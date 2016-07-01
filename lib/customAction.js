"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var utils = require("./utils");
var headers = require("./requestHeaders");

// MSDN Info
// https://msdn.microsoft.com/en-us/library/office/dn531432.aspx#bk_UserCustomActionCollection

var metadata = {
	__metadata: {
		"type": "SP.UserCustomAction"
	}
};

var CustomActions = function CustomActions(web) {
	this.web = web;
	this.baseUrl = "/web/userCustomActions";
};

CustomActions.prototype.get = function (name) {
	return this.web._dao.get(this.baseUrl).then(utils.validateODataV2).then(function (customActions) {
		if (name) return customActions.find(function (a) {
			return a.Name === name;
		});else return customActions;
	});
};

CustomActions.prototype._getUrl = function (name) {
	var _this = this;

	return this.get(updates.Name).then(function (a) {
		return _this.baseUrl + "('" + a.Id + "')";
	});
};

CustomActions.prototype._getUrlAndDigest = function (name) {
	var _this2 = this;

	var url = null;
	return this.getUrl(updates.Name).then(function (url) {
		url = url;
		return _this2.web.getRequestDigest();
	}).then(function (digest) {
		digest, url;
	});
};

CustomActions.prototype.update = function (updates) {
	var _this3 = this;

	if (!updates || !updates.Name) throw new Error("You must at least pass a Custom Action 'Name'");
	var url = null;
	return this.getUrlAndDigest(updates.Name).then(function (prep) {
		updates = _extends({}, metadata, updates);
		var customOptions = {
			headers: headers.getUpdateHeaders(prep.digest)
		};
		return _this3._web._dao.post(prep.url, updates, customOptions);
	});
};

CustomActions.metadata = metadata;
module.exports = CustomActions;
//# sourceMappingURL=customAction.js.map