import Context from "./Context";
import { parseOData, getUpdateHeaders, getDeleteHeaders, getAddHeaders } from "./utils";

export default class CustomActions {
  private ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  /** Returns both Site and Web custom actions. */
  get(): Promise<CustomAction[]>;
  /** Searches both Site and Web scoped custom actions for a name match */
  get(name: string): Promise<CustomAction>;
  async get(name?: any): Promise<any> {
    let webCustomActions = await this.ctx.get("/web/usercustomactions").then(parseOData);
    let siteCustomActions = await this.ctx.get("/site/usercustomactions").then(parseOData);
    let allCustomActions = [...webCustomActions, ...siteCustomActions];
    if (name) {
      return allCustomActions.find((c) => c.Name === name);
    }
    return allCustomActions;
  }

  private _getUrl = async (name) => {
    let target = await this.get(name);
    if (!target || !target["odata.editLink"]) {
      throw new Error("Unable to find matching Custom Action: " + name);
    }
    return "/" + target["odata.editLink"];
  };
  /** Update an existing Custom Action. You must pass a custom action with a 'Name' property */
  async update(updates: CustomAction): Promise<any> {
    if (!updates || !updates.Name) throw new Error("You must at least pass a Custom Action 'Name'");

    let url = await this._getUrl(updates.Name);
    return this.ctx.post(url, updates, "MERGE");
  }

  /** Remove an existing Custom Action. Searches both Site and Web scoped */
  async remove(name: string): Promise<any> {
    if (!name) throw new Error("You must at least pass an existing Custom Action name");
    let url = await this._getUrl(name);
    return this.ctx.post(url, {}, "DELETE");
  }

  /** Adds a new custom action. If the custom action name already exists, it will be deleted first */
  async add(customAction: CustomAction): Promise<any> {
    if (!customAction || !customAction.Name)
      throw new Error("You must at least pass a Custom Action 'Name'");

    var defaults: Partial<CustomAction> = {
      Name: customAction.Name,
      Title: customAction.Name,
      Description: customAction.Name,
      // Group: customAction.Name,
      Sequence: 100,
      Scope: 2,
    };
    customAction = { ...defaults, ...customAction };

    // if it exists already, delete it
    let exists = await this.get(customAction.Name);
    if (exists) {
      await this.remove(customAction.Name);
    }

    let url = (customAction.Scope === 2 ? "/site" : "/web") + "/usercustomactions";

    return this.ctx.post(url, customAction);
  }

  activateExtension = (
    title: string,
    componentId: string,
    properties = {},
    overrides: Partial<CustomAction> = {}
  ) => {
    let customAction: CustomAction = {
      Name: title,
      ClientSideComponentId: componentId,
      Location: "ClientSideExtension.ApplicationCustomizer",
      ClientSideComponentProperties: JSON.stringify(properties),
      ...overrides,
    };
    return this.add(customAction);
  };
}

export type CustomActionScope = "Web" | "Site";

export interface CustomAction {
  Name: string;
  Location: string;
  /** Defaults to match Name */
  Title?: string;
  /** Defaults to match Name */
  Description?: string;
  /** Defaults to match Name */
  Group?: string;
  /** Defaults to to 100 */
  Sequence?: number;

  /** 3 for Web. 2 for Site */
  Scope?: 3 | 2;
  ScriptBlock?: string;
  /** To activate an SPFx Extension, the Component Id*/
  ClientSideComponentId?: string;
  /** Properties for configuring SPFx Extensions */
  ClientSideComponentProperties?: string;
  /** The Custom Action's primary key, guid. */
  Id?: string;
  HostProperties?: "";
}
