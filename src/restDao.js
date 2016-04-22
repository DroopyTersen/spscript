var BaseDao = require("./baseDao");
var objAssign = require("object-assign");
var ajax = require('./ajax') 

var RestDao = function(url) {
	var self = this;
	BaseDao.call(this);
	this.webUrl = url || _spPageContextInfo.webAbsoluteUrl;
};

RestDao.prototype = new BaseDao();

RestDao.prototype.executeRequest = function(url, options) {
	var self = this;
	var fullUrl = (/^http/i).test(url) ? url : this.webUrl + "/_api" + url;

	var executeOptions = {
		url: fullUrl,
		method: "GET",
		headers: {
			"Accept": "application/json; odata=verbose"
		}
	};

	executeOptions = objAssign({}, executeOptions, options);
	return ajax(executeOptions);
};


module.exports = RestDao;