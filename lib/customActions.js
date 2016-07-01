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

	return this.get(name).then(function (a) {
		var url = _this.baseUrl + "('" + a.Id + "')";
		return url;
	});
};

CustomActions.prototype._getUrlAndDigest = function (name) {
	var _this2 = this;

	var prep = {};
	return this._getUrl(name).then(function (url) {
		prep.url = url;
		return _this2.web.getRequestDigest();
	}).then(function (digest) {
		prep.digest = digest;
		return prep;
	});
};

CustomActions.prototype.update = function (updates) {
	var _this3 = this;

	if (!updates || !updates.Name) throw new Error("You must at least pass a Custom Action 'Name'");
	return this._getUrlAndDigest(updates.Name).then(function (prep) {
		updates = _extends({}, metadata, updates);
		var opts = {
			headers: headers.getUpdateHeaders(prep.digest)
		};
		return _this3.web._dao.post(prep.url, updates, opts);
	});
};

// 1. Get request digest to authorize request
// 2. Get all the custom actions
// 3. Filter to get the custom actions with the specified name
// 4. Perform a DELETE request on each of the matching custom actions
// 5. Wait for all the DELETE's to succeed before resolving the promise
CustomActions.prototype.remove = function (name) {
	var _this4 = this;

	var digest = null;
	return this.web.getRequestDigest().then(function (d) {
		return digest = d;
	}).then(function () {
		return _this4.get();
	}).then(function (all) {
		return all.filter(function (a) {
			return a.Name === name;
		});
	}).then(function (matches) {
		return Promise.all(matches.map(function (a) {
			return _this4._remove(a.Id, digest);
		}));
	});
};

CustomActions.prototype._remove = function (id, digest) {
	var url = this.baseUrl + "('" + id + "')";
	var opts = {
		headers: headers.getDeleteHeaders(digest)
	};
	return this.web._dao.post(url, {}, opts);
};

CustomActions.prototype.add = function (customAction) {
	var _this5 = this;

	if (!customAction || !customAction.Name || !customAction.Location) throw new Error("You must at least pass a Custom Action 'Name' and 'Location'");
	return this.web.getRequestDigest().then(function (digest) {
		customAction = _extends({}, metadata, customAction);
		var opts = {
			headers: headers.getAddHeaders(digest)
		};
		return _this5.web._dao.post(_this5.baseUrl, customAction, opts);
	});
};
CustomActions.metadata = metadata;
module.exports = CustomActions;
//# sourceMappingURL=customActions.js.map