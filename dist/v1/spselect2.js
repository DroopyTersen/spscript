(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 *	@description ajax in broswer 
 *	@author liaozhongwu
 *	@params options {
 *		@key url
 *			@Class String
 *			@default ""
 *			@description request url, support url template :param and {param}
 *		@key method
 *			@Class Enum('GET', 'POST', 'PUT', 'HEAD', 'DELETE', 'PATCH')
 *			@default GET
 *			@description request method
 *		@key async
 *			@Class Boolean
 *			@default true
 *		@key data 
 *			@Class Object
 *			@default {}
 *			@description request data, append to query while method in [GET HEAD PATCH]
 *		@key format
 *			@Class Enum('form', 'json', 'formdata')
 *			@default form
 *			@description request data type, effective while method in [POST PUT DELETE]
 *		@key timeout
 *			@Class Number
 *			@description request timeout
 *    @key origin
 *			@Class Boolean
 *			@default false
 *			@description return origin response instead of body
 *		@key type  
 *			@Class Enum("", "arraybuffer", "blob", "document", "json", "text")
 *			@default json
 *			@description XMLHttpRequest.responseType
 *		@key headers
 *			@Class Object
 *			@default {}
 *			@description request headers
 *		@key before 
 *			@Class Function
 *			@description before request will be sent
 *		@key success
 *			@Class Function
 *			@description while request succeed
 *		@key error 
 *			@Class Function
 *			@description while request made mistakes
 *		@key complete
 *			@Class Function
 *			@description while request completed
 *	@params callback
 *	@return Promise
 */
 
(function () {

	// create default options
	var defaultOptions = {
		url: ''
		, method: 'GET'
		, async: true
		, data: {}
		, origin: false
		, type: "json"
		, headers: {}
	}
	,	errorInterceptors = []

	// util function
	function forEach (obj, callback) {
		if (!isFunction(callback)) return
		if (isArray(obj)) {
			if (obj.forEach) return obj.forEach(callback)
			for (var i = 0; i < obj.length; ++i) {
				callback(obj[i], i)
			}
		} 
		else if (isObject(obj)) {
			for (var key in obj) {
				obj.hasOwnProperty(key) && callback(obj[key], key)
			}
		}
	}

	function extend () {
		var n = {}
		for (var i = 0; i < arguments.length; ++i) {
			forEach(arguments[i], function (value, key) {
				n[key] = value
			})
		}
		return n
	}

	function isString (str) {
		return typeof str === 'string' || Object.prototype.toString.call(str) === '[object String]'
	}

	function isObject (obj) {
		return Object.prototype.toString.call(obj) === '[object Object]'
	}

	function isFunction (func) {
		return typeof func === 'function'
	}

	function isArray (arr) {
		if (Array.isArray) return Array.isArray(arr)
		return arr instanceof Array
	}

	function isValidMethod (method) {
		return isString(method) && /^GET|POST|PUT|HEAD|DELETE|PATCH$/.test(method.toUpperCase())
	}

	function isValidKey (key) {
		return /^url|method|async|data|format|timeout|body|type|headers|before|success|error|complete$/.test(key)
	}

	function querystring (data) {
		var search = []
		forEach(data, recursion)

		function recursion (value, key) {
			if (value === null || value === undefined || isFunction(value)) {
				search.push(encodeURIComponent(key) + "=")
			}
			else if (isObject(value)) {
				forEach(value, function (v, k) { recursion(v, key + "[" + k + "]") })
			} 
			else if (isArray(value)) {
				forEach(value, function (v) { recursion(v, key + "[]") })
			} 
			else {
				search.push(encodeURIComponent(key) + "=" + encodeURIComponent(value))
			}
		}

		return search.join("&")
	}

	function xhr () {
		if (typeof XMLHttpRequest !== 'undefined') return new XMLHttpRequest()
		if (typeof ActiveXObject !== 'undefined') return new ActiveXObject('Microsoft.XMLHTTP')
		return null
	}

 	// main funciton
	function _request () {
		var url = ''
		,	qs = ""
		, method = 'GET'
		, data = null
		, options = {}
		, callback
		, isTimeout = false
		, isFinished = false
		, err

		// handle arguments
		for (var i = 0; i < arguments.length; ++i) {
			var arg = arguments[i]
			if (isString(arg)) {
				url = arg
			} 
			else if (isObject(arg)) {
				options = arg
			} 
			else if (isFunction(arg)) {
				callback = arg
			}
		}

		// extend default options
		options = extend(defaultOptions, options)

		// get url
		isString(options.url) && (url = options.url)

		// get method
		isValidMethod(options.method) && (method = options.method.toUpperCase())

		// handle url template
	  url = url.replace(/:([^\/]+)|\{([^\/]+)\}/g, function (match, p) {return options[p] ? options[p] : p})

		// handle data
		if (method === "POST" || method === "PUT" || method === "DELETE") {
			switch (options.format) {
				case "json":
					options.headers['Content-Type'] = 'application/json;charset=UTF-8'
					data = JSON.stringify(options.data)
					break
				case "formdata":
					if (typeof FormData !== "undefined") {
						options.headers['Content-Type'] = "multipart/form-data"
						if (options.data instanceof FormData) {
							data = options.data
						} else {
							data = new FormData()
							forEach(options.data, function (value, key) {
								data.append(key, value)
							})
						}
						break
					}
				case "form":
				default:
					options.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
					qs = querystring(options.data)
					qs && (data = qs)
					break
			}
		} 
		else {
			qs = querystring(options.data)
			qs && (url += (url.indexOf('?') >= 0 ? '&' : '?') + qs)
		}

		// create XMLHttpRequest
		var http = xhr()

		// handle error
		if (http === null) {
			err = new Error("Your broswer don't support ajax!")
			isFunction(options.error) && options.error(err)
			isFunction(callback) && callback(err)
			if (typeof Promise !== "undefined") return Promise.reject(err)
			return
		}

		// open XMLHttpRequest
		http.open(method, url, options.async)

		// set request headers
		forEach(options.headers, function (value, key) {http.setRequestHeader(key, value)})

		// set response type
		options.type && (http.responseType = options.type)

		function send (resolve, reject) {

			http.onreadystatechange = function () {
				// complete
				if (http.readyState === 4 && !isTimeout) {
					isFinished = true
					var res = http.response
					http.body = http.response
					options.origin && (res = http)

					if (http.status < 400 && http.status >= 100) {
						isFunction(options.success) && options.success(res)
						isFunction(callback) && callback(null, res)
						isFunction(resolve) && resolve(res)
					} 
					else {
						err = new Error('Request Error, Response Code: ' + http.status)
						err.code = http.status
						http.error = err
						forEach(errorInterceptors, function (interceptor) {
							isFunction(interceptor) && interceptor(err, http)
						})
						isFunction(options.error) && options.error(err)
						isFunction(callback) && callback(err, res)
						isFunction(reject) && reject(err)
					}
					isFunction(options.complete) && options.complete(res)
				}
			}

			// call before send
			isFunction(options.before) && options.before()

			// set timeout
			if (options.timeout) {
				setTimeout(function () {
					if (!isFinished) {
						isTimeout = true
						err = new Error('Request Timeout, Response Code: 408')
						err.code = 408
						http.error = err
						forEach(errorInterceptors, function (interceptor) {
							isFunction(interceptor) && interceptor(err, http)
						})
						isFunction(options.error) && options.error(err)
						isFunction(callback) && callback(err, http)
						isFunction(reject) && reject(err)
						isFunction(options.complete) && options.complete(http)
					}
				}, options.timeout)
			}

			// send data
			http.send(data)
		}

		// create Promise
		if (typeof Promise !== "undefined") return new Promise(send)
		send()
	}

	function ajax () {
		return _request.apply(this, arguments)
	}

	ajax.get = function (url, data, callback) {
		return _request.call(this, {url: url, method: 'GET', data: data}, callback)
	}

	ajax.post = function (url, data, callback) {
		return _request.call(this, {url: url, method: 'POST', data: data}, callback)
	}

	ajax.setDefault = function (options) {
		defaultOptions = extend(defaultOptions, options)
		return ajax
	}

	ajax.setErrorInterceptor = function (interceptor) {
		errorInterceptors.push(interceptor)
		return ajax
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = ajax
	} else if (typeof define === "function" && define.amd) {
		define("ajax", [], function () {return ajax})
	} else {
		window.ajax = ajax
	}
})()
},{}],2:[function(require,module,exports){
/* eslint-disable no-unused-vars */
'use strict';
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],3:[function(require,module,exports){
var objAssign = require("object-assign");

var List 		= require("./list");
var Web 		= require("./web");
var Profiles 	= require("./profiles")
var Search 		= require("./search");
var fs 			= require("./filesystem");
var utils 		= require("./utils");

var Folder = fs.Folder;

var BaseDao = function() {
	var self = this;

	self.web = new Web(self);
	self.search = new Search(self);
	self.profiles = new Profiles(self);
};

BaseDao.prototype.executeRequest = function() {
	throw "Not implemented exception";
};

BaseDao.prototype.get = function(relativeQueryUrl, extendedOptions, raw) {
	var options = {
		method: "GET"
	};

	if (extendedOptions) {
		options = objAssign({}, options, extendedOptions);
	}
	return this.executeRequest(relativeQueryUrl, options);
};

BaseDao.prototype.lists = function(listname) {
	if (!listname) {
		return this.get("/web/lists").then(utils.validateODataV2);
	}
	return new List(listname, this);
};

BaseDao.prototype.post = function(relativePostUrl, body, extendedOptions) {
	var strBody = JSON.stringify(body);
	var options = {
		method: "POST",
		data: strBody,
		contentType: "application/json;odata=verbose"
	};
	options = objAssign({}, options, extendedOptions);
	return this.executeRequest(relativePostUrl, options);
};

BaseDao.prototype.getFolder = function(serverRelativeUrl) {
	if (serverRelativeUrl.charAt(0) === "/") {
		serverRelativeUrl = serverRelativeUrl.substr(1);
	}
	var url = "/web/GetFolderByServerRelativeUrl('" + serverRelativeUrl + "')?$expand=Folders,Files";

	return this.get(url).then(utils.validateODataV2).then(function(spFolder) {
		var folder = new Folder(spFolder);
		folder.populateChildren(spFolder);
		return folder;
	});
};

BaseDao.prototype.uploadFile = function(folderUrl, name, base64Binary) {
	var uploadUrl = "/web/GetFolderByServerRelativeUrl('" + folderUrl + "')/Files/Add(url='" + name + "',overwrite=true)",
		options = {
			binaryStringRequestBody: true,
			state: "Update"
		};
	return this.post(uploadUrl, base64Binary, options);
};


module.exports = BaseDao;
},{"./filesystem":5,"./list":6,"./profiles":9,"./search":12,"./utils":13,"./web":14,"object-assign":2}],4:[function(require,module,exports){
(function (global){
global.SPSelect2 = require("../plugins/SPSelect2/spselect2");
module.exports = global.SPSelect2;
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../plugins/SPSelect2/spselect2":8}],5:[function(require,module,exports){
var utils = require("./utils");

var Folder = function(spFolder) {
	var self = this;
	self.mapProperties(spFolder);
};

Folder.prototype.populateChildren = function(spFolder) {
	this.folders = spFolder.Folders.results.map(function(spFolder){
		return new Folder(spFolder);
	});
	
	this.files = spFolder.Files.results.map(function(spFile){
		return new File(spFile);
	});
};

Folder.prototype.mapProperties = function(spFolder) {
	this.name = spFolder.Name;
	this.serverRelativeUrl = spFolder.ServerRelativeUrl;
	this.itemCount = spFolder.ItemCount;
	this.guid = spFolder.UniqueId;
	this.uri = spFolder.__metadata.uri;
};

var File = function(spFile) {
	this.mapProperties(spFile);
};

File.prototype.mapProperties = function(spFile) {
	this.name = spFile.Name,
	this.title = spFile.Title,
	this.checkoutType = spFile.CheckOutType,
	this.byteLength = spFile.Length,
	this.majorVersion = spFile.MajorVersion,
	this.minorVersion = spFile.MinorVersion,
	this.serverRelativeUrl = spFile.ServerRelativeUrl,
	this.uri =  spFile.__metadata.uri
};
	

module.exports = {
	File: File,
	Folder: Folder
};
},{"./utils":13}],6:[function(require,module,exports){
var utils 			= require("./utils");
var Permissions 	= require("./permissions");
var objAssign 		= require("object-assign");

var List = function(listname, dao) {
	this.listname = listname;
	this.baseUrl = "/web/lists/getbytitle('" + listname + "')";
	this._dao = dao;
	this.permissions = new Permissions(this.baseUrl, this._dao);
};

List.prototype.getItems = function(odataQuery) {
	var query = (odataQuery != null) ? "?" + odataQuery : "";
	return this._dao
		.get(this.baseUrl + "/items" + query)
		.then(utils.validateODataV2);
};

List.prototype.getItemById = function(id, odata) {
	var url = this.baseUrl + "/items(" + id + ")";
	url += (odata != null) ? "?" + odata : "";
	return this._dao.get(url).then(utils.validateODataV2);
};

List.prototype.info = function() {
	return this._dao.get(this.baseUrl).then(utils.validateODataV2);
};

List.prototype.addItem = function(item) {
	var self = this;
	return self._dao.get(self.baseUrl).then(function(data) {
		item = objAssign({}, {
			"__metadata": {
				"type": data.d.ListItemEntityTypeFullName
			}
		}, item);

		var customOptions = {
			headers: {
				"Accept": utils.acceptHeader,
				"X-RequestDigest": utils.getRequestDigest()
			}
		};

		return self._dao.post(baseUrl + "/items", item, customOptions)
			.then(utils.validateODataV2);
	});
};

List.prototype.updateItem = function(itemId, updates) {
	var self = this;
	return self.getItemById(itemId).then(function(item) {
		updates = objAssign({}, {
			"__metadata": {
				"type": item.__metadata.type
			}
		}, updates);

		var customOptions = {
			headers: {
				"Accept": utils.acceptHeader,
				"X-RequestDigest": utils.getRequestDigest(),
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
				"Accept": utils.acceptHeader,
				"X-RequestDigest": utils.getRequestDigest(),
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

module.exports = List;
},{"./permissions":7,"./utils":13,"object-assign":2}],7:[function(require,module,exports){
var utils = require("./utils");

var Permissions = function(baseUrl, dao) {
   this._dao = dao;
   this.baseUrl = baseUrl
};

Permissions.prototype.getRoleAssignments = function() {
   var url = baseUrl + "/RoleAssignments?$expand=Member,RoleDefinitionBindings";
   return dao.get(url)
      .then(utils.validateODataV2)
      .then(function(results) {
         return results.map(transforms.roleAssignment);
      });
};

Permissions.prototype.check = function(email) {
   var self = this;
   var checkPrivs = function(user) {
      var login = encodeURIComponent(user.LoginName);
      var url = self.baseUrl + "/getusereffectivepermissions(@v)?@v='" + login + "'";
      return self._dao.get(url).then(utils.validateODataV2);
   };

   // If no email is passed, then get current user, else get user by email
   var req = !email ? self._dao.get('/web/getuserbyid(' + _spPageContextInfo.userId + ')').then(function(data) {
      return data.d
   }) : self._dao.web.getUser(email)

   return req.then(checkPrivs)
      .then(function(privs) {
         return permissionMaskToStrings(privs.GetUserEffectivePermissions.Low, privs.GetUserEffectivePermissions.High);
      });
}

var transforms = {
   roleAssignment: function(raw) {
      var priv = {
         member: {
            login: raw.Member.LoginName,
            name: raw.Member.Title,
            id: raw.Member.Id
         }
      };
      priv.roles = raw.RoleDefinitionBindings.results.map(function(roleDef) {
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
   spBasePermissions.forEach(function(basePermission) {
      if ((basePermission.low & lowMask) > 0 || (basePermission.high & highMask) > 0) {
         basePermissions.push(basePermission.name);
      }
   });
   return basePermissions;
};

// Scraped it from SP.PermissionKind. 
// Storing it in here to remove sp.js dependency

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

var spBasePermissions = [{
   "name": "emptyMask",
   "low": 0,
   "high": 0
}, {
   "name": "viewListItems",
   "low": 1,
   "high": 0
}, {
   "name": "addListItems",
   "low": 2,
   "high": 0
}, {
   "name": "editListItems",
   "low": 4,
   "high": 0
}, {
   "name": "deleteListItems",
   "low": 8,
   "high": 0
}, {
   "name": "approveItems",
   "low": 16,
   "high": 0
}, {
   "name": "openItems",
   "low": 32,
   "high": 0
}, {
   "name": "viewVersions",
   "low": 64,
   "high": 0
}, {
   "name": "deleteVersions",
   "low": 128,
   "high": 0
}, {
   "name": "cancelCheckout",
   "low": 256,
   "high": 0
}, {
   "name": "managePersonalViews",
   "low": 512,
   "high": 0
}, {
   "name": "manageLists",
   "low": 2048,
   "high": 0
}, {
   "name": "viewFormPages",
   "low": 4096,
   "high": 0
}, {
   "name": "anonymousSearchAccessList",
   "low": 8192,
   "high": 0
}, {
   "name": "open",
   "low": 65536,
   "high": 0
}, {
   "name": "viewPages",
   "low": 131072,
   "high": 0
}, {
   "name": "addAndCustomizePages",
   "low": 262144,
   "high": 0
}, {
   "name": "applyThemeAndBorder",
   "low": 524288,
   "high": 0
}, {
   "name": "applyStyleSheets",
   "low": 1048576,
   "high": 0
}, {
   "name": "viewUsageData",
   "low": 2097152,
   "high": 0
}, {
   "name": "createSSCSite",
   "low": 4194304,
   "high": 0
}, {
   "name": "manageSubwebs",
   "low": 8388608,
   "high": 0
}, {
   "name": "createGroups",
   "low": 16777216,
   "high": 0
}, {
   "name": "managePermissions",
   "low": 33554432,
   "high": 0
}, {
   "name": "browseDirectories",
   "low": 67108864,
   "high": 0
}, {
   "name": "browseUserInfo",
   "low": 134217728,
   "high": 0
}, {
   "name": "addDelPrivateWebParts",
   "low": 268435456,
   "high": 0
}, {
   "name": "updatePersonalWebParts",
   "low": 536870912,
   "high": 0
}, {
   "name": "manageWeb",
   "low": 1073741824,
   "high": 0
}, {
   "name": "anonymousSearchAccessWebLists",
   "low": -2147483648,
   "high": 0
}, {
   "name": "useClientIntegration",
   "low": 0,
   "high": 16
}, {
   "name": "useRemoteAPIs",
   "low": 0,
   "high": 32
}, {
   "name": "manageAlerts",
   "low": 0,
   "high": 64
}, {
   "name": "createAlerts",
   "low": 0,
   "high": 128
}, {
   "name": "editMyUserInfo",
   "low": 0,
   "high": 256
}, {
   "name": "enumeratePermissions",
   "low": 0,
   "high": 1073741824
}];

module.exports = Permissions; 
},{"./utils":13}],8:[function(require,module,exports){
var RestDao = require("../../restDao");

var handleError  = function(message) {
	alert(message);
};

var init = function(field, list) {
	
	var head = document.getElementsByTagName("head")[0];
	if (!window.jQuery) {
		var script = document.createElement("script");
		script.setAttribute("src", "//code.jquery.com/jquery-2.1.4.min.js");
		script.setAttribute("type", "text/javascript");
		head.appendChild(script);
	}

	//add select 2 css
	var link = document.createElement("link");
	link.setAttribute("rel", "stylesheet");
	link.setAttribute("type", "text/css");
	link.setAttribute("href", "//cdnjs.cloudflare.com/ajax/libs/select2/4.0.0/css/select2.min.css");
	head.appendChild(link);

	var registerDropdownTemplate = function(field) {
		var overrides = {};
		overrides.Templates = { Fields: {} };
		overrides.Templates.Fields[field] = { 
			'EditForm': convertToSelect2,
			'NewForm': convertToSelect2
		};

		// Register the rendering template
		SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrides);
	};

	var convertToSelect2 = function(ctx) {
		var fieldCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
		console.log(fieldCtx);
		var url = fieldCtx.webAttributes.WebUrl;
		var dao = new RestDao(url);
		var isMultple = fieldCtx.fieldSchema.FieldType === "LookupMulti" ? "multiple='multple'" : "";
		var dropdownHtml = "<select id='" + fieldCtx.fieldName + "' " +  isMultple + "class='ms-long' name='" + fieldCtx.fieldName + "'><option value=''></option></select>";
		var selector = "[name='" + fieldCtx.fieldName + "']";

		fieldCtx.registerGetValueCallback(fieldCtx.fieldName, function() {
			var value = $(selector).val();
			if (fieldCtx.fieldSchema.FieldType === "LookupMulti") {
				value = value.join(";#");
			}
			return value;
		});

		$(document).ready(function(){
			$.getScript("//cdnjs.cloudflare.com/ajax/libs/select2/4.0.0/js/select2.min.js").then(function(){
				$(selector).select2({
					minimumInputLength: 1,
					placeholder: "Begin typing...",
					ajax: {
						delay: 150,
						url: "",
						data: function(params) {
							return {
								q: params.term
							};
						},
						processResults: function(items) {
							var results = items.map(function(item){
								return {
									id: item.Id + ";#" + item.Title,
									text: item.Title
								};
							});
							return { results: results };
						},
						cache: true,
						transport: function(params, success, failure) {
							var search = params.data.q || "";
							var odata = "$top=10&$select=Title, Id&$filter=substringof('" + search + "', Title)";
							dao.lists(list).getItems(odata).then(function(items){
								success(items);
							}, failure);
						}
					},
				});
			});
		});
		return dropdownHtml;
	};
	
	registerDropdownTemplate(field);
};
   
exports.init = init;
},{"../../restDao":11}],9:[function(require,module,exports){
var utils = require("./utils");

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
				.then(utils.validateODataV2)
				.then(transformPersonProperties);
};

Profiles.prototype.setProperty = function(userOrEmail, key, value) {
	var self = this;
	var url = this.baseUrl + "/SetSingleValueProfileProperty";
	var args = {
		propertyName: key,
		propertyValue: value,
	};
	var customOptions = {
		headers: {
			"Accept": utils.acceptHeader,
			"X-RequestDigest": utils.getRequestDigest()
		}
	};

	// if a string is passed, assume its an email address
	if (typeof userOrEmail === "string") {
		return self.getByEmail(userOrEmail).then(function(user){
			args.accountName = user.AccountName;
			return self._dao.post(url, args, customOptions);
		})
	} else {
		args.accountName = userOrEmail.LoginName || userOrEmail.AccountName;
		return self._dao.post(url, args, customOptions);
	}
};

Profiles.prototype.getProfile = function(user) {
	var login = encodeURIComponent(user.LoginName);
	var url = this.baseUrl + "/GetPropertiesFor(accountName=@v)?@v='" + login + "'";
	return this._dao.get(url)
		.then(utils.validateODataV2)
		.then(transformPersonProperties);
};

Profiles.prototype.getByEmail = function(email) {
	var self = this;
	return self._dao.web.getUser(email)
		.then(function(user) {
			return self.getProfile(user);
		});
};

module.exports = Profiles;
},{"./utils":13}],10:[function(require,module,exports){
var queryString = {
	_queryString: {},
	_processed: false,

	//private method (only run on the first 'GetValue' request)
	_processQueryString: function(text) {
		if (text || window.location.search) {
			var qs = text || window.location.search.substring(1),
				keyValue,
				keyValues = qs.split('&');

			for (var i = 0; i < keyValues.length; i++) {
				keyValue = keyValues[i].split('=');
				//this._queryString.push(keyValue[0]);
				this._queryString[keyValue[0]] = decodeURIComponent(keyValue[1].replace(/\+/g, " "));
			}
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

module.exports = queryString;
},{}],11:[function(require,module,exports){
var BaseDao = require("./baseDao");
var objAssign = require("object-assign");
var ajax = require('client-ajax') 

var RestDao = function(url) {
	var self = this;
	BaseDao.call(this);
	this.webUrl = url || _spPageContextInfo.webAbsoluteUrl;
};

RestDao.prototype = new BaseDao();

RestDao.prototype.executeRequest = function(url, options) {
	var self = this;
	var fullUrl = (/^http/i).test(url) ? url : this.webUrl + "/_api" + url;

	var executeOptions = {
		url: fullUrl,
		method: "GET",
		headers: {
			"Accept": "application/json; odata=verbose"
		}
	};

	executeOptions = objAssign({}, executeOptions, options);
	return ajax(executeOptions);
};


module.exports = RestDao;
},{"./baseDao":3,"client-ajax":1,"object-assign":2}],12:[function(require,module,exports){
var queryString = require('./queryString');

var Search = function(dao) {
	this._dao = dao;
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
	this.refiners = queryResponse.PrimaryQueryResult.RefinementResults ? MapRefiners(queryResponse.PrimaryQueryResult.RefinementResults.Refiners.results) : null;
};

var MapRefiners = function(refinerResults) {
	var refiners = [];

	for (var i = 0; i < refinerResults.length; i++) {
		var entry = {};
		entry.RefinerName = refinerResults[i].Name;
		entry.RefinerOptions = refinerResults[i].Entries.results;

		refiners.push(entry);
	}

	return refiners;
};

Search.prototype.query = function(queryText, queryOptions) {
	var self = this;
	var optionsQueryString = queryOptions != null ? "&" + queryString.objectToQueryString(queryOptions, true) : "";

	var url = "/search/query?querytext='" + queryText + "'" + optionsQueryString;
	return self._dao.get(url).then(function(data) {
		if (data.d && data.d.query) {
			return new SearchResults(data.d.query);
		}
		throw new Error("Invalid response back from search service");
	});
};

Search.prototype.people = function(queryText, queryOptions) {
	var options = queryOptions || {};
	options.sourceid = 'b09a7990-05ea-4af9-81ef-edfab16c4e31';
	return this.query(queryText, options);
};


module.exports = Search;
},{"./queryString":10}],13:[function(require,module,exports){
var getRequestDigest = exports.getRequestDigest = function() {
	return document.querySelector("#__REQUESTDIGEST").value
};
var acceptHeader = exports.acceptHeader = "application/json;odata=verbose";

var validateODataV2 = exports.validateODataV2= function(data) {
	var results = data;
	if (data.d && data.d.results && data.d.results.length != null) {
		results = data.d.results;
	} else if (data.d) {
		results = data.d;
	}
	return results;
};

var validateCrossDomainODataV2 = exports.validateCrossDomainODataV2 = function(response) {
	var data = $.parseJSON(response.body);
	helpers.validateODataV2(data);
};

//'Borrowed' from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
var arrayFromBitMask = exports.arrayFromBitMask = function(nMask) {
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

var waitForLibraries = exports.waitForLibraries = function(namespaces, cb) {
	var missing = namespaces.filter(function(namespace) {
		return !validateNamespace(namespace);
	});

	if (missing.length === 0) {
		cb();
	} else {
		setTimeout(function() {
			waitForLibraries(namespaces, cb);
		}, 25);
	}
};

var waitForLibrary = exports.waitForLibrary = function(namespace, cb) {
	return waitForLibraries([namespace], cb);
};

var validateNamespace = exports.validateNamespace = function(namespace) {
	var scope = window;
	var sections = namespace.split(".");
	var sectionsLength = sections.length;
	for (var i = 0; i < sectionsLength; i++) {
		var prop = sections[i];
		if (prop in scope) {
			scope = scope[prop]
		} else {
			return false;
		}
	}
	return true;
};
},{}],14:[function(require,module,exports){
var utils = require("./utils");
var Permissions = require("./permissions");
var objAssign = require("object-assign");

var Web = function(dao) {
	this._dao = dao;
	this.baseUrl = "/web";
	this.permissions = new Permissions(this.baseUrl, this._dao);
};

Web.prototype.info = function() {
	return this._dao
		.get(this.baseUrl)
		.then(utils.validateODataV2);
};

Web.prototype.subsites = function() {
	return this._dao
		.get(this.baseUrl + "/webinfos")
		.then(utils.validateODataV2);
};

Web.prototype.getRequestDigest = function() {
	var url = "/contextinfo";
	var options = {
		headers: {
			"Accept": "application/json;odata=verbose",
			"Content-Type": "application/json;odata=verbose"
			//"Content-Length": "255",
		}
	};
	return this._dao.post(url, {}, options).then(function(data) {
		return data.d.GetContextWebInformation.FormDigestValue;
	});
};

Web.prototype.copyFile = function(sourceUrl, destinationUrl, digest) {
	var self = this;
	if (digest) return self._copyFileWithDigest(sourceUrl, destinationUrl, digest);

	self.getRequestDigest().then(function(requestDigest) {
		return self._copyFileWithDigest(sourceUrl, destinationUrl, requestDigest)
	});
};

Web.prototype.deleteFile = function(sourceUrl, digest) {
	var self = this;
	if (digest) return self._deleteFileWithDigest(sourceUrl, digest);

	self.getRequestDigest().then(function(requestDigest) {
		return self._deleteFileWithDigest(sourceUrl, requestDigest)
	});
};

var headers = {
			"Accept": "application/json;odata=verbose",
			"Content-Type": "application/json;odata=verbose"
};

Web.prototype._deleteFileWithDigest = function(sourceUrl, requestDigest) {
	var url = "/web/getfilebyserverrelativeurl(@url)/?@Url='" + sourceUrl + "'";
	var options = {
		headers: objAssign({}, headers, { 
			"X-HTTP-Method": "DELETE",
			"X-RequestDigest": requestDigest
	 	})
	};
	return this._dao.post(url, {}, options);
}; 

Web.prototype._copyFileWithDigest = function(sourceUrl, destinationUrl, requestDigest) {
	var url = "/web/getfilebyserverrelativeurl(@url)/CopyTo?@Url='" + sourceUrl + "'&strNewUrl='" + destinationUrl + "'&bOverWrite='true'";
	var options = {
		headers: objAssign({}, headers, { "X-RequestDigest": requestDigest })
	}
	return this._dao.post(url, {}, options);
};


Web.prototype.getUser = function(email) {
	var url = baseUrl + "/SiteUsers/GetByEmail('" + email + "')";
	return this._dao.get(url).then(utils.validateODataV2);
};

module.exports = Web;
},{"./permissions":7,"./utils":13,"object-assign":2}]},{},[4])