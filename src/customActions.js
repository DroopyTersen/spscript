var utils = require("./utils");
var headers = require("./requestHeaders");

var metadata = {
	__metadata: {
		"type": "SP.UserCustomAction"
	}
};

var CustomActions = function (dao) {
	this._dao = dao;

	this.scopes = {
		"Web": {
			id: 3,
			name: "Web",
			url: "/web/usercustomactions"
		},
		"Site": {
			id: 2,
			name: "Site",
			url: "/site/usercustomactions"
		}
	};
	this.scopes.getById = (id) => id === 2 ? this.scopes.Site : this.scopes.Web
};

// Get all Site and Web scoped custom actions.
// If a name is passed, filter the result set
CustomActions.prototype.get = function (name) {

	// first get the site scoped ones, then the web scoped ones
	return this._dao.get(this.scopes.Site.url)
		.then(utils.validateODataV2)
		.then(siteCustomActions => {
			return this._dao.get(this.scopes.Web.url)
				.then(utils.validateODataV2)
				//combine site scoped and web scoped into single array
				.then(webCustomActions => siteCustomActions.concat(webCustomActions));
		})
		.then(customActions => {
			// if a name was passed filter it otherwise return everything
			if (name) {
				var matches = customActions.filter(a => a.Name === name);
				if (matches.length) {
					return matches[0]
				}
				throw new Error("Unable to find Custom Action with name: " + name );
			}
			else return customActions;
		});
};


CustomActions.prototype._getUrl = function (name) {
	return this.get(name)
		.then(a => `${this.scopes.getById(a.Scope).url}('${a.Id}')`);
};

CustomActions.prototype._getUrlAndDigest = function (name) {
	var prep = {};
	return this._getUrl(name)
		.then(url => {
			prep.url = url;
			return this._dao.getRequestDigest()
		})
		.then(digest => {
			prep.digest = digest;
			return prep;
		});
};

CustomActions.prototype.update = function (updates) {
	if (!updates || !updates.Name) throw new Error("You must at least pass a Custom Action 'Name'");

	return this._getUrlAndDigest(updates.Name)
		.then(prep => {
			updates = Object.assign({}, metadata, updates);
			var opts = {
				headers: headers.getUpdateHeaders(prep.digest)
			};
			return this._dao.post(prep.url, updates, opts);
		})
};


CustomActions.prototype.remove = function (name) {
	if (!name) throw new Error("You must at least pass a Custom Action 'Name'");
	return this._getUrlAndDigest(name)
		.then(prep => {
			var opts = {
				headers: headers.getDeleteHeaders(prep.digest)
			};
			return this._dao.post(prep.url, {}, opts);
		});
};

CustomActions.prototype.add = function (customAction) {
	if (!customAction || !customAction.Name || !customAction.Location)
		throw new Error("You must at least pass a Custom Action 'Name' and 'Location'");
	customAction.Scope = customAction.Scope || "Web";
	return this._dao.getRequestDigest()
		.then(digest => {
			customAction = Object.assign({}, metadata, customAction);
			var scope = this.scopes[customAction.Scope]
			customAction.Scope = scope.id;
			var opts = {
				headers: headers.getAddHeaders(digest)
			};
			return this._dao.post(scope.url, customAction, opts);
		})
};


CustomActions.prototype.addScriptLink = function (name, url, opts) {
	var customAction = {
		Name: name,
		Title: name,
		Description: name,
		Group: name,
		Sequence: 100,
		Scope: "Web",
		Location: "ScriptLink",
		ScriptSrc: url
	};
	customAction = Object.assign({}, customAction, opts || {});

	return this.add(customAction);
};

CustomActions.prototype.addCSSLink = function (name, url, opts) {
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
		})();`

	var customAction = {
		Name: name,
		Title: name,
		Description: name,
		Group: name,
		Sequence: 100,
		Scope: "Web",
		Location: "ScriptLink",
		ScriptBlock: scriptBlockStr
	};
	customAction = Object.assign({}, customAction, opts || {});
	
	return this.add(customAction);
};
CustomActions.metadata = metadata;

module.exports = CustomActions;