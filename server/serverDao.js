var BaseDao = require("../src/baseDao");
require("./overrides");
var request = require('./httpRequest').request;
var tokenHelper = require("./tokenHelper");
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

var ServerDao = function (url, clientKey, clientSecret) {
	var self = this;
	BaseDao.call(this);
    this.clientKey = clientKey;
    this.clientSecret = clientSecret;
	this.webUrl = url || _spPageContextInfo.webAbsoluteUrl;
    this.ensureToken = tokenHelper.getAppOnlyToken(this.webUrl, this.clientKey, this.clientSecret).then(token => this.accessToken = token);
};

ServerDao.prototype = Object.create(BaseDao.prototype);

ServerDao.prototype.executeRequest = function (url, options) {
    return this.ensureToken.then(() => this._executeRequest(url, options));
};

ServerDao.prototype._executeRequest = function (url, options) {
	var fullUrl = (/^http/i).test(url) ? url : this.webUrl + "/_api" + url;
	var defaultOptions = {
		url: fullUrl,
		method: "GET",
		headers: {
			'Accept': 'application/json;odata=verbose',
			'Authorization': 'Bearer ' + this.accessToken
		}
	};
	
	var requestOptions = Object.assign({}, defaultOptions, options);
	if (options.headers){
		requestOptions.headers = Object.assign({}, defaultOptions.headers, options.headers);
	}
	return request(requestOptions).then(res => res.body);
};


module.exports = ServerDao;

