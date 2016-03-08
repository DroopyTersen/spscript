var SPScript = require("./spscript");
SPScript.helpers = require("./helpers");
SPScript.permissions = require("./permissions");

(function(sp, $) {
	var baseUrl = null;
	var List = function(listname, dao) {
		this.listname = listname;
		baseUrl = "/web/lists/getbytitle('" + listname + "')";
		this._dao = dao;
	};

	List.prototype.getItems = function(odataQuery) {
		var query = (odataQuery != null) ? "?" + odataQuery : "";
		return this._dao
			.get(baseUrl + "/items" + query)
			.then(sp.helpers.validateODataV2);
	};

	List.prototype.getItemById = function(id, odata) {
		var url = baseUrl + "/items(" + id + ")";
		url += (odata != null) ? "?" + odata : "";
		return this._dao.get(url).then(sp.helpers.validateODataV2);
	};

	List.prototype.info = function() {
		return this._dao.get(baseUrl).then(sp.helpers.validateODataV2);
	};

	List.prototype.addItem = function(item) {
		var self = this;
		return self._dao.get(baseUrl).then(function(data) {
			item = $.extend({
				"__metadata": {
					"type": data.d.ListItemEntityTypeFullName
				}
			}, item);

			var customOptions = {
				headers: {
					"Accept": "application/json;odata=verbose",
					"X-RequestDigest": $("#__REQUESTDIGEST").val(),
				}
			};

			return self._dao.post(baseUrl + "/items", item, customOptions)
				.then(sp.helpers.validateODataV2);
		});
	};

	List.prototype.updateItem = function(itemId, updates) {
		var self = this;
		return self.getItemById(itemId).then(function(item) {
			updates = $.extend({
				"__metadata": {
					"type": item.__metadata.type
				}
			}, updates);

			var customOptions = {
				headers: {
					"Accept": "application/json;odata=verbose",
					"X-RequestDigest": $("#__REQUESTDIGEST").val(),
					"X-HTTP-Method": "MERGE",
					"If-Match": item.__metadata.etag
				}
			};

			return self._dao.post(item.__metadata.uri, updates, customOptions);
		});
	};
	
	List.prototype.deleteItem = function(itemId) {
		var self = this;
		return self.getItemById(itemId).then(function(item) {
			var customOptions = {
				headers: {
					"Accept": "application/json;odata=verbose",
					"X-RequestDigest": $("#__REQUESTDIGEST").val(),
					"X-HTTP-Method": "DELETE",
					"If-Match": item.__metadata.etag
				}
			};
			return self._dao.post(item.__metadata.uri, "", customOptions);
		});
	};

	List.prototype.findItems = function(key, value, extraOData) {
		//if its a string, wrap in single quotes
		var filterValue = typeof value === "string" ? "'" + value + "'" : value;
		var odata = "$filter=" + key + " eq " + filterValue;
		odata += (extraOData != null) ? "&" + extraOData : "";

		return this.getItems(odata);
	};

	List.prototype.findItem = function(key, value, odata) {
		return this.findItems(key, value, odata).then(function(items) {
			if (items && items.length && items.length > 0) {
				return items[0];
			}
			return null;
		});
	};

	List.prototype.permissions = function(email) {
		return sp.permissions(baseUrl, this._dao, email);
	};

	sp.List = List;
})(SPScript, jQuery);

module.exports = SPScript.List;