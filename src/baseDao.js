SPScript = window.SPScript || {};
/* 
 * ==========
 * BaseDao - 'Abstract', use either RestDao or CrossDomainDao which inherit
 * Dependencies: ["$"]
 * ==========
 */
(function(sp) {
	var BaseDao = function() {};

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

	BaseDao.prototype.lists = function(listname) {
		var self = this,
			baseUrl = "/web/lists/getbytitle('" + listname + "')";

		return {
			info: function() {
				return self.get(baseUrl);
			},

			items: function(oDataQuery) {
				var query = (oDataQuery != null) ? "?" + oDataQuery : "";
				//query = encodeURIComponent(query);
				return self.get(baseUrl + "/items" + query).then(function(data){
					if (data && data.d && data.d.results) {
						return data.d.results;
					} else {
						return data;
					}
				});
			},
			updateItem: function (itemId, updates) {
				var url = baseUrl + "/items(" + itemId + ")";
				return self.get(url).then(function(data){
					updates = $.extend({
						"__metadata": { "type": data.d.__metadata.type }
					}, updates);

					var customOptions = {    
						headers: {
							"Accept": "application/json;odata=verbose",
							"X-RequestDigest": $("#__REQUESTDIGEST").val(),
							"X-HTTP-Method": "MERGE",
							"If-Match": data.d.__metadata.etag
						}
					};
					
					return self.post(url, updates, customOptions);
				});
			}
		};
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