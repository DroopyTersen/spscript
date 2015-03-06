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

	List.prototype.findItems = function(key, value) {
		//if its a string, wrap in single quotes
		var filterValue = typeof value === "string" ? "'" + value + "'" : value;
		var odata = "$filter=" + key + " eq " + filterValue;
		return this.getItems(odata);
	};

	List.prototype.findItem = function(key, value) {
		return this.findItems(key, value).then(function(items) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxnaXR3aXBcXFNQU2NyaXB0XFxub2RlX21vZHVsZXNcXGd1bHAtYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL2Jhc2VEYW8uanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL2Nyb3NzRG9tYWluRGFvLmpzIiwiQzovZ2l0d2lwL1NQU2NyaXB0L3NyYy9lbnRyaWVzL2Zha2VfYWY3Mzc3YjguanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL2hlbHBlcnMuanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL2xpc3QuanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL3Blcm1pc3Npb25zLmpzIiwiQzovZ2l0d2lwL1NQU2NyaXB0L3NyYy9wcm9maWxlcy5qcyIsIkM6L2dpdHdpcC9TUFNjcmlwdC9zcmMvcXVlcnlTdHJpbmcuanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL3Jlc3REYW8uanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL3NlYXJjaC5qcyIsIkM6L2dpdHdpcC9TUFNjcmlwdC9zcmMvc3BzY3JpcHQuanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL3RlbXBsYXRpbmcuanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL3dlYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiU1BTY3JpcHQgPSByZXF1aXJlKFwiLi9zcHNjcmlwdFwiKTtcclxuU1BTY3JpcHQuTGlzdCA9IHJlcXVpcmUoXCIuL2xpc3RcIik7XHJcblNQU2NyaXB0LldlYiA9IHJlcXVpcmUoXCIuL3dlYlwiKTtcclxuU1BTY3JpcHQuUHJvZmlsZXMgPSByZXF1aXJlKFwiLi9wcm9maWxlc1wiKVxyXG5TUFNjcmlwdC5oZWxwZXJzID0gcmVxdWlyZShcIi4vaGVscGVyc1wiKTtcclxuXHJcbihmdW5jdGlvbihzcCkge1xyXG5cdHZhciBCYXNlRGFvID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0c2VsZi53ZWIgPSBuZXcgc3AuV2ViKHNlbGYpO1xyXG5cdFx0c2VsZi5zZWFyY2ggPSBuZXcgc3AuU2VhcmNoKHNlbGYpO1xyXG5cdFx0c2VsZi5wcm9maWxlcyA9IG5ldyBzcC5Qcm9maWxlcyhzZWxmKTtcclxuXHR9O1xyXG5cclxuXHRCYXNlRGFvLnByb3RvdHlwZS5leGVjdXRlUmVxdWVzdCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhyb3cgXCJOb3QgaW1wbGVtZW50ZWQgZXhjZXB0aW9uXCI7XHJcblx0fTtcclxuXHJcblx0QmFzZURhby5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24ocmVsYXRpdmVRdWVyeVVybCwgZXh0ZW5kZWRPcHRpb25zLCByYXcpIHtcclxuXHRcdHZhciBvcHRpb25zID0ge1xyXG5cdFx0XHR0eXBlOiBcIkdFVFwiXHJcblx0XHR9O1xyXG5cclxuXHRcdGlmIChleHRlbmRlZE9wdGlvbnMpIHtcclxuXHRcdFx0JC5leHRlbmQob3B0aW9ucywgZXh0ZW5kZWRPcHRpb25zKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzLmV4ZWN1dGVSZXF1ZXN0KHJlbGF0aXZlUXVlcnlVcmwsIG9wdGlvbnMpO1xyXG5cdH07XHJcblxyXG5cdEJhc2VEYW8ucHJvdG90eXBlLmxpc3RzID0gZnVuY3Rpb24obGlzdG5hbWUpIHtcclxuXHRcdGlmKCFsaXN0bmFtZSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5nZXQoXCIvd2ViL2xpc3RzXCIpLnRoZW4oc3AuaGVscGVycy52YWxpZGF0ZU9EYXRhVjIpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ldyBzcC5MaXN0KGxpc3RuYW1lLCB0aGlzKTtcclxuXHR9O1xyXG5cclxuXHRCYXNlRGFvLnByb3RvdHlwZS5wb3N0ID0gZnVuY3Rpb24ocmVsYXRpdmVQb3N0VXJsLCBib2R5LCBleHRlbmRlZE9wdGlvbnMpIHtcclxuXHRcdHZhciBzdHJCb2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XHJcblx0XHR2YXIgb3B0aW9ucyA9IHtcclxuXHRcdFx0dHlwZTogXCJQT1NUXCIsXHJcblx0XHRcdGRhdGE6IHN0ckJvZHksXHJcblx0XHRcdGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb247b2RhdGE9dmVyYm9zZVwiXHJcblx0XHR9O1xyXG5cdFx0JC5leHRlbmQob3B0aW9ucywgZXh0ZW5kZWRPcHRpb25zKTtcclxuXHRcdHJldHVybiB0aGlzLmV4ZWN1dGVSZXF1ZXN0KHJlbGF0aXZlUG9zdFVybCwgb3B0aW9ucyk7XHJcblx0fTtcclxuXHJcblx0QmFzZURhby5wcm90b3R5cGUudXBsb2FkRmlsZSA9IGZ1bmN0aW9uKGZvbGRlclVybCwgbmFtZSwgYmFzZTY0QmluYXJ5KSB7XHJcblx0XHR2YXIgdXBsb2FkVXJsID0gXCIvd2ViL0dldEZvbGRlckJ5U2VydmVyUmVsYXRpdmVVcmwoJ1wiICsgZm9sZGVyVXJsICsgXCInKS9GaWxlcy9BZGQodXJsPSdcIiArIG5hbWUgKyBcIicsb3ZlcndyaXRlPXRydWUpXCIsXHJcblx0XHRcdG9wdGlvbnMgPSB7XHJcblx0XHRcdFx0YmluYXJ5U3RyaW5nUmVxdWVzdEJvZHk6IHRydWUsXHJcblx0XHRcdFx0c3RhdGU6IFwiVXBkYXRlXCJcclxuXHRcdFx0fTtcclxuXHRcdHJldHVybiB0aGlzLnBvc3QodXBsb2FkVXJsLCBiYXNlNjRCaW5hcnksIG9wdGlvbnMpO1xyXG5cdH07XHJcblxyXG5cdHNwLkJhc2VEYW8gPSBCYXNlRGFvO1xyXG59KShTUFNjcmlwdCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNQU2NyaXB0LkJhc2VEYW87IiwiU1BTY3JpcHQgPSByZXF1aXJlKFwiLi9zcHNjcmlwdFwiKTtcclxuU1BTY3JpcHQuaGVscGVycyA9IHJlcXVpcmUoXCIuL2hlbHBlcnNcIik7XHJcblNQU2NyaXB0LkJhc2VEYW8gPSByZXF1aXJlKFwiLi9iYXNlRGFvXCIpO1xyXG5cclxuKGZ1bmN0aW9uKHNwKSB7XHJcblx0dmFyIENyb3NzRG9tYWluRGFvID0gZnVuY3Rpb24oYXBwV2ViVXJsLCBob3N0VXJsKSB7XHJcblx0XHR0aGlzLmFwcFVybCA9IGFwcFdlYlVybDtcclxuXHRcdHRoaXMuaG9zdFVybCA9IGhvc3RVcmw7XHJcblx0XHR0aGlzLnNjcmlwdFJlYWR5ID0gbmV3ICQuRGVmZXJyZWQoKTtcclxuXHJcblx0XHQvL0xvYWQgb2YgdXAgdG8gUmVxdWVzdEV4ZWN1dG9yIGphdmFzY3JpcHQgZnJvbSB0aGUgaG9zdCBzaXRlIGlmIGl0cyBub3QgdGhlcmUuXHJcblx0XHRpZiAoIVNQIHx8ICFTUC5SZXF1ZXN0RXhlY3V0b3IpIHtcclxuXHRcdFx0dGhpcy5zY3JpcHRSZWFkeSA9ICQuZ2V0U2NyaXB0KGhvc3RVcmwgKyBcIi9fbGF5b3V0cy8xNS9TUC5SZXF1ZXN0RXhlY3V0b3IuanNcIik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMuc2NyaXB0UmVhZHkucmVzb2x2ZSgpO1x0XHJcblx0XHRcdH0sIDEpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdENyb3NzRG9tYWluRGFvLnByb3RvdHlwZSA9IG5ldyBTUFNjcmlwdC5CYXNlRGFvKCk7XHJcblxyXG5cdENyb3NzRG9tYWluRGFvLnByb3RvdHlwZS5leGVjdXRlUmVxdWVzdCA9IGZ1bmN0aW9uKGhvc3RSZWxhdGl2ZVVybCwgb3B0aW9ucykge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRkZWZlcnJlZCA9IG5ldyAkLkRlZmVycmVkKCksXHJcblxyXG5cdFx0XHQvL0lmIGEgY2FsbGJhY2sgd2FzIGdpdmVuIGV4ZWN1dGUgaXQsIHBhc3NpbmcgcmVzcG9uc2UgdGhlbiB0aGUgZGVmZXJyZWRcclxuXHRcdFx0Ly9vdGhlcndpc2UganVzdCByZXNvbHZlIHRoZSBkZWZlcnJlZC5cclxuXHRcdFx0c3VjY2Vzc0NhbGxiYWNrID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHR2YXIgZGF0YSA9ICQucGFyc2VKU09OKHJlc3BvbnNlLmJvZHkpO1xyXG5cdFx0XHRcdC8vYSBzdWNlZXNzIGNhbGxiYWNrIHdhcyBwYXNzZWQgaW5cclxuXHRcdFx0XHRpZiAob3B0aW9ucy5zdWNjZXNzKSB7XHJcblx0XHRcdFx0XHRvcHRpb25zLnN1Y2Nlc3MoZGF0YSwgZGVmZXJyZWQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvL25vIHN1Y2Nlc3MgY2FsbGJhY2sgc28ganVzdCBtYWtlIHN1cmUgaXRzIHZhbGlkIE9EYXRhXHJcblx0XHRcdFx0XHRzcC5oZWxwZXJzLnZhbGlkYXRlT0RhdGFWMihkYXRhLCBkZWZlcnJlZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRlcnJvckNhbGxiYWNrID0gZnVuY3Rpb24oZGF0YSwgZXJyb3JDb2RlLCBlcnJvck1lc3NhZ2UpIHtcclxuXHRcdFx0XHQvL2FuIGVycm9yIGNhbGxiYWNrIHdhcyBwYXNzZWQgaW5cclxuXHRcdFx0XHRpZiAob3B0aW9ucy5lcnJvcikge1xyXG5cdFx0XHRcdFx0b3B0aW9ucy5lcnJvcihkYXRhLCBlcnJvckNvZGUsIGVycm9yTWVzc2FnZSwgZGVmZXJyZWQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvL25vIGVycm9yIGNhbGxiYWNrIHNvIGp1c3QgcmVqZWN0IGl0XHJcblx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyb3JNZXNzYWdlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0dGhpcy5zY3JpcHRSZWFkeS5kb25lKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQvL3RhY2sgb24gdGhlIHF1ZXJ5IHN0cmluZyBxdWVzdGlvbiBtYXJrIGlmIG5vdCB0aGVyZSBhbHJlYWR5XHJcblx0XHRcdGlmIChob3N0UmVsYXRpdmVVcmwuaW5kZXhPZihcIj9cIikgPT09IC0xKSB7XHJcblx0XHRcdFx0aG9zdFJlbGF0aXZlVXJsID0gaG9zdFJlbGF0aXZlVXJsICsgXCI/XCI7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBleGVjdXRvciA9IG5ldyBTUC5SZXF1ZXN0RXhlY3V0b3Ioc2VsZi5hcHBVcmwpLFxyXG5cdFx0XHRcdGZ1bGxVcmwgPSBzZWxmLmFwcFVybCArIFwiL19hcGkvU1AuQXBwQ29udGV4dFNpdGUoQHRhcmdldClcIiArIGhvc3RSZWxhdGl2ZVVybCArIFwiQHRhcmdldD0nXCIgKyBzZWxmLmhvc3RVcmwgKyBcIidcIjtcclxuXHJcblx0XHRcdHZhciBleGVjdXRlT3B0aW9ucyA9IHtcclxuXHRcdFx0XHR1cmw6IGZ1bGxVcmwsXHJcblx0XHRcdFx0dHlwZTogXCJHRVRcIixcclxuXHRcdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0XHRcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb247IG9kYXRhPXZlcmJvc2VcIlxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0c3VjY2Vzczogc3VjY2Vzc0NhbGxiYWNrLFxyXG5cdFx0XHRcdGVycm9yOiBlcnJvckNhbGxiYWNrXHJcblx0XHRcdH07XHJcblx0XHRcdC8vTWVyZ2UgcGFzc2VkIGluIG9wdGlvbnNcclxuXHRcdFx0JC5leHRlbmQodHJ1ZSwgZXhlY3V0ZU9wdGlvbnMsIG9wdGlvbnMpO1xyXG5cdFx0XHRleGVjdXRvci5leGVjdXRlQXN5bmMoZXhlY3V0ZU9wdGlvbnMpO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xyXG5cdH07XHJcblxyXG5cdHNwLkNyb3NzRG9tYWluRGFvID0gQ3Jvc3NEb21haW5EYW87XHJcbn0pKFNQU2NyaXB0KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU1BTY3JpcHQuQ3Jvc3NEb21haW5EYW87IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuZ2xvYmFsLlNQU2NyaXB0ID0ge307XHJcbmdsb2JhbC5TUFNjcmlwdC5SZXN0RGFvID0gcmVxdWlyZShcIi4uL3Jlc3REYW9cIik7XHJcbmdsb2JhbC5TUFNjcmlwdC5Dcm9zc0RvbWFpbkRhbyA9IHJlcXVpcmUoXCIuLi9jcm9zc0RvbWFpbkRhb1wiKTtcclxuZ2xvYmFsLlNQU2NyaXB0LnF1ZXJ5U3RyaW5nID0gcmVxdWlyZShcIi4uL3F1ZXJ5U3RyaW5nXCIpO1xyXG5nbG9iYWwuU1BTY3JpcHQuU2VhcmNoID0gcmVxdWlyZShcIi4uL3NlYXJjaFwiKTtcclxuZ2xvYmFsLlNQU2NyaXB0LnRlbXBsYXRpbmcgPSByZXF1aXJlKFwiLi4vdGVtcGxhdGluZ1wiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBnbG9iYWwuU1BTY3JpcHQ7XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsInZhciBTUFNjcmlwdCA9IHJlcXVpcmUoXCIuL3Nwc2NyaXB0LmpzXCIpO1xyXG5cclxuKGZ1bmN0aW9uKHNwKSB7XHJcblx0dmFyIGhlbHBlcnMgPSB7fTtcclxuXHRoZWxwZXJzLnZhbGlkYXRlT0RhdGFWMiA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdHZhciByZXN1bHRzID0gZGF0YTtcclxuXHRcdGlmIChkYXRhLmQgJiYgZGF0YS5kLnJlc3VsdHMgJiYgZGF0YS5kLnJlc3VsdHMubGVuZ3RoICE9IG51bGwpIHtcclxuXHRcdFx0cmVzdWx0cyA9IGRhdGEuZC5yZXN1bHRzO1xyXG5cdFx0fSBlbHNlIGlmIChkYXRhLmQpIHtcclxuXHRcdFx0cmVzdWx0cyA9IGRhdGEuZDtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHRzO1xyXG5cdH07XHJcblxyXG5cdGhlbHBlcnMudmFsaWRhdGVDcm9zc0RvbWFpbk9EYXRhVjIgPSBmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0dmFyIGRhdGEgPSAkLnBhcnNlSlNPTihyZXNwb25zZS5ib2R5KTtcclxuXHRcdGhlbHBlcnMudmFsaWRhdGVPRGF0YVYyKGRhdGEpO1xyXG5cdH07XHJcblxyXG5cdC8vJ0JvcnJvd2VkJyBmcm9tIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL09wZXJhdG9ycy9CaXR3aXNlX09wZXJhdG9yc1xyXG5cdGhlbHBlcnMuYXJyYXlGcm9tQml0TWFzayA9IGZ1bmN0aW9uIChuTWFzaykge1xyXG5cdFx0Ly8gbk1hc2sgbXVzdCBiZSBiZXR3ZWVuIC0yMTQ3NDgzNjQ4IGFuZCAyMTQ3NDgzNjQ3XHJcblx0XHRpZiAodHlwZW9mIG5NYXNrID09PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdG5NYXNrID0gcGFyc2VJbnQobk1hc2spO1xyXG5cdFx0fVxyXG5cdFx0Ly8gaWYgKG5NYXNrID4gMHg3ZmZmZmZmZiB8fCBuTWFzayA8IC0weDgwMDAwMDAwKSB7IFxyXG5cdFx0Ly8gXHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXJyYXlGcm9tTWFzayAtIG91dCBvZiByYW5nZVwiKTsgXHJcblx0XHQvLyB9XHJcblx0XHRmb3IgKHZhciBuU2hpZnRlZCA9IG5NYXNrLCBhRnJvbU1hc2sgPSBbXTsgblNoaWZ0ZWQ7IGFGcm9tTWFzay5wdXNoKEJvb2xlYW4oblNoaWZ0ZWQgJiAxKSksIG5TaGlmdGVkID4+Pj0gMSk7XHJcblx0XHRyZXR1cm4gYUZyb21NYXNrO1xyXG5cdH07XHJcblxyXG5cdHNwLmhlbHBlcnMgPSBoZWxwZXJzO1xyXG59KShTUFNjcmlwdCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNQU2NyaXB0LmhlbHBlcnM7IiwidmFyIFNQU2NyaXB0ID0gcmVxdWlyZShcIi4vc3BzY3JpcHRcIik7XHJcblNQU2NyaXB0LmhlbHBlcnMgPSByZXF1aXJlKFwiLi9oZWxwZXJzXCIpO1xyXG5TUFNjcmlwdC5wZXJtaXNzaW9ucyA9IHJlcXVpcmUoXCIuL3Blcm1pc3Npb25zXCIpO1xyXG5cclxuKGZ1bmN0aW9uKHNwKSB7XHJcblx0dmFyIGJhc2VVcmwgPSBudWxsO1xyXG5cdHZhciBMaXN0ID0gZnVuY3Rpb24obGlzdG5hbWUsIGRhbykge1xyXG5cdFx0dGhpcy5saXN0bmFtZSA9IGxpc3RuYW1lO1xyXG5cdFx0YmFzZVVybCA9IFwiL3dlYi9saXN0cy9nZXRieXRpdGxlKCdcIiArIGxpc3RuYW1lICsgXCInKVwiO1xyXG5cdFx0dGhpcy5fZGFvID0gZGFvO1xyXG5cdH07XHJcblxyXG5cdExpc3QucHJvdG90eXBlLmdldEl0ZW1zID0gZnVuY3Rpb24ob2RhdGFRdWVyeSkge1xyXG5cdFx0dmFyIHF1ZXJ5ID0gKG9kYXRhUXVlcnkgIT0gbnVsbCkgPyBcIj9cIiArIG9kYXRhUXVlcnkgOiBcIlwiO1xyXG5cdFx0cmV0dXJuIHRoaXMuX2Rhb1xyXG5cdFx0XHQuZ2V0KGJhc2VVcmwgKyBcIi9pdGVtc1wiICsgcXVlcnkpXHJcblx0XHRcdC50aGVuKHNwLmhlbHBlcnMudmFsaWRhdGVPRGF0YVYyKTtcclxuXHR9O1xyXG5cclxuXHRMaXN0LnByb3RvdHlwZS5nZXRJdGVtQnlJZCA9IGZ1bmN0aW9uKGlkKSB7XHJcblx0XHR2YXIgdXJsID0gYmFzZVVybCArIFwiL2l0ZW1zKFwiICsgaWQgKyBcIilcIjtcclxuXHRcdHJldHVybiB0aGlzLl9kYW8uZ2V0KHVybCkudGhlbihzcC5oZWxwZXJzLnZhbGlkYXRlT0RhdGFWMik7XHJcblx0fTtcclxuXHJcblx0TGlzdC5wcm90b3R5cGUuaW5mbyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2Rhby5nZXQoYmFzZVVybCkudGhlbihzcC5oZWxwZXJzLnZhbGlkYXRlT0RhdGFWMik7XHJcblx0fTtcclxuXHJcblx0TGlzdC5wcm90b3R5cGUuYWRkSXRlbSA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHJldHVybiBzZWxmLl9kYW8uZ2V0KGJhc2VVcmwpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRpdGVtID0gJC5leHRlbmQoe1xyXG5cdFx0XHRcdFwiX19tZXRhZGF0YVwiOiB7XHJcblx0XHRcdFx0XHRcInR5cGVcIjogZGF0YS5kLkxpc3RJdGVtRW50aXR5VHlwZUZ1bGxOYW1lXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCBpdGVtKTtcclxuXHJcblx0XHRcdHZhciBjdXN0b21PcHRpb25zID0ge1xyXG5cdFx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHRcdFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvbjtvZGF0YT12ZXJib3NlXCIsXHJcblx0XHRcdFx0XHRcIlgtUmVxdWVzdERpZ2VzdFwiOiAkKFwiI19fUkVRVUVTVERJR0VTVFwiKS52YWwoKSxcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRyZXR1cm4gc2VsZi5fZGFvLnBvc3QoYmFzZVVybCArIFwiL2l0ZW1zXCIsIGl0ZW0sIGN1c3RvbU9wdGlvbnMpXHJcblx0XHRcdFx0LnRoZW4oc3AuaGVscGVycy52YWxpZGF0ZU9EYXRhVjIpO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0TGlzdC5wcm90b3R5cGUudXBkYXRlSXRlbSA9IGZ1bmN0aW9uKGl0ZW1JZCwgdXBkYXRlcykge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0cmV0dXJuIHNlbGYuZ2V0SXRlbUJ5SWQoaXRlbUlkKS50aGVuKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0dXBkYXRlcyA9ICQuZXh0ZW5kKHtcclxuXHRcdFx0XHRcIl9fbWV0YWRhdGFcIjoge1xyXG5cdFx0XHRcdFx0XCJ0eXBlXCI6IGl0ZW0uX19tZXRhZGF0YS50eXBlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCB1cGRhdGVzKTtcclxuXHJcblx0XHRcdHZhciBjdXN0b21PcHRpb25zID0ge1xyXG5cdFx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHRcdFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvbjtvZGF0YT12ZXJib3NlXCIsXHJcblx0XHRcdFx0XHRcIlgtUmVxdWVzdERpZ2VzdFwiOiAkKFwiI19fUkVRVUVTVERJR0VTVFwiKS52YWwoKSxcclxuXHRcdFx0XHRcdFwiWC1IVFRQLU1ldGhvZFwiOiBcIk1FUkdFXCIsXHJcblx0XHRcdFx0XHRcIklmLU1hdGNoXCI6IGl0ZW0uX19tZXRhZGF0YS5ldGFnXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0cmV0dXJuIHNlbGYuX2Rhby5wb3N0KGl0ZW0uX19tZXRhZGF0YS51cmksIHVwZGF0ZXMsIGN1c3RvbU9wdGlvbnMpO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHRcclxuXHRMaXN0LnByb3RvdHlwZS5kZWxldGVJdGVtID0gZnVuY3Rpb24oaXRlbUlkKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRyZXR1cm4gc2VsZi5nZXRJdGVtQnlJZChpdGVtSWQpLnRoZW4oZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHR2YXIgY3VzdG9tT3B0aW9ucyA9IHtcclxuXHRcdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0XHRcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb247b2RhdGE9dmVyYm9zZVwiLFxyXG5cdFx0XHRcdFx0XCJYLVJlcXVlc3REaWdlc3RcIjogJChcIiNfX1JFUVVFU1RESUdFU1RcIikudmFsKCksXHJcblx0XHRcdFx0XHRcIlgtSFRUUC1NZXRob2RcIjogXCJERUxFVEVcIixcclxuXHRcdFx0XHRcdFwiSWYtTWF0Y2hcIjogaXRlbS5fX21ldGFkYXRhLmV0YWdcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdHJldHVybiBzZWxmLl9kYW8ucG9zdChpdGVtLl9fbWV0YWRhdGEudXJpLCBcIlwiLCBjdXN0b21PcHRpb25zKTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdExpc3QucHJvdG90eXBlLmZpbmRJdGVtcyA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcclxuXHRcdC8vaWYgaXRzIGEgc3RyaW5nLCB3cmFwIGluIHNpbmdsZSBxdW90ZXNcclxuXHRcdHZhciBmaWx0ZXJWYWx1ZSA9IHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiA/IFwiJ1wiICsgdmFsdWUgKyBcIidcIiA6IHZhbHVlO1xyXG5cdFx0dmFyIG9kYXRhID0gXCIkZmlsdGVyPVwiICsga2V5ICsgXCIgZXEgXCIgKyBmaWx0ZXJWYWx1ZTtcclxuXHRcdHJldHVybiB0aGlzLmdldEl0ZW1zKG9kYXRhKTtcclxuXHR9O1xyXG5cclxuXHRMaXN0LnByb3RvdHlwZS5maW5kSXRlbSA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcclxuXHRcdHJldHVybiB0aGlzLmZpbmRJdGVtcyhrZXksIHZhbHVlKS50aGVuKGZ1bmN0aW9uKGl0ZW1zKSB7XHJcblx0XHRcdGlmIChpdGVtcyAmJiBpdGVtcy5sZW5ndGggJiYgaXRlbXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdHJldHVybiBpdGVtc1swXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdExpc3QucHJvdG90eXBlLnBlcm1pc3Npb25zID0gZnVuY3Rpb24oZW1haWwpIHtcclxuXHRcdHJldHVybiBzcC5wZXJtaXNzaW9ucyhiYXNlVXJsLCB0aGlzLl9kYW8sIGVtYWlsKTtcclxuXHR9O1xyXG5cclxuXHRzcC5MaXN0ID0gTGlzdDtcclxufSkoU1BTY3JpcHQpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTUFNjcmlwdC5MaXN0OyIsInZhciBTUFNjcmlwdCA9IHJlcXVpcmUoXCIuL3Nwc2NyaXB0XCIpO1xyXG5TUFNjcmlwdC5oZWxwZXJzID0gcmVxdWlyZShcIi4vaGVscGVyc1wiKTtcclxuXHJcbihmdW5jdGlvbihzcCkge1xyXG5cdHZhciB0cmFuc2Zvcm1zID0ge1xyXG5cdFx0cm9sZUFzc2lnbm1lbnQ6IGZ1bmN0aW9uKHJhdykge1xyXG5cdFx0XHR2YXIgcHJpdiA9IHtcclxuXHRcdFx0XHRtZW1iZXI6IHtcclxuXHRcdFx0XHRcdGxvZ2luOiByYXcuTWVtYmVyLkxvZ2luTmFtZSxcclxuXHRcdFx0XHRcdG5hbWU6IHJhdy5NZW1iZXIuVGl0bGUsXHJcblx0XHRcdFx0XHRpZDogcmF3Lk1lbWJlci5JZFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0cHJpdi5yb2xlcyA9IHJhdy5Sb2xlRGVmaW5pdGlvbkJpbmRpbmdzLnJlc3VsdHMubWFwKGZ1bmN0aW9uKHJvbGVEZWYpe1xyXG5cdFx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHRuYW1lOiByb2xlRGVmLk5hbWUsXHJcblx0XHRcdFx0XHRkZXNjcmlwdGlvbjogcm9sZURlZi5EZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdGJhc2VQZXJtaXNzaW9uczogcGVybWlzc2lvbk1hc2tUb1N0cmluZ3Mocm9sZURlZi5CYXNlUGVybWlzc2lvbnMuTG93LCByb2xlRGVmLkJhc2VQZXJtaXNzaW9ucy5IaWdoKVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gcHJpdjtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHR2YXIgcGVybWlzc2lvbk1hc2tUb1N0cmluZ3MgPSBmdW5jdGlvbihsb3dNYXNrLCBoaWdoTWFzaykge1xyXG5cdFx0dmFyIGJhc2VQZXJtaXNzaW9ucyA9IFtdO1xyXG5cdFx0c3BCYXNlUGVybWlzc2lvbnMuZm9yRWFjaChmdW5jdGlvbihiYXNlUGVybWlzc2lvbil7XHJcblx0XHRcdGlmICgoYmFzZVBlcm1pc3Npb24ubG93ICYgbG93TWFzaykgPiAwIHx8IChiYXNlUGVybWlzc2lvbi5oaWdoICYgaGlnaE1hc2spID4gMCkge1xyXG5cdFx0XHRcdGJhc2VQZXJtaXNzaW9ucy5wdXNoKGJhc2VQZXJtaXNzaW9uLm5hbWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBiYXNlUGVybWlzc2lvbnM7XHJcblx0fTtcclxuXHJcblx0dmFyIHBlcm1pc3Npb25zID0gZnVuY3Rpb24oYmFzZVVybCwgZGFvLCBlbWFpbCkge1xyXG5cdFx0aWYoIWVtYWlsKSB7XHJcblx0XHRcdHZhciB1cmwgPSBiYXNlVXJsICsgXCIvUm9sZUFzc2lnbm1lbnRzPyRleHBhbmQ9TWVtYmVyLFJvbGVEZWZpbml0aW9uQmluZGluZ3NcIjtcclxuXHRcdFx0cmV0dXJuIGRhby5nZXQodXJsKVxyXG5cdFx0XHRcdC50aGVuKHNwLmhlbHBlcnMudmFsaWRhdGVPRGF0YVYyKVxyXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHMubWFwKHRyYW5zZm9ybXMucm9sZUFzc2lnbm1lbnQpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0Ly9BbiBlbWFpbCB3YXMgcGFzc2VkIHNvIGNoZWNrIHByaXZzIG9uIHRoYXQgc3BlY2lmaWMgdXNlclxyXG5cdFx0dmFyIGNoZWNrUHJpdnMgPSBmdW5jdGlvbih1c2VyKSB7XHJcblx0XHRcdHZhciBsb2dpbiA9IGVuY29kZVVSSUNvbXBvbmVudCh1c2VyLkxvZ2luTmFtZSk7XHJcblx0XHRcdHZhciB1cmwgPSBiYXNlVXJsICsgXCIvZ2V0dXNlcmVmZmVjdGl2ZXBlcm1pc3Npb25zKEB2KT9Adj0nXCIgKyBsb2dpbiArIFwiJ1wiO1xyXG5cdFx0XHRyZXR1cm4gZGFvLmdldCh1cmwpLnRoZW4oc3AuaGVscGVycy52YWxpZGF0ZU9EYXRhVjIpO1xyXG5cdFx0fTtcclxuXHRcdHJldHVybiBkYW8ud2ViLmdldFVzZXIoZW1haWwpXHJcblx0XHRcdC50aGVuKGNoZWNrUHJpdnMpXHJcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHByaXZzKSB7XHJcblx0XHRcdFx0cmV0dXJuIHBlcm1pc3Npb25NYXNrVG9TdHJpbmdzKHByaXZzLkdldFVzZXJFZmZlY3RpdmVQZXJtaXNzaW9ucy5Mb3csIHByaXZzLkdldFVzZXJFZmZlY3RpdmVQZXJtaXNzaW9ucy5IaWdoKTtcclxuXHRcdFx0fSk7XHJcblx0fTtcclxuXHJcblx0Ly8gU2NyYXBlZCBpdCBmcm9tIFNQLlBlcm1pc3Npb25LaW5kXHJcblx0Ly8gdmFyIGJhc2VQZXJtaXNzaW9ucyA9IFtdO1xyXG5cdC8vIE9iamVjdC5rZXlzKFNQLlBlcm1pc3Npb25LaW5kKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkgeyBcclxuXHQvLyBcdHZhciBwZXJtID0gbmV3IFNQLkJhc2VQZXJtaXNzaW9ucygpO1xyXG5cdC8vICAgICBwZXJtLnNldChTUC5QZXJtaXNzaW9uS2luZFtrZXldKTtcclxuXHQvLyAgICAgdmFyIHBlcm1pc2lzb24gPSB7XHJcblx0Ly8gICAgIFx0bmFtZToga2V5LFxyXG5cdC8vICAgICBcdGxvdzogcGVybS4kQV8xLFxyXG5cdC8vICAgICBcdGhpZ2g6IHBlcm0uJDlfMVxyXG5cdC8vICAgICB9O1xyXG5cdC8vICAgICBiYXNlUGVybWlzc2lvbnMucHVzaChwZXJtaXNpc29uKTtcclxuXHQvLyB9KTtcclxuXHR2YXIgc3BCYXNlUGVybWlzc2lvbnMgPSBbICBcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiZW1wdHlNYXNrXCIsXHJcbiAgICAgIFwibG93XCI6MCxcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJ2aWV3TGlzdEl0ZW1zXCIsXHJcbiAgICAgIFwibG93XCI6MSxcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJhZGRMaXN0SXRlbXNcIixcclxuICAgICAgXCJsb3dcIjoyLFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImVkaXRMaXN0SXRlbXNcIixcclxuICAgICAgXCJsb3dcIjo0LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImRlbGV0ZUxpc3RJdGVtc1wiLFxyXG4gICAgICBcImxvd1wiOjgsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiYXBwcm92ZUl0ZW1zXCIsXHJcbiAgICAgIFwibG93XCI6MTYsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwib3Blbkl0ZW1zXCIsXHJcbiAgICAgIFwibG93XCI6MzIsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwidmlld1ZlcnNpb25zXCIsXHJcbiAgICAgIFwibG93XCI6NjQsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiZGVsZXRlVmVyc2lvbnNcIixcclxuICAgICAgXCJsb3dcIjoxMjgsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiY2FuY2VsQ2hlY2tvdXRcIixcclxuICAgICAgXCJsb3dcIjoyNTYsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwibWFuYWdlUGVyc29uYWxWaWV3c1wiLFxyXG4gICAgICBcImxvd1wiOjUxMixcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJtYW5hZ2VMaXN0c1wiLFxyXG4gICAgICBcImxvd1wiOjIwNDgsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwidmlld0Zvcm1QYWdlc1wiLFxyXG4gICAgICBcImxvd1wiOjQwOTYsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiYW5vbnltb3VzU2VhcmNoQWNjZXNzTGlzdFwiLFxyXG4gICAgICBcImxvd1wiOjgxOTIsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwib3BlblwiLFxyXG4gICAgICBcImxvd1wiOjY1NTM2LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcInZpZXdQYWdlc1wiLFxyXG4gICAgICBcImxvd1wiOjEzMTA3MixcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJhZGRBbmRDdXN0b21pemVQYWdlc1wiLFxyXG4gICAgICBcImxvd1wiOjI2MjE0NCxcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJhcHBseVRoZW1lQW5kQm9yZGVyXCIsXHJcbiAgICAgIFwibG93XCI6NTI0Mjg4LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImFwcGx5U3R5bGVTaGVldHNcIixcclxuICAgICAgXCJsb3dcIjoxMDQ4NTc2LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcInZpZXdVc2FnZURhdGFcIixcclxuICAgICAgXCJsb3dcIjoyMDk3MTUyLFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImNyZWF0ZVNTQ1NpdGVcIixcclxuICAgICAgXCJsb3dcIjo0MTk0MzA0LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcIm1hbmFnZVN1YndlYnNcIixcclxuICAgICAgXCJsb3dcIjo4Mzg4NjA4LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImNyZWF0ZUdyb3Vwc1wiLFxyXG4gICAgICBcImxvd1wiOjE2Nzc3MjE2LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcIm1hbmFnZVBlcm1pc3Npb25zXCIsXHJcbiAgICAgIFwibG93XCI6MzM1NTQ0MzIsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiYnJvd3NlRGlyZWN0b3JpZXNcIixcclxuICAgICAgXCJsb3dcIjo2NzEwODg2NCxcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJicm93c2VVc2VySW5mb1wiLFxyXG4gICAgICBcImxvd1wiOjEzNDIxNzcyOCxcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJhZGREZWxQcml2YXRlV2ViUGFydHNcIixcclxuICAgICAgXCJsb3dcIjoyNjg0MzU0NTYsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwidXBkYXRlUGVyc29uYWxXZWJQYXJ0c1wiLFxyXG4gICAgICBcImxvd1wiOjUzNjg3MDkxMixcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJtYW5hZ2VXZWJcIixcclxuICAgICAgXCJsb3dcIjoxMDczNzQxODI0LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImFub255bW91c1NlYXJjaEFjY2Vzc1dlYkxpc3RzXCIsXHJcbiAgICAgIFwibG93XCI6LTIxNDc0ODM2NDgsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwidXNlQ2xpZW50SW50ZWdyYXRpb25cIixcclxuICAgICAgXCJsb3dcIjowLFxyXG4gICAgICBcImhpZ2hcIjoxNlxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJ1c2VSZW1vdGVBUElzXCIsXHJcbiAgICAgIFwibG93XCI6MCxcclxuICAgICAgXCJoaWdoXCI6MzJcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwibWFuYWdlQWxlcnRzXCIsXHJcbiAgICAgIFwibG93XCI6MCxcclxuICAgICAgXCJoaWdoXCI6NjRcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiY3JlYXRlQWxlcnRzXCIsXHJcbiAgICAgIFwibG93XCI6MCxcclxuICAgICAgXCJoaWdoXCI6MTI4XHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImVkaXRNeVVzZXJJbmZvXCIsXHJcbiAgICAgIFwibG93XCI6MCxcclxuICAgICAgXCJoaWdoXCI6MjU2XHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImVudW1lcmF0ZVBlcm1pc3Npb25zXCIsXHJcbiAgICAgIFwibG93XCI6MCxcclxuICAgICAgXCJoaWdoXCI6MTA3Mzc0MTgyNFxyXG4gICB9XHJcbl07XHJcblxyXG5cdHNwLnBlcm1pc3Npb25zID0gcGVybWlzc2lvbnM7XHJcbn0pKFNQU2NyaXB0KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU1BTY3JpcHQucGVybWlzc2lvbnM7IiwidmFyIFNQU2NyaXB0ID0gcmVxdWlyZTsoXCIuL3Nwc2NyaXB0XCIpO1xyXG5TUFNjcmlwdC5oZWxwZXJzID0gcmVxdWlyZShcIi4vaGVscGVyc1wiKTtcclxuXHJcbihmdW5jdGlvbihzcCkge1xyXG5cdHZhciBQcm9maWxlcyA9IGZ1bmN0aW9uKGRhbykge1xyXG5cdFx0dGhpcy5fZGFvID0gZGFvO1xyXG5cdFx0dGhpcy5iYXNlVXJsID0gXCIvU1AuVXNlclByb2ZpbGVzLlBlb3BsZU1hbmFnZXJcIjtcclxuXHR9O1xyXG5cclxuXHR2YXIgdHJhbnNmb3JtUGVyc29uUHJvcGVydGllcyA9IGZ1bmN0aW9uKHByb2ZpbGUpIHtcclxuXHRcdHByb2ZpbGUuVXNlclByb2ZpbGVQcm9wZXJ0aWVzLnJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbihrZXl2YWx1ZSl7XHJcblx0XHRcdHByb2ZpbGVba2V5dmFsdWUuS2V5XSA9IGtleXZhbHVlLlZhbHVlO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gcHJvZmlsZTtcclxuXHR9O1xyXG5cclxuXHRQcm9maWxlcy5wcm90b3R5cGUuY3VycmVudCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHVybCA9IHRoaXMuYmFzZVVybCArIFwiL0dldE15UHJvcGVydGllc1wiO1xyXG5cdFx0cmV0dXJuIHRoaXMuX2Rhby5nZXQodXJsKVxyXG5cdFx0XHRcdFx0LnRoZW4oc3AuaGVscGVycy52YWxpZGF0ZU9EYXRhVjIpXHJcblx0XHRcdFx0XHQudGhlbih0cmFuc2Zvcm1QZXJzb25Qcm9wZXJ0aWVzKTtcclxuXHR9O1xyXG5cclxuXHRQcm9maWxlcy5wcm90b3R5cGUuZ2V0UHJvZmlsZSA9IGZ1bmN0aW9uKHVzZXIpIHtcclxuXHRcdHZhciBsb2dpbiA9IGVuY29kZVVSSUNvbXBvbmVudCh1c2VyLkxvZ2luTmFtZSk7XHJcblx0XHR2YXIgdXJsID0gdGhpcy5iYXNlVXJsICsgXCIvR2V0UHJvcGVydGllc0ZvcihhY2NvdW50TmFtZT1Adik/QHY9J1wiICsgbG9naW4gKyBcIidcIjtcclxuXHRcdHJldHVybiB0aGlzLl9kYW8uZ2V0KHVybClcclxuXHRcdFx0LnRoZW4oc3AuaGVscGVycy52YWxpZGF0ZU9EYXRhVjIpXHJcblx0XHRcdC50aGVuKHRyYW5zZm9ybVBlcnNvblByb3BlcnRpZXMpO1xyXG5cdH07XHJcblxyXG5cdFByb2ZpbGVzLnByb3RvdHlwZS5nZXRCeUVtYWlsID0gZnVuY3Rpb24oZW1haWwpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHJldHVybiBzZWxmLl9kYW8ud2ViLmdldFVzZXIoZW1haWwpXHJcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcclxuXHRcdFx0XHRyZXR1cm4gc2VsZi5nZXRQcm9maWxlKHVzZXIpO1xyXG5cdFx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHRzcC5Qcm9maWxlcyA9IFByb2ZpbGVzO1xyXG59KShTUFNjcmlwdCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNQU2NyaXB0LlByb2ZpbGVzOyIsIlNQU2NyaXB0ID0gcmVxdWlyZShcIi4vc3BzY3JpcHRcIik7XHJcblxyXG4oZnVuY3Rpb24oc3ApIHtcclxuXHRzcC5xdWVyeVN0cmluZyA9IHtcclxuXHRcdF9xdWVyeVN0cmluZzoge30sXHJcblx0XHRfcHJvY2Vzc2VkOiBmYWxzZSxcclxuXHJcblx0XHQvL3ByaXZhdGUgbWV0aG9kIChvbmx5IHJ1biBvbiB0aGUgZmlyc3QgJ0dldFZhbHVlJyByZXF1ZXN0KVxyXG5cdFx0X3Byb2Nlc3NRdWVyeVN0cmluZzogZnVuY3Rpb24odGV4dCkge1xyXG5cdFx0XHR2YXIgcXMgPSB0ZXh0IHx8IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyaW5nKDEpLFxyXG5cdFx0XHRcdGtleVZhbHVlLFxyXG5cdFx0XHRcdGtleVZhbHVlcyA9IHFzLnNwbGl0KCcmJyk7XHJcblxyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleVZhbHVlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGtleVZhbHVlID0ga2V5VmFsdWVzW2ldLnNwbGl0KCc9Jyk7XHJcblx0XHRcdFx0Ly90aGlzLl9xdWVyeVN0cmluZy5wdXNoKGtleVZhbHVlWzBdKTtcclxuXHRcdFx0XHR0aGlzLl9xdWVyeVN0cmluZ1trZXlWYWx1ZVswXV0gPSBkZWNvZGVVUklDb21wb25lbnQoa2V5VmFsdWVbMV0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuX3Byb2Nlc3NlZCA9IHRydWU7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vUHVibGljIE1ldGhvZHNcclxuXHRcdGNvbnRhaW5zOiBmdW5jdGlvbihrZXksIHRleHQpIHtcclxuXHRcdFx0aWYgKCF0aGlzLl9wcm9jZXNzZWQpIHtcclxuXHRcdFx0XHR0aGlzLl9wcm9jZXNzUXVlcnlTdHJpbmcodGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRoaXMuX3F1ZXJ5U3RyaW5nLmhhc093blByb3BlcnR5KGtleSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGdldFZhbHVlOiBmdW5jdGlvbihrZXksIHRleHQpIHtcclxuXHRcdFx0aWYgKCF0aGlzLl9wcm9jZXNzZWQpIHtcclxuXHRcdFx0XHR0aGlzLl9wcm9jZXNzUXVlcnlTdHJpbmcodGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29udGFpbnMoa2V5KSA/IHRoaXMuX3F1ZXJ5U3RyaW5nW2tleV0gOiBcIlwiO1xyXG5cdFx0fSxcclxuXHJcblx0XHRnZXRBbGw6IGZ1bmN0aW9uKHRleHQpIHtcclxuXHRcdFx0aWYgKCF0aGlzLl9wcm9jZXNzZWQpIHtcclxuXHRcdFx0XHR0aGlzLl9wcm9jZXNzUXVlcnlTdHJpbmcodGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRoaXMuX3F1ZXJ5U3RyaW5nO1xyXG5cdFx0fSxcclxuXHJcblx0XHRvYmplY3RUb1F1ZXJ5U3RyaW5nOiBmdW5jdGlvbihvYmosIHF1b3RlVmFsdWVzKSB7XHJcblx0XHRcdHZhciBwYXJhbXMgPSBbXTtcclxuXHRcdFx0Zm9yICh2YXIga2V5IGluIG9iaikge1xyXG5cdFx0XHRcdHZhbHVlID0gb2JqW2tleV07XHJcblx0XHRcdFx0aWYgKHZhbHVlICE9PSBudWxsKSB7XHJcblx0XHRcdFx0XHRpZiAocXVvdGVWYWx1ZXMpIHtcclxuXHRcdFx0XHRcdFx0cGFyYW1zLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj0nXCIgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpICsgXCInXCIpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cGFyYW1zLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHBhcmFtcy5qb2luKFwiJlwiKTtcclxuXHRcdH1cclxuXHR9O1xyXG59KShTUFNjcmlwdCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNQU2NyaXB0LnF1ZXJ5U3RyaW5nOyIsInZhciBTUFNjcmlwdCA9IHJlcXVpcmUoXCIuL3Nwc2NyaXB0XCIpO1xyXG5TUFNjcmlwdC5CYXNlRGFvID0gcmVxdWlyZShcIi4vYmFzZURhb1wiKTtcclxuU1BTY3JpcHQuU2VhcmNoID0gcmVxdWlyZShcIi4vc2VhcmNoXCIpO1xyXG5cclxuKGZ1bmN0aW9uKHNwKSB7XHJcblx0dmFyIFJlc3REYW8gPSBmdW5jdGlvbih1cmwpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHNwLkJhc2VEYW8uY2FsbCh0aGlzKTtcclxuXHRcdHRoaXMud2ViVXJsID0gdXJsO1xyXG5cdH07XHJcblxyXG5cdFJlc3REYW8ucHJvdG90eXBlID0gbmV3IHNwLkJhc2VEYW8oKTtcclxuXHJcblx0UmVzdERhby5wcm90b3R5cGUuZXhlY3V0ZVJlcXVlc3QgPSBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdFx0ZnVsbFVybCA9ICgvXmh0dHAvaSkudGVzdCh1cmwpID8gdXJsIDogdGhpcy53ZWJVcmwgKyBcIi9fYXBpXCIgKyB1cmwsXHJcblx0XHRcdGV4ZWN1dGVPcHRpb25zID0ge1xyXG5cdFx0XHRcdHVybDogZnVsbFVybCxcclxuXHRcdFx0XHR0eXBlOiBcIkdFVFwiLFxyXG5cdFx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHRcdFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvbjsgb2RhdGE9dmVyYm9zZVwiXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdCQuZXh0ZW5kKGV4ZWN1dGVPcHRpb25zLCBvcHRpb25zKTtcclxuXHRcdHJldHVybiAkLmFqYXgoZXhlY3V0ZU9wdGlvbnMpO1xyXG5cdH07XHJcblxyXG5cdHNwLlJlc3REYW8gPSBSZXN0RGFvO1xyXG59KShTUFNjcmlwdCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNQU2NyaXB0LlJlc3REYW87IiwiU1BTY3JpcHQgPSByZXF1aXJlKFwiLi9zcHNjcmlwdFwiKTtcclxuU1BTY3JpcHQuUmVzdERhbyA9IHJlcXVpcmUoXCIuL3Jlc3REYW9cIik7XHJcblNQU2NyaXB0LnF1ZXJ5U3RyaW5nID0gcmVxdWlyZSgnLi9xdWVyeVN0cmluZycpO1xyXG5cclxuKGZ1bmN0aW9uKHNwKSB7XHJcblx0dmFyIFNlYXJjaCA9IGZ1bmN0aW9uKHVybE9yRGFvKSB7XHJcblx0XHRpZiAodHlwZW9mIHVybE9yRGFvID09PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdHRoaXMuZGFvID0gbmV3IHNwLlJlc3REYW8odXJsT3JEYW8pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5kYW8gPSB1cmxPckRhbztcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRTZWFyY2guUXVlcnlPcHRpb25zID0gZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNvdXJjZWlkID0gbnVsbDtcclxuXHRcdHRoaXMuc3RhcnRyb3cgPSBudWxsO1xyXG5cdFx0dGhpcy5yb3dsaW1pdCA9IDMwO1xyXG5cdFx0dGhpcy5zZWxlY3RlZHByb3BlcnRpZXMgPSBudWxsO1xyXG5cdFx0dGhpcy5yZWZpbmVycyA9IG51bGw7XHJcblx0XHR0aGlzLnJlZmluZW1lbnRmaWx0ZXJzID0gbnVsbDtcclxuXHRcdHRoaXMuaGlkZGVuY29uc3RyYWludHMgPSBudWxsO1xyXG5cdFx0dGhpcy5zb3J0bGlzdCA9IG51bGw7XHJcblx0fTtcclxuXHJcblx0dmFyIGNvbnZlcnRSb3dzVG9PYmplY3RzID0gZnVuY3Rpb24oaXRlbVJvd3MpIHtcclxuXHRcdHZhciBpdGVtcyA9IFtdO1xyXG5cclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbVJvd3MubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIHJvdyA9IGl0ZW1Sb3dzW2ldLFxyXG5cdFx0XHRcdGl0ZW0gPSB7fTtcclxuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCByb3cuQ2VsbHMucmVzdWx0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGl0ZW1bcm93LkNlbGxzLnJlc3VsdHNbal0uS2V5XSA9IHJvdy5DZWxscy5yZXN1bHRzW2pdLlZhbHVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpdGVtcy5wdXNoKGl0ZW0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBpdGVtcztcclxuXHR9O1xyXG5cclxuXHQvL3NlYWxlZCBjbGFzcyB1c2VkIHRvIGZvcm1hdCByZXN1bHRzXHJcblx0dmFyIFNlYXJjaFJlc3VsdHMgPSBmdW5jdGlvbihxdWVyeVJlc3BvbnNlKSB7XHJcblx0XHR0aGlzLmVsYXBzZWRUaW1lID0gcXVlcnlSZXNwb25zZS5FbGFwc2VkVGltZTtcclxuXHRcdHRoaXMuc3VnZ2VzdGlvbiA9IHF1ZXJ5UmVzcG9uc2UuU3BlbGxpbmdTdWdnZXN0aW9uO1xyXG5cdFx0dGhpcy5yZXN1bHRzQ291bnQgPSBxdWVyeVJlc3BvbnNlLlByaW1hcnlRdWVyeVJlc3VsdC5SZWxldmFudFJlc3VsdHMuUm93Q291bnQ7XHJcblx0XHR0aGlzLnRvdGFsUmVzdWx0cyA9IHF1ZXJ5UmVzcG9uc2UuUHJpbWFyeVF1ZXJ5UmVzdWx0LlJlbGV2YW50UmVzdWx0cy5Ub3RhbFJvd3M7XHJcblx0XHR0aGlzLnRvdGFsUmVzdWx0c0luY2x1ZGluZ0R1cGxpY2F0ZXMgPSBxdWVyeVJlc3BvbnNlLlByaW1hcnlRdWVyeVJlc3VsdC5SZWxldmFudFJlc3VsdHMuVG90YWxSb3dzSW5jbHVkaW5nRHVwbGljYXRlcztcclxuXHRcdHRoaXMuaXRlbXMgPSBjb252ZXJ0Um93c1RvT2JqZWN0cyhxdWVyeVJlc3BvbnNlLlByaW1hcnlRdWVyeVJlc3VsdC5SZWxldmFudFJlc3VsdHMuVGFibGUuUm93cy5yZXN1bHRzKTtcclxuXHR9O1xyXG5cclxuXHRTZWFyY2gucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24ocXVlcnlUZXh0LCBxdWVyeU9wdGlvbnMpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdFx0b3B0aW9uc1F1ZXJ5U3RyaW5nID0gcXVlcnlPcHRpb25zICE9IG51bGwgPyBcIiZcIiArIHNwLnF1ZXJ5U3RyaW5nLm9iamVjdFRvUXVlcnlTdHJpbmcocXVlcnlPcHRpb25zLCB0cnVlKSA6IFwiXCIsXHJcblx0XHRcdGFzeW5jUmVxdWVzdCA9IG5ldyAkLkRlZmVycmVkKCk7XHJcblxyXG5cdFx0dmFyIHVybCA9IFwiL3NlYXJjaC9xdWVyeT9xdWVyeXRleHQ9J1wiICsgcXVlcnlUZXh0ICsgXCInXCIgKyBvcHRpb25zUXVlcnlTdHJpbmc7XHJcblx0XHR2YXIgZ2V0UmVxdWVzdCA9IHNlbGYuZGFvLmdldCh1cmwpO1xyXG5cclxuXHRcdGdldFJlcXVlc3QuZG9uZShmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdGlmIChkYXRhLmQgJiYgZGF0YS5kLnF1ZXJ5KSB7XHJcblx0XHRcdFx0dmFyIHJlc3VsdHMgPSBuZXcgU2VhcmNoUmVzdWx0cyhkYXRhLmQucXVlcnkpO1xyXG5cdFx0XHRcdGFzeW5jUmVxdWVzdC5yZXNvbHZlKHJlc3VsdHMpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFzeW5jUmVxdWVzdC5yZWplY3QoZGF0YSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhc3luY1JlcXVlc3QucHJvbWlzZSgpO1xyXG5cdH07XHJcblxyXG5cdFNlYXJjaC5wcm90b3R5cGUucGVvcGxlID0gZnVuY3Rpb24ocXVlcnlUZXh0LCBxdWVyeU9wdGlvbnMpIHtcclxuXHRcdHZhciBvcHRpb25zID0gcXVlcnlPcHRpb25zIHx8IHt9O1xyXG5cdFx0b3B0aW9ucy5zb3VyY2VpZCA9ICAnYjA5YTc5OTAtMDVlYS00YWY5LTgxZWYtZWRmYWIxNmM0ZTMxJztcclxuXHRcdHJldHVybiB0aGlzLnF1ZXJ5KHF1ZXJ5VGV4dCwgb3B0aW9ucyk7XHJcblx0fTtcclxuXHJcblx0c3AuU2VhcmNoID0gU2VhcmNoO1xyXG5cclxufSkoU1BTY3JpcHQpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTUFNjcmlwdC5TZWFyY2g7IiwibW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJTUFNjcmlwdCA9IHJlcXVpcmUoXCIuL3Nwc2NyaXB0XCIpO1xyXG5cclxuKGZ1bmN0aW9uKHNwKSB7XHJcblx0c3AudGVtcGxhdGluZyA9IHtcclxuXHJcblx0XHRQbGFjZWhvbGRlcjogZnVuY3Rpb24ocmF3KSB7XHJcblx0XHRcdHRoaXMucmF3ID0gcmF3O1xyXG5cdFx0XHR0aGlzLmZ1bGxQcm9wZXJ0eSA9IHJhdy5zbGljZSgyLCByYXcubGVuZ3RoIC0gMik7XHJcblx0XHR9LFxyXG5cclxuXHRcdGdldFBsYWNlSG9sZGVyczogZnVuY3Rpb24odGVtcGxhdGUsIHJlZ2V4cCkge1xyXG5cdFx0XHR2YXIgcmVnRXhwUGF0dGVybiA9IHJlZ2V4cCB8fCAvXFx7XFx7W15cXH1dK1xcfVxcfT8vZztcclxuXHRcdFx0cmV0dXJuIHRlbXBsYXRlLm1hdGNoKHJlZ0V4cFBhdHRlcm4pO1xyXG5cdFx0fSxcclxuXHJcblx0XHRnZXRPYmplY3RWYWx1ZTogZnVuY3Rpb24ob2JqLCBmdWxsUHJvcGVydHkpIHtcclxuXHRcdFx0dmFyIHZhbHVlID0gb2JqLFxyXG5cdFx0XHRcdHByb3BlcnR5Q2hhaW4gPSBmdWxsUHJvcGVydHkuc3BsaXQoJy4nKTtcclxuXHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydHlDaGFpbi5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdHZhciBwcm9wZXJ0eSA9IHByb3BlcnR5Q2hhaW5baV07XHJcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZVtwcm9wZXJ0eV0gIT0gbnVsbCA/IHZhbHVlW3Byb3BlcnR5XSA6IFwiTm90IEZvdW5kOiBcIiArIGZ1bGxQcm9wZXJ0eTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoZnVsbFByb3BlcnR5ID09PSBcIl9cIikge1xyXG5cdFx0XHRcdHZhbHVlID0gb2JqO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikgJiYgdmFsdWUuaW5kZXhPZihcIi9EYXRlKFwiKSAhPT0gLTEpIHtcclxuXHRcdFx0XHR2YXIgZGF0ZVZhbHVlID0gdmFsdWUuVVRDSnNvblRvRGF0ZSgpO1xyXG5cdFx0XHRcdHZhbHVlID0gZGF0ZVZhbHVlLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHR9LFxyXG5cclxuXHRcdHBvcHVsYXRlVGVtcGxhdGU6IGZ1bmN0aW9uKHRlbXBsYXRlLCBpdGVtLCByZWdleHApIHtcclxuXHRcdFx0dmFyIHBsYWNlaG9sZGVycyA9IHRoaXMuZ2V0UGxhY2VIb2xkZXJzKHRlbXBsYXRlLCByZWdleHApIHx8IFtdLFxyXG5cdFx0XHRcdGl0ZW1IdG1sID0gdGVtcGxhdGU7XHJcblxyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHBsYWNlaG9sZGVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdHZhciBwbGFjZWhvbGRlciA9IG5ldyB0aGlzLlBsYWNlaG9sZGVyKHBsYWNlaG9sZGVyc1tpXSk7XHJcblx0XHRcdFx0cGxhY2Vob2xkZXIudmFsID0gdGhpcy5nZXRPYmplY3RWYWx1ZShpdGVtLCBwbGFjZWhvbGRlci5mdWxsUHJvcGVydHkpO1xyXG5cdFx0XHRcdHZhciBwYXR0ZXJuID0gcGxhY2Vob2xkZXIucmF3LnJlcGxhY2UoXCJbXCIsIFwiXFxcXFtcIikucmVwbGFjZShcIl1cIiwgXCJcXFxcXVwiKTtcclxuXHRcdFx0XHR2YXIgbW9kaWZpZXIgPSBcImdcIjtcclxuXHRcdFx0XHRpdGVtSHRtbCA9IGl0ZW1IdG1sLnJlcGxhY2UobmV3IFJlZ0V4cChwYXR0ZXJuLCBtb2RpZmllciksIHBsYWNlaG9sZGVyLnZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGl0ZW1IdG1sO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdHNwLnRlbXBsYXRpbmcuRWFjaCA9IHtcclxuXHJcblx0XHRyZWdFeHA6IC9cXHtcXFtbXlxcXV0rXFxdXFx9Py9nLFxyXG5cclxuXHRcdHBvcHVsYXRlRWFjaFRlbXBsYXRlczogZnVuY3Rpb24oaXRlbUh0bWwsIGl0ZW0pIHtcclxuXHRcdFx0dmFyICRpdGVtSHRtbCA9ICQoaXRlbUh0bWwpLFxyXG5cdFx0XHRcdGVhY2hUZW1wbGF0ZXMgPSAkaXRlbUh0bWwuZmluZChcIltkYXRhLWVhY2hdXCIpO1xyXG5cclxuXHRcdFx0ZWFjaFRlbXBsYXRlcy5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBhcnJheUh0bWwgPSBcIlwiLFxyXG5cdFx0XHRcdFx0aXRlbVRlbXBsYXRlID0gJCh0aGlzKS5odG1sKCksXHJcblx0XHRcdFx0XHRhcnJheVByb3AgPSAkKHRoaXMpLmRhdGEoXCJlYWNoXCIpLFxyXG5cdFx0XHRcdFx0YXJyYXkgPSBzcC50ZW1wbGF0aW5nLmdldE9iamVjdFZhbHVlKGl0ZW0sIGFycmF5UHJvcCk7XHJcblxyXG5cdFx0XHRcdGlmIChhcnJheSAhPSBudWxsICYmICQuaXNBcnJheShhcnJheSkpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0YXJyYXlIdG1sICs9IHNwLnRlbXBsYXRpbmcucG9wdWxhdGVUZW1wbGF0ZShpdGVtVGVtcGxhdGUsIGFycmF5W2ldLCBzcC50ZW1wbGF0aW5nLkVhY2gucmVnRXhwKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdCRpdGVtSHRtbC5maW5kKCQodGhpcykpLmh0bWwoYXJyYXlIdG1sKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR2YXIgdGVtcCA9ICRpdGVtSHRtbC5jbG9uZSgpLndyYXAoXCI8ZGl2PlwiKTtcclxuXHRcdFx0cmV0dXJuIHRlbXAucGFyZW50KCkuaHRtbCgpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdHNwLnRlbXBsYXRpbmcucmVuZGVyVGVtcGxhdGUgPSBmdW5jdGlvbih0ZW1wbGF0ZSwgaXRlbSwgcmVuZGVyRWFjaFRlbXBsYXRlKSB7XHJcblx0XHR2YXIgaXRlbUh0bWwgPSBzcC50ZW1wbGF0aW5nLnBvcHVsYXRlVGVtcGxhdGUodGVtcGxhdGUsIGl0ZW0pO1xyXG5cdFx0aWYgKHJlbmRlckVhY2hUZW1wbGF0ZSkge1xyXG5cdFx0XHRpdGVtSHRtbCA9IHNwLnRlbXBsYXRpbmcuRWFjaC5wb3B1bGF0ZUVhY2hUZW1wbGF0ZXMoaXRlbUh0bWwsIGl0ZW0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGl0ZW1IdG1sO1xyXG5cdH07XHJcbn0pKFNQU2NyaXB0KTtcclxuXHJcblN0cmluZy5wcm90b3R5cGUuVVRDSnNvblRvRGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciB1dGNTdHIgPSB0aGlzLnN1YnN0cmluZyh0aGlzLmluZGV4T2YoXCIoXCIpICsgMSk7XHJcblx0dXRjU3RyID0gdXRjU3RyLnN1YnN0cmluZygwLCB1dGNTdHIuaW5kZXhPZihcIilcIikpO1xyXG5cclxuXHR2YXIgcmV0dXJuRGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KHV0Y1N0ciwgMTApKTtcclxuXHR2YXIgaG91ck9mZnNldCA9IHJldHVybkRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwO1xyXG5cdHJldHVybkRhdGUuc2V0SG91cnMocmV0dXJuRGF0ZS5nZXRIb3VycygpICsgaG91ck9mZnNldCk7XHJcblxyXG5cdHJldHVybiByZXR1cm5EYXRlO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTUFNjcmlwdC50ZW1wbGF0aW5nOyIsInZhciBTUFNjcmlwdCA9IHJlcXVpcmU7KFwiLi9zcHNjcmlwdFwiKTtcclxuU1BTY3JpcHQuaGVscGVycyA9IHJlcXVpcmUoXCIuL2hlbHBlcnNcIik7XHJcblNQU2NyaXB0LnBlcm1pc3Npb25zID0gcmVxdWlyZShcIi4vcGVybWlzc2lvbnNcIik7XHJcblxyXG4oZnVuY3Rpb24oc3ApIHtcclxuXHR2YXIgYmFzZVVybCA9IFwiL3dlYlwiO1xyXG5cdHZhciBXZWIgPSBmdW5jdGlvbihkYW8pIHtcclxuXHRcdHRoaXMuX2RhbyA9IGRhbztcclxuXHR9O1xyXG5cclxuXHRXZWIucHJvdG90eXBlLmluZm8gPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLl9kYW9cclxuXHRcdFx0LmdldChiYXNlVXJsKVxyXG5cdFx0XHQudGhlbihzcC5oZWxwZXJzLnZhbGlkYXRlT0RhdGFWMik7XHJcblx0fTtcclxuXHJcblx0V2ViLnByb3RvdHlwZS5zdWJzaXRlcyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2Rhb1xyXG5cdFx0XHQuZ2V0KGJhc2VVcmwgKyBcIi93ZWJpbmZvc1wiKVxyXG5cdFx0XHQudGhlbihzcC5oZWxwZXJzLnZhbGlkYXRlT0RhdGFWMik7XHJcblx0fTtcclxuXHJcblx0V2ViLnByb3RvdHlwZS5wZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKGVtYWlsKSB7XHJcblx0XHRyZXR1cm4gc3AucGVybWlzc2lvbnMoYmFzZVVybCwgdGhpcy5fZGFvLCBlbWFpbCk7XHJcblx0fTtcclxuXHJcblx0V2ViLnByb3RvdHlwZS5nZXRVc2VyID0gZnVuY3Rpb24oZW1haWwpIHtcclxuXHRcdHZhciB1cmwgPSBiYXNlVXJsICsgXCIvU2l0ZVVzZXJzL0dldEJ5RW1haWwoJ1wiICsgZW1haWwgKyBcIicpXCI7XHJcblx0XHRyZXR1cm4gdGhpcy5fZGFvLmdldCh1cmwpLnRoZW4oc3AuaGVscGVycy52YWxpZGF0ZU9EYXRhVjIpO1xyXG5cdH07XHJcblxyXG5cdHNwLldlYiA9IFdlYjtcclxufSkoU1BTY3JpcHQpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTUFNjcmlwdC5XZWI7Il19
