(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
SPScript = require("./spscript");
SPScript.List = require("./list");
SPScript.Web = require("./web");
SPScript.Profiles = require("./profiles")
SPScript.helpers = require("./helpers");

(function(sp) {
	var BaseDao = function() {
		var self = this;

		self.web = new sp.Web(self);
		self.search = new sp.Search(self);
		self.profiles = new sp.Profiles(self);
	};

	BaseDao.prototype.executeRequest = function() {
		throw "Not implemented exception";
	};

	BaseDao.prototype.get = function(relativeQueryUrl, extendedOptions, raw) {
		var options = {
			type: "GET"
		};

		if (extendedOptions) {
			$.extend(options, extendedOptions);
		}
		return this.executeRequest(relativeQueryUrl, options);
	};

	BaseDao.prototype.lists = function(listname) {
		if(!listname) {
			return this.get("/web/lists").then(sp.helpers.validateODataV2);
		}
		return new sp.List(listname, this);
	};

	BaseDao.prototype.post = function(relativePostUrl, body, extendedOptions) {
		var strBody = JSON.stringify(body);
		var options = {
			type: "POST",
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

module.exports = SPScript.BaseDao;
},{"./helpers":4,"./list":5,"./profiles":7,"./spscript":11,"./web":13}],2:[function(require,module,exports){
SPScript = require("./spscript");
SPScript.helpers = require("./helpers");
SPScript.BaseDao = require("./baseDao");

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
				type: "GET",
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

module.exports = SPScript.CrossDomainDao;
},{"./baseDao":1,"./helpers":4,"./spscript":11}],3:[function(require,module,exports){
(function (global){
global.SPScript = {};
global.SPScript.RestDao = require("../restDao");
global.SPScript.CrossDomainDao = require("../crossDomainDao");
global.SPScript.queryString = require("../queryString");
global.SPScript.Search = require("../search");
global.SPScript.templating = require("../templating");
module.exports = global.SPScript;
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../crossDomainDao":2,"../queryString":8,"../restDao":9,"../search":10,"../templating":12}],4:[function(require,module,exports){
var SPScript = require("./spscript.js");

(function(sp) {
	var helpers = {};
	helpers.validateODataV2 = function(data) {
		var results = data;
		if (data.d && data.d.results && data.d.results.length != null) {
			results = data.d.results;
		} else if (data.d) {
			results = data.d;
		}
		return results;
	};

	helpers.validateCrossDomainODataV2 = function(response) {
		var data = $.parseJSON(response.body);
		helpers.validateODataV2(data);
	};

	//'Borrowed' from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
	helpers.arrayFromBitMask = function (nMask) {
		// nMask must be between -2147483648 and 2147483647
		if (typeof nMask === "string") {
			nMask = parseInt(nMask);
		}
		// if (nMask > 0x7fffffff || nMask < -0x80000000) { 
		// 	throw new TypeError("arrayFromMask - out of range"); 
		// }
		for (var nShifted = nMask, aFromMask = []; nShifted; aFromMask.push(Boolean(nShifted & 1)), nShifted >>>= 1);
		return aFromMask;
	};

	sp.helpers = helpers;
})(SPScript);

module.exports = SPScript.helpers;
},{"./spscript.js":11}],5:[function(require,module,exports){
var SPScript = require("./spscript");
SPScript.helpers = require("./helpers");
SPScript.permissions = require("./permissions");

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
})(SPScript);

module.exports = SPScript.List;
},{"./helpers":4,"./permissions":6,"./spscript":11}],6:[function(require,module,exports){
var SPScript = require("./spscript");
SPScript.helpers = require("./helpers");

(function(sp) {
	var transforms = {
		roleAssignment: function(raw) {
			var priv = {
				member: {
					login: raw.Member.LoginName,
					name: raw.Member.Title,
					id: raw.Member.Id
				}
			};
			priv.roles = raw.RoleDefinitionBindings.results.map(function(roleDef){
				return {
					name: roleDef.Name,
					description: roleDef.Description,
					basePermissions: permissionMaskToStrings(roleDef.BasePermissions.Low, roleDef.BasePermissions.High)
				};
			});
			return priv;
		}
	};

	var permissionMaskToStrings = function(lowMask, highMask) {
		var basePermissions = [];
		spBasePermissions.forEach(function(basePermission){
			if ((basePermission.low & lowMask) > 0 || (basePermission.high & highMask) > 0) {
				basePermissions.push(basePermission.name);
			}
		});
		return basePermissions;
	};

	var permissions = function(baseUrl, dao, email) {
		if(!email) {
			var url = baseUrl + "/RoleAssignments?$expand=Member,RoleDefinitionBindings";
			return dao.get(url)
				.then(sp.helpers.validateODataV2)
				.then(function(results){
					return results.map(transforms.roleAssignment);
				});
		}
		//An email was passed so check privs on that specific user
		var checkPrivs = function(user) {
			var login = encodeURIComponent(user.LoginName);
			var url = baseUrl + "/getusereffectivepermissions(@v)?@v='" + login + "'";
			return dao.get(url).then(sp.helpers.validateODataV2);
		};
		return dao.web.getUser(email)
			.then(checkPrivs)
			.then(function(privs) {
				return permissionMaskToStrings(privs.GetUserEffectivePermissions.Low, privs.GetUserEffectivePermissions.High);
			});
	};

	// Scraped it from SP.PermissionKind
	// var basePermissions = [];
	// Object.keys(SP.PermissionKind).forEach(function(key) { 
	// 	var perm = new SP.BasePermissions();
	//     perm.set(SP.PermissionKind[key]);
	//     var permisison = {
	//     	name: key,
	//     	low: perm.$A_1,
	//     	high: perm.$9_1
	//     };
	//     basePermissions.push(permisison);
	// });
	var spBasePermissions = [  
   {  
      "name":"emptyMask",
      "low":0,
      "high":0
   },
   {  
      "name":"viewListItems",
      "low":1,
      "high":0
   },
   {  
      "name":"addListItems",
      "low":2,
      "high":0
   },
   {  
      "name":"editListItems",
      "low":4,
      "high":0
   },
   {  
      "name":"deleteListItems",
      "low":8,
      "high":0
   },
   {  
      "name":"approveItems",
      "low":16,
      "high":0
   },
   {  
      "name":"openItems",
      "low":32,
      "high":0
   },
   {  
      "name":"viewVersions",
      "low":64,
      "high":0
   },
   {  
      "name":"deleteVersions",
      "low":128,
      "high":0
   },
   {  
      "name":"cancelCheckout",
      "low":256,
      "high":0
   },
   {  
      "name":"managePersonalViews",
      "low":512,
      "high":0
   },
   {  
      "name":"manageLists",
      "low":2048,
      "high":0
   },
   {  
      "name":"viewFormPages",
      "low":4096,
      "high":0
   },
   {  
      "name":"anonymousSearchAccessList",
      "low":8192,
      "high":0
   },
   {  
      "name":"open",
      "low":65536,
      "high":0
   },
   {  
      "name":"viewPages",
      "low":131072,
      "high":0
   },
   {  
      "name":"addAndCustomizePages",
      "low":262144,
      "high":0
   },
   {  
      "name":"applyThemeAndBorder",
      "low":524288,
      "high":0
   },
   {  
      "name":"applyStyleSheets",
      "low":1048576,
      "high":0
   },
   {  
      "name":"viewUsageData",
      "low":2097152,
      "high":0
   },
   {  
      "name":"createSSCSite",
      "low":4194304,
      "high":0
   },
   {  
      "name":"manageSubwebs",
      "low":8388608,
      "high":0
   },
   {  
      "name":"createGroups",
      "low":16777216,
      "high":0
   },
   {  
      "name":"managePermissions",
      "low":33554432,
      "high":0
   },
   {  
      "name":"browseDirectories",
      "low":67108864,
      "high":0
   },
   {  
      "name":"browseUserInfo",
      "low":134217728,
      "high":0
   },
   {  
      "name":"addDelPrivateWebParts",
      "low":268435456,
      "high":0
   },
   {  
      "name":"updatePersonalWebParts",
      "low":536870912,
      "high":0
   },
   {  
      "name":"manageWeb",
      "low":1073741824,
      "high":0
   },
   {  
      "name":"anonymousSearchAccessWebLists",
      "low":-2147483648,
      "high":0
   },
   {  
      "name":"useClientIntegration",
      "low":0,
      "high":16
   },
   {  
      "name":"useRemoteAPIs",
      "low":0,
      "high":32
   },
   {  
      "name":"manageAlerts",
      "low":0,
      "high":64
   },
   {  
      "name":"createAlerts",
      "low":0,
      "high":128
   },
   {  
      "name":"editMyUserInfo",
      "low":0,
      "high":256
   },
   {  
      "name":"enumeratePermissions",
      "low":0,
      "high":1073741824
   }
];

	sp.permissions = permissions;
})(SPScript);

module.exports = SPScript.permissions;
},{"./helpers":4,"./spscript":11}],7:[function(require,module,exports){
var SPScript = require;("./spscript");
SPScript.helpers = require("./helpers");

(function(sp) {
	var Profiles = function(dao) {
		this._dao = dao;
		this.baseUrl = "/SP.UserProfiles.PeopleManager";
	};

	var transformPersonProperties = function(profile) {
		profile.UserProfileProperties.results.forEach(function(keyvalue){
			profile[keyvalue.Key] = keyvalue.Value;
		});
		return profile;
	};

	Profiles.prototype.current = function() {
		var url = this.baseUrl + "/GetMyProperties";
		return this._dao.get(url)
					.then(sp.helpers.validateODataV2)
					.then(transformPersonProperties);
	};

	Profiles.prototype.getProfile = function(user) {
		var login = encodeURIComponent(user.LoginName);
		var url = this.baseUrl + "/GetPropertiesFor(accountName=@v)?@v='" + login + "'";
		return this._dao.get(url)
			.then(sp.helpers.validateODataV2)
			.then(transformPersonProperties);
	};

	Profiles.prototype.getByEmail = function(email) {
		var self = this;
		return self._dao.web.getUser(email)
			.then(function(user) {
				return self.getProfile(user);
			});
	};

	sp.Profiles = Profiles;
})(SPScript);

module.exports = SPScript.Profiles;
},{"./helpers":4}],8:[function(require,module,exports){
SPScript = require("./spscript");

(function(sp) {
	sp.queryString = {
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

module.exports = SPScript.queryString;
},{"./spscript":11}],9:[function(require,module,exports){
var SPScript = require("./spscript");
SPScript.BaseDao = require("./baseDao");
SPScript.Search = require("./search");

(function(sp) {
	var RestDao = function(url) {
		var self = this;
		sp.BaseDao.call(this);
		this.webUrl = url;
	};

	RestDao.prototype = new sp.BaseDao();

	RestDao.prototype.executeRequest = function(url, options) {
		var self = this,
			fullUrl = (/^http/i).test(url) ? url : this.webUrl + "/_api" + url,
			executeOptions = {
				url: fullUrl,
				type: "GET",
				headers: {
					"Accept": "application/json; odata=verbose"
				}
			};

		$.extend(executeOptions, options);
		return $.ajax(executeOptions);
	};

	sp.RestDao = RestDao;
})(SPScript);

module.exports = SPScript.RestDao;
},{"./baseDao":1,"./search":10,"./spscript":11}],10:[function(require,module,exports){
SPScript = require("./spscript");
SPScript.RestDao = require("./restDao");
SPScript.queryString = require('./queryString');

(function(sp) {
	var Search = function(urlOrDao) {
		if (typeof urlOrDao === "string") {
			this.dao = new sp.RestDao(urlOrDao);
		} else {
			this.dao = urlOrDao;
		}
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
			optionsQueryString = queryOptions != null ? "&" + sp.queryString.objectToQueryString(queryOptions, true) : "",
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

	Search.prototype.people = function(queryText, queryOptions) {
		var options = queryOptions || {};
		options.sourceid =  'b09a7990-05ea-4af9-81ef-edfab16c4e31';
		return this.query(queryText, options);
	};

	sp.Search = Search;

})(SPScript);

module.exports = SPScript.Search;
},{"./queryString":8,"./restDao":9,"./spscript":11}],11:[function(require,module,exports){
module.exports = {};
},{}],12:[function(require,module,exports){
SPScript = require("./spscript");

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

			if(fullProperty === "_") {
				value = obj;
			}
			
			if ((typeof value === "string") && value.indexOf("/Date(") !== -1) {
				var dateValue = value.UTCJsonToDate();
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
				var modifier = "g";
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

module.exports = SPScript.templating;
},{"./spscript":11}],13:[function(require,module,exports){
var SPScript = require;("./spscript");
SPScript.helpers = require("./helpers");
SPScript.permissions = require("./permissions");

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

	Web.prototype.permissions = function(email) {
		return sp.permissions(baseUrl, this._dao, email);
	};

	Web.prototype.getUser = function(email) {
		var url = baseUrl + "/SiteUsers/GetByEmail('" + email + "')";
		return this._dao.get(url).then(sp.helpers.validateODataV2);
	};

	sp.Web = Web;
})(SPScript);

module.exports = SPScript.Web;
},{"./helpers":4,"./permissions":6}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxnaXR3aXBcXFNQU2NyaXB0XFxub2RlX21vZHVsZXNcXGd1bHAtYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL2Jhc2VEYW8uanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL2Nyb3NzRG9tYWluRGFvLmpzIiwiQzovZ2l0d2lwL1NQU2NyaXB0L3NyYy9lbnRyaWVzL2Zha2VfYTYzNDVmMzkuanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL2hlbHBlcnMuanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL2xpc3QuanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL3Blcm1pc3Npb25zLmpzIiwiQzovZ2l0d2lwL1NQU2NyaXB0L3NyYy9wcm9maWxlcy5qcyIsIkM6L2dpdHdpcC9TUFNjcmlwdC9zcmMvcXVlcnlTdHJpbmcuanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL3Jlc3REYW8uanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL3NlYXJjaC5qcyIsIkM6L2dpdHdpcC9TUFNjcmlwdC9zcmMvc3BzY3JpcHQuanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL3RlbXBsYXRpbmcuanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL3dlYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiU1BTY3JpcHQgPSByZXF1aXJlKFwiLi9zcHNjcmlwdFwiKTtcclxuU1BTY3JpcHQuTGlzdCA9IHJlcXVpcmUoXCIuL2xpc3RcIik7XHJcblNQU2NyaXB0LldlYiA9IHJlcXVpcmUoXCIuL3dlYlwiKTtcclxuU1BTY3JpcHQuUHJvZmlsZXMgPSByZXF1aXJlKFwiLi9wcm9maWxlc1wiKVxyXG5TUFNjcmlwdC5oZWxwZXJzID0gcmVxdWlyZShcIi4vaGVscGVyc1wiKTtcclxuXHJcbihmdW5jdGlvbihzcCkge1xyXG5cdHZhciBCYXNlRGFvID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0c2VsZi53ZWIgPSBuZXcgc3AuV2ViKHNlbGYpO1xyXG5cdFx0c2VsZi5zZWFyY2ggPSBuZXcgc3AuU2VhcmNoKHNlbGYpO1xyXG5cdFx0c2VsZi5wcm9maWxlcyA9IG5ldyBzcC5Qcm9maWxlcyhzZWxmKTtcclxuXHR9O1xyXG5cclxuXHRCYXNlRGFvLnByb3RvdHlwZS5leGVjdXRlUmVxdWVzdCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhyb3cgXCJOb3QgaW1wbGVtZW50ZWQgZXhjZXB0aW9uXCI7XHJcblx0fTtcclxuXHJcblx0QmFzZURhby5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24ocmVsYXRpdmVRdWVyeVVybCwgZXh0ZW5kZWRPcHRpb25zLCByYXcpIHtcclxuXHRcdHZhciBvcHRpb25zID0ge1xyXG5cdFx0XHR0eXBlOiBcIkdFVFwiXHJcblx0XHR9O1xyXG5cclxuXHRcdGlmIChleHRlbmRlZE9wdGlvbnMpIHtcclxuXHRcdFx0JC5leHRlbmQob3B0aW9ucywgZXh0ZW5kZWRPcHRpb25zKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzLmV4ZWN1dGVSZXF1ZXN0KHJlbGF0aXZlUXVlcnlVcmwsIG9wdGlvbnMpO1xyXG5cdH07XHJcblxyXG5cdEJhc2VEYW8ucHJvdG90eXBlLmxpc3RzID0gZnVuY3Rpb24obGlzdG5hbWUpIHtcclxuXHRcdGlmKCFsaXN0bmFtZSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5nZXQoXCIvd2ViL2xpc3RzXCIpLnRoZW4oc3AuaGVscGVycy52YWxpZGF0ZU9EYXRhVjIpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ldyBzcC5MaXN0KGxpc3RuYW1lLCB0aGlzKTtcclxuXHR9O1xyXG5cclxuXHRCYXNlRGFvLnByb3RvdHlwZS5wb3N0ID0gZnVuY3Rpb24ocmVsYXRpdmVQb3N0VXJsLCBib2R5LCBleHRlbmRlZE9wdGlvbnMpIHtcclxuXHRcdHZhciBzdHJCb2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XHJcblx0XHR2YXIgb3B0aW9ucyA9IHtcclxuXHRcdFx0dHlwZTogXCJQT1NUXCIsXHJcblx0XHRcdGRhdGE6IHN0ckJvZHksXHJcblx0XHRcdGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb247b2RhdGE9dmVyYm9zZVwiXHJcblx0XHR9O1xyXG5cdFx0JC5leHRlbmQob3B0aW9ucywgZXh0ZW5kZWRPcHRpb25zKTtcclxuXHRcdHJldHVybiB0aGlzLmV4ZWN1dGVSZXF1ZXN0KHJlbGF0aXZlUG9zdFVybCwgb3B0aW9ucyk7XHJcblx0fTtcclxuXHJcblx0QmFzZURhby5wcm90b3R5cGUudXBsb2FkRmlsZSA9IGZ1bmN0aW9uKGZvbGRlclVybCwgbmFtZSwgYmFzZTY0QmluYXJ5KSB7XHJcblx0XHR2YXIgdXBsb2FkVXJsID0gXCIvd2ViL0dldEZvbGRlckJ5U2VydmVyUmVsYXRpdmVVcmwoJ1wiICsgZm9sZGVyVXJsICsgXCInKS9GaWxlcy9BZGQodXJsPSdcIiArIG5hbWUgKyBcIicsb3ZlcndyaXRlPXRydWUpXCIsXHJcblx0XHRcdG9wdGlvbnMgPSB7XHJcblx0XHRcdFx0YmluYXJ5U3RyaW5nUmVxdWVzdEJvZHk6IHRydWUsXHJcblx0XHRcdFx0c3RhdGU6IFwiVXBkYXRlXCJcclxuXHRcdFx0fTtcclxuXHRcdHJldHVybiB0aGlzLnBvc3QodXBsb2FkVXJsLCBiYXNlNjRCaW5hcnksIG9wdGlvbnMpO1xyXG5cdH07XHJcblxyXG5cdHNwLkJhc2VEYW8gPSBCYXNlRGFvO1xyXG59KShTUFNjcmlwdCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNQU2NyaXB0LkJhc2VEYW87IiwiU1BTY3JpcHQgPSByZXF1aXJlKFwiLi9zcHNjcmlwdFwiKTtcclxuU1BTY3JpcHQuaGVscGVycyA9IHJlcXVpcmUoXCIuL2hlbHBlcnNcIik7XHJcblNQU2NyaXB0LkJhc2VEYW8gPSByZXF1aXJlKFwiLi9iYXNlRGFvXCIpO1xyXG5cclxuKGZ1bmN0aW9uKHNwKSB7XHJcblx0dmFyIENyb3NzRG9tYWluRGFvID0gZnVuY3Rpb24oYXBwV2ViVXJsLCBob3N0VXJsKSB7XHJcblx0XHR0aGlzLmFwcFVybCA9IGFwcFdlYlVybDtcclxuXHRcdHRoaXMuaG9zdFVybCA9IGhvc3RVcmw7XHJcblx0XHR0aGlzLnNjcmlwdFJlYWR5ID0gbmV3ICQuRGVmZXJyZWQoKTtcclxuXHJcblx0XHQvL0xvYWQgb2YgdXAgdG8gUmVxdWVzdEV4ZWN1dG9yIGphdmFzY3JpcHQgZnJvbSB0aGUgaG9zdCBzaXRlIGlmIGl0cyBub3QgdGhlcmUuXHJcblx0XHRpZiAoIVNQIHx8ICFTUC5SZXF1ZXN0RXhlY3V0b3IpIHtcclxuXHRcdFx0dGhpcy5zY3JpcHRSZWFkeSA9ICQuZ2V0U2NyaXB0KGhvc3RVcmwgKyBcIi9fbGF5b3V0cy8xNS9TUC5SZXF1ZXN0RXhlY3V0b3IuanNcIik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMuc2NyaXB0UmVhZHkucmVzb2x2ZSgpO1x0XHJcblx0XHRcdH0sIDEpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdENyb3NzRG9tYWluRGFvLnByb3RvdHlwZSA9IG5ldyBTUFNjcmlwdC5CYXNlRGFvKCk7XHJcblxyXG5cdENyb3NzRG9tYWluRGFvLnByb3RvdHlwZS5leGVjdXRlUmVxdWVzdCA9IGZ1bmN0aW9uKGhvc3RSZWxhdGl2ZVVybCwgb3B0aW9ucykge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRkZWZlcnJlZCA9IG5ldyAkLkRlZmVycmVkKCksXHJcblxyXG5cdFx0XHQvL0lmIGEgY2FsbGJhY2sgd2FzIGdpdmVuIGV4ZWN1dGUgaXQsIHBhc3NpbmcgcmVzcG9uc2UgdGhlbiB0aGUgZGVmZXJyZWRcclxuXHRcdFx0Ly9vdGhlcndpc2UganVzdCByZXNvbHZlIHRoZSBkZWZlcnJlZC5cclxuXHRcdFx0c3VjY2Vzc0NhbGxiYWNrID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHR2YXIgZGF0YSA9ICQucGFyc2VKU09OKHJlc3BvbnNlLmJvZHkpO1xyXG5cdFx0XHRcdC8vYSBzdWNlZXNzIGNhbGxiYWNrIHdhcyBwYXNzZWQgaW5cclxuXHRcdFx0XHRpZiAob3B0aW9ucy5zdWNjZXNzKSB7XHJcblx0XHRcdFx0XHRvcHRpb25zLnN1Y2Nlc3MoZGF0YSwgZGVmZXJyZWQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvL25vIHN1Y2Nlc3MgY2FsbGJhY2sgc28ganVzdCBtYWtlIHN1cmUgaXRzIHZhbGlkIE9EYXRhXHJcblx0XHRcdFx0XHRzcC5oZWxwZXJzLnZhbGlkYXRlT0RhdGFWMihkYXRhLCBkZWZlcnJlZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRlcnJvckNhbGxiYWNrID0gZnVuY3Rpb24oZGF0YSwgZXJyb3JDb2RlLCBlcnJvck1lc3NhZ2UpIHtcclxuXHRcdFx0XHQvL2FuIGVycm9yIGNhbGxiYWNrIHdhcyBwYXNzZWQgaW5cclxuXHRcdFx0XHRpZiAob3B0aW9ucy5lcnJvcikge1xyXG5cdFx0XHRcdFx0b3B0aW9ucy5lcnJvcihkYXRhLCBlcnJvckNvZGUsIGVycm9yTWVzc2FnZSwgZGVmZXJyZWQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvL25vIGVycm9yIGNhbGxiYWNrIHNvIGp1c3QgcmVqZWN0IGl0XHJcblx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyb3JNZXNzYWdlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0dGhpcy5zY3JpcHRSZWFkeS5kb25lKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQvL3RhY2sgb24gdGhlIHF1ZXJ5IHN0cmluZyBxdWVzdGlvbiBtYXJrIGlmIG5vdCB0aGVyZSBhbHJlYWR5XHJcblx0XHRcdGlmIChob3N0UmVsYXRpdmVVcmwuaW5kZXhPZihcIj9cIikgPT09IC0xKSB7XHJcblx0XHRcdFx0aG9zdFJlbGF0aXZlVXJsID0gaG9zdFJlbGF0aXZlVXJsICsgXCI/XCI7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBleGVjdXRvciA9IG5ldyBTUC5SZXF1ZXN0RXhlY3V0b3Ioc2VsZi5hcHBVcmwpLFxyXG5cdFx0XHRcdGZ1bGxVcmwgPSBzZWxmLmFwcFVybCArIFwiL19hcGkvU1AuQXBwQ29udGV4dFNpdGUoQHRhcmdldClcIiArIGhvc3RSZWxhdGl2ZVVybCArIFwiQHRhcmdldD0nXCIgKyBzZWxmLmhvc3RVcmwgKyBcIidcIjtcclxuXHJcblx0XHRcdHZhciBleGVjdXRlT3B0aW9ucyA9IHtcclxuXHRcdFx0XHR1cmw6IGZ1bGxVcmwsXHJcblx0XHRcdFx0dHlwZTogXCJHRVRcIixcclxuXHRcdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0XHRcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb247IG9kYXRhPXZlcmJvc2VcIlxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0c3VjY2Vzczogc3VjY2Vzc0NhbGxiYWNrLFxyXG5cdFx0XHRcdGVycm9yOiBlcnJvckNhbGxiYWNrXHJcblx0XHRcdH07XHJcblx0XHRcdC8vTWVyZ2UgcGFzc2VkIGluIG9wdGlvbnNcclxuXHRcdFx0JC5leHRlbmQodHJ1ZSwgZXhlY3V0ZU9wdGlvbnMsIG9wdGlvbnMpO1xyXG5cdFx0XHRleGVjdXRvci5leGVjdXRlQXN5bmMoZXhlY3V0ZU9wdGlvbnMpO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xyXG5cdH07XHJcblxyXG5cdHNwLkNyb3NzRG9tYWluRGFvID0gQ3Jvc3NEb21haW5EYW87XHJcbn0pKFNQU2NyaXB0KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU1BTY3JpcHQuQ3Jvc3NEb21haW5EYW87IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuZ2xvYmFsLlNQU2NyaXB0ID0ge307XHJcbmdsb2JhbC5TUFNjcmlwdC5SZXN0RGFvID0gcmVxdWlyZShcIi4uL3Jlc3REYW9cIik7XHJcbmdsb2JhbC5TUFNjcmlwdC5Dcm9zc0RvbWFpbkRhbyA9IHJlcXVpcmUoXCIuLi9jcm9zc0RvbWFpbkRhb1wiKTtcclxuZ2xvYmFsLlNQU2NyaXB0LnF1ZXJ5U3RyaW5nID0gcmVxdWlyZShcIi4uL3F1ZXJ5U3RyaW5nXCIpO1xyXG5nbG9iYWwuU1BTY3JpcHQuU2VhcmNoID0gcmVxdWlyZShcIi4uL3NlYXJjaFwiKTtcclxuZ2xvYmFsLlNQU2NyaXB0LnRlbXBsYXRpbmcgPSByZXF1aXJlKFwiLi4vdGVtcGxhdGluZ1wiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBnbG9iYWwuU1BTY3JpcHQ7XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsInZhciBTUFNjcmlwdCA9IHJlcXVpcmUoXCIuL3Nwc2NyaXB0LmpzXCIpO1xyXG5cclxuKGZ1bmN0aW9uKHNwKSB7XHJcblx0dmFyIGhlbHBlcnMgPSB7fTtcclxuXHRoZWxwZXJzLnZhbGlkYXRlT0RhdGFWMiA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdHZhciByZXN1bHRzID0gZGF0YTtcclxuXHRcdGlmIChkYXRhLmQgJiYgZGF0YS5kLnJlc3VsdHMgJiYgZGF0YS5kLnJlc3VsdHMubGVuZ3RoICE9IG51bGwpIHtcclxuXHRcdFx0cmVzdWx0cyA9IGRhdGEuZC5yZXN1bHRzO1xyXG5cdFx0fSBlbHNlIGlmIChkYXRhLmQpIHtcclxuXHRcdFx0cmVzdWx0cyA9IGRhdGEuZDtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHRzO1xyXG5cdH07XHJcblxyXG5cdGhlbHBlcnMudmFsaWRhdGVDcm9zc0RvbWFpbk9EYXRhVjIgPSBmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0dmFyIGRhdGEgPSAkLnBhcnNlSlNPTihyZXNwb25zZS5ib2R5KTtcclxuXHRcdGhlbHBlcnMudmFsaWRhdGVPRGF0YVYyKGRhdGEpO1xyXG5cdH07XHJcblxyXG5cdC8vJ0JvcnJvd2VkJyBmcm9tIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL09wZXJhdG9ycy9CaXR3aXNlX09wZXJhdG9yc1xyXG5cdGhlbHBlcnMuYXJyYXlGcm9tQml0TWFzayA9IGZ1bmN0aW9uIChuTWFzaykge1xyXG5cdFx0Ly8gbk1hc2sgbXVzdCBiZSBiZXR3ZWVuIC0yMTQ3NDgzNjQ4IGFuZCAyMTQ3NDgzNjQ3XHJcblx0XHRpZiAodHlwZW9mIG5NYXNrID09PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdG5NYXNrID0gcGFyc2VJbnQobk1hc2spO1xyXG5cdFx0fVxyXG5cdFx0Ly8gaWYgKG5NYXNrID4gMHg3ZmZmZmZmZiB8fCBuTWFzayA8IC0weDgwMDAwMDAwKSB7IFxyXG5cdFx0Ly8gXHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXJyYXlGcm9tTWFzayAtIG91dCBvZiByYW5nZVwiKTsgXHJcblx0XHQvLyB9XHJcblx0XHRmb3IgKHZhciBuU2hpZnRlZCA9IG5NYXNrLCBhRnJvbU1hc2sgPSBbXTsgblNoaWZ0ZWQ7IGFGcm9tTWFzay5wdXNoKEJvb2xlYW4oblNoaWZ0ZWQgJiAxKSksIG5TaGlmdGVkID4+Pj0gMSk7XHJcblx0XHRyZXR1cm4gYUZyb21NYXNrO1xyXG5cdH07XHJcblxyXG5cdHNwLmhlbHBlcnMgPSBoZWxwZXJzO1xyXG59KShTUFNjcmlwdCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNQU2NyaXB0LmhlbHBlcnM7IiwidmFyIFNQU2NyaXB0ID0gcmVxdWlyZShcIi4vc3BzY3JpcHRcIik7XHJcblNQU2NyaXB0LmhlbHBlcnMgPSByZXF1aXJlKFwiLi9oZWxwZXJzXCIpO1xyXG5TUFNjcmlwdC5wZXJtaXNzaW9ucyA9IHJlcXVpcmUoXCIuL3Blcm1pc3Npb25zXCIpO1xyXG5cclxuKGZ1bmN0aW9uKHNwKSB7XHJcblx0dmFyIGJhc2VVcmwgPSBudWxsO1xyXG5cdHZhciBMaXN0ID0gZnVuY3Rpb24obGlzdG5hbWUsIGRhbykge1xyXG5cdFx0dGhpcy5saXN0bmFtZSA9IGxpc3RuYW1lO1xyXG5cdFx0YmFzZVVybCA9IFwiL3dlYi9saXN0cy9nZXRieXRpdGxlKCdcIiArIGxpc3RuYW1lICsgXCInKVwiO1xyXG5cdFx0dGhpcy5fZGFvID0gZGFvO1xyXG5cdH07XHJcblxyXG5cdExpc3QucHJvdG90eXBlLmdldEl0ZW1zID0gZnVuY3Rpb24ob2RhdGFRdWVyeSkge1xyXG5cdFx0dmFyIHF1ZXJ5ID0gKG9kYXRhUXVlcnkgIT0gbnVsbCkgPyBcIj9cIiArIG9kYXRhUXVlcnkgOiBcIlwiO1xyXG5cdFx0cmV0dXJuIHRoaXMuX2Rhb1xyXG5cdFx0XHQuZ2V0KGJhc2VVcmwgKyBcIi9pdGVtc1wiICsgcXVlcnkpXHJcblx0XHRcdC50aGVuKHNwLmhlbHBlcnMudmFsaWRhdGVPRGF0YVYyKTtcclxuXHR9O1xyXG5cclxuXHRMaXN0LnByb3RvdHlwZS5nZXRJdGVtQnlJZCA9IGZ1bmN0aW9uKGlkLCBvZGF0YSkge1xyXG5cdFx0dmFyIHVybCA9IGJhc2VVcmwgKyBcIi9pdGVtcyhcIiArIGlkICsgXCIpXCI7XHJcblx0XHR1cmwgKz0gKG9kYXRhICE9IG51bGwpID8gXCI/XCIgKyBvZGF0YSA6IFwiXCI7XHJcblx0XHRyZXR1cm4gdGhpcy5fZGFvLmdldCh1cmwpLnRoZW4oc3AuaGVscGVycy52YWxpZGF0ZU9EYXRhVjIpO1xyXG5cdH07XHJcblxyXG5cdExpc3QucHJvdG90eXBlLmluZm8gPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLl9kYW8uZ2V0KGJhc2VVcmwpLnRoZW4oc3AuaGVscGVycy52YWxpZGF0ZU9EYXRhVjIpO1xyXG5cdH07XHJcblxyXG5cdExpc3QucHJvdG90eXBlLmFkZEl0ZW0gPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRyZXR1cm4gc2VsZi5fZGFvLmdldChiYXNlVXJsKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0aXRlbSA9ICQuZXh0ZW5kKHtcclxuXHRcdFx0XHRcIl9fbWV0YWRhdGFcIjoge1xyXG5cdFx0XHRcdFx0XCJ0eXBlXCI6IGRhdGEuZC5MaXN0SXRlbUVudGl0eVR5cGVGdWxsTmFtZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgaXRlbSk7XHJcblxyXG5cdFx0XHR2YXIgY3VzdG9tT3B0aW9ucyA9IHtcclxuXHRcdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0XHRcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb247b2RhdGE9dmVyYm9zZVwiLFxyXG5cdFx0XHRcdFx0XCJYLVJlcXVlc3REaWdlc3RcIjogJChcIiNfX1JFUVVFU1RESUdFU1RcIikudmFsKCksXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0cmV0dXJuIHNlbGYuX2Rhby5wb3N0KGJhc2VVcmwgKyBcIi9pdGVtc1wiLCBpdGVtLCBjdXN0b21PcHRpb25zKVxyXG5cdFx0XHRcdC50aGVuKHNwLmhlbHBlcnMudmFsaWRhdGVPRGF0YVYyKTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdExpc3QucHJvdG90eXBlLnVwZGF0ZUl0ZW0gPSBmdW5jdGlvbihpdGVtSWQsIHVwZGF0ZXMpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHJldHVybiBzZWxmLmdldEl0ZW1CeUlkKGl0ZW1JZCkudGhlbihmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdHVwZGF0ZXMgPSAkLmV4dGVuZCh7XHJcblx0XHRcdFx0XCJfX21ldGFkYXRhXCI6IHtcclxuXHRcdFx0XHRcdFwidHlwZVwiOiBpdGVtLl9fbWV0YWRhdGEudHlwZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgdXBkYXRlcyk7XHJcblxyXG5cdFx0XHR2YXIgY3VzdG9tT3B0aW9ucyA9IHtcclxuXHRcdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0XHRcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb247b2RhdGE9dmVyYm9zZVwiLFxyXG5cdFx0XHRcdFx0XCJYLVJlcXVlc3REaWdlc3RcIjogJChcIiNfX1JFUVVFU1RESUdFU1RcIikudmFsKCksXHJcblx0XHRcdFx0XHRcIlgtSFRUUC1NZXRob2RcIjogXCJNRVJHRVwiLFxyXG5cdFx0XHRcdFx0XCJJZi1NYXRjaFwiOiBpdGVtLl9fbWV0YWRhdGEuZXRhZ1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHJldHVybiBzZWxmLl9kYW8ucG9zdChpdGVtLl9fbWV0YWRhdGEudXJpLCB1cGRhdGVzLCBjdXN0b21PcHRpb25zKTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblx0XHJcblx0TGlzdC5wcm90b3R5cGUuZGVsZXRlSXRlbSA9IGZ1bmN0aW9uKGl0ZW1JZCkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0cmV0dXJuIHNlbGYuZ2V0SXRlbUJ5SWQoaXRlbUlkKS50aGVuKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0dmFyIGN1c3RvbU9wdGlvbnMgPSB7XHJcblx0XHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdFx0XCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uO29kYXRhPXZlcmJvc2VcIixcclxuXHRcdFx0XHRcdFwiWC1SZXF1ZXN0RGlnZXN0XCI6ICQoXCIjX19SRVFVRVNURElHRVNUXCIpLnZhbCgpLFxyXG5cdFx0XHRcdFx0XCJYLUhUVFAtTWV0aG9kXCI6IFwiREVMRVRFXCIsXHJcblx0XHRcdFx0XHRcIklmLU1hdGNoXCI6IGl0ZW0uX19tZXRhZGF0YS5ldGFnXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRyZXR1cm4gc2VsZi5fZGFvLnBvc3QoaXRlbS5fX21ldGFkYXRhLnVyaSwgXCJcIiwgY3VzdG9tT3B0aW9ucyk7XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHRMaXN0LnByb3RvdHlwZS5maW5kSXRlbXMgPSBmdW5jdGlvbihrZXksIHZhbHVlLCBleHRyYU9EYXRhKSB7XHJcblx0XHQvL2lmIGl0cyBhIHN0cmluZywgd3JhcCBpbiBzaW5nbGUgcXVvdGVzXHJcblx0XHR2YXIgZmlsdGVyVmFsdWUgPSB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgPyBcIidcIiArIHZhbHVlICsgXCInXCIgOiB2YWx1ZTtcclxuXHRcdHZhciBvZGF0YSA9IFwiJGZpbHRlcj1cIiArIGtleSArIFwiIGVxIFwiICsgZmlsdGVyVmFsdWU7XHJcblx0XHRvZGF0YSArPSAoZXh0cmFPRGF0YSAhPSBudWxsKSA/IFwiJlwiICsgZXh0cmFPRGF0YSA6IFwiXCI7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0SXRlbXMob2RhdGEpO1xyXG5cdH07XHJcblxyXG5cdExpc3QucHJvdG90eXBlLmZpbmRJdGVtID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSwgb2RhdGEpIHtcclxuXHRcdHJldHVybiB0aGlzLmZpbmRJdGVtcyhrZXksIHZhbHVlLCBvZGF0YSkudGhlbihmdW5jdGlvbihpdGVtcykge1xyXG5cdFx0XHRpZiAoaXRlbXMgJiYgaXRlbXMubGVuZ3RoICYmIGl0ZW1zLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gaXRlbXNbMF07XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHRMaXN0LnByb3RvdHlwZS5wZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKGVtYWlsKSB7XHJcblx0XHRyZXR1cm4gc3AucGVybWlzc2lvbnMoYmFzZVVybCwgdGhpcy5fZGFvLCBlbWFpbCk7XHJcblx0fTtcclxuXHJcblx0c3AuTGlzdCA9IExpc3Q7XHJcbn0pKFNQU2NyaXB0KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU1BTY3JpcHQuTGlzdDsiLCJ2YXIgU1BTY3JpcHQgPSByZXF1aXJlKFwiLi9zcHNjcmlwdFwiKTtcclxuU1BTY3JpcHQuaGVscGVycyA9IHJlcXVpcmUoXCIuL2hlbHBlcnNcIik7XHJcblxyXG4oZnVuY3Rpb24oc3ApIHtcclxuXHR2YXIgdHJhbnNmb3JtcyA9IHtcclxuXHRcdHJvbGVBc3NpZ25tZW50OiBmdW5jdGlvbihyYXcpIHtcclxuXHRcdFx0dmFyIHByaXYgPSB7XHJcblx0XHRcdFx0bWVtYmVyOiB7XHJcblx0XHRcdFx0XHRsb2dpbjogcmF3Lk1lbWJlci5Mb2dpbk5hbWUsXHJcblx0XHRcdFx0XHRuYW1lOiByYXcuTWVtYmVyLlRpdGxlLFxyXG5cdFx0XHRcdFx0aWQ6IHJhdy5NZW1iZXIuSWRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdHByaXYucm9sZXMgPSByYXcuUm9sZURlZmluaXRpb25CaW5kaW5ncy5yZXN1bHRzLm1hcChmdW5jdGlvbihyb2xlRGVmKXtcclxuXHRcdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdFx0bmFtZTogcm9sZURlZi5OYW1lLFxyXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246IHJvbGVEZWYuRGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRiYXNlUGVybWlzc2lvbnM6IHBlcm1pc3Npb25NYXNrVG9TdHJpbmdzKHJvbGVEZWYuQmFzZVBlcm1pc3Npb25zLkxvdywgcm9sZURlZi5CYXNlUGVybWlzc2lvbnMuSGlnaClcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIHByaXY7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0dmFyIHBlcm1pc3Npb25NYXNrVG9TdHJpbmdzID0gZnVuY3Rpb24obG93TWFzaywgaGlnaE1hc2spIHtcclxuXHRcdHZhciBiYXNlUGVybWlzc2lvbnMgPSBbXTtcclxuXHRcdHNwQmFzZVBlcm1pc3Npb25zLmZvckVhY2goZnVuY3Rpb24oYmFzZVBlcm1pc3Npb24pe1xyXG5cdFx0XHRpZiAoKGJhc2VQZXJtaXNzaW9uLmxvdyAmIGxvd01hc2spID4gMCB8fCAoYmFzZVBlcm1pc3Npb24uaGlnaCAmIGhpZ2hNYXNrKSA+IDApIHtcclxuXHRcdFx0XHRiYXNlUGVybWlzc2lvbnMucHVzaChiYXNlUGVybWlzc2lvbi5uYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gYmFzZVBlcm1pc3Npb25zO1xyXG5cdH07XHJcblxyXG5cdHZhciBwZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKGJhc2VVcmwsIGRhbywgZW1haWwpIHtcclxuXHRcdGlmKCFlbWFpbCkge1xyXG5cdFx0XHR2YXIgdXJsID0gYmFzZVVybCArIFwiL1JvbGVBc3NpZ25tZW50cz8kZXhwYW5kPU1lbWJlcixSb2xlRGVmaW5pdGlvbkJpbmRpbmdzXCI7XHJcblx0XHRcdHJldHVybiBkYW8uZ2V0KHVybClcclxuXHRcdFx0XHQudGhlbihzcC5oZWxwZXJzLnZhbGlkYXRlT0RhdGFWMilcclxuXHRcdFx0XHQudGhlbihmdW5jdGlvbihyZXN1bHRzKXtcclxuXHRcdFx0XHRcdHJldHVybiByZXN1bHRzLm1hcCh0cmFuc2Zvcm1zLnJvbGVBc3NpZ25tZW50KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdC8vQW4gZW1haWwgd2FzIHBhc3NlZCBzbyBjaGVjayBwcml2cyBvbiB0aGF0IHNwZWNpZmljIHVzZXJcclxuXHRcdHZhciBjaGVja1ByaXZzID0gZnVuY3Rpb24odXNlcikge1xyXG5cdFx0XHR2YXIgbG9naW4gPSBlbmNvZGVVUklDb21wb25lbnQodXNlci5Mb2dpbk5hbWUpO1xyXG5cdFx0XHR2YXIgdXJsID0gYmFzZVVybCArIFwiL2dldHVzZXJlZmZlY3RpdmVwZXJtaXNzaW9ucyhAdik/QHY9J1wiICsgbG9naW4gKyBcIidcIjtcclxuXHRcdFx0cmV0dXJuIGRhby5nZXQodXJsKS50aGVuKHNwLmhlbHBlcnMudmFsaWRhdGVPRGF0YVYyKTtcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gZGFvLndlYi5nZXRVc2VyKGVtYWlsKVxyXG5cdFx0XHQudGhlbihjaGVja1ByaXZzKVxyXG5cdFx0XHQudGhlbihmdW5jdGlvbihwcml2cykge1xyXG5cdFx0XHRcdHJldHVybiBwZXJtaXNzaW9uTWFza1RvU3RyaW5ncyhwcml2cy5HZXRVc2VyRWZmZWN0aXZlUGVybWlzc2lvbnMuTG93LCBwcml2cy5HZXRVc2VyRWZmZWN0aXZlUGVybWlzc2lvbnMuSGlnaCk7XHJcblx0XHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdC8vIFNjcmFwZWQgaXQgZnJvbSBTUC5QZXJtaXNzaW9uS2luZFxyXG5cdC8vIHZhciBiYXNlUGVybWlzc2lvbnMgPSBbXTtcclxuXHQvLyBPYmplY3Qua2V5cyhTUC5QZXJtaXNzaW9uS2luZCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHsgXHJcblx0Ly8gXHR2YXIgcGVybSA9IG5ldyBTUC5CYXNlUGVybWlzc2lvbnMoKTtcclxuXHQvLyAgICAgcGVybS5zZXQoU1AuUGVybWlzc2lvbktpbmRba2V5XSk7XHJcblx0Ly8gICAgIHZhciBwZXJtaXNpc29uID0ge1xyXG5cdC8vICAgICBcdG5hbWU6IGtleSxcclxuXHQvLyAgICAgXHRsb3c6IHBlcm0uJEFfMSxcclxuXHQvLyAgICAgXHRoaWdoOiBwZXJtLiQ5XzFcclxuXHQvLyAgICAgfTtcclxuXHQvLyAgICAgYmFzZVBlcm1pc3Npb25zLnB1c2gocGVybWlzaXNvbik7XHJcblx0Ly8gfSk7XHJcblx0dmFyIHNwQmFzZVBlcm1pc3Npb25zID0gWyAgXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImVtcHR5TWFza1wiLFxyXG4gICAgICBcImxvd1wiOjAsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwidmlld0xpc3RJdGVtc1wiLFxyXG4gICAgICBcImxvd1wiOjEsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiYWRkTGlzdEl0ZW1zXCIsXHJcbiAgICAgIFwibG93XCI6MixcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJlZGl0TGlzdEl0ZW1zXCIsXHJcbiAgICAgIFwibG93XCI6NCxcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJkZWxldGVMaXN0SXRlbXNcIixcclxuICAgICAgXCJsb3dcIjo4LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImFwcHJvdmVJdGVtc1wiLFxyXG4gICAgICBcImxvd1wiOjE2LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcIm9wZW5JdGVtc1wiLFxyXG4gICAgICBcImxvd1wiOjMyLFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcInZpZXdWZXJzaW9uc1wiLFxyXG4gICAgICBcImxvd1wiOjY0LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImRlbGV0ZVZlcnNpb25zXCIsXHJcbiAgICAgIFwibG93XCI6MTI4LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImNhbmNlbENoZWNrb3V0XCIsXHJcbiAgICAgIFwibG93XCI6MjU2LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcIm1hbmFnZVBlcnNvbmFsVmlld3NcIixcclxuICAgICAgXCJsb3dcIjo1MTIsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwibWFuYWdlTGlzdHNcIixcclxuICAgICAgXCJsb3dcIjoyMDQ4LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcInZpZXdGb3JtUGFnZXNcIixcclxuICAgICAgXCJsb3dcIjo0MDk2LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImFub255bW91c1NlYXJjaEFjY2Vzc0xpc3RcIixcclxuICAgICAgXCJsb3dcIjo4MTkyLFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcIm9wZW5cIixcclxuICAgICAgXCJsb3dcIjo2NTUzNixcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJ2aWV3UGFnZXNcIixcclxuICAgICAgXCJsb3dcIjoxMzEwNzIsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiYWRkQW5kQ3VzdG9taXplUGFnZXNcIixcclxuICAgICAgXCJsb3dcIjoyNjIxNDQsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiYXBwbHlUaGVtZUFuZEJvcmRlclwiLFxyXG4gICAgICBcImxvd1wiOjUyNDI4OCxcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJhcHBseVN0eWxlU2hlZXRzXCIsXHJcbiAgICAgIFwibG93XCI6MTA0ODU3NixcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJ2aWV3VXNhZ2VEYXRhXCIsXHJcbiAgICAgIFwibG93XCI6MjA5NzE1MixcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJjcmVhdGVTU0NTaXRlXCIsXHJcbiAgICAgIFwibG93XCI6NDE5NDMwNCxcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJtYW5hZ2VTdWJ3ZWJzXCIsXHJcbiAgICAgIFwibG93XCI6ODM4ODYwOCxcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJjcmVhdGVHcm91cHNcIixcclxuICAgICAgXCJsb3dcIjoxNjc3NzIxNixcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJtYW5hZ2VQZXJtaXNzaW9uc1wiLFxyXG4gICAgICBcImxvd1wiOjMzNTU0NDMyLFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImJyb3dzZURpcmVjdG9yaWVzXCIsXHJcbiAgICAgIFwibG93XCI6NjcxMDg4NjQsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiYnJvd3NlVXNlckluZm9cIixcclxuICAgICAgXCJsb3dcIjoxMzQyMTc3MjgsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiYWRkRGVsUHJpdmF0ZVdlYlBhcnRzXCIsXHJcbiAgICAgIFwibG93XCI6MjY4NDM1NDU2LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcInVwZGF0ZVBlcnNvbmFsV2ViUGFydHNcIixcclxuICAgICAgXCJsb3dcIjo1MzY4NzA5MTIsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwibWFuYWdlV2ViXCIsXHJcbiAgICAgIFwibG93XCI6MTA3Mzc0MTgyNCxcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJhbm9ueW1vdXNTZWFyY2hBY2Nlc3NXZWJMaXN0c1wiLFxyXG4gICAgICBcImxvd1wiOi0yMTQ3NDgzNjQ4LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcInVzZUNsaWVudEludGVncmF0aW9uXCIsXHJcbiAgICAgIFwibG93XCI6MCxcclxuICAgICAgXCJoaWdoXCI6MTZcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwidXNlUmVtb3RlQVBJc1wiLFxyXG4gICAgICBcImxvd1wiOjAsXHJcbiAgICAgIFwiaGlnaFwiOjMyXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcIm1hbmFnZUFsZXJ0c1wiLFxyXG4gICAgICBcImxvd1wiOjAsXHJcbiAgICAgIFwiaGlnaFwiOjY0XHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImNyZWF0ZUFsZXJ0c1wiLFxyXG4gICAgICBcImxvd1wiOjAsXHJcbiAgICAgIFwiaGlnaFwiOjEyOFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJlZGl0TXlVc2VySW5mb1wiLFxyXG4gICAgICBcImxvd1wiOjAsXHJcbiAgICAgIFwiaGlnaFwiOjI1NlxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJlbnVtZXJhdGVQZXJtaXNzaW9uc1wiLFxyXG4gICAgICBcImxvd1wiOjAsXHJcbiAgICAgIFwiaGlnaFwiOjEwNzM3NDE4MjRcclxuICAgfVxyXG5dO1xyXG5cclxuXHRzcC5wZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zO1xyXG59KShTUFNjcmlwdCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNQU2NyaXB0LnBlcm1pc3Npb25zOyIsInZhciBTUFNjcmlwdCA9IHJlcXVpcmU7KFwiLi9zcHNjcmlwdFwiKTtcclxuU1BTY3JpcHQuaGVscGVycyA9IHJlcXVpcmUoXCIuL2hlbHBlcnNcIik7XHJcblxyXG4oZnVuY3Rpb24oc3ApIHtcclxuXHR2YXIgUHJvZmlsZXMgPSBmdW5jdGlvbihkYW8pIHtcclxuXHRcdHRoaXMuX2RhbyA9IGRhbztcclxuXHRcdHRoaXMuYmFzZVVybCA9IFwiL1NQLlVzZXJQcm9maWxlcy5QZW9wbGVNYW5hZ2VyXCI7XHJcblx0fTtcclxuXHJcblx0dmFyIHRyYW5zZm9ybVBlcnNvblByb3BlcnRpZXMgPSBmdW5jdGlvbihwcm9maWxlKSB7XHJcblx0XHRwcm9maWxlLlVzZXJQcm9maWxlUHJvcGVydGllcy5yZXN1bHRzLmZvckVhY2goZnVuY3Rpb24oa2V5dmFsdWUpe1xyXG5cdFx0XHRwcm9maWxlW2tleXZhbHVlLktleV0gPSBrZXl2YWx1ZS5WYWx1ZTtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIHByb2ZpbGU7XHJcblx0fTtcclxuXHJcblx0UHJvZmlsZXMucHJvdG90eXBlLmN1cnJlbnQgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB1cmwgPSB0aGlzLmJhc2VVcmwgKyBcIi9HZXRNeVByb3BlcnRpZXNcIjtcclxuXHRcdHJldHVybiB0aGlzLl9kYW8uZ2V0KHVybClcclxuXHRcdFx0XHRcdC50aGVuKHNwLmhlbHBlcnMudmFsaWRhdGVPRGF0YVYyKVxyXG5cdFx0XHRcdFx0LnRoZW4odHJhbnNmb3JtUGVyc29uUHJvcGVydGllcyk7XHJcblx0fTtcclxuXHJcblx0UHJvZmlsZXMucHJvdG90eXBlLmdldFByb2ZpbGUgPSBmdW5jdGlvbih1c2VyKSB7XHJcblx0XHR2YXIgbG9naW4gPSBlbmNvZGVVUklDb21wb25lbnQodXNlci5Mb2dpbk5hbWUpO1xyXG5cdFx0dmFyIHVybCA9IHRoaXMuYmFzZVVybCArIFwiL0dldFByb3BlcnRpZXNGb3IoYWNjb3VudE5hbWU9QHYpP0B2PSdcIiArIGxvZ2luICsgXCInXCI7XHJcblx0XHRyZXR1cm4gdGhpcy5fZGFvLmdldCh1cmwpXHJcblx0XHRcdC50aGVuKHNwLmhlbHBlcnMudmFsaWRhdGVPRGF0YVYyKVxyXG5cdFx0XHQudGhlbih0cmFuc2Zvcm1QZXJzb25Qcm9wZXJ0aWVzKTtcclxuXHR9O1xyXG5cclxuXHRQcm9maWxlcy5wcm90b3R5cGUuZ2V0QnlFbWFpbCA9IGZ1bmN0aW9uKGVtYWlsKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRyZXR1cm4gc2VsZi5fZGFvLndlYi5nZXRVc2VyKGVtYWlsKVxyXG5cdFx0XHQudGhlbihmdW5jdGlvbih1c2VyKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNlbGYuZ2V0UHJvZmlsZSh1c2VyKTtcclxuXHRcdFx0fSk7XHJcblx0fTtcclxuXHJcblx0c3AuUHJvZmlsZXMgPSBQcm9maWxlcztcclxufSkoU1BTY3JpcHQpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTUFNjcmlwdC5Qcm9maWxlczsiLCJTUFNjcmlwdCA9IHJlcXVpcmUoXCIuL3Nwc2NyaXB0XCIpO1xyXG5cclxuKGZ1bmN0aW9uKHNwKSB7XHJcblx0c3AucXVlcnlTdHJpbmcgPSB7XHJcblx0XHRfcXVlcnlTdHJpbmc6IHt9LFxyXG5cdFx0X3Byb2Nlc3NlZDogZmFsc2UsXHJcblxyXG5cdFx0Ly9wcml2YXRlIG1ldGhvZCAob25seSBydW4gb24gdGhlIGZpcnN0ICdHZXRWYWx1ZScgcmVxdWVzdClcclxuXHRcdF9wcm9jZXNzUXVlcnlTdHJpbmc6IGZ1bmN0aW9uKHRleHQpIHtcclxuXHRcdFx0dmFyIHFzID0gdGV4dCB8fCB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKSxcclxuXHRcdFx0XHRrZXlWYWx1ZSxcclxuXHRcdFx0XHRrZXlWYWx1ZXMgPSBxcy5zcGxpdCgnJicpO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZXlWYWx1ZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRrZXlWYWx1ZSA9IGtleVZhbHVlc1tpXS5zcGxpdCgnPScpO1xyXG5cdFx0XHRcdC8vdGhpcy5fcXVlcnlTdHJpbmcucHVzaChrZXlWYWx1ZVswXSk7XHJcblx0XHRcdFx0dGhpcy5fcXVlcnlTdHJpbmdba2V5VmFsdWVbMF1dID0gZGVjb2RlVVJJQ29tcG9uZW50KGtleVZhbHVlWzFdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIikpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLl9wcm9jZXNzZWQgPSB0cnVlO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvL1B1YmxpYyBNZXRob2RzXHJcblx0XHRjb250YWluczogZnVuY3Rpb24oa2V5LCB0ZXh0KSB7XHJcblx0XHRcdGlmICghdGhpcy5fcHJvY2Vzc2VkKSB7XHJcblx0XHRcdFx0dGhpcy5fcHJvY2Vzc1F1ZXJ5U3RyaW5nKHRleHQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzLl9xdWVyeVN0cmluZy5oYXNPd25Qcm9wZXJ0eShrZXkpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRnZXRWYWx1ZTogZnVuY3Rpb24oa2V5LCB0ZXh0KSB7XHJcblx0XHRcdGlmICghdGhpcy5fcHJvY2Vzc2VkKSB7XHJcblx0XHRcdFx0dGhpcy5fcHJvY2Vzc1F1ZXJ5U3RyaW5nKHRleHQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzLmNvbnRhaW5zKGtleSkgPyB0aGlzLl9xdWVyeVN0cmluZ1trZXldIDogXCJcIjtcclxuXHRcdH0sXHJcblxyXG5cdFx0Z2V0QWxsOiBmdW5jdGlvbih0ZXh0KSB7XHJcblx0XHRcdGlmICghdGhpcy5fcHJvY2Vzc2VkKSB7XHJcblx0XHRcdFx0dGhpcy5fcHJvY2Vzc1F1ZXJ5U3RyaW5nKHRleHQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzLl9xdWVyeVN0cmluZztcclxuXHRcdH0sXHJcblxyXG5cdFx0b2JqZWN0VG9RdWVyeVN0cmluZzogZnVuY3Rpb24ob2JqLCBxdW90ZVZhbHVlcykge1xyXG5cdFx0XHR2YXIgcGFyYW1zID0gW107XHJcblx0XHRcdGZvciAodmFyIGtleSBpbiBvYmopIHtcclxuXHRcdFx0XHR2YWx1ZSA9IG9ialtrZXldO1xyXG5cdFx0XHRcdGlmICh2YWx1ZSAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0aWYgKHF1b3RlVmFsdWVzKSB7XHJcblx0XHRcdFx0XHRcdHBhcmFtcy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9J1wiICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSArIFwiJ1wiKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHBhcmFtcy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBwYXJhbXMuam9pbihcIiZcIik7XHJcblx0XHR9XHJcblx0fTtcclxufSkoU1BTY3JpcHQpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTUFNjcmlwdC5xdWVyeVN0cmluZzsiLCJ2YXIgU1BTY3JpcHQgPSByZXF1aXJlKFwiLi9zcHNjcmlwdFwiKTtcclxuU1BTY3JpcHQuQmFzZURhbyA9IHJlcXVpcmUoXCIuL2Jhc2VEYW9cIik7XHJcblNQU2NyaXB0LlNlYXJjaCA9IHJlcXVpcmUoXCIuL3NlYXJjaFwiKTtcclxuXHJcbihmdW5jdGlvbihzcCkge1xyXG5cdHZhciBSZXN0RGFvID0gZnVuY3Rpb24odXJsKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRzcC5CYXNlRGFvLmNhbGwodGhpcyk7XHJcblx0XHR0aGlzLndlYlVybCA9IHVybDtcclxuXHR9O1xyXG5cclxuXHRSZXN0RGFvLnByb3RvdHlwZSA9IG5ldyBzcC5CYXNlRGFvKCk7XHJcblxyXG5cdFJlc3REYW8ucHJvdG90eXBlLmV4ZWN1dGVSZXF1ZXN0ID0gZnVuY3Rpb24odXJsLCBvcHRpb25zKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRcdGZ1bGxVcmwgPSAoL15odHRwL2kpLnRlc3QodXJsKSA/IHVybCA6IHRoaXMud2ViVXJsICsgXCIvX2FwaVwiICsgdXJsLFxyXG5cdFx0XHRleGVjdXRlT3B0aW9ucyA9IHtcclxuXHRcdFx0XHR1cmw6IGZ1bGxVcmwsXHJcblx0XHRcdFx0dHlwZTogXCJHRVRcIixcclxuXHRcdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0XHRcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb247IG9kYXRhPXZlcmJvc2VcIlxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHJcblx0XHQkLmV4dGVuZChleGVjdXRlT3B0aW9ucywgb3B0aW9ucyk7XHJcblx0XHRyZXR1cm4gJC5hamF4KGV4ZWN1dGVPcHRpb25zKTtcclxuXHR9O1xyXG5cclxuXHRzcC5SZXN0RGFvID0gUmVzdERhbztcclxufSkoU1BTY3JpcHQpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTUFNjcmlwdC5SZXN0RGFvOyIsIlNQU2NyaXB0ID0gcmVxdWlyZShcIi4vc3BzY3JpcHRcIik7XHJcblNQU2NyaXB0LlJlc3REYW8gPSByZXF1aXJlKFwiLi9yZXN0RGFvXCIpO1xyXG5TUFNjcmlwdC5xdWVyeVN0cmluZyA9IHJlcXVpcmUoJy4vcXVlcnlTdHJpbmcnKTtcclxuXHJcbihmdW5jdGlvbihzcCkge1xyXG5cdHZhciBTZWFyY2ggPSBmdW5jdGlvbih1cmxPckRhbykge1xyXG5cdFx0aWYgKHR5cGVvZiB1cmxPckRhbyA9PT0gXCJzdHJpbmdcIikge1xyXG5cdFx0XHR0aGlzLmRhbyA9IG5ldyBzcC5SZXN0RGFvKHVybE9yRGFvKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuZGFvID0gdXJsT3JEYW87XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0U2VhcmNoLlF1ZXJ5T3B0aW9ucyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zb3VyY2VpZCA9IG51bGw7XHJcblx0XHR0aGlzLnN0YXJ0cm93ID0gbnVsbDtcclxuXHRcdHRoaXMucm93bGltaXQgPSAzMDtcclxuXHRcdHRoaXMuc2VsZWN0ZWRwcm9wZXJ0aWVzID0gbnVsbDtcclxuXHRcdHRoaXMucmVmaW5lcnMgPSBudWxsO1xyXG5cdFx0dGhpcy5yZWZpbmVtZW50ZmlsdGVycyA9IG51bGw7XHJcblx0XHR0aGlzLmhpZGRlbmNvbnN0cmFpbnRzID0gbnVsbDtcclxuXHRcdHRoaXMuc29ydGxpc3QgPSBudWxsO1xyXG5cdH07XHJcblxyXG5cdHZhciBjb252ZXJ0Um93c1RvT2JqZWN0cyA9IGZ1bmN0aW9uKGl0ZW1Sb3dzKSB7XHJcblx0XHR2YXIgaXRlbXMgPSBbXTtcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1Sb3dzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciByb3cgPSBpdGVtUm93c1tpXSxcclxuXHRcdFx0XHRpdGVtID0ge307XHJcblx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgcm93LkNlbGxzLnJlc3VsdHMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRpdGVtW3Jvdy5DZWxscy5yZXN1bHRzW2pdLktleV0gPSByb3cuQ2VsbHMucmVzdWx0c1tqXS5WYWx1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aXRlbXMucHVzaChpdGVtKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gaXRlbXM7XHJcblx0fTtcclxuXHJcblx0Ly9zZWFsZWQgY2xhc3MgdXNlZCB0byBmb3JtYXQgcmVzdWx0c1xyXG5cdHZhciBTZWFyY2hSZXN1bHRzID0gZnVuY3Rpb24ocXVlcnlSZXNwb25zZSkge1xyXG5cdFx0dGhpcy5lbGFwc2VkVGltZSA9IHF1ZXJ5UmVzcG9uc2UuRWxhcHNlZFRpbWU7XHJcblx0XHR0aGlzLnN1Z2dlc3Rpb24gPSBxdWVyeVJlc3BvbnNlLlNwZWxsaW5nU3VnZ2VzdGlvbjtcclxuXHRcdHRoaXMucmVzdWx0c0NvdW50ID0gcXVlcnlSZXNwb25zZS5QcmltYXJ5UXVlcnlSZXN1bHQuUmVsZXZhbnRSZXN1bHRzLlJvd0NvdW50O1xyXG5cdFx0dGhpcy50b3RhbFJlc3VsdHMgPSBxdWVyeVJlc3BvbnNlLlByaW1hcnlRdWVyeVJlc3VsdC5SZWxldmFudFJlc3VsdHMuVG90YWxSb3dzO1xyXG5cdFx0dGhpcy50b3RhbFJlc3VsdHNJbmNsdWRpbmdEdXBsaWNhdGVzID0gcXVlcnlSZXNwb25zZS5QcmltYXJ5UXVlcnlSZXN1bHQuUmVsZXZhbnRSZXN1bHRzLlRvdGFsUm93c0luY2x1ZGluZ0R1cGxpY2F0ZXM7XHJcblx0XHR0aGlzLml0ZW1zID0gY29udmVydFJvd3NUb09iamVjdHMocXVlcnlSZXNwb25zZS5QcmltYXJ5UXVlcnlSZXN1bHQuUmVsZXZhbnRSZXN1bHRzLlRhYmxlLlJvd3MucmVzdWx0cyk7XHJcblx0fTtcclxuXHJcblx0U2VhcmNoLnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uKHF1ZXJ5VGV4dCwgcXVlcnlPcHRpb25zKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRcdG9wdGlvbnNRdWVyeVN0cmluZyA9IHF1ZXJ5T3B0aW9ucyAhPSBudWxsID8gXCImXCIgKyBzcC5xdWVyeVN0cmluZy5vYmplY3RUb1F1ZXJ5U3RyaW5nKHF1ZXJ5T3B0aW9ucywgdHJ1ZSkgOiBcIlwiLFxyXG5cdFx0XHRhc3luY1JlcXVlc3QgPSBuZXcgJC5EZWZlcnJlZCgpO1xyXG5cclxuXHRcdHZhciB1cmwgPSBcIi9zZWFyY2gvcXVlcnk/cXVlcnl0ZXh0PSdcIiArIHF1ZXJ5VGV4dCArIFwiJ1wiICsgb3B0aW9uc1F1ZXJ5U3RyaW5nO1xyXG5cdFx0dmFyIGdldFJlcXVlc3QgPSBzZWxmLmRhby5nZXQodXJsKTtcclxuXHJcblx0XHRnZXRSZXF1ZXN0LmRvbmUoZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRpZiAoZGF0YS5kICYmIGRhdGEuZC5xdWVyeSkge1xyXG5cdFx0XHRcdHZhciByZXN1bHRzID0gbmV3IFNlYXJjaFJlc3VsdHMoZGF0YS5kLnF1ZXJ5KTtcclxuXHRcdFx0XHRhc3luY1JlcXVlc3QucmVzb2x2ZShyZXN1bHRzKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRhc3luY1JlcXVlc3QucmVqZWN0KGRhdGEpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gYXN5bmNSZXF1ZXN0LnByb21pc2UoKTtcclxuXHR9O1xyXG5cclxuXHRTZWFyY2gucHJvdG90eXBlLnBlb3BsZSA9IGZ1bmN0aW9uKHF1ZXJ5VGV4dCwgcXVlcnlPcHRpb25zKSB7XHJcblx0XHR2YXIgb3B0aW9ucyA9IHF1ZXJ5T3B0aW9ucyB8fCB7fTtcclxuXHRcdG9wdGlvbnMuc291cmNlaWQgPSAgJ2IwOWE3OTkwLTA1ZWEtNGFmOS04MWVmLWVkZmFiMTZjNGUzMSc7XHJcblx0XHRyZXR1cm4gdGhpcy5xdWVyeShxdWVyeVRleHQsIG9wdGlvbnMpO1xyXG5cdH07XHJcblxyXG5cdHNwLlNlYXJjaCA9IFNlYXJjaDtcclxuXHJcbn0pKFNQU2NyaXB0KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU1BTY3JpcHQuU2VhcmNoOyIsIm1vZHVsZS5leHBvcnRzID0ge307IiwiU1BTY3JpcHQgPSByZXF1aXJlKFwiLi9zcHNjcmlwdFwiKTtcclxuXHJcbihmdW5jdGlvbihzcCkge1xyXG5cdHNwLnRlbXBsYXRpbmcgPSB7XHJcblxyXG5cdFx0UGxhY2Vob2xkZXI6IGZ1bmN0aW9uKHJhdykge1xyXG5cdFx0XHR0aGlzLnJhdyA9IHJhdztcclxuXHRcdFx0dGhpcy5mdWxsUHJvcGVydHkgPSByYXcuc2xpY2UoMiwgcmF3Lmxlbmd0aCAtIDIpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRnZXRQbGFjZUhvbGRlcnM6IGZ1bmN0aW9uKHRlbXBsYXRlLCByZWdleHApIHtcclxuXHRcdFx0dmFyIHJlZ0V4cFBhdHRlcm4gPSByZWdleHAgfHwgL1xce1xce1teXFx9XStcXH1cXH0/L2c7XHJcblx0XHRcdHJldHVybiB0ZW1wbGF0ZS5tYXRjaChyZWdFeHBQYXR0ZXJuKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Z2V0T2JqZWN0VmFsdWU6IGZ1bmN0aW9uKG9iaiwgZnVsbFByb3BlcnR5KSB7XHJcblx0XHRcdHZhciB2YWx1ZSA9IG9iaixcclxuXHRcdFx0XHRwcm9wZXJ0eUNoYWluID0gZnVsbFByb3BlcnR5LnNwbGl0KCcuJyk7XHJcblxyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnR5Q2hhaW4ubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHR2YXIgcHJvcGVydHkgPSBwcm9wZXJ0eUNoYWluW2ldO1xyXG5cdFx0XHRcdHZhbHVlID0gdmFsdWVbcHJvcGVydHldICE9IG51bGwgPyB2YWx1ZVtwcm9wZXJ0eV0gOiBcIk5vdCBGb3VuZDogXCIgKyBmdWxsUHJvcGVydHk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGZ1bGxQcm9wZXJ0eSA9PT0gXCJfXCIpIHtcclxuXHRcdFx0XHR2YWx1ZSA9IG9iajtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKCh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpICYmIHZhbHVlLmluZGV4T2YoXCIvRGF0ZShcIikgIT09IC0xKSB7XHJcblx0XHRcdFx0dmFyIGRhdGVWYWx1ZSA9IHZhbHVlLlVUQ0pzb25Ub0RhdGUoKTtcclxuXHRcdFx0XHR2YWx1ZSA9IGRhdGVWYWx1ZS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0fSxcclxuXHJcblx0XHRwb3B1bGF0ZVRlbXBsYXRlOiBmdW5jdGlvbih0ZW1wbGF0ZSwgaXRlbSwgcmVnZXhwKSB7XHJcblx0XHRcdHZhciBwbGFjZWhvbGRlcnMgPSB0aGlzLmdldFBsYWNlSG9sZGVycyh0ZW1wbGF0ZSwgcmVnZXhwKSB8fCBbXSxcclxuXHRcdFx0XHRpdGVtSHRtbCA9IHRlbXBsYXRlO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwbGFjZWhvbGRlcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHR2YXIgcGxhY2Vob2xkZXIgPSBuZXcgdGhpcy5QbGFjZWhvbGRlcihwbGFjZWhvbGRlcnNbaV0pO1xyXG5cdFx0XHRcdHBsYWNlaG9sZGVyLnZhbCA9IHRoaXMuZ2V0T2JqZWN0VmFsdWUoaXRlbSwgcGxhY2Vob2xkZXIuZnVsbFByb3BlcnR5KTtcclxuXHRcdFx0XHR2YXIgcGF0dGVybiA9IHBsYWNlaG9sZGVyLnJhdy5yZXBsYWNlKFwiW1wiLCBcIlxcXFxbXCIpLnJlcGxhY2UoXCJdXCIsIFwiXFxcXF1cIik7XHJcblx0XHRcdFx0dmFyIG1vZGlmaWVyID0gXCJnXCI7XHJcblx0XHRcdFx0aXRlbUh0bWwgPSBpdGVtSHRtbC5yZXBsYWNlKG5ldyBSZWdFeHAocGF0dGVybiwgbW9kaWZpZXIpLCBwbGFjZWhvbGRlci52YWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBpdGVtSHRtbDtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRzcC50ZW1wbGF0aW5nLkVhY2ggPSB7XHJcblxyXG5cdFx0cmVnRXhwOiAvXFx7XFxbW15cXF1dK1xcXVxcfT8vZyxcclxuXHJcblx0XHRwb3B1bGF0ZUVhY2hUZW1wbGF0ZXM6IGZ1bmN0aW9uKGl0ZW1IdG1sLCBpdGVtKSB7XHJcblx0XHRcdHZhciAkaXRlbUh0bWwgPSAkKGl0ZW1IdG1sKSxcclxuXHRcdFx0XHRlYWNoVGVtcGxhdGVzID0gJGl0ZW1IdG1sLmZpbmQoXCJbZGF0YS1lYWNoXVwiKTtcclxuXHJcblx0XHRcdGVhY2hUZW1wbGF0ZXMuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgYXJyYXlIdG1sID0gXCJcIixcclxuXHRcdFx0XHRcdGl0ZW1UZW1wbGF0ZSA9ICQodGhpcykuaHRtbCgpLFxyXG5cdFx0XHRcdFx0YXJyYXlQcm9wID0gJCh0aGlzKS5kYXRhKFwiZWFjaFwiKSxcclxuXHRcdFx0XHRcdGFycmF5ID0gc3AudGVtcGxhdGluZy5nZXRPYmplY3RWYWx1ZShpdGVtLCBhcnJheVByb3ApO1xyXG5cclxuXHRcdFx0XHRpZiAoYXJyYXkgIT0gbnVsbCAmJiAkLmlzQXJyYXkoYXJyYXkpKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGFycmF5SHRtbCArPSBzcC50ZW1wbGF0aW5nLnBvcHVsYXRlVGVtcGxhdGUoaXRlbVRlbXBsYXRlLCBhcnJheVtpXSwgc3AudGVtcGxhdGluZy5FYWNoLnJlZ0V4cCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQkaXRlbUh0bWwuZmluZCgkKHRoaXMpKS5odG1sKGFycmF5SHRtbCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dmFyIHRlbXAgPSAkaXRlbUh0bWwuY2xvbmUoKS53cmFwKFwiPGRpdj5cIik7XHJcblx0XHRcdHJldHVybiB0ZW1wLnBhcmVudCgpLmh0bWwoKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRzcC50ZW1wbGF0aW5nLnJlbmRlclRlbXBsYXRlID0gZnVuY3Rpb24odGVtcGxhdGUsIGl0ZW0sIHJlbmRlckVhY2hUZW1wbGF0ZSkge1xyXG5cdFx0dmFyIGl0ZW1IdG1sID0gc3AudGVtcGxhdGluZy5wb3B1bGF0ZVRlbXBsYXRlKHRlbXBsYXRlLCBpdGVtKTtcclxuXHRcdGlmIChyZW5kZXJFYWNoVGVtcGxhdGUpIHtcclxuXHRcdFx0aXRlbUh0bWwgPSBzcC50ZW1wbGF0aW5nLkVhY2gucG9wdWxhdGVFYWNoVGVtcGxhdGVzKGl0ZW1IdG1sLCBpdGVtKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBpdGVtSHRtbDtcclxuXHR9O1xyXG59KShTUFNjcmlwdCk7XHJcblxyXG5TdHJpbmcucHJvdG90eXBlLlVUQ0pzb25Ub0RhdGUgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgdXRjU3RyID0gdGhpcy5zdWJzdHJpbmcodGhpcy5pbmRleE9mKFwiKFwiKSArIDEpO1xyXG5cdHV0Y1N0ciA9IHV0Y1N0ci5zdWJzdHJpbmcoMCwgdXRjU3RyLmluZGV4T2YoXCIpXCIpKTtcclxuXHJcblx0dmFyIHJldHVybkRhdGUgPSBuZXcgRGF0ZShwYXJzZUludCh1dGNTdHIsIDEwKSk7XHJcblx0dmFyIGhvdXJPZmZzZXQgPSByZXR1cm5EYXRlLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MDtcclxuXHRyZXR1cm5EYXRlLnNldEhvdXJzKHJldHVybkRhdGUuZ2V0SG91cnMoKSArIGhvdXJPZmZzZXQpO1xyXG5cclxuXHRyZXR1cm4gcmV0dXJuRGF0ZTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU1BTY3JpcHQudGVtcGxhdGluZzsiLCJ2YXIgU1BTY3JpcHQgPSByZXF1aXJlOyhcIi4vc3BzY3JpcHRcIik7XHJcblNQU2NyaXB0LmhlbHBlcnMgPSByZXF1aXJlKFwiLi9oZWxwZXJzXCIpO1xyXG5TUFNjcmlwdC5wZXJtaXNzaW9ucyA9IHJlcXVpcmUoXCIuL3Blcm1pc3Npb25zXCIpO1xyXG5cclxuKGZ1bmN0aW9uKHNwKSB7XHJcblx0dmFyIGJhc2VVcmwgPSBcIi93ZWJcIjtcclxuXHR2YXIgV2ViID0gZnVuY3Rpb24oZGFvKSB7XHJcblx0XHR0aGlzLl9kYW8gPSBkYW87XHJcblx0fTtcclxuXHJcblx0V2ViLnByb3RvdHlwZS5pbmZvID0gZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZGFvXHJcblx0XHRcdC5nZXQoYmFzZVVybClcclxuXHRcdFx0LnRoZW4oc3AuaGVscGVycy52YWxpZGF0ZU9EYXRhVjIpO1xyXG5cdH07XHJcblxyXG5cdFdlYi5wcm90b3R5cGUuc3Vic2l0ZXMgPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLl9kYW9cclxuXHRcdFx0LmdldChiYXNlVXJsICsgXCIvd2ViaW5mb3NcIilcclxuXHRcdFx0LnRoZW4oc3AuaGVscGVycy52YWxpZGF0ZU9EYXRhVjIpO1xyXG5cdH07XHJcblxyXG5cdFdlYi5wcm90b3R5cGUucGVybWlzc2lvbnMgPSBmdW5jdGlvbihlbWFpbCkge1xyXG5cdFx0cmV0dXJuIHNwLnBlcm1pc3Npb25zKGJhc2VVcmwsIHRoaXMuX2RhbywgZW1haWwpO1xyXG5cdH07XHJcblxyXG5cdFdlYi5wcm90b3R5cGUuZ2V0VXNlciA9IGZ1bmN0aW9uKGVtYWlsKSB7XHJcblx0XHR2YXIgdXJsID0gYmFzZVVybCArIFwiL1NpdGVVc2Vycy9HZXRCeUVtYWlsKCdcIiArIGVtYWlsICsgXCInKVwiO1xyXG5cdFx0cmV0dXJuIHRoaXMuX2Rhby5nZXQodXJsKS50aGVuKHNwLmhlbHBlcnMudmFsaWRhdGVPRGF0YVYyKTtcclxuXHR9O1xyXG5cclxuXHRzcC5XZWIgPSBXZWI7XHJcbn0pKFNQU2NyaXB0KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU1BTY3JpcHQuV2ViOyJdfQ==
