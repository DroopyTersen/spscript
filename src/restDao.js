var BaseDao = require("./baseDao");
var ajax = require('./ajax') 

/**
 * Main point of entry. Big Daddy class that all SP requests are routed through. Data Access Object (DAO)
 * @class
 * @augments BaseDao

 * @param {string} [url] - Url of the site you are connected to. _spPageContextInfo.webAbsoluteUrl will be used if no value is passed.
 * @property {string} webUrl - Url of the site you are connected to
 * @property {Web} web - Allows interacting with the SharePoint site you connected to
 * @property {Search} search - Allows querying through the SP Search Service
 * @property {Profiles} profiles - Allows interacting with the SP Profile Service
 * @example <caption>Create a new instance of a RestDao</caption>
 * var dao = new SPScript.RestDao(_spPageContextInfo.webAbsoluteUrl);
 */
var RestDao = function(url) {
	var self = this;
	BaseDao.call(this);
	this.webUrl = url || _spPageContextInfo.webAbsoluteUrl;
};

RestDao.prototype = new BaseDao();

RestDao.prototype.executeRequest = function(url, options) {
	var fullUrl = (/^http/i).test(url) ? url : this.webUrl + "/_api" + url;

	var defaultOptions = {
		url: fullUrl,
		method: "GET",
		headers: {
			"Accept": "application/json; odata=verbose",
			"Content-Type": "application/json; odata=verbose"
		}
	};

	var ajaxOptions = Object.assign({}, defaultOptions, options);
	return ajax(ajaxOptions);
};


module.exports = RestDao;