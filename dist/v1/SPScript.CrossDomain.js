SPScript = window.SPScript || {};
/* 
 * ==========
 * Helpers
 * Dependencies: ["$"]
 * ==========
 */
(function(sp) {
	var helpers = {};
	helpers.validateODataV2 = function(data, deferred) {
		var results = data;
		if (data.d && data.d.results && data.d.results.length != null) {
			results = data.d.results;
		} else if (data.d) {
			results = data.d;
		}

		if (deferred) {
			deferred.resolve(results);
		} else {
			return results;
		}
	};

	helpers.validateCrossDomainODataV2 = function(response, deferred) {
		var data = $.parseJSON(response.body);
		SPScript.helpers.validateODataV2(data, deferred);
	};

	sp.helpers = helpers;
})(SPScript);

SPScript = window.SPScript || {};

(function(sp) {
	var baseUrl = "/web";
	var Web = function(dao) {
		this._dao = dao;
	};

	Web.prototype.info = function() {
		return this._dao
			.get(baseUrl)
			.then(sp.helpers.validateODataV2);
	};

	Web.prototype.subsites = function() {
		return this._dao
			.get(baseUrl + "/webinfos")
			.then(sp.helpers.validateODataV2);
	};
	sp.Web = Web;
})(SPScript);
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
	//lists(listname).items.find(key, value)
	//lists(listname).items.findOne(key, value)
	BaseDao.prototype.lists = function(listname) {
		var self = this,
			baseUrl = "/web/lists/getbytitle('" + listname + "')";

		var getItems = function(odataQuery) {
			var query = (odataQuery != null) ? "?" + odataQuery : "";
			//query = encodeURIComponent(query);
			return self.get(baseUrl + "/items" + query).then(function(data) {
				if (data && data.d && data.d.results) {
					return data.d.results;
				} else {
					return data;
				}
			});
		};

		var getById = function(id) {
			var url = baseUrl + "/items(" + id + ")";
			return self.get(url).then(function(data) {
				if (data.d) return data.d;
				else return data;
			});
		};

		//If no list name was passed, return a promise to get all the lists
		if(!listname) {
			return self.get("/web/lists").then(sp.helpers.validateODataV2);
		}
		//A list name was passed so return list context methods
		return {
			info: function() {
				return self.get(baseUrl).then(sp.helpers.validateODataV2);
			},
			getItemById: getById,
			getItems: getItems,
			addItem: function(item) {
				return self.get(baseUrl).then(function(data) {
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

					return self.post(baseUrl + "/items", item, customOptions);
				});
			},
			updateItem: function(itemId, updates) {
				return getById(itemId).then(function(item) {
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

					return self.post(url, updates, customOptions);
				});
			},
			items: {
				find: function(key, value) {
					var odata = "$filter=" + key + " eq '" + value + "'";
					return getItems(odata);
				},
				findOne: function(key, value) {
					var odata = "$filter=" + key + " eq '" + value + "'";
					return getItems(odata).then(function(items) {
						if (items && items.length && items.length > 0) {
							return items[0];
						}
						return null;
					});
				}
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
SPScript = window.SPScript || {};
/* 
 * ==========
 * CrossDomainDao
 * Dependencies: ["$", "baseDao.js", "ODataHelpers.js"]
 * ==========
 */
(function(sp) {
	var CrossDomainDao = function(appWebUrl, hostUrl) {
		this.appUrl = appWebUrl;
		this.hostUrl = hostUrl;
		this.scriptReady = new $.Deferred();

		//Load of up to RequestExecutor javascript from the host site if its not there.
		if (!SP || !SP.RequestExecutor) {
			this.scriptReady = $.getScript(hostUrl + "/_layouts/15/SP.RequestExecutor.js");
		} else {
			setTimeout(function() {
				this.scriptReady.resolve();	
			}, 1);
		}
	};

	CrossDomainDao.prototype = new SPScript.BaseDao();

	CrossDomainDao.prototype.executeRequest = function(hostRelativeUrl, options) {
		var self = this,
			deferred = new $.Deferred(),

			//If a callback was given execute it, passing response then the deferred
			//otherwise just resolve the deferred.
			successCallback = function(response) {
				var data = $.parseJSON(response.body);
				//a suceess callback was passed in
				if (options.success) {
					options.success(data, deferred);
				} else {
					//no success callback so just make sure its valid OData
					sp.helpers.validateODataV2(data, deferred);
				}
			},
			errorCallback = function(data, errorCode, errorMessage) {
				//an error callback was passed in
				if (options.error) {
					options.error(data, errorCode, errorMessage, deferred);
				} else {
					//no error callback so just reject it
					deferred.reject(errorMessage);
				}
			};

		this.scriptReady.done(function() {
			//tack on the query string question mark if not there already
			if (hostRelativeUrl.indexOf("?") === -1) {
				hostRelativeUrl = hostRelativeUrl + "?";
			}

			var executor = new SP.RequestExecutor(self.appUrl),
				fullUrl = self.appUrl + "/_api/SP.AppContextSite(@target)" + hostRelativeUrl + "@target='" + self.hostUrl + "'";

			var executeOptions = {
				url: fullUrl,
				method: "GET",
				headers: {
					"Accept": "application/json; odata=verbose"
				},
				success: successCallback,
				error: errorCallback
			};
			//Merge passed in options
			$.extend(true, executeOptions, options);
			executor.executeAsync(executeOptions);
		});
		return deferred.promise();
	};

	sp.CrossDomainDao = CrossDomainDao;
})(SPScript);
