var BaseDao = require("./baseDao");
var ajax = require('./ajax') 

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