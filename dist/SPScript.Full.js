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

		var getItems = function(odataQuery) {
			var query = (oDataQuery != null) ? "?" + oDataQuery : "";
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
			var url = baseUrl + "/items(" + itemId + ")";
			return self.get(url).then(function(data) {
				if (data.d) return data.d;
				else return data;
			});
		};

		//If no list name was passed, return a promise to get all the lists
		if(!listname) {
			return self.get("/web/lists");
		}
		//A list name was passed so return list context methods
		return {
			info: function() {
				return self.get(baseUrl);
			},
			getById: getById,
			items: getItems,
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
 * Helpers
 * Dependencies: ["$"]
 * ==========
 */
(function(sp) {
	var helpers = {};
	helpers.validateODataV2 = function(data, deferred) {
		if (data.d && data.d.results && data.d.results.length != null) {
			deferred.resolve(data.d.results);
		} else if (data.d) {
			deferred.resolve(data.d);
		} else {
			deferred.resolve(data);
		}
	};

	helpers.validateCrossDomainODataV2 = function(response, deferred) {
		var data = $.parseJSON(response.body);
		SPScript.helpers.validateODataV2(data, deferred);
	};

	sp.helpers = helpers;
})(SPScript);

SPScript = window.SPScript || {};
/* 
 * ==========
 * RestDao
 * Dependencies: ["$", "baseDao.js"]
 * ==========
 */
(function(sp) {
	var RestDao = function(url) {
		var self = this;
		this.webUrl = url;
	};

	RestDao.prototype = new SPScript.BaseDao();

	RestDao.prototype.executeRequest = function(relativeUrl, options) {
		var self = this,
			deferred = new $.Deferred(),

			//If a callback was given execute it, passing response then the deferred
			//otherwise just resolve the deferred.
			successCallback = function(response) {
				if (options.success) {
					options.success(response, deferred);
				} else {
					deferred.resolve(response);
				}
			},
			errorCallback = function(data, errorCode, errorMessage) {
				if (options.error) {
					options.error(data, errorCode, errorMessage, deferred);
				} else {
					deferred.reject(errorMessage);
				}
			},
			fullUrl = this.webUrl + "/_api" + relativeUrl,
			executeOptions = {
				url: fullUrl,
				method: "GET",
				headers: {
					"Accept": "application/json; odata=verbose"
				},
				success: successCallback,
				error: errorCallback
			};

		$.extend(executeOptions, options);
		$.ajax(executeOptions);

		return deferred.promise();
	};

	sp.RestDao = RestDao;
})(SPScript);
SPScript = window.SPScript || {};
/* 
 * ==========
 * queryString
 * Dependencies: []
 * ==========
 */
(function(sp) {
	sp.queryString = {
		/*  === getValue ===
		
			Summary: Pass a string value in as the key to get the string value
			Note: Returns empty string("") if key is not found
			Usage: var id = QueryString.getValue("id");
		*/

		/*  === getAll ===
		
			Summary: returns a hash table of query string arguments
			Usage:
				var args = QueryString.getAll();
				for (var i = 0; i < args.length; i++) {
					var key = args[i];
					var value = args[key];
					alert(key + " : " + value);
				}
		*/

		/*  === contains ===
			
			Summary: Pass in a string value as the key to see whether it exists
					in the query string arguments.  Returns boolean.
			Usage:
					if (QueryString.contains("redirectUrl")){
						window.location.href = QueryString.GetValue("redirectUrl");
					}	
		*/

		//private variables
		_queryString: {},
		_processed: false,

		//private method (only run on the first 'GetValue' request)
		_processQueryString: function(text) {
			var qs = text || window.location.search.substring(1),
				keyValue,
				keyValues = qs.split('&');

			for (var i = 0; i < keyValues.length; i++) {
				keyValue = keyValues[i].split('=');
				//this._queryString.push(keyValue[0]);
				this._queryString[keyValue[0]] = decodeURIComponent(keyValue[1].replace(/\+/g, " "));
			}

			this._processed = true;
		},

		//Public Methods
		contains: function(key, text) {
			if (!this._processed) {
				this._processQueryString(text);
			}
			return this._queryString.hasOwnProperty(key);
		},

		getValue: function(key, text) {
			if (!this._processed) {
				this._processQueryString(text);
			}
			return this.contains(key) ? this._queryString[key] : "";
		},

		getAll: function(text) {
			if (!this._processed) {
				this._processQueryString(text);
			}
			return this._queryString;
		},

		objectToQueryString: function(obj, quoteValues) {
			var params = [];
			for (var key in obj) {
				value = obj[key];
				if (value !== null) {
					if (quoteValues) {
						params.push(encodeURIComponent(key) + "='" + encodeURIComponent(value) + "'");
					} else {
						params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
					}
				}

			}
			return params.join("&");
		}
	};
})(SPScript);
SPScript = window.SPScript || {};
/* 
 * ==========
 * Search
 * Dependencies: ["$", "restDao.js", "queryString.js" ]
 * ==========
 */
(function(sp) {
	var Search = function(url) {
		this.dao = new SPScript.RestDao(url);
		this.webUrl = url;
	};

	Search.QueryOptions = function() {
		this.sourceid = null;
		this.startrow = null;
		this.rowlimit = 30;
		this.selectedproperties = null;
		this.refiners = null;
		this.refinementfilters = null;
		this.hiddenconstraints = null;
		this.sortlist = null;
	};

	var convertRowsToObjects = function(itemRows) {
		var items = [];

		for (var i = 0; i < itemRows.length; i++) {
			var row = itemRows[i],
				item = {};
			for (var j = 0; j < row.Cells.results.length; j++) {
				item[row.Cells.results[j].Key] = row.Cells.results[j].Value;
			}

			items.push(item);
		}

		return items;
	};

	//sealed class used to format results
	var SearchResults = function(queryResponse) {
		this.elapsedTime = queryResponse.ElapsedTime;
		this.suggestion = queryResponse.SpellingSuggestion;
		this.resultsCount = queryResponse.PrimaryQueryResult.RelevantResults.RowCount;
		this.totalResults = queryResponse.PrimaryQueryResult.RelevantResults.TotalRows;
		this.totalResultsIncludingDuplicates = queryResponse.PrimaryQueryResult.RelevantResults.TotalRowsIncludingDuplicates;
		this.items = convertRowsToObjects(queryResponse.PrimaryQueryResult.RelevantResults.Table.Rows.results);
	};

	Search.prototype.query = function(queryText, queryOptions) {
		var self = this,
			optionsQueryString = queryOptions != null ? "&" + SPScript.queryString.objectToQueryString(queryOptions, true) : "",
			asyncRequest = new $.Deferred();

		var url = "/search/query?querytext='" + queryText + "'" + optionsQueryString;
		var getRequest = self.dao.get(url);

		getRequest.done(function(data) {
			if (data.d && data.d.query) {
				var results = new SearchResults(data.d.query);
				asyncRequest.resolve(results);
			} else {
				asyncRequest.reject(data);
			}
		});

		return asyncRequest.promise();
	};

	sp.Search = Search;
})(SPScript);
SPScript = window.SPScript || {};
/* 
 * ==========
 * templating
 * ==========
 */
(function(sp) {
	sp.templating = {

		Placeholder: function(raw) {
			this.raw = raw;
			this.fullProperty = raw.slice(2, raw.length - 2);
		},

		getPlaceHolders: function(template, regexp) {
			var regExpPattern = regexp || /\{\{[^\}]+\}\}?/g;
			return template.match(regExpPattern);
		},

		getObjectValue: function(obj, fullProperty) {
			var value = obj,
				propertyChain = fullProperty.split('.');

			for (var i = 0; i < propertyChain.length; i++) {
				var property = propertyChain[i];
				value = value[property] != null ? value[property] : "Not Found: " + fullProperty;
			}

			if ((typeof value === "string") && value.indexOf("/Date(") !== -1) {
				dateValue = value.UTCJsonToDate();
				value = dateValue.toLocaleDateString();
			}

			return value;
		},

		populateTemplate: function(template, item, regexp) {
			var placeholders = this.getPlaceHolders(template, regexp) || [],
				itemHtml = template;

			for (var i = 0; i < placeholders.length; i++) {
				var placeholder = new this.Placeholder(placeholders[i]);
				placeholder.val = this.getObjectValue(item, placeholder.fullProperty);
				var pattern = placeholder.raw.replace("[", "\\[").replace("]", "\\]");
				modifier = "g";
				itemHtml = itemHtml.replace(new RegExp(pattern, modifier), placeholder.val);
			}
			return itemHtml;
		}
	};

	sp.templating.Each = {

		regExp: /\{\[[^\]]+\]\}?/g,

		populateEachTemplates: function(itemHtml, item) {
			var $itemHtml = $(itemHtml),
				eachTemplates = $itemHtml.find("[data-each]");

			eachTemplates.each(function() {
				var arrayHtml = "",
					itemTemplate = $(this).html(),
					arrayProp = $(this).data("each"),
					array = sp.templating.getObjectValue(item, arrayProp);

				if (array != null && $.isArray(array)) {
					for (var i = 0; i < array.length; i++) {
						arrayHtml += sp.templating.populateTemplate(itemTemplate, array[i], sp.templating.Each.regExp);
					}
				}

				$itemHtml.find($(this)).html(arrayHtml);
			});

			var temp = $itemHtml.clone().wrap("<div>");
			return temp.parent().html();
		}
	};

	sp.templating.renderTemplate = function(template, item, renderEachTemplate) {
		var itemHtml = sp.templating.populateTemplate(template, item);
		if (renderEachTemplate) {
			itemHtml = sp.templating.Each.populateEachTemplates(itemHtml, item);
		}
		return itemHtml;
	};
})(SPScript);

String.prototype.UTCJsonToDate = function() {
	var utcStr = this.substring(this.indexOf("(") + 1);
	utcStr = utcStr.substring(0, utcStr.indexOf(")"));

	var returnDate = new Date(parseInt(utcStr, 10));
	var hourOffset = returnDate.getTimezoneOffset() / 60;
	returnDate.setHours(returnDate.getHours() + hourOffset);

	return returnDate;
};