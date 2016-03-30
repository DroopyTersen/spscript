SPScript = require("./spscript");
SPScript.List = require("./list");
SPScript.Web = require("./web");
SPScript.Profiles = require("./profiles")
SPScript.helpers = require("./helpers");
var fs = require("./filesystem");
SPScript.File = fs.File;
SPScript.Folder = fs.Folder;
SPScript.Search = require("./search");
var $ = require("jquery");

(function(sp) {
	var BaseDao = function() {
		var self = this;

		self.web = new sp.Web(self);
		self.search = new sp.Search(self);
		self.profiles = new sp.Profiles(self);
	};

	BaseDao.prototype.executeRequest = function() {
		throw "Not implemented exception";
	};

	BaseDao.prototype.get = function(relativeQueryUrl, extendedOptions, raw) {
		var options = {
			type: "GET"
		};

		if (extendedOptions) {
			$.extend(options, extendedOptions);
		}
		return this.executeRequest(relativeQueryUrl, options);
	};

	BaseDao.prototype.lists = function(listname) {
		if(!listname) {
			return this.get("/web/lists").then(sp.helpers.validateODataV2);
		}
		return new sp.List(listname, this);
	};

	BaseDao.prototype.post = function(relativePostUrl, body, extendedOptions) {
		var strBody = JSON.stringify(body);
		var options = {
			type: "POST",
			data: strBody,
			contentType: "application/json;odata=verbose"
		};
		$.extend(options, extendedOptions);
		return this.executeRequest(relativePostUrl, options);
	};
	
	BaseDao.prototype.getFolder = function(serverRelativeUrl) {
		if (serverRelativeUrl.charAt(0) === "/") {
			serverRelativeUrl = serverRelativeUrl.substr(1);
		}
		var url = "/web/GetFolderByServerRelativeUrl('" + serverRelativeUrl + "')?$expand=Folders,Files";
		
		return this.get(url).then(sp.helpers.validateODataV2).then(function(spFolder) {
			var folder = new SPScript.Folder(spFolder);
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

	sp.BaseDao = BaseDao;
})(SPScript);

module.exports = SPScript.BaseDao;