"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var List = require("./list");
var Web = require("./web");
var Profiles = require("./profiles");
var Search = require("./search");
var utils = require("./utils");
var CustomActions = require("./customActions");
/**
 * Abstract class. You'll never work with this directly. 
 * @abstract
 * @private
 * @property {Web} web - Allows interacting with the SharePoint site you connected to
 * @property {Search} search - Allows querying through the SP Search Service
 * @property {Profiles} profiles - Allows interacting with the SP Profile Service
 */
var BaseDao = function BaseDao() {
	this.web = new Web(this);
	this.search = new Search(this);
	this.profiles = new Profiles(this);
	this.customActions = new CustomActions(this);
};

BaseDao.prototype.executeRequest = function () {
	throw "Not implemented exception";
};

/**
 * Generic helper to make AJAX GET request
  * @example <caption>Use generic GET method to retrieve a site's content types</caption>
 * dao.get('/web/contentTypes').then(function(data) { console.log(data.d.results)})
 * @param {string} relativeQueryUrl - the API url relative to "/_api"
 * @param {Object} [extendedOptions] - AJAX options (like custom request headers)
 * @returns {Promise} - An ES6 Promise that resolves to the an object probably in the form of data.d
 */
BaseDao.prototype.get = function (relativeQueryUrl, extendedOptions) {
	var options = _extends({}, {
		method: "GET"
	}, extendedOptions);
	return this.executeRequest(relativeQueryUrl, options).then(utils.parseJSON);
};

BaseDao.prototype.getRequestDigest = function () {
	return this.post('/contextinfo', {}).then(function (data) {
		return data.d.GetContextWebInformation.FormDigestValue;
	});
};
/**
 * If a list name is passed, an SPScript.List object, otherwise performs a request to get all the site's lists
 * @param {string} [listname] - If a list name is passed, method is synchronous returning an SPScript.List
 * @returns {List|Promise} - SPScript.List object or a Promise that resolves to an Array of lists
 * @example <caption>Option 1: No List Name gets all the lists of a site</caption>
 * dao.lists().then(function(lists) { console.log(lists)});
 * @example <caption>Option 2: Pass a List Name to get a list object</caption>
 * var list = dao.lists('MyList');
 * list.getItemById(12).then(function(item) { console.log(item)});
 */
BaseDao.prototype.lists = function (listname) {
	if (!listname) {
		return this.get("/web/lists").then(utils.validateODataV2);
	}
	return new List(listname, this);
};

/**
 * Generic helper to make AJAX POST request
 * @param {string} relativeQueryUrl - the API url relative to "/_api"
 * @param {Object} [extendedOptions] - AJAX options (like custom request headers)
 * @returns {Promise} - An ES6 Promise
 */
BaseDao.prototype.post = function (relativePostUrl, body, opts) {
	body = packagePostBody(body, opts);
	var options = {
		method: "POST",
		data: body
	};
	options = _extends({}, options, opts);
	return this.executeRequest(relativePostUrl, options).then(utils.parseJSON);
};

BaseDao.prototype.ensureRequestDigest = function (digest) {
	return digest ? Promise.resolve(digest) : this.getRequestDigest();
};

//Skip stringify it its already a string or it has an explicit Content-Type that is not JSON
var packagePostBody = function packagePostBody(body, opts) {
	// if its already a string just return
	if (typeof body === "string") return body;
	// if it has an explicit content-type, asssume the body is already that type
	if (opts && opts.headers && opts.headers["Content-Type"] && opts.headers["Content-Type"].indexOf("json") === -1) {
		return body;
	}
	//others stringify
	return JSON.stringify(body);
};
module.exports = BaseDao;
//# sourceMappingURL=baseDao.js.map