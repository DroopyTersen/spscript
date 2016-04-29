var utils 			= require("./utils");
var Permissions 	= require("./permissions");
var headers 		= require("./requestHeaders");
var Folder			= require("./filesystem").Folder;

var Web = function(dao) {
	this._dao = dao;
	this.baseUrl = "/web";
	this.permissions = new Permissions(this.baseUrl, this._dao);
};

Web.prototype.info = function() {
	return this._dao
		.get(this.baseUrl)
		.then(utils.validateODataV2);
};

Web.prototype.subsites = function() {
	return this._dao
		.get(this.baseUrl + "/webinfos")
		.then(utils.validateODataV2);
};

Web.prototype.getRequestDigest = function() {
	return this._dao.post('/contextinfo', {})
		.then(data => data.d.GetContextWebInformation.FormDigestValue);
};

Web.prototype.getFolder = function(serverRelativeUrl) {
	//remove leading slash
	if (serverRelativeUrl.charAt(0) === "/") {
		serverRelativeUrl = serverRelativeUrl.substr(1);
	}
	var url = "/web/GetFolderByServerRelativeUrl('" + serverRelativeUrl + "')?$expand=Folders,Files";

	return this._dao.get(url).then(utils.validateODataV2)
		.then(spFolder => {
			var folder = new Folder(spFolder);
			folder.populateChildren(spFolder);
			return folder;
		});
};

// Web.prototype.uploadFile = function(folderUrl, name, base64Binary, digest) {
// 	if (digest) return this._uploadFile(folderUrl, name, base64Binary, digest);
// 	return this.getRequestDigest().then(digest => this._uploadFile(folderUrl, name, base64Binary, digest));
// }

// //TODO: Fix this. Its from v0.0 and never worked
// Web.prototype._uploadFile = function(folderUrl, name, base64Binary, digest) {
// 	var uploadUrl = "/web/GetFolderByServerRelativeUrl('" + folderUrl + "')/Files/Add(url='" + name + "',overwrite=true)";
// 	var options = {
// 			binaryStringRequestBody: true,
// 			state: "Update"
// 	};
// 	return this.post(uploadUrl, base64Binary, options);
// };

Web.prototype.getFile = function(url) {
	var url = `/web/getfilebyserverrelativeurl('${url}')`
	return this._dao.get(url).then(utils.validateODataV2);
};

Web.prototype.copyFile = function(sourceUrl, destinationUrl, digest) {
	if (digest) return this._copyFile(sourceUrl, destinationUrl, digest);

	return this.getRequestDigest().then(requestDigest => this._copyFile(sourceUrl, destinationUrl, requestDigest));
};

Web.prototype._copyFile = function(sourceUrl, destinationUrl, digest) {
	var url = "/web/getfilebyserverrelativeurl(@url)/CopyTo?@Url='" + sourceUrl + "'&strNewUrl='" + destinationUrl + "'&bOverWrite='true'";
	var options = {
		headers: headers.getAddHeaders(digest)
	};
	return this._dao.post(url, {}, options);
};

Web.prototype.deleteFile = function(sourceUrl, digest) {
	if (digest) return this._deleteFile(sourceUrl, digest);

	return this.getRequestDigest().then(requestDigest => this._deleteFile(sourceUrl, requestDigest));
};

Web.prototype._deleteFile = function(sourceUrl, requestDigest) {
	var url = "/web/getfilebyserverrelativeurl(@url)/?@Url='" + sourceUrl + "'";
	var options = {
		headers: headers.getDeleteHeaders(requestDigest)
	};
	return this._dao.post(url, {}, options);
}; 

Web.prototype.getUser = function(email) {
	var url = this.baseUrl + "/SiteUsers/GetByEmail('" + email + "')";
	return this._dao.get(url).then(utils.validateODataV2);
};

module.exports = Web;