var List 		= require("./list");
var Web 		= require("./web");
var Profiles 	= require("./profiles")
var Search 		= require("./search");
var utils 		= require("./utils");


var BaseDao = function() {
	this.web = new Web(this);
	this.search = new Search(this);
	this.profiles = new Profiles(this);
};

BaseDao.prototype.executeRequest = function() {
	throw "Not implemented exception";
};

BaseDao.prototype.getRequestDigest = function() {
	return this.web.getRequestDigest();
};

BaseDao.prototype.get = function(relativeQueryUrl, extendedOptions) {
	var options = Object.assign({}, {
		method: "GET"
	}, extendedOptions);
	return this.executeRequest(relativeQueryUrl, options);
};

BaseDao.prototype.lists = function(listname) {
	if (!listname) {
		return this.get("/web/lists").then(utils.validateODataV2);
	}
	return new List(listname, this);
};

BaseDao.prototype.post = function(relativePostUrl, body, extendedOptions) {
	var strBody = JSON.stringify(body);
	var options = {
		method: "POST",
		data: strBody,
		contentType: "application/json;odata=verbose"
	};
	options = Object.assign({}, options, extendedOptions);
	return this.executeRequest(relativePostUrl, options);
};

module.exports = BaseDao;