"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var utils = require("./utils");
var headers = require("./requestHeaders");

var metadata = {
	__metadata: {
		"type": "SP.UserCustomAction"
	}
};

var CustomActions = function CustomActions(dao) {
	var _this = this;

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
	this.scopes.getById = function (id) {
		return id === 2 ? _this.scopes.Site : _this.scopes.Web;
	};
};

// 
// If a name is passed, filter the result set
CustomActions.prototype.get = function (name) {
	var _this2 = this;

	// first get the site scoped ones, then the web scoped ones
	return this._dao.get(this.scopes.Site.url).then(utils.validateODataV2).then(function (siteCustomActions) {
		return _this2._dao.get(_this2.scopes.Web.url).then(utils.validateODataV2)
		//combine site scoped and web scoped into single array
		.then(function (webCustomActions) {
			return siteCustomActions.concat(webCustomActions);
		});
	}).then(function (customActions) {
		// if a name was passed filter it otherwise return everything
		if (name) {
			var matches = customActions.filter(function (a) {
				return a.Name === name;
			});
			if (matches.length) {
				return matches[0];
			}
			throw new Error("Unable to find Custom Action with name: " + name);
		} else return customActions;
	});
};

CustomActions.prototype._getUrl = function (name) {
	var _this3 = this;

	return this.get(name).then(function (a) {
		return _this3.scopes.getById(a.Scope).url + "('" + a.Id + "')";
	});
};

CustomActions.prototype._getUrlAndDigest = function (name) {
	var _this4 = this;

	var prep = {};
	return this._getUrl(name).then(function (url) {
		prep.url = url;
		return _this4._dao.getRequestDigest();
	}).then(function (digest) {
		prep.digest = digest;
		return prep;
	});
};

CustomActions.prototype.update = function (updates) {
	var _this5 = this;

	if (!updates || !updates.Name) throw new Error("You must at least pass a Custom Action 'Name'");

	return this._getUrlAndDigest(updates.Name).then(function (prep) {
		updates = _extends({}, metadata, updates);
		var opts = {
			headers: headers.getUpdateHeaders(prep.digest)
		};
		return _this5._dao.post(prep.url, updates, opts);
	});
};

CustomActions.prototype.remove = function (name) {
	var _this6 = this;

	if (!name) throw new Error("You must at least pass a Custom Action 'Name'");
	return this._getUrlAndDigest(name).then(function (prep) {
		var opts = {
			headers: headers.getDeleteHeaders(prep.digest)
		};
		return _this6._dao.post(prep.url, {}, opts);
	});
};

CustomActions.prototype.add = function (customAction) {
	var _this7 = this;

	if (!customAction || !customAction.Name || !customAction.Location) throw new Error("You must at least pass a Custom Action 'Name' and 'Location'");
	customAction.Scope = customAction.Scope || "Web";
	return this._dao.getRequestDigest().then(function (digest) {
		customAction = _extends({}, metadata, customAction);
		var scope = _this7.scopes[customAction.Scope];
		customAction.Scope = scope.id;
		var opts = {
			headers: headers.getAddHeaders(digest)
		};
		return _this7._dao.post(scope.url, customAction, opts);
	});
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
	customAction = _extends({}, customAction, opts || {});

	return this.add(customAction);
};

CustomActions.prototype.addCSSLink = function (name, url, opts) {
	var scriptBlockStr = "\n\t\t(function() {\n\t\t\tvar head = document.querySelector(\"head\");\n\t\t\tvar styleTag = document.createElement(\"style\");\n\t\t\tstyleTag.appendChild(document.createTextNode(\"body { opacity: 0 }\"));\n\t\t\t\n\t\t\tvar linkTag = document.createElement(\"link\");\n\t\t\tlinkTag.rel = \"stylesheet\";\tlinkTag.href = \"" + url + "\"; linkTag.type = \"text/css\";\n\t\t\tlinkTag.addEventListener(\"load\", function() {\n\t\t\t\thead.removeChild(styleTag);\n\t\t\t});\n\n\t\t\thead.appendChild(styleTag);\n\t\t\thead.appendChild(linkTag);\n\t\t})();";

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
	customAction = _extends({}, customAction, opts || {});

	return this.add(customAction);
};
CustomActions.metadata = metadata;

module.exports = CustomActions;
//# sourceMappingURL=customActions.js.map