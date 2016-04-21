var utils = require("./utils");
var Permissions = require("./permissions");
var objAssign = require("object-assign");

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
	var url = "/contextinfo";
	var options = {
		headers: {
			"Accept": "application/json;odata=verbose",
			"Content-Type": "application/json;odata=verbose"
			//"Content-Length": "255",
		}
	};
	return this._dao.post(url, {}, options).then(function(data) {
		return data.d.GetContextWebInformation.FormDigestValue;
	});
};

Web.prototype.copyFile = function(sourceUrl, destinationUrl, digest) {
	var self = this;
	if (digest) return self._copyFileWithDigest(sourceUrl, destinationUrl, digest);

	self.getRequestDigest().then(function(requestDigest) {
		return self._copyFileWithDigest(sourceUrl, destinationUrl, requestDigest)
	});
};

Web.prototype.deleteFile = function(sourceUrl, digest) {
	var self = this;
	if (digest) return self._deleteFileWithDigest(sourceUrl, digest);

	self.getRequestDigest().then(function(requestDigest) {
		return self._deleteFileWithDigest(sourceUrl, requestDigest)
	});
};

var headers = {
			"Accept": "application/json;odata=verbose",
			"Content-Type": "application/json;odata=verbose"
};

Web.prototype._deleteFileWithDigest = function(sourceUrl, requestDigest) {
	var url = "/web/getfilebyserverrelativeurl(@url)/?@Url='" + sourceUrl + "'";
	var options = {
		headers: objAssign({}, headers, { 
			"X-HTTP-Method": "DELETE",
			"X-RequestDigest": requestDigest
	 	})
	};
	return this._dao.post(url, {}, options);
}; 

Web.prototype._copyFileWithDigest = function(sourceUrl, destinationUrl, requestDigest) {
	var url = "/web/getfilebyserverrelativeurl(@url)/CopyTo?@Url='" + sourceUrl + "'&strNewUrl='" + destinationUrl + "'&bOverWrite='true'";
	var options = {
		headers: objAssign({}, headers, { "X-RequestDigest": requestDigest })
	}
	return this._dao.post(url, {}, options);
};


Web.prototype.getUser = function(email) {
	var url = baseUrl + "/SiteUsers/GetByEmail('" + email + "')";
	return this._dao.get(url).then(utils.validateODataV2);
};

module.exports = Web;