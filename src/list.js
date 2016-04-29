var utils 			= require("./utils");
var Permissions 	= require("./permissions");
var headers 		= require("./requestHeaders");

var List = function(listname, dao) {
	this.listname = listname;
	this.baseUrl = "/web/lists/getbytitle('" + listname + "')";
	this._dao = dao;
	this.permissions = new Permissions(this.baseUrl, this._dao);
};

List.prototype.getItems = function(odataQuery) {
	return this._dao
		.get(this.baseUrl + "/items" + appendOData(odataQuery))
		.then(utils.validateODataV2);
};

List.prototype.getItemById = function(id, odata) {
	var url = this.baseUrl + "/items(" + id + ")" + appendOData(odata);
	return this._dao.get(url).then(utils.validateODataV2);
};

List.prototype.info = function() {
	return this._dao.get(this.baseUrl).then(utils.validateODataV2);
};

List.prototype.addItem = function(item, requestDigest) {
	if (requestDigest) return this._addItem(item, requestDigest);

	return this._dao.getRequestDigest().then(requestDigest => this._addItem(item, requestDigest));
};

List.prototype._addItem = function(item, requestDigest) {
	return this._dao.get(this.baseUrl).then(data => {

		//decorate the item with the 'type' metadata
		item = Object.assign({}, {
			"__metadata": {
				"type": data.d.ListItemEntityTypeFullName
			}
		}, item);

		var customOptions = {
			headers: headers.getAddHeaders(requestDigest)
		};
		return this._dao.post(this.baseUrl + "/items", item, customOptions)
	})
	.then(utils.validateODataV2);
};

List.prototype.updateItem = function(item, updates, requestDigest) {
	if (requestDigest) return this._updateItem(item, updates, requestDigest);

	return this._dao.getRequestDigest().then(requestDigest => this._updateItem(item, updates, requestDigest));
};

List.prototype._updateItem = function(itemId, updates, digest) {
	return this.getItemById(itemId).then(item => {
		//decorate the item with the 'type' metadata
		updates = Object.assign({}, {
			"__metadata": {
				"type": item.__metadata.type
			}
		}, updates);

		var customOptions = {
			headers: headers.getUpdateHeaders(digest, item.__metadata.etag)
		};

		return this._dao.post(item.__metadata.uri, updates, customOptions);
	});
};

List.prototype.deleteItem = function(itemId, requestDigest) {
	if (requestDigest) return this._deleteItem(itemId, requestDigest);

	return this._dao.getRequestDigest().then(requestDigest => this._deleteItem(itemId, requestDigest));
};

List.prototype._deleteItem = function(itemId, digest) {
	return this.getItemById(itemId).then(item => {
		var customOptions = {
			headers: headers.getDeleteHeaders(digest, item.__metadata.etag)
		};
		return this._dao.post(item.__metadata.uri, "", customOptions);
	});
};

List.prototype.findItems = function(key, value, extraOData) {
	//if its a string, wrap in single quotes
	var filterValue = typeof value === "string" ? "'" + value + "'" : value;
	var odata = "$filter=" + key + " eq " + filterValue + appendOData(extraOData, "&");

	return this.getItems(odata);
};

List.prototype.findItem = function(key, value, odata) {
	return this.findItems(key, value, odata).then(items => {
		if (items && items.length && items.length > 0) {
			return items[0];
		}
		return null;
	});
};

var appendOData = function(odata, prefix) {
	prefix = prefix || "?";
	if (odata) return prefix + odata;
	return "";
};

module.exports = List;