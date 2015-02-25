SPScript = window.SPScript || {};
/* 
 * ==========
 * BaseDao - 'Abstract', use either RestDao or CrossDomainDao which inherit
 * Dependencies: ["$", "Web"]
 * ==========
 */
(function(sp) {
	var BaseDao = function() {
		var self = this;

		self.web = new sp.Web(self);
	};

	BaseDao.prototype.executeRequest = function() {
		throw "Not implemented exception";
	};

	BaseDao.prototype.get = function(relativeQueryUrl, extendedOptions, raw) {
		var options = {
			method: "GET"
		};

		if (extendedOptions) {
			$.extend(options, extendedOptions);
		}
		return this.executeRequest(relativeQueryUrl, options);
	};

	//lists()
	//lists(listname).info()
	//lists(listname).getItemById(id)
	//lists(listname).addItem(item)
	//lists(listname).updateItem(id, item)
	//lists(listname).getItems()
	//lists(listname).getItems(odata)
	//lists(listname).findItems(key, value)
	//lists(listname).findItem(key, value)
	BaseDao.prototype.lists = function(listname) {
		if(!listname) {
			return this.get("/web/lists").then(sp.helpers.validateODataV2);
		}
		return new sp.List(listname, this);
	};

	BaseDao.prototype.post = function(relativePostUrl, body, extendedOptions) {
		var strBody = JSON.stringify(body);
		var options = {
			method: "POST",
			data: strBody,
			contentType: "application/json;odata=verbose"
		};
		$.extend(options, extendedOptions);
		return this.executeRequest(relativePostUrl, options);
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