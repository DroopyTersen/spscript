var utils = require("./utils");

var Folder = function(spFolder) {
	var self = this;
	self.mapProperties(spFolder);
};

Folder.prototype.populateChildren = function(spFolder) {
	this.folders = spFolder.Folders.results.map(function(spFolder){
		return new Folder(spFolder);
	});
	
	this.files = spFolder.Files.results.map(function(spFile){
		return new File(spFile);
	});
};

Folder.prototype.mapProperties = function(spFolder) {
	this.name = spFolder.Name;
	this.serverRelativeUrl = spFolder.ServerRelativeUrl;
	this.itemCount = spFolder.ItemCount;
	this.guid = spFolder.UniqueId;
	this.uri = spFolder.__metadata.uri;
};

var File = function(spFile) {
	this.mapProperties(spFile);
};

File.prototype.mapProperties = function(spFile) {
	this.name = spFile.Name,
	this.title = spFile.Title,
	this.checkoutType = spFile.CheckOutType,
	this.byteLength = spFile.Length,
	this.majorVersion = spFile.MajorVersion,
	this.minorVersion = spFile.MinorVersion,
	this.serverRelativeUrl = spFile.ServerRelativeUrl,
	this.uri =  spFile.__metadata.uri
};
	

module.exports = {
	File: File,
	Folder: Folder
};