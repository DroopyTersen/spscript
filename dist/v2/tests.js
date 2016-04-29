/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var RestDao = __webpack_require__(6);

	mocha.setup('bdd');
	chai.should();

	var url = _spPageContextInfo.webAbsoluteUrl;
	var dao = new RestDao(url);

	describe("var dao = new SPScript.RestDao(_spPageContextInfo.webAbsoluteUrl)", function () {
	    it("Should create the primary Data Access Objec (DAO) you use to interact with the site", function () {
	        dao.should.not.be.null;
	        dao.should.have.property("web");
	        dao.should.have.property("lists");
	    });
	});

	var webTests = __webpack_require__(22);
	webTests.run(dao);

	var listTests = __webpack_require__(24);
	listTests.run(dao);

	// var searchTests = require("./searchTests");
	// searchTests.run(dao);

	// var profileTests = require("./profileTests");
	// profileTests.run(dao);

	// var queryStringTests = require("./queryStringTests");
	// queryStringTests.run();

	mocha.run();

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var BaseDao = __webpack_require__(7);
	var ajax = __webpack_require__(20);

	var RestDao = function RestDao(url) {
		var self = this;
		BaseDao.call(this);
		this.webUrl = url || _spPageContextInfo.webAbsoluteUrl;
	};

	RestDao.prototype = new BaseDao();

	RestDao.prototype.executeRequest = function (url, options) {
		var fullUrl = /^http/i.test(url) ? url : this.webUrl + "/_api" + url;

		var defaultOptions = {
			url: fullUrl,
			method: "GET",
			headers: {
				"Accept": "application/json; odata=verbose",
				"Content-Type": "application/json; odata=verbose"
			}
		};

		var ajaxOptions = Object.assign({}, defaultOptions, options);
		return ajax(ajaxOptions);
	};

	module.exports = RestDao;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var List = __webpack_require__(8);
	var Web = __webpack_require__(12);
	var Profiles = __webpack_require__(14);
	var Search = __webpack_require__(15);
	var utils = __webpack_require__(9);

	var BaseDao = function BaseDao() {
		this.web = new Web(this);
		this.search = new Search(this);
		this.profiles = new Profiles(this);
	};

	BaseDao.prototype.executeRequest = function () {
		throw "Not implemented exception";
	};

	BaseDao.prototype.getRequestDigest = function () {
		return this.web.getRequestDigest();
	};

	BaseDao.prototype.get = function (relativeQueryUrl, extendedOptions) {
		var options = Object.assign({}, {
			method: "GET"
		}, extendedOptions);
		return this.executeRequest(relativeQueryUrl, options);
	};

	BaseDao.prototype.lists = function (listname) {
		if (!listname) {
			return this.get("/web/lists").then(utils.validateODataV2);
		}
		return new List(listname, this);
	};

	BaseDao.prototype.post = function (relativePostUrl, body, extendedOptions) {
		var strBody = JSON.stringify(body);
		var options = {
			method: "POST",
			data: strBody,
			contentType: "application/json;odata=verbose"
		};
		options = Object.assign({}, options, extendedOptions);
		return this.executeRequest(relativePostUrl, options);
	};

	module.exports = BaseDao;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var utils = __webpack_require__(9);
	var Permissions = __webpack_require__(10);
	var headers = __webpack_require__(11);

	var List = function List(listname, dao) {
		this.listname = listname;
		this.baseUrl = "/web/lists/getbytitle('" + listname + "')";
		this._dao = dao;
		this.permissions = new Permissions(this.baseUrl, this._dao);
	};

	List.prototype.getItems = function (odataQuery) {
		return this._dao.get(this.baseUrl + "/items" + appendOData(odataQuery)).then(utils.validateODataV2);
	};

	List.prototype.getItemById = function (id, odata) {
		var url = this.baseUrl + "/items(" + id + ")" + appendOData(odata);
		return this._dao.get(url).then(utils.validateODataV2);
	};

	List.prototype.info = function () {
		return this._dao.get(this.baseUrl).then(utils.validateODataV2);
	};

	List.prototype.addItem = function (item, requestDigest) {
		var _this = this;

		if (requestDigest) return this._addItem(item, requestDigest);

		return this._dao.getRequestDigest().then(function (requestDigest) {
			return _this._addItem(item, requestDigest);
		});
	};

	List.prototype._addItem = function (item, requestDigest) {
		var _this2 = this;

		return this._dao.get(this.baseUrl).then(function (data) {

			//decorate the item with the 'type' metadata
			item = Object.assign({}, {
				"__metadata": {
					"type": data.d.ListItemEntityTypeFullName
				}
			}, item);

			var customOptions = {
				headers: headers.getAddHeaders(requestDigest)
			};
			return _this2._dao.post(_this2.baseUrl + "/items", item, customOptions);
		}).then(utils.validateODataV2);
	};

	List.prototype.updateItem = function (item, updates, requestDigest) {
		var _this3 = this;

		if (requestDigest) return this._updateItem(item, updates, requestDigest);

		return this._dao.getRequestDigest().then(function (requestDigest) {
			return _this3._updateItem(item, updates, requestDigest);
		});
	};

	List.prototype._updateItem = function (itemId, updates, digest) {
		var _this4 = this;

		return this.getItemById(itemId).then(function (item) {
			//decorate the item with the 'type' metadata
			updates = Object.assign({}, {
				"__metadata": {
					"type": item.__metadata.type
				}
			}, updates);

			var customOptions = {
				headers: headers.getUpdateHeaders(digest, item.__metadata.etag)
			};

			return _this4._dao.post(item.__metadata.uri, updates, customOptions);
		});
	};

	List.prototype.deleteItem = function (itemId, requestDigest) {
		var _this5 = this;

		if (requestDigest) return this._deleteItem(itemId, requestDigest);

		return this._dao.getRequestDigest().then(function (requestDigest) {
			return _this5._deleteItem(itemId, requestDigest);
		});
	};

	List.prototype._deleteItem = function (itemId, digest) {
		var _this6 = this;

		return this.getItemById(itemId).then(function (item) {
			var customOptions = {
				headers: headers.getDeleteHeaders(digest, item.__metadata.etag)
			};
			return _this6._dao.post(item.__metadata.uri, "", customOptions);
		});
	};

	List.prototype.findItems = function (key, value, extraOData) {
		//if its a string, wrap in single quotes
		var filterValue = typeof value === "string" ? "'" + value + "'" : value;
		var odata = "$filter=" + key + " eq " + filterValue + appendOData(extraOData, "&");

		return this.getItems(odata);
	};

	List.prototype.findItem = function (key, value, odata) {
		return this.findItems(key, value, odata).then(function (items) {
			if (items && items.length && items.length > 0) {
				return items[0];
			}
			return null;
		});
	};

	var appendOData = function appendOData(odata, prefix) {
		prefix = prefix || "?";
		if (odata) return prefix + odata;
		return "";
	};

	module.exports = List;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	var getRequestDigest = exports.getRequestDigest = function () {
		return document.querySelector("#__REQUESTDIGEST").value;
	};
	var acceptHeader = exports.acceptHeader = "application/json;odata=verbose";

	var validateODataV2 = exports.validateODataV2 = function (data) {
		if (typeof data === "string") {
			data = JSON.parse(data);
		}
		var results = data;
		if (data.d && data.d.results && data.d.results.length != null) {
			results = data.d.results;
		} else if (data.d) {
			results = data.d;
		}
		return results;
	};

	//'Borrowed' from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
	var arrayFromBitMask = exports.arrayFromBitMask = function (nMask) {
		// nMask must be between -2147483648 and 2147483647
		if (typeof nMask === "string") {
			nMask = parseInt(nMask);
		}
		// if (nMask > 0x7fffffff || nMask < -0x80000000) {
		// 	throw new TypeError("arrayFromMask - out of range");
		// }
		for (var nShifted = nMask, aFromMask = []; nShifted; aFromMask.push(Boolean(nShifted & 1)), nShifted >>>= 1) {}
		return aFromMask;
	};

	var waitForLibraries = exports.waitForLibraries = function (namespaces, cb) {
		return new Promise(function (deferred) {
			var missing = namespaces.filter(function (namespace) {
				return !validateNamespace(namespace);
			});

			if (missing.length === 0) {
				if (cb) cb();
				deferred.resolve();
			} else setTimeout(function () {
				return waitForLibraries(namespaces, cb);
			}, 25);
		});
	};

	var waitForLibrary = exports.waitForLibrary = function (namespace, cb) {
		return waitForLibraries([namespace], cb);
	};

	var validateNamespace = exports.validateNamespace = function (namespace) {
		var scope = window;
		var sections = namespace.split(".");
		var sectionsLength = sections.length;
		for (var i = 0; i < sectionsLength; i++) {
			var prop = sections[i];
			if (prop in scope) {
				scope = scope[prop];
			} else {
				return false;
			}
		}
		return true;
	};

	var getScript = exports.getScript = function (url, namespace) {
		var scriptTag = window.document.createElement("script");
		scriptTag.type = 'text/javascript';
		scriptTag.src = url;
		window.document.querySelector("head").appendChild(scriptTag);

		if (namespace) {
			return waitForLibrary(namespace);
		}
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var utils = __webpack_require__(9);

	var Permissions = function Permissions(baseUrl, dao) {
	   this._dao = dao;
	   this.baseUrl = baseUrl;
	};

	Permissions.prototype.getRoleAssignments = function () {
	   var url = this.baseUrl + "/RoleAssignments?$expand=Member,RoleDefinitionBindings";
	   return this._dao.get(url).then(utils.validateODataV2).then(function (results) {
	      return results.map(transforms.roleAssignment);
	   });
	};

	Permissions.prototype.check = function (email) {
	   var _this = this;

	   var checkPrivs = function checkPrivs(user) {
	      var login = encodeURIComponent(user.LoginName);
	      var url = _this.baseUrl + "/getusereffectivepermissions(@v)?@v='" + login + "'";
	      return _this._dao.get(url).then(utils.validateODataV2);
	   };

	   // If no email is passed, then get current user, else get user by email
	   var req = !email ? this._dao.get('/web/getuserbyid(' + _spPageContextInfo.userId + ')').then(function (data) {
	      return data.d;
	   }) : this._dao.web.getUser(email);

	   return req.then(checkPrivs).then(function (privs) {
	      return permissionMaskToStrings(privs.GetUserEffectivePermissions.Low, privs.GetUserEffectivePermissions.High);
	   });
	};

	var transforms = {
	   roleAssignment: function roleAssignment(raw) {
	      var priv = {
	         member: {
	            login: raw.Member.LoginName,
	            name: raw.Member.Title,
	            id: raw.Member.Id
	         }
	      };
	      priv.roles = raw.RoleDefinitionBindings.results.map(function (roleDef) {
	         return {
	            name: roleDef.Name,
	            description: roleDef.Description,
	            basePermissions: permissionMaskToStrings(roleDef.BasePermissions.Low, roleDef.BasePermissions.High)
	         };
	      });
	      return priv;
	   }
	};

	var permissionMaskToStrings = function permissionMaskToStrings(lowMask, highMask) {
	   var basePermissions = [];
	   spBasePermissions.forEach(function (basePermission) {
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

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var utils = __webpack_require__(9);

	var getStandardHeaders = exports.getStandardHeaders = function (digest) {
		var headers = {
			"Accept": utils.acceptHeader,
			"Content-Type": utils.acceptHeader
		};
		if (digest) headers["X-RequestDigest"] = digest;
		return headers;
	};

	exports.getAddHeaders = getStandardHeaders;

	var getActionHeaders = function getActionHeaders(verb, digest) {
		return Object.assign({}, getStandardHeaders(digest), { "X-HTTP-Method": verb });
	};

	var decorateETag = function decorateETag(headers, etag) {
		if (etag) headers["If-Match"] = etag;
		return headers;
	};

	exports.getUpdateHeaders = function (digest, etag) {
		return decorateETag(getActionHeaders("MERGE", digest), etag);
	};
	exports.getDeleteHeaders = function (digest, etag) {
		return decorateETag(getActionHeaders("DELETE", digest), etag);
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var utils = __webpack_require__(9);
	var Permissions = __webpack_require__(10);
	var headers = __webpack_require__(11);
	var Folder = __webpack_require__(13).Folder;

	var Web = function Web(dao) {
		this._dao = dao;
		this.baseUrl = "/web";
		this.permissions = new Permissions(this.baseUrl, this._dao);
	};

	Web.prototype.info = function () {
		return this._dao.get(this.baseUrl).then(utils.validateODataV2);
	};

	Web.prototype.subsites = function () {
		return this._dao.get(this.baseUrl + "/webinfos").then(utils.validateODataV2);
	};

	Web.prototype.getRequestDigest = function () {
		return this._dao.post('/contextinfo', {}).then(function (data) {
			return data.d.GetContextWebInformation.FormDigestValue;
		});
	};

	Web.prototype.getFolder = function (serverRelativeUrl) {
		//remove leading slash
		if (serverRelativeUrl.charAt(0) === "/") {
			serverRelativeUrl = serverRelativeUrl.substr(1);
		}
		var url = "/web/GetFolderByServerRelativeUrl('" + serverRelativeUrl + "')?$expand=Folders,Files";

		return this._dao.get(url).then(utils.validateODataV2).then(function (spFolder) {
			var folder = new Folder(spFolder);
			folder.populateChildren(spFolder);
			return folder;
		});
	};

	// Web.prototype.uploadFile = function(folderUrl, name, base64Binary, digest) {
	// 	if (digest) return this._uploadFile(folderUrl, name, base64Binary, digest);
	// 	return this.getRequestDigest().then(digest => this._uploadFile(folderUrl, name, base64Binary, digest));
	// }

	// //TODO: Fix this. Its from v0.0 and never worked
	// Web.prototype._uploadFile = function(folderUrl, name, base64Binary, digest) {
	// 	var uploadUrl = "/web/GetFolderByServerRelativeUrl('" + folderUrl + "')/Files/Add(url='" + name + "',overwrite=true)";
	// 	var options = {
	// 			binaryStringRequestBody: true,
	// 			state: "Update"
	// 	};
	// 	return this.post(uploadUrl, base64Binary, options);
	// };

	Web.prototype.getFile = function (url) {
		var url = "/web/getfilebyserverrelativeurl('" + url + "')";
		return this._dao.get(url).then(utils.validateODataV2);
	};

	Web.prototype.copyFile = function (sourceUrl, destinationUrl, digest) {
		var _this = this;

		if (digest) return this._copyFile(sourceUrl, destinationUrl, digest);

		return this.getRequestDigest().then(function (requestDigest) {
			return _this._copyFile(sourceUrl, destinationUrl, requestDigest);
		});
	};

	Web.prototype._copyFile = function (sourceUrl, destinationUrl, digest) {
		var url = "/web/getfilebyserverrelativeurl(@url)/CopyTo?@Url='" + sourceUrl + "'&strNewUrl='" + destinationUrl + "'&bOverWrite='true'";
		var options = {
			headers: headers.getAddHeaders(digest)
		};
		return this._dao.post(url, {}, options);
	};

	Web.prototype.deleteFile = function (sourceUrl, digest) {
		var _this2 = this;

		if (digest) return this._deleteFile(sourceUrl, digest);

		return this.getRequestDigest().then(function (requestDigest) {
			return _this2._deleteFile(sourceUrl, requestDigest);
		});
	};

	Web.prototype._deleteFile = function (sourceUrl, requestDigest) {
		var url = "/web/getfilebyserverrelativeurl(@url)/?@Url='" + sourceUrl + "'";
		var options = {
			headers: headers.getDeleteHeaders(requestDigest)
		};
		return this._dao.post(url, {}, options);
	};

	Web.prototype.getUser = function (email) {
		var url = this.baseUrl + "/SiteUsers/GetByEmail('" + email + "')";
		return this._dao.get(url).then(utils.validateODataV2);
	};

	module.exports = Web;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var utils = __webpack_require__(9);

	var Folder = function Folder(spFolder) {
		this.mapProperties(spFolder);
	};

	Folder.prototype.populateChildren = function (spFolder) {
		this.folders = spFolder.Folders.results.map(function (f) {
			return new Folder(f);
		});
		this.files = spFolder.Files.results.map(function (f) {
			return new File(f);
		});
	};

	Folder.prototype.mapProperties = function (spFolder) {
		this.name = spFolder.Name;
		this.serverRelativeUrl = spFolder.ServerRelativeUrl;
		this.itemCount = spFolder.ItemCount;
		this.guid = spFolder.UniqueId;
		this.uri = spFolder.__metadata.uri;
	};

	var File = function File(spFile) {
		this.mapProperties(spFile);
	};

	File.prototype.mapProperties = function (spFile) {
		this.name = spFile.Name, this.title = spFile.Title, this.checkoutType = spFile.CheckOutType, this.byteLength = spFile.Length, this.majorVersion = spFile.MajorVersion, this.minorVersion = spFile.MinorVersion, this.serverRelativeUrl = spFile.ServerRelativeUrl, this.uri = spFile.__metadata.uri;
	};

	module.exports = {
		File: File,
		Folder: Folder
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var utils = __webpack_require__(9);
	var headers = __webpack_require__(11);

	var Profiles = function Profiles(dao) {
		this._dao = dao;
		this.baseUrl = "/SP.UserProfiles.PeopleManager";
	};

	var transformPersonProperties = function transformPersonProperties(profile) {
		profile.UserProfileProperties.results.forEach(function (keyvalue) {
			profile[keyvalue.Key] = keyvalue.Value;
		});
		return profile;
	};

	Profiles.prototype.current = function () {
		var url = this.baseUrl + "/GetMyProperties";
		return this._dao.get(url).then(utils.validateODataV2).then(transformPersonProperties);
	};

	Profiles.prototype.setProperty = function (userOrEmail, key, value, digest) {
		var _this = this;

		if (digest) return this._setProperty(userOrEmail, key, value, digest);
		return this._dao.getRequestDigest().then(function (digest) {
			return _this._setProperty(userOrEmail, key, value, digest);
		});
	};

	// Supports email string or a user object
	Profiles.prototype._setProperty = function (userOrEmail, key, value, digest) {
		var _this2 = this;

		var url = this.baseUrl + "/SetSingleValueProfileProperty";
		var args = {
			propertyName: key,
			propertyValue: value
		};

		var customOptions = {
			headers: headers.getStandardHeaders(digest)
		};

		// if a string is passed, assume its an email address, otherwise a user was passed
		if (typeof userOrEmail === "string") {
			return this.getByEmail(userOrEmail).then(function (user) {
				args.accountName = user.AccountName;
				return _this2._dao.post(url, args, customOptions);
			});
		} else {
			args.accountName = userOrEmail.LoginName || userOrEmail.AccountName;
			return this._dao.post(url, args, customOptions);
		}
	};

	Profiles.prototype.getProfile = function (user) {
		var login = encodeURIComponent(user.LoginName);
		var url = this.baseUrl + "/GetPropertiesFor(accountName=@v)?@v='" + login + "'";
		return this._dao.get(url).then(utils.validateODataV2).then(transformPersonProperties);
	};

	Profiles.prototype.getByEmail = function (email) {
		var _this3 = this;

		return this._dao.web.getUser(email).then(function (user) {
			return _this3.getProfile(user);
		});
	};

	module.exports = Profiles;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var queryString = __webpack_require__(16);
	var utils = __webpack_require__(9);

	var Search = function Search(dao) {
		this._dao = dao;
	};

	Search.QueryOptions = function () {
		this.sourceid = null;
		this.startrow = null;
		this.rowlimit = 30;
		this.selectedproperties = null;
		this.refiners = null;
		this.refinementfilters = null;
		this.hiddenconstraints = null;
		this.sortlist = null;
	};

	var convertRowsToObjects = function convertRowsToObjects(itemRows) {
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
	var SearchResults = function SearchResults(queryResponse) {
		this.elapsedTime = queryResponse.ElapsedTime;
		this.suggestion = queryResponse.SpellingSuggestion;
		this.resultsCount = queryResponse.PrimaryQueryResult.RelevantResults.RowCount;
		this.totalResults = queryResponse.PrimaryQueryResult.RelevantResults.TotalRows;
		this.totalResultsIncludingDuplicates = queryResponse.PrimaryQueryResult.RelevantResults.TotalRowsIncludingDuplicates;
		this.items = convertRowsToObjects(queryResponse.PrimaryQueryResult.RelevantResults.Table.Rows.results);
		this.refiners = mapRefiners(queryResponse.PrimaryQueryResult.RefinementResults.Refiners.results);
	};

	var mapRefiners = function mapRefiners(refinerResults) {
		var refiners = [];

		if (refinerResults && refinerResults.length) {
			refiners = refinerResults.map(function (r) {
				return {
					RefinerName: r.Name,
					RefinerOptions: r.Entries.results
				};
			});
		}
		return refiners;
	};

	Search.prototype.query = function (queryText, queryOptions) {
		var optionsQueryString = queryOptions != null ? "&" + queryString.fromObj(queryOptions, true) : "";

		var url = "/search/query?querytext='" + queryText + "'" + optionsQueryString;
		return this._dao.get(url).then(utils.validateODataV2).then(function (resp) {
			if (resp.query) {
				return new SearchResults(resp.query);
			}
			throw new Error("Invalid response back from search service");
		});
	};

	Search.prototype.people = function (queryText, queryOptions) {
		var options = queryOptions || {};
		options.sourceid = 'b09a7990-05ea-4af9-81ef-edfab16c4e31';
		return this.query(queryText, options);
	};

	module.exports = Search;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var qs = __webpack_require__(17);

	var fromObj = exports.fromObj = function (obj, quoteValues) {

		var writeParam = function writeParam(key) {
			var value = (obj[key] + "").trim();
			// if there is a space, wrap in single quotes
			if (value.indexOf(" ") > -1 || quoteValues) value = "'" + value + "'";

			return key + "=" + value;
		};

		var str = Object.keys(obj).map(writeParam).join("&");
		return str;
	};

	var toObj = exports.toObj = function (str) {
		//if no string is passed use window.location.search
		if (str === undefined && window && window.location && window.location.search) {
			str = window.location.search;
		}
		if (!str) return {};
		//trim off the leading '?' if its there
		if (str[0] === "?") str = str.substr(1);

		return qs.parse(str);
	};

	exports.contains = function (key, text) {
		return toObj(text).hasOwnProperty(key);
	};
	exports.getValue = function (key, text) {
		return toObj(text)[key] || "";
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.decode = exports.parse = __webpack_require__(18);
	exports.encode = exports.stringify = __webpack_require__(19);


/***/ },
/* 18 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};


/***/ },
/* 19 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

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
			url: '',
			method: 'GET',
			async: true,
			data: {},
			origin: false,
			type: "json",
			headers: {}
		},
		    errorInterceptors = [];

		// util function
		function forEach(obj, callback) {
			if (!isFunction(callback)) return;
			if (isArray(obj)) {
				if (obj.forEach) return obj.forEach(callback);
				for (var i = 0; i < obj.length; ++i) {
					callback(obj[i], i);
				}
			} else if (isObject(obj)) {
				for (var key in obj) {
					obj.hasOwnProperty(key) && callback(obj[key], key);
				}
			}
		}

		function extend() {
			var n = {};
			for (var i = 0; i < arguments.length; ++i) {
				forEach(arguments[i], function (value, key) {
					n[key] = value;
				});
			}
			return n;
		}

		function isString(str) {
			return typeof str === 'string' || Object.prototype.toString.call(str) === '[object String]';
		}

		function isObject(obj) {
			return Object.prototype.toString.call(obj) === '[object Object]';
		}

		function isFunction(func) {
			return typeof func === 'function';
		}

		function isArray(arr) {
			if (Array.isArray) return Array.isArray(arr);
			return arr instanceof Array;
		}

		function isValidMethod(method) {
			return isString(method) && /^GET|POST|PUT|HEAD|DELETE|PATCH$/.test(method.toUpperCase());
		}

		function isValidKey(key) {
			return (/^url|method|async|data|format|timeout|body|type|headers|before|success|error|complete$/.test(key)
			);
		}

		function xhr() {
			if (typeof XMLHttpRequest !== 'undefined') return new XMLHttpRequest();
			if (typeof ActiveXObject !== 'undefined') return new ActiveXObject('Microsoft.XMLHTTP');
			return null;
		}

		// main funciton
		function _request() {
			var url = '',
			    qs = "",
			    method = 'GET',
			    data = null,
			    options = {},
			    callback,
			    isTimeout = false,
			    isFinished = false,
			    err;

			// handle arguments
			for (var i = 0; i < arguments.length; ++i) {
				var arg = arguments[i];
				if (isString(arg)) {
					url = arg;
				} else if (isObject(arg)) {
					options = arg;
				} else if (isFunction(arg)) {
					callback = arg;
				}
			}

			// extend default options
			options = extend(defaultOptions, options);

			// get url
			isString(options.url) && (url = options.url);

			// get method
			isValidMethod(options.method) && (method = options.method.toUpperCase());

			data = options.data;

			// create XMLHttpRequest
			var http = xhr();

			// handle error
			if (http === null) {
				err = new Error("Your broswer don't support ajax!");
				isFunction(options.error) && options.error(err);
				isFunction(callback) && callback(err);
				if (typeof Promise !== "undefined") return Promise.reject(err);
				return;
			}

			// open XMLHttpRequest
			http.open(method, url, options.async);

			// set request headers
			forEach(options.headers, function (value, key) {
				http.setRequestHeader(key, value);
			});

			// set response type
			options.type && (http.responseType = options.type);

			function send(resolve, reject) {

				http.onreadystatechange = function () {
					// complete
					if (http.readyState === 4 && !isTimeout) {
						isFinished = true;
						var res = http.response;
						http.body = http.response;
						options.origin && (res = http);

						if (http.status < 400 && http.status >= 100) {
							isFunction(options.success) && options.success(res);
							isFunction(callback) && callback(null, res);
							isFunction(resolve) && resolve(res);
						} else {
							err = new Error('Request Error, Response Code: ' + http.status);
							err.code = http.status;
							http.error = err;
							forEach(errorInterceptors, function (interceptor) {
								isFunction(interceptor) && interceptor(err, http);
							});
							isFunction(options.error) && options.error(err);
							isFunction(callback) && callback(err, res);
							isFunction(reject) && reject(err);
						}
						isFunction(options.complete) && options.complete(res);
					}
				};

				// call before send
				isFunction(options.before) && options.before();

				// set timeout
				if (options.timeout) {
					setTimeout(function () {
						if (!isFinished) {
							isTimeout = true;
							err = new Error('Request Timeout, Response Code: 408');
							err.code = 408;
							http.error = err;
							forEach(errorInterceptors, function (interceptor) {
								isFunction(interceptor) && interceptor(err, http);
							});
							isFunction(options.error) && options.error(err);
							isFunction(callback) && callback(err, http);
							isFunction(reject) && reject(err);
							isFunction(options.complete) && options.complete(http);
						}
					}, options.timeout);
				}

				// send data
				http.send(data);
			}

			// create Promise
			if (typeof Promise !== "undefined") return new Promise(send);
			send();
		}

		function ajax() {
			return _request.apply(this, arguments);
		}

		ajax.get = function (url, data, callback) {
			return _request.call(this, { url: url, method: 'GET', data: data }, callback);
		};

		ajax.post = function (url, data, callback) {
			return _request.call(this, { url: url, method: 'POST', data: data }, callback);
		};

		ajax.setDefault = function (options) {
			defaultOptions = extend(defaultOptions, options);
			return ajax;
		};

		ajax.setErrorInterceptor = function (interceptor) {
			errorInterceptors.push(interceptor);
			return ajax;
		};

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = ajax;
		} else if (true) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return ajax;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.ajax = ajax;
		}
	})();

/***/ },
/* 21 */,
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var permissionsTests = __webpack_require__(23);

	exports.run = function (dao) {
	    describe("var web = dao.web", function () {
	        this.timeout(10000);
	        describe("web.info()", function () {
	            it("Should return a promise that resolves to web info", function (done) {
	                dao.web.info().then(function (webInfo) {
	                    webInfo.should.have.property("Url");
	                    webInfo.should.have.property("Title");
	                    done();
	                });
	            });
	        });

	        describe("web.subsites()", function () {
	            it("Should return a promise that resolves to an array of subsite web infos.", function (done) {
	                dao.web.subsites().then(function (subsites) {
	                    subsites.should.be.an("array");
	                    if (subsites.length) {
	                        subsites[0].should.have.property("Title");
	                        subsites[0].should.have.property("ServerRelativeUrl");
	                    }
	                    done();
	                });
	            });
	        });

	        describe("web.getRequestDigest()", function () {
	            it("Should return a promise that resolves to a request digest string", function (done) {
	                dao.web.getRequestDigest().then(function (digest) {
	                    digest.should.not.be.null;
	                    done();
	                });
	            });
	        });

	        var folderPath = "/shared documents";
	        describe("SPScript.RestDao.web.getFolder(serverRelativeUrl)", function () {
	            var folder = null;
	            before(function (done) {
	                dao.web.getFolder(folderPath).then(function (result) {
	                    folder = result;
	                    done();
	                });
	            });
	            it("Should return a promise that resolves to a folder with files and folders", function () {
	                folder.should.be.an("object");
	                folder.should.have.property("name");
	                folder.should.have.property("serverRelativeUrl");
	                folder.should.have.property("files");
	                folder.files.should.be.an("array");
	                folder.should.have.property("folders");
	                folder.folders.should.be.an("array");
	            });
	        });

	        var email = "andrew@andrewpetersen.onmicrosoft.com";
	        describe("web.getUser(email)", function () {
	            var user = null;
	            before(function (done) {
	                dao.web.getUser(email).then(function (result) {
	                    user = result;
	                    done();
	                });
	            });

	            it("Should return a promise that resolves to a user object", function () {
	                user.should.not.be.null;
	                user.should.have.property("Id");
	                user.should.have.property("LoginName");
	                user.should.have.property("Email");
	            });
	        });

	        var fileUrl = "/spscript/Shared%20Documents/testfile.txt";
	        describe("web.getFile(serverRelativeFileUrl)", function () {
	            var file = null;
	            before(function (done) {
	                dao.web.getFile(fileUrl).then(function (result) {
	                    file = result;
	                    done();
	                });
	            });
	            it("Should return a promise that resolves to a file object", function () {
	                file.should.not.be.null;
	                file.should.property("CheckOutType");
	                file.should.property("ETag");
	                file.should.property("Exists");
	                file.should.property("TimeLastModified");
	                file.should.property("Name");
	                file.should.property("UIVersionLabel");
	            });
	        });

	        var destinationUrl = "/spscript/Shared%20Documents/testfile2.txt";

	        describe("web.copyFile(serverRelativeFileUrl)", function () {
	            var startTestTime = new Date();
	            var file = null;
	            before(function (done) {
	                dao.web.copyFile(fileUrl, destinationUrl).then(function () {
	                    return dao.web.getFile(destinationUrl);
	                }).then(function (result) {
	                    file = result;
	                    done();
	                });
	            });
	            it("Should return a promise, and once resolved, the new (copied) file should be retrievable.", function () {
	                file.should.not.be.null;
	                file.should.property("CheckOutType");
	                file.should.property("ETag");
	                file.should.property("Exists");
	                file.should.property("TimeLastModified");
	                file.should.property("Name");
	                file.should.property("UIVersionLabel");
	                var modified = new Date(file["TimeLastModified"]);
	                modified.should.be.above(startTestTime);
	            });
	        });

	        describe("web.deleteFile(serverRelativeFileUrl)", function () {
	            var file = null;
	            it("Ensure there is a file to delete.", function (done) {
	                dao.web.getFile(destinationUrl).then(function (result) {
	                    result.should.not.be.null;
	                    result.should.have.property("Name");
	                    done();
	                });
	            });

	            it("Should return a promise, and once resolved, the file should NOT be retrievable", function (done) {
	                dao.web.deleteFile(destinationUrl).then(function (result) {
	                    dao.web.getFile(destinationUrl).then(function () {
	                        // the call to get file succeeded so for a a failure
	                        "one".should.equal("two");
	                        done();
	                    }).catch(function () {
	                        console.log(arguments);
	                        done();
	                        // call to get file failed as expected because file is gone
	                    });
	                });
	            });
	        });
	        describe("web.permissions.getRoleAssignments()", permissionsTests.create(dao.web));

	        describe("web.permissions.check()", permissionsTests.create(dao.web, "check"));

	        describe("web.permissions.check(email)", permissionsTests.create(dao.web, "check", "andrew@andrewpetersen.onmicrosoft.com"));
	    });
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";

	var create = exports.create = function (securable, action, email) {
		if (action === "check") {
			return function () {
				var permissions = null;
				before(function (done) {
					securable.permissions.check(email).then(function (privs) {
						permissions = privs;
						done();
					});
				});

				it("Should return a promise that resolves to an array of base permission strings", function () {
					permissions.should.be.an("array");
					permissions.should.not.be.empty;
				});

				it("Should reject the promise for an invalid email", function (done) {

					securable.permissions.check("invalid@invalid123.com").then(function (privs) {
						"one".should.equal("two");
						done();
					}).catch(function (error) {
						done();
					});
				});
			};
		} else {
			return function () {
				var permissions = null;
				before(function (done) {
					securable.permissions.getRoleAssignments().then(function (privs) {
						permissions = privs;
						done();
					});
				});
				it("Should return a promise that resolves to an array of objects", function () {
					permissions.should.be.an("array");
					permissions.should.not.be.empty;
				});
				it("Should return objects that each have a member and a roles array", function () {
					permissions.forEach(function (permission) {
						permission.should.have.property("member");
						permission.should.have.property("roles");
						permission.roles.should.be.an("array");
					});
				});
				it("Should return permission objects that contain member.name, member.login, and member.id", function () {
					permissions.forEach(function (permission) {
						permission.member.should.have.property("name");
						permission.member.should.have.property("login");
						permission.member.should.have.property("id");
					});
				});
				it("Should return permission objects, each with a roles array that has a name and description", function () {
					permissions.forEach(function (permission) {
						permission.roles.forEach(function (role) {
							role.should.have.property("name");
							role.should.have.property("description");
						});
					});
				});
			};
		}
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var permissionsTests = __webpack_require__(23);

	exports.run = function (dao) {
	    describe("dao.lists()", function () {
	        this.timeout(10000);
	        var results = null;
	        before(function (done) {
	            dao.lists().then(function (data) {
	                results = data;
	                done();
	            });
	        });
	        it("Should return a promise that resolves to an array of lists", function () {
	            results.should.be.an("array");
	            results.should.not.be.empty;
	        });
	        it("Should bring back list info like Title, ItemCount, and ListItemEntityTypeFullName", function () {
	            var firstItem = results[0];
	            firstItem.should.have.property("Title");
	            firstItem.should.have.property("ItemCount");
	            firstItem.should.have.property("ListItemEntityTypeFullName");
	        });
	    });

	    describe("var list = SPScript.RestDao.lists(listname)", function () {
	        this.timeout(10000);
	        var list = dao.lists("TestList");
	        describe("list.info()", function () {
	            var listInfo = null;
	            before(function (done) {
	                list.info().then(function (info) {
	                    listInfo = info;
	                    done();
	                });
	            });
	            it("Should return a promise that resolves to list info", function () {
	                listInfo.should.be.an("object");
	            });
	            it("Should bring back list info like Title, ItemCount, and ListItemEntityTypeFullName", function () {
	                listInfo.should.have.property("Title");
	                listInfo.should.have.property("ItemCount");
	                listInfo.should.have.property("ListItemEntityTypeFullName");
	            });
	        });

	        describe("list.getItems()", function () {
	            var items = null;
	            before(function (done) {
	                list.getItems().then(function (results) {
	                    items = results;
	                    done();
	                });
	            });

	            it("Should return a promise that resolves to an array of items", function () {
	                items.should.be.an("array");
	                items.should.not.be.empty;
	            });
	            it("Should return all the items in the list", function (done) {
	                list.info().then(function (listInfo) {
	                    items.length.should.equal(listInfo.ItemCount);
	                    done();
	                });
	            });
	        });

	        describe("list.getItems(odata)", function () {
	            //Get items where BoolColumn == TRUE
	            var odata = "$filter=MyStatus eq 'Green'";
	            var items = null;
	            before(function (done) {
	                list.getItems(odata).then(function (results) {
	                    items = results;
	                    done();
	                });
	            });
	            it("Should return a promise that resolves to an array of items", function () {
	                items.should.be.an("array");
	            });
	            it("Should return only items that match the OData params", function () {
	                items.forEach(function (item) {
	                    item.should.have.property("MyStatus");
	                    item.MyStatus.should.equal("Green");
	                });
	            });
	        });

	        describe("list.getItemById(id)", function () {
	            var item = null;
	            var validId = -1;
	            before(function (done) {
	                list.getItems().then(function (allItems) {
	                    validId = allItems[0].Id;
	                    return validId;
	                }).then(function (id) {
	                    return list.getItemById(id);
	                }).then(function (result) {
	                    item = result;
	                    done();
	                });
	            });
	            it("Should return a promise that resolves to a single item", function () {
	                item.should.be.an("object");
	                item.should.have.property("Title");
	            });
	            it("Should resolve an item with a matching ID", function () {
	                item.should.have.property("Id");
	                item.Id.should.equal(validId);
	            });
	        });

	        describe("list.findItems(key, value)", function () {
	            var matches = null;
	            before(function (done) {
	                list.findItems("MyStatus", "Green").then(function (results) {
	                    matches = results;
	                    done();
	                });
	            });
	            it("Should return a promise that resolves to an array of list items", function () {
	                matches.should.be.an("array");
	                matches.should.not.be.empty;
	            });
	            it("Should only bring back items the match the key value query", function () {
	                matches.forEach(function (item) {
	                    item.should.have.property("MyStatus");
	                    item.MyStatus.should.equal("Green");
	                });
	            });
	        });
	        describe("list.findItem(key, value)", function () {
	            var match = null;
	            before(function (done) {
	                list.findItem("MyStatus", "Green").then(function (result) {
	                    match = result;
	                    done();
	                });
	            });
	            it("Should resolve to one list item", function () {
	                match.should.be.an("object");
	            });
	            it("Should only bring back an item if it matches the key value query", function () {
	                match.should.have.property("MyStatus");
	                match.MyStatus.should.equal("Green");
	            });
	        });

	        describe("list.addItem()", function () {
	            var newItem = {
	                Title: "Test Created Item",
	                MyStatus: "Red"
	            };
	            var insertedItem = null;
	            before(function (done) {
	                list.addItem(newItem).then(function (result) {
	                    insertedItem = result;
	                    done();
	                }).catch(function (error) {
	                    console.log(error);
	                    done();
	                });
	            });
	            it("Should return a promise that resolves with the new list item", function () {
	                insertedItem.should.not.be.null;
	                insertedItem.should.be.an("object");
	                insertedItem.should.have.property("Id");
	            });
	            it("Should save the item right away so it can be queried.", function () {
	                list.getItemById(insertedItem.Id).then(function (foundItem) {
	                    foundItem.should.not.be.null;
	                    foundItem.should.have.property("Title");
	                    foundItem.Title.should.equal(newItem.Title);
	                });
	            });
	            it("Should throw an error if a invalid field is set", function (done) {
	                newItem.InvalidColumn = "test";
	                list.addItem(newItem).then(function () {
	                    //supposed to fail
	                    "one".should.equal("two");
	                }).catch(function (xhr, status, msg) {
	                    done();
	                });
	            });
	        });

	        describe("list.deleteItem(id)", function () {
	            var itemToDelete = null;
	            before(function (done) {
	                list.getItems("$orderby=Id").then(function (items) {
	                    itemToDelete = items[items.length - 1];
	                    return list.deleteItem(itemToDelete.Id);
	                }).then(function () {
	                    done();
	                });
	            });
	            it("Should delete that item", function (done) {
	                list.getItemById(itemToDelete.Id).then(function () {
	                    throw "Should have failed because item has been deleted";
	                }).catch(function () {
	                    done();
	                });
	            });
	            it("Should reject the promise if the item id can not be found", function (done) {
	                list.deleteItem(99999999).then(function () {
	                    throw "Should have failed because id doesnt exist";
	                }).catch(function () {
	                    done();
	                });
	            });
	        });

	        describe("list.updateItem()", function () {
	            var itemToUpdate = null;
	            var updates = {
	                Title: "Updated Title"
	            };
	            before(function (done) {
	                list.getItems("$orderby=Id desc").then(function (items) {
	                    itemToUpdate = items[items.length - 1];
	                    done();
	                });
	            });
	            it("Should return a promise", function (done) {
	                list.updateItem(itemToUpdate.Id, updates).then(function () {
	                    done();
	                });
	            });
	            it("Should update only the properties that were passed", function (done) {
	                list.getItemById(itemToUpdate.Id).then(function (item) {
	                    item.should.have.property("Title");
	                    item.Title.should.equal(updates.Title);
	                    done();
	                });
	            });
	        });

	        describe("list.permissions.getRoleAssignments()", permissionsTests.create(list));

	        describe("list.permissions.check()", permissionsTests.create(list, "check"));

	        describe("list.permissions.check(email)", permissionsTests.create(list, "check", "andrew@andrewpetersen.onmicrosoft.com"));
	    });
	};

/***/ }
/******/ ]);