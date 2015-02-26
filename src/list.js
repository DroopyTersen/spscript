SPScript = window.SPScript || {};

(function(sp) {
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

	List.prototype.getItemById = function(id) {
		var url = baseUrl + "/items(" + id + ")";
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

			return self._dao.post(baseUrl + "/items", item, customOptions);
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

			return self._dao.post(url, updates, customOptions);
		});
	};

	List.prototype.findItems = function(key, value) {
		//if its a string, wrap in single quotes
		var filterValue = typeof value === "string" ? "'" + value + "'" : value;
		var odata = "$filter=" + key + " eq " + filterValue;
		return this.getItems(odata);
	};

	List.prototype.findItem = function(key, value){
		return this.findItems(key, value).then(function(items) {
			if (items && items.length && items.length > 0) {
				return items[0];
			}
			return null;
		});
	};

	List.prototype.permissions = function() {
		return sp.permissions(baseUrl, this._dao);
	};

	sp.List = List;
})(SPScript);
