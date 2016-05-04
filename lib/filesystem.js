"use strict";

var utils = require("./utils");

/**
 * Represents a SharePoint Folder.  Keep in mind, and File or Folder objects obtained from the 'files' and 'folders' array will not have their child items populated.
 * @typedef Folder
 * @property {string} name - Folder name
 * @property {string} serverRelativeUrl - Server relative url
 * @property {int} itemCount - Number of items in the folder
 * @property {string} guid - Unique ID of the folder
 * @property {string} uri - API url to get the raw SP.Folder object
 * @property {Array<File>} files - An array of files in that folder
 * @property {Array<Folder>} folders - An array of sub folders
 * @example
 *  dao.web.getFolder("/sites/mysite/Shared Documents")
 *			.then(function(folder) { 
 *				console.log(folder.name);
 *				console.log(folder.files);
 *			});
 */
var Folder = function Folder(spFolder) {
  this.mapProperties(spFolder);
  this.populateChildren(spFolder);
};

Folder.prototype.populateChildren = function (spFolder) {
  if (spFolder && spFolder.Folders && spFolder.Folders.results) {
    this.folders = spFolder.Folders.results.map(function (f) {
      return new Folder(f);
    });
  }
  if (spFolder && spFolder.Files && spFolder.Files.results) {
    this.files = spFolder.Files.results.map(function (f) {
      return new File(f);
    });
  }
};

Folder.prototype.mapProperties = function (spFolder) {
  this.name = spFolder.Name;
  this.serverRelativeUrl = spFolder.ServerRelativeUrl;
  this.itemCount = spFolder.ItemCount;
  this.guid = spFolder.UniqueId;
  this.uri = spFolder.__metadata.uri;
};

/**
 * Represents a SharePoint File
 * @typedef File
 * @property {string} name - Folder name
 * @property {string} title - Folder title
 * @property {string} serverRelativeUrl - Server relative url
 * @property {int} byteLength - File size in bytes
 * @property {string} checkoutType - Checked out status of file.  "none", "offline", "online".
 * @property {number} majorVersion - Major version of the file
 * @property {number} minorVersion - Minor version of the file
 * @property {string} uri - API url to get the raw SP.Folder object
 * @example
 *  dao.web.getFile("/sites/mysite/Shared Documents/myFile.docx")
 *			.then(function(file) { 
 *				console.log(file.name);
 *				console.log("Size:" + (file.byteLength / 1000) + "KB");
 *			});
 */
var File = function File(spFile) {
  this.mapProperties(spFile);
};

File.prototype.mapProperties = function (spFile) {
  this.name = spFile.Name, this.title = spFile.Title, this.checkoutType = spFile.CheckOutType, this.byteLength = spFile.Length, this.majorVersion = spFile.MajorVersion, this.minorVersion = spFile.MinorVersion, this.serverRelativeUrl = spFile.ServerRelativeUrl, this.uri = spFile.__metadata.uri;
};

module.exports = {
  File: File,
  Folder: Folder
};
//# sourceMappingURL=filesystem.js.map