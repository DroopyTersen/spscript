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

SPScript = window.SPScript || {};

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
			.then(checkPrivs, function() { return []; })
			.then(function(privs) {
				return permissionMaskToStrings(privs.GetUserEffectivePermissions.Low, privs.GetUserEffectivePermissions.High);
			}).fail(function() {
				throw "User not found";
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

	List.prototype.permissions = function(email) {
		return sp.permissions(baseUrl, this._dao, email);
	};

	sp.List = List;
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

	Web.prototype.permissions = function(email) {
		return sp.permissions(baseUrl, this._dao, email);
	};

	var fail = function() {
		console.log("uh oh");
		return null;
	};
	Web.prototype.getUser = function(email) {
		var url = baseUrl + "/SiteUsers/GetByEmail('" + email + "')";
		return this._dao.get(url).then(sp.helpers.validateODataV2);
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
