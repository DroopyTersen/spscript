var objAssign = require("object-assign");

var List 		= require("./list");
var Web 		= require("./web");
var Profiles 	= require("./profiles")
var Search 		= require("./search");
var fs 			= require("./filesystem");
var utils 		= require("./utils");

var Folder = fs.Folder;

var BaseDao = function() {
	var self = this;

	self.web = new Web(self);
	self.search = new Search(self);
	self.profiles = new Profiles(self);
};

BaseDao.prototype.executeRequest = function() {
	throw "Not implemented exception";
};

BaseDao.prototype.get = function(relativeQueryUrl, extendedOptions, raw) {
	var options = {
		type: "GET"
	};

	if (extendedOptions) {
		objAssign({}, options, extendedOptions);
	}
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
		type: "POST",
		data: strBody,
		contentType: "application/json;odata=verbose"
	};
	objAssign({}, options, extendedOptions);
	return this.executeRequest(relativePostUrl, options);
};

BaseDao.prototype.getFolder = function(serverRelativeUrl) {
	if (serverRelativeUrl.charAt(0) === "/") {
		serverRelativeUrl = serverRelativeUrl.substr(1);
	}
	var url = "/web/GetFolderByServerRelativeUrl('" + serverRelativeUrl + "')?$expand=Folders,Files";

	return this.get(url).then(utils.validateODataV2).then(function(spFolder) {
		var folder = new Folder(spFolder);
		folder.populateChildren(spFolder);
		return folder;
	});
};

BaseDao.prototype.uploadFile = function(folderUrl, name, base64Binary) {
	var uploadUrl = "/web/GetFolderByServerRelativeUrl('" + folderUrl + "')/Files/Add(url='" + name + "',overwrite=true)",
		options = {
			binaryStringRequestBody: true,
			state: "Update"
		};
	return this.post(uploadUrl, base64Binary, options);
};


module.exports = BaseDao;