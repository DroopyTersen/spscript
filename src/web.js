var utils = require("./utils");
var Permissions = require("./permissions");
var headers = require("./requestHeaders");
var Folder = require("./filesystem").Folder;

/**
 * Represents a SharePoint site. You shouldn't ever be new'ing this class up up yourself, instead you'll get it from your dao as shown in first example.
 * @class
 * @param {IBaseDao} dao - Data access object used to make requests.
 * @property {Permissions} permissions - allows checking security information of the Web
 * @property {string} baseUrl - API relative url (value = "/web")
 * @example <caption>You access this Web class using the 'web' property of the dao</caption>
 * var dao = new SPScript.RestDao(_spPageContextInfo.webAbsoluteUrl);
 * dao.web.info().then(function(info) { console.log(info) });
 */
var Web = function(dao) {
	this._dao = dao;
	this.baseUrl = "/web";
	this.permissions = new Permissions(this.baseUrl, this._dao);
};

/**
 * Retrieves basic information about the site
 * @returns {Promise<SP.Web>} - A Promise that resolves to an object containing non-deferred properties of SP.Web (https://msdn.microsoft.com/en-us/library/office/jj244873.aspx)
 * @example
 * dao.web.info().then(function(info) { console.log(info) });
 */
Web.prototype.info = function() {
	return this._dao
		.get(this.baseUrl)
		.then(utils.validateODataV2);
};

/**
 * Retrieves all of the subsites
 * @returns {Promise<SP.Web[]>} - A Promise that resolves to an array of subsite object, each loaded with all non-deferred properties
 * @example
 *  dao.web.subsites().then(function(sites) { console.log(sites) });
 */
Web.prototype.subsites = function() {
	return this._dao
		.get(this.baseUrl + "/webinfos")
		.then(utils.validateODataV2);
};

/**
 * Retrieves a token needed to authorize any updates
 * @return {string} - A Promise that resolves to a the token that needs to added to the "X-RequestDigest" request header
 * @example
 *  dao.web.getRequestDigest().then(function(digest) { console.log(digest) });
 */
Web.prototype.getRequestDigest = function() {
	return this._dao.post('/contextinfo', {})
		.then(data => data.d.GetContextWebInformation.FormDigestValue);
};

/**
 * Retrieves a folder
 * @param {string} serverRelativeUrl - The server relative url of the folder
 * @returns {Promise<Folder>} - A Promise that resolves to a folder object contain a files and folders arrays
 * @example
 *  dao.web.getFolder("/sites/mysite/Shared Documents")
 *			.then(function(folder) { console.log(folder) });
 */
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

Web.prototype.uploadFile = function(folderUrl, fileContent, fields, digest) {
	if (digest) return this._uploadFile(folderUrl, fileContent, fields, digest);
	return this.getRequestDigest().then(digest => this._uploadFile(folderUrl, fileContent, fields, digest));
}

Web.prototype._uploadFile = function(folderUrl, fileContent, fields, digest) {
	fields = fields || {};
	// if its a string, just treat that as the raw content
	if (typeof fileContent === "string") {
		fields.name = fields.name || "NewFile.txt";
		return this._uploadBinaryData(folderUrl, fileContent, fields, digest);
	}

	// If its a browser File object, use FileReader to get ArrayBuffer
	if (fileContent instanceof File) {
		fields.name = fields.name || fileContent.name
		return utils.getArrayBuffer(fileContent)
			.then(arrayBuffer => this._uploadBinaryData(folderUrl, arrayBuffer, fields, digest))
	}
};

Web.prototype._setFileFields = function(spFile, fields, digest) {
	// Get the ListItem with ParentList properties so we can query by list title
	return this._dao.get(spFile.__metadata.uri + "/ListItemAllFields?$expand=ParentList")
		.then(utils.validateODataV2)
		.then(item => {
			delete fields.name;
			// if there were no fields passed in just return the file and list item
			if (Object.keys(fields).length === 0) {
				return {
					item,
					file: spFile
				}
			};
			// If extra fields were passed in, update the list item
			return this._dao.lists(item.ParentList.Title).updateItem(item.Id, fields, digest)
				.then(() => {
					item = Object.assign({}, item, fields);
					return { item, file: spFile };
				})
		})
};

Web.prototype._uploadBinaryData = function(folderUrl, binaryContent, fields, digest) {
	var uploadUrl = "/web/GetFolderByServerRelativeUrl('" + folderUrl + "')/Files/Add(url='" + fields.name + "',overwrite=true)";
	var options = {
		headers: headers.getFilestreamHeaders(digest)
	};
	return this._dao.post(uploadUrl, binaryContent, options)
		.then(utils.validateODataV2)
		.then(spFile => this._setFileFields(spFile, fields, digest));
};

/**
 * Retrieves a file object
 * @param {string} url - The server relative url of the file
 * @returns {Promise<File>} - A Promise that resolves to a file object
 * @example
 *  dao.web.getFile("/sites/mysite/Shared Documents/myfile.docx")
 *			.then(function(file) { console.log(file) });
 */
Web.prototype.getFile = function(url) {
	var url = `/web/getfilebyserverrelativeurl('${url}')`
	return this._dao.get(url).then(utils.validateODataV2);
};

/**
 * Copies a file
 * @param {string} sourceUrl - The server relative url of the file you want to copy
 * @param {string} destinationUrl - The server relative url of the destination
 * @param {string} [[requestDigest]] - The request digest token used to authorize the request. One will be automatically retrieved if not passed.
 * @example
 * var sourceFile = "/sites/mysite/Shared Documents/myfile.docx";
 * var destination = "/sites/mysite/Restricted Docs/myFile.docx";
 * dao.web.copyFile(sourceFile, destination).then(function() { console.log("Success") });
 */
Web.prototype.copyFile = function(sourceUrl, destinationUrl, digest) {
	if (digest) return this._copyFile(sourceUrl, destinationUrl, digest);

	return this.getRequestDigest().then(requestDigest => this._copyFile(sourceUrl, destinationUrl, requestDigest));
};

Web.prototype._copyFile = function(sourceUrl, destinationUrl, digest) {
	var url = `/web/getfilebyserverrelativeurl('${sourceUrl}')/CopyTo(strnewurl='${destinationUrl}',boverwrite=true)`
	var options = {
		headers: headers.getAddHeaders(digest)
	};
	return this._dao.post(url, {}, options);
};

/**
 * Deletes a file
 * @param {string} fileUrl - The server relative url of the file you want to delete
 * @param {string} [[requestDigest]] - The request digest token used to authorize the request. One will be automatically retrieved if not passed.
 * @example
 * dao.web.deleteFile("/sites/mysite/Shared Documents/myFile.docx")
 *			.then(function() { console.log("Success")});
 */
Web.prototype.deleteFile = function(fileUrl, digest) {
	if (digest) return this._deleteFile(fileUrl, digest);

	return this.getRequestDigest().then(requestDigest => this._deleteFile(fileUrl, requestDigest));
};

Web.prototype._deleteFile = function(sourceUrl, requestDigest) {
	var url = "/web/getfilebyserverrelativeurl(@url)/?@Url='" + sourceUrl + "'";
	var options = {
		headers: headers.getDeleteHeaders(requestDigest)
	};
	return this._dao.post(url, {}, options);
};

/**
 * Retrieves a users object based on an email address
 * @param {string} email - The email address of the user to retrieve
 * @returns {Promise<SP.User>} - A Promise that resolves to a an SP.User object
 * @example
 * dao.web.getUser("andrew@andrewpetersen.onmicrosoft.com")
 * 			.then(function(user) { console.log(user)});
 */
Web.prototype.getUser = function(email) {
	var url = this.baseUrl + "/SiteUsers/GetByEmail('" + email + "')";
	return this._dao.get(url).then(utils.validateODataV2);
};

module.exports = Web;