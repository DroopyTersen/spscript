var utils = require("./utils");
var headers = require("./requestHeaders");

// MSDN Info
// https://msdn.microsoft.com/en-us/library/office/dn531432.aspx#bk_UserCustomActionCollection



var metadata = {
	__metadata: {
		"type": "SP.UserCustomAction"
	}
};

var CustomActions = function(web) {
	this.web = web;
	this.baseUrl = "/web/userCustomActions";
};

CustomActions.prototype.get = function(name) {
	return this.web._dao.get(this.baseUrl)
		.then(utils.validateODataV2)
		.then(customActions => {
			if (name) return customActions.find(a => a.Name === name);
			else return customActions;
		});
};

CustomActions.prototype._getUrl = function(name) {
	return this.get(name).then(a => {
		var url = `${this.baseUrl}('${a.Id}')`
		return url;
	});
};

CustomActions.prototype._getUrlAndDigest = function(name) {
	var prep = {};
	return this._getUrl(name)
		.then(url => {
			prep.url = url;
			return this.web.getRequestDigest()
		})
		.then(digest => {
			prep.digest = digest;
			return prep;
		});
};

CustomActions.prototype.update = function(updates) {
	if (!updates || !updates.Name) throw new Error("You must at least pass a Custom Action 'Name'");
	return this._getUrlAndDigest(updates.Name)
		.then(prep => {
			updates = Object.assign({}, metadata, updates);
			var opts = {
				headers: headers.getUpdateHeaders(prep.digest)
			};
			return this.web._dao.post(prep.url, updates, opts);
		})
};

// 1. Get request digest to authorize request
// 2. Get all the custom actions
// 3. Filter to get the custom actions with the specified name
// 4. Perform a DELETE request on each of the matching custom actions
// 5. Wait for all the DELETE's to succeed before resolving the promise
CustomActions.prototype.remove = function(name) {
	var digest = null;
	return this.web.getRequestDigest()
		.then(d => digest = d)
		.then(() => this.get())
		.then(all => all.filter(a => a.Name === name))
		.then(matches => Promise.all(matches.map(a => this._remove(a.Id, digest))))
};

CustomActions.prototype._remove = function(id, digest) {
	var url = `${this.baseUrl}('${id}')`;
	var opts = {
		headers: headers.getDeleteHeaders(digest)
	};
	return this.web._dao.post(url, {}, opts);
};

CustomActions.prototype.add = function(customAction) {
	if (!customAction || !customAction.Name || !customAction.Location) 
		throw new Error("You must at least pass a Custom Action 'Name' and 'Location'");
	return this.web.getRequestDigest()
		.then(digest => {
			customAction = Object.assign({}, metadata, customAction);
			var opts = {
				headers: headers.getAddHeaders(digest)
			};
			return this.web._dao.post(this.baseUrl, customAction, opts);
		})
};
CustomActions.metadata = metadata;
module.exports = CustomActions;