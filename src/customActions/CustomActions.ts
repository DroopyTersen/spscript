import Context from "../context/Context";
import utils from "../utils";

export default class CustomActions {
  private _dao: Context;

  constructor(ctx: Context) {
    this._dao = ctx;
  }

  private getScope(scopeId: number): any {
    if (scopeId === 3) return scopes.Web;
    if (scopeId === 2) return scopes.Site;

    throw new Error("Invalid Custom Action Scope");
  }

  /** Returns both Site and Web custom actions. */
  get(): Promise<any>;
  /** Searches both Site and Web scoped custom actions for a name match */
  get(name: string): Promise<any>;
  get(name?: any): Promise<any> {
    // first get the site scoped ones, then the web scoped ones
    return this._dao
      .get(scopes.Site.url)
      .then(utils.validateODataV2)
      .then((siteCustomActions) => {
        return (
          this._dao
            .get(scopes.Web.url)
            .then(utils.validateODataV2)
            //combine site scoped and web scoped into single array
            .then((webCustomActions) => siteCustomActions.concat(webCustomActions))
        );
      })
      .then((customActions) => {
        // if a name was passed filter it otherwise return everything
        if (name) {
          var matches = customActions.filter((a) => a.Name === name);
          if (matches.length) {
            return matches[0];
          }
          throw new Error("Unable to find Custom Action with name: " + name);
        } else return customActions;
      });
  }

  /** Gets the API url of a specific Custom Action */
  private _getUrl(name: string): Promise<string> {
    return this.get(name).then((a) => `${this.getScope(a.Scope).url}('${a.Id}')`);
  }

  private _getUrlAndDigest(name: string): Promise<any> {
    var prep: any = {};
    return this._getUrl(name)
      .then((url) => {
        prep.url = url;
        return this._dao.auth.getRequestDigest();
      })
      .then((digest) => {
        prep.digest = digest;
        return prep;
      });
  }

  /** Update an existing Custom Action. You must pass a custom action with a 'Name' property */
  update(updates: CustomAction): Promise<any> {
    if (!updates || !updates.Name) throw new Error("You must at least pass a Custom Action 'Name'");

    return this._getUrlAndDigest(updates.Name).then((prep) => {
      updates = Object.assign({}, metadata, updates);
      var opts = {
        headers: utils.headers.getUpdateHeaders(prep.digest),
      };
      return this._dao._post(prep.url, updates, opts);
    });
  }

  /** Remove an existing Custom Action. Searches both Site and Web scoped */
  remove(name: string): Promise<any> {
    if (!name) throw new Error("You must at least pass an existing Custom Action name");
    return this._getUrlAndDigest(name).then((prep) => {
      var opts = {
        headers: utils.headers.getDeleteHeaders(prep.digest),
      };
      return this._dao._post(prep.url, {}, opts);
    });
  }

  /** Adds a new custom action. If the custom action name already exists, it will be deleted first */
  add(customAction: CustomAction): Promise<any> {
    if (!customAction || !customAction.Name)
      throw new Error("You must at least pass a Custom Action 'Name'");

    var defaults: CustomAction = {
      Name: customAction.Name,
      Title: customAction.Name,
      Description: customAction.Name,
      // Group: customAction.Name,
      Sequence: 100,
      Scope: "Site",
      Location: "ScriptLink",
    };
    customAction = Object.assign({}, defaults, customAction);

    // if it exists already, delete it
    return this.get()
      .then((existingCustomActions) => {
        if (existingCustomActions.filter((ca) => ca.Name === customAction.Name).length) {
          return this.remove(customAction.Name);
        }
        return true;
      })
      .then(() => this._dao.auth.getRequestDigest())
      .then((digest) => {
        customAction = Object.assign({}, metadata, customAction);
        var scope = scopes[customAction.Scope];
        customAction.Scope = scope.id;
        var opts = {
          headers: utils.headers.getAddHeaders(digest),
        };
        return this._dao._post(scope.url, customAction, opts);
      });
  }

  private addScriptBlock(name: string, block: string, opts: CustomAction = {}) {
    var customAction: CustomAction = {
      Name: name,
      ScriptBlock: block,
      Group: name,
    };
    customAction = Object.assign({}, customAction, opts);
    return this.add(customAction);
  }

  /** Injects a CSS file onto your site. Defaults to Site scoped */
  addCSSLink(name: string, url: string, opts: CustomAction = {}) {
    var scriptBlockStr = `
		(function() {
			var head = document.querySelector("head");
			var styleTag = document.createElement("style");
			styleTag.appendChild(document.createTextNode("body { opacity: 0 }"));
			
			var linkTag = document.createElement("link");
			linkTag.rel = "stylesheet";	linkTag.href = "${url}"; linkTag.type = "text/css";
			linkTag.addEventListener("load", function() {
				head.removeChild(styleTag);
			});

			head.appendChild(styleTag);
			head.appendChild(linkTag);
		})();`;
    return this.addScriptBlock(name, scriptBlockStr, opts);
  }

  addScriptLink(name: string, url: string, opts: CustomAction = {}) {
    var scriptBlockStr = `
		(function() {
			var head = document.querySelector("head");
			var scriptTag = document.createElement("script");
            scriptTag.src = "${url}";
            scriptTag.type = "text/javascript";
			head.appendChild(scriptTag);
		})();`;
    return this.addScriptBlock(name, scriptBlockStr, opts);
  }
}

export type CustomActionScope = "Web" | "Site";

export interface CustomAction {
  Name?: string;
  /** Defaults to match Name */
  Title?: string;
  /** Defaults to match Name */
  Description?: string;
  /** Defaults to match Name */
  Group?: string;
  /** Defaults to to 100 */
  Sequence?: number;
  Scope?: any;
  /** Defaults to to 'ScriptLink' */
  Location?: string;
  ScriptBlock?: string;
}

export var metadata = {
  __metadata: {
    type: "SP.UserCustomAction",
  },
};

export var scopes = {
  Web: {
    id: 3,
    name: "Web",
    url: "/web/usercustomactions",
  },
  Site: {
    id: 2,
    name: "Site",
    url: "/site/usercustomactions",
  },
};
