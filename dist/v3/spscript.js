(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("isomorphic-fetch"));
	else if(typeof define === 'function' && define.amd)
		define("SPScript", ["isomorphic-fetch"], factory);
	else if(typeof exports === 'object')
		exports["SPScript"] = factory(require("isomorphic-fetch"));
	else
		root["SPScript"] = factory(root["isomorphic-fetch"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var queryString_1 = __webpack_require__(22);
var headers_1 = __webpack_require__(25);
var loaders_1 = __webpack_require__(26);
var dependencyManagement_1 = __webpack_require__(27);
function isBrowser() {
    return !(typeof window === "undefined");
}
function parseJSON(data) {
    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        }
        catch (e) {
            return null;
        }
    }
    return data;
}
var getArrayBuffer = function (file) {
    if (file && file instanceof File) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function (e) {
                resolve(e.target.result);
            };
            reader.readAsArrayBuffer(file);
        });
    }
    else {
        throw "SPScript.utils.getArrayBuffer: Cant get ArrayBuffer if you don't pass in a file";
    }
};
function validateODataV2(data) {
    data = parseJSON(data);
    var results = null;
    if (data.d && data.d.results && data.d.results.length != null) {
        results = data.d.results;
    }
    else if (data.d) {
        results = data.d;
    }
    return results || data;
}
function openModal(url, modalOptions) {
    if (!dependencyManagement_1.validateNamespace("SP.UI.ModalDialog")) {
        throw new Error("Sorry. Unable to open modal because native SharePoint Modal JavaScript is on loaded on page.");
    }
    var defaults = {
        width: 800,
        title: " "
    };
    var options = __assign({}, defaults, modalOptions, { url: url });
    return SP.UI.ModalDialog.showModalDialog(options);
}
var utils = {
    isBrowser: isBrowser,
    headers: headers_1.default,
    parseJSON: parseJSON,
    validateODataV2: validateODataV2,
    qs: { toObj: queryString_1.toObj, fromObj: queryString_1.fromObj },
    loadScript: loaders_1.loadScript,
    loadScripts: loaders_1.loadScripts,
    loadCSS: loaders_1.loadCSS,
    getArrayBuffer: getArrayBuffer,
    waitForLibraries: dependencyManagement_1.waitForLibraries,
    waitForLibrary: dependencyManagement_1.waitForLibrary,
    validateNamespace: dependencyManagement_1.validateNamespace,
    waitForElement: dependencyManagement_1.waitForElement,
    openModal: openModal
};
exports.default = utils;


/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(23);
exports.encode = exports.stringify = __webpack_require__(24);


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// require("isomorphic-fetch");
var utils_1 = __webpack_require__(0);
var defaults = {
    method: "GET",
    credentials: "include",
    redirect: "follow"
};
var request = function (url, options) {
    var opts = Object.assign({}, defaults, options);
    return fetch(url, opts).then(function (resp) {
        var succeeded = resp.ok;
        if (!resp.ok) {
            return resp.text().then(function (err) {
                throw new Error(err);
            });
        }
        return resp.text().then(function (text) {
            return utils_1.default.parseJSON(text) || text;
        });
    });
};
exports.default = request;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(0);
var IPermissions_1 = __webpack_require__(30);
/** Allows you to check the permissions of a securable (list or site) */
var Securable = (function () {
    function Securable(baseUrl, ctx) {
        this.baseUrl = baseUrl;
        this._dao = ctx;
    }
    /** Gets all the role assignments on that securable  */
    Securable.prototype.getRoleAssignments = function () {
        var url = this.baseUrl + "/RoleAssignments?$expand=Member,RoleDefinitionBindings";
        return this._dao.get(url)
            .then(utils_1.default.validateODataV2)
            .then(function (results) { return results.map(transformRoleAssignment); });
    };
    Securable.prototype.checkPrivs = function (user) {
        var login = encodeURIComponent(user.LoginName);
        var url = this.baseUrl + "/getusereffectivepermissions(@v)?@v='" + login + "'";
        return this._dao.get(url).then(utils_1.default.validateODataV2);
    };
    /** Gets all the role assignments on that securable. If you don't pass an email, it will use the current user. */
    Securable.prototype.check = function (email) {
        var _this = this;
        if (!email && !utils_1.default.isBrowser()) {
            return Promise.reject("Can't check permissions. No email passed and no current user");
        }
        // If no email is passed, then get current user, else get user by email
        var req = !email
            ? this._dao.get('/web/getuserbyid(' + _spPageContextInfo.userId + ')').then(function (data) { return data.d; })
            : this._dao.web.getUser(email);
        return req.then(function (user) { return _this.checkPrivs(user); })
            .then(function (privs) { return permissionMaskToStrings(privs.GetUserEffectivePermissions.Low, privs.GetUserEffectivePermissions.High); });
    };
    return Securable;
}());
exports.default = Securable;
var transformRoleAssignment = function (raw) {
    var member = {
        login: raw.Member.LoginName,
        name: raw.Member.Title,
        id: raw.Member.Id
    };
    var roles = raw.RoleDefinitionBindings.results.map(function (roleDef) {
        return {
            name: roleDef.Name,
            description: roleDef.Description,
            basePermissions: permissionMaskToStrings(roleDef.BasePermissions.Low, roleDef.BasePermissions.High)
        };
    });
    return { member: member, roles: roles };
};
var permissionMaskToStrings = function (lowMask, highMask) {
    var permissions = [];
    IPermissions_1.basePermissions.forEach(function (basePermission) {
        if ((basePermission.low & lowMask) > 0 || (basePermission.high & highMask) > 0) {
            permissions.push(basePermission.name);
        }
    });
    return permissions;
};


/***/ }),
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(5);
__webpack_require__(17);
var SPScript_1 = __webpack_require__(21);
module.exports = SPScript_1.default;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// This file can be required in Browserify and Node.js for automatic polyfill
// To use it:  require('es6-promise/auto');

module.exports = __webpack_require__(18).polyfill();


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {var require;/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.1
 */

(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = require;
    var vertx = __webpack_require__(20);
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && "function" === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === GET_THEN_ERROR) {
      reject(promise, GET_THEN_ERROR.error);
      GET_THEN_ERROR.error = null;
    } else if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      resolve(promise, value);
    } else if (failed) {
      reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator$1(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate(input);
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

Enumerator$1.prototype._enumerate = function (input) {
  for (var i = 0; this._state === PENDING && i < input.length; i++) {
    this._eachEntry(input[i], i);
  }
};

Enumerator$1.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$1 = c.resolve;

  if (resolve$$1 === resolve$1) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise$2) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$1) {
        return resolve$$1(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$1(entry), i);
  }
};

Enumerator$1.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator$1.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all$1(entries) {
  return new Enumerator$1(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race$1(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise$2(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise$2 ? initializePromise(this, resolver) : needsNew();
  }
}

Promise$2.all = all$1;
Promise$2.race = race$1;
Promise$2.resolve = resolve$1;
Promise$2.reject = reject$1;
Promise$2._setScheduler = setScheduler;
Promise$2._setAsap = setAsap;
Promise$2._asap = asap;

Promise$2.prototype = {
  constructor: Promise$2,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

/*global self*/
function polyfill$1() {
    var local = undefined;

    if (typeof global !== 'undefined') {
        local = global;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise$2;
}

// Strange compat..
Promise$2.polyfill = polyfill$1;
Promise$2.Promise = Promise$2;

return Promise$2;

})));

//# sourceMappingURL=es6-promise.map

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19), __webpack_require__(2)))

/***/ }),
/* 19 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 20 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(0);
var Context_1 = __webpack_require__(28);
var csr_1 = __webpack_require__(41);
var spscript = {
    utils: utils_1.default,
    CSR: csr_1.default,
    createContext: function (url, options) {
        try {
            if (!url && global._spPageContextInfo) {
                url = global._spPageContextInfo.webAbsoluteUrl;
            }
            return new Context_1.default(url, options);
        }
        catch (ex) {
            throw new Error("Unable to create SPScript Context: " + ex.message);
        }
    }
};
exports.default = spscript;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var qs = __webpack_require__(6);
function fromObj(obj, quoteValues) {
    var writeParam = function (key) {
        var value = (obj[key] + "").trim();
        // if there is a space, wrap in single quotes
        if (value.indexOf(" ") > -1 || quoteValues)
            value = "'" + value + "'";
        return key + "=" + value;
    };
    var str = Object.keys(obj)
        .map(writeParam)
        .join("&");
    return str;
}
exports.fromObj = fromObj;
function toObj(str) {
    //if no string is passed use window.location.search
    if (str === undefined && window && window.location && window.location.search) {
        str = window.location.search;
    }
    if (!str)
        return {};
    //trim off the leading '?' if its there
    if (str[0] === "?")
        str = str.substr(1);
    return qs.parse(str);
}
exports.toObj = toObj;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
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

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
;
var jsonMimeType = "application/json;odata=verbose";
function getStandardHeaders(digest) {
    var headers = {
        "Accept": jsonMimeType,
        "Content-Type": jsonMimeType
    };
    if (digest)
        headers["X-RequestDigest"] = digest;
    return headers;
}
var getAddHeaders = getStandardHeaders;
var getFilestreamHeaders = function (digest) {
    return {
        'Accept': jsonMimeType,
        'X-RequestDigest': digest,
        'Content-Type': "application/octet-stream",
        'binaryStringRequestBody': "true"
    };
};
var getActionHeaders = function (verb, digest) {
    return Object.assign({}, getStandardHeaders(digest), {
        "X-HTTP-Method": verb
    });
};
var decorateETag = function (headers, etag) {
    if (etag)
        headers["If-Match"] = etag;
    return headers;
};
var getUpdateHeaders = function (digest, etag) { return decorateETag(getActionHeaders("MERGE", digest), etag); };
var getDeleteHeaders = function (digest, etag) { return decorateETag(getActionHeaders("DELETE", digest), etag); };
var headerUtils = {
    getStandardHeaders: getStandardHeaders,
    getAddHeaders: getAddHeaders,
    getFilestreamHeaders: getFilestreamHeaders,
    getUpdateHeaders: getUpdateHeaders,
    getDeleteHeaders: getDeleteHeaders,
    getActionHeaders: getActionHeaders
};
exports.default = headerUtils;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCSS = function (url) {
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", url);
    document.querySelector("head").appendChild(link);
};
exports.loadScript = function (url) {
    return new Promise(function (resolve, reject) {
        var scriptTag = window.document.createElement("script");
        var firstScriptTag = document.getElementsByTagName('script')[0];
        scriptTag.async = true;
        firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
        scriptTag.onload = scriptTag.onreadystatechange = function (arg, isAbort) {
            // if its been aborted, readyState is gone, or readyState is in a 'done' status
            if (isAbort || !scriptTag.readyState || /loaded|complete/.test(scriptTag.readyState)) {
                //clean up
                scriptTag.onload = scriptTag.onreadystatechange = null;
                scriptTag = undefined;
                // resolve/reject the promise
                if (!isAbort)
                    resolve();
                else
                    reject;
            }
        };
        scriptTag.src = url;
    });
};
exports.loadScripts = function (urls) {
    return Promise.all(urls.map(exports.loadScript));
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNamespace = function (namespace) {
    var scope = window;
    var sections = namespace.split(".");
    var sectionsLength = sections.length;
    for (var i = 0; i < sectionsLength; i++) {
        var prop = sections[i];
        if (prop in scope) {
            scope = scope[prop];
        }
        else {
            return false;
        }
    }
    return true;
};
var _waitForLibraries = function (namespaces, resolve) {
    var missing = namespaces.filter(function (namespace) { return !exports.validateNamespace(namespace); });
    if (missing.length === 0)
        resolve();
    else
        setTimeout(function () { return _waitForLibraries(namespaces, resolve); }, 25);
};
exports.waitForLibraries = function (namespaces) {
    return new Promise(function (resolve, reject) { return _waitForLibraries(namespaces, resolve); });
};
exports.waitForLibrary = function (namespace) {
    return exports.waitForLibraries([namespace]);
};
exports.waitForElement = function (selector, timeout) {
    if (timeout === void 0) { timeout = 5000; }
    var counter = 0;
    var INTERVAL = 25; //milliseconds
    var MAX_ATTEMPTS = timeout / INTERVAL; // eventually give up
    return new Promise(function (resolve, reject) {
        var _waitForElement = function () {
            if (counter > MAX_ATTEMPTS)
                reject("Unable to find element: " + selector);
            var elem = document.querySelector(selector);
            if (!elem) {
                counter++;
                setTimeout(_waitForElement, INTERVAL);
            }
            else
                resolve(elem);
        };
        _waitForElement();
    });
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __webpack_require__(9);
var utils_1 = __webpack_require__(0);
var List_1 = __webpack_require__(29);
var Web_1 = __webpack_require__(31);
var Search_1 = __webpack_require__(32);
var CustomActions_1 = __webpack_require__(34);
var Profiles_1 = __webpack_require__(36);
var tokenHelper_1 = __webpack_require__(37);
var Context = (function () {
    function Context(url, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.webUrl = url;
        this.clientId = options.clientId;
        this.clientSecret = options.clientSecret;
        // TODO serverside: replace with tokenHelper.getAppOnlyToken(this.webUrl, this.clientKey, this.clientSecret).then(token => this.accessToken = token);
        this.ensureToken = !options.clientId
            ? Promise.resolve(true)
            : tokenHelper_1.getAppOnlyToken(url, options.clientId, options.clientSecret).then(function (token) { return (_this.accessToken = token); });
        this.search = new Search_1.default(this);
        this.customActions = new CustomActions_1.default(this);
        this.web = new Web_1.default(this);
        this.profiles = new Profiles_1.default(this);
    }
    Context.prototype.executeRequest = function (url, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var fullUrl, defaultOptions, requestOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureToken];
                    case 1:
                        _a.sent();
                        fullUrl = /^http/i.test(url) ? url : this.webUrl + "/_api" + url;
                        defaultOptions = {
                            method: "GET",
                            headers: {
                                Accept: "application/json; odata=verbose",
                                "Content-Type": "application/json; odata=verbose"
                            }
                        };
                        requestOptions = Object.assign({}, defaultOptions, opts);
                        if (this.accessToken) {
                            requestOptions.headers["Authorization"] =
                                "Bearer " + this.accessToken;
                        }
                        return [2 /*return*/, request_1.default(fullUrl, requestOptions)];
                }
            });
        });
    };
    /** Make a 'GET' request to the '<site>/_api' relative url. */
    Context.prototype.get = function (url, opts) {
        var options = Object.assign({}, { method: "GET" }, opts);
        return this.executeRequest(url, options).then(utils_1.default.parseJSON);
    };
    /** Make a 'POST' request to the '<site>/_api' relative url. */
    Context.prototype.post = function (url, body, opts) {
        body = this._packagePostBody(body, opts);
        var options = {
            method: "POST",
            body: body
        };
        options = Object.assign({}, options, opts);
        return this.executeRequest(url, options).then(utils_1.default.parseJSON);
    };
    /** Make a 'POST' request to the '<site>/_api' relative url. SPScript will handle authorizing the request for you.*/
    Context.prototype.authorizedPost = function (url, body, verb) {
        var _this = this;
        return this.getRequestDigest()
            .then(function (digest) { return utils_1.default.headers.getActionHeaders(verb, digest); })
            .then(function (headers) { return _this.post(url, body, { headers: headers }); });
    };
    Context.prototype._ensureRequestDigest = function (digest) {
        return digest ? Promise.resolve(digest) : this.getRequestDigest();
    };
    /** Get a Request Digest token to authorize a request */
    Context.prototype.getRequestDigest = function () {
        return this.post("/contextInfo", {}).then(function (data) { return data["d"].GetContextWebInformation.FormDigestValue; });
    };
    /** Get an SPScript List instance */
    Context.prototype.lists = function (name) {
        return new List_1.default(name, this);
    };
    Context.prototype._packagePostBody = function (body, opts) {
        // if its already a string just return
        if (typeof body === "string")
            return body;
        // if it has an explicit content-type, asssume the body is already that type
        if (opts &&
            opts.headers &&
            opts.headers["Content-Type"] &&
            opts.headers["Content-Type"].indexOf("json") === -1) {
            return body;
        }
        //others stringify
        return JSON.stringify(body);
    };
    return Context;
}());
exports.default = Context;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(0);
var Securable_1 = __webpack_require__(10);
var List = (function () {
    function List(name, ctx) {
        this.listName = name;
        this.baseUrl = "/web/lists/getbytitle('" + this.listName + "')";
        this._dao = ctx;
        this.permissions = new Securable_1.default(this.baseUrl, ctx);
    }
    /** Get items from the list. Will return all items if no OData is passed. */
    List.prototype.getItems = function (odata) {
        return this._dao
            .get(this.baseUrl + "/items" + appendOData(odata))
            .then(utils_1.default.validateODataV2);
    };
    /** Get a specific item by SharePoint ID */
    List.prototype.getItemById = function (id, odata) {
        var url = this.baseUrl + "/items(" + id + ")" + appendOData(odata);
        return this._dao.get(url).then(utils_1.default.validateODataV2);
    };
    /** Gets the items returned by the specified View name */
    List.prototype.getItemsByView = function (viewName) {
        var _this = this;
        var viewUrl = this.baseUrl + "/Views/getByTitle('" + viewName + "')/ViewQuery";
        // 1. Get the targeted view on the targeted list so we can pull out the ViewXml
        return this._dao.get(viewUrl)
            .then(utils_1.default.validateODataV2)
            .then(function (view) {
            // Now that we found the view, craft a POST request the the /GetItems endpoint
            var queryUrl = _this.baseUrl + "/GetItems";
            var postBody = {
                query: {
                    "__metadata": {
                        type: "SP.CamlQuery"
                    },
                    ViewXml: view.ViewQuery
                }
            };
            return _this._dao.authorizedPost(queryUrl, postBody);
        })
            .then(utils_1.default.validateODataV2);
    };
    /** Gets you all items whose field(key) matches the value. Currently only text and number columns are supported. */
    List.prototype.findItems = function (key, value, odata) {
        var filterValue = typeof value === "string" ? "'" + value + "'" : value;
        odata = "$filter=" + key + " eq " + filterValue + appendOData(odata, "&");
        return this.getItems(odata);
    };
    /** Get the item whose field(key) matches the value. If multiple matches are found, the first is returned. Currently only text and number columns are supported. */
    List.prototype.findItem = function (key, value, odata) {
        return this.findItems(key, value, odata)
            .then(function (items) {
            if (items && items.length && items.length > 0)
                return items[0];
            return null;
        });
    };
    /** Get all the properties of the List */
    List.prototype.getInfo = function () {
        return this._dao.get(this.baseUrl).then(utils_1.default.validateODataV2);
    };
    /** Insert a List Item */
    List.prototype.addItem = function (item, digest) {
        var _this = this;
        return this._dao._ensureRequestDigest(digest).then(function (digest) {
            return _this._dao.get(_this.baseUrl)
                .then(function (data) {
                //decorate the item with the 'type' metadata
                item = Object.assign({}, {
                    "__metadata": {
                        "type": data["d"].ListItemEntityTypeFullName
                    }
                }, item);
                var customOptions = {
                    headers: utils_1.default.headers.getAddHeaders(digest)
                };
                return _this._dao.post(_this.baseUrl + "/items", item, customOptions);
            })
                .then(utils_1.default.validateODataV2);
        });
    };
    /** Takes a SharePoint Id, and updates that item ONLY with properties that are found in the passed in updates object. */
    List.prototype.updateItem = function (itemId, updates, digest) {
        var _this = this;
        return this._dao._ensureRequestDigest(digest).then(function (digest) {
            return _this.getItemById(itemId).then(function (item) {
                //decorate the item with the 'type' metadata
                updates = Object.assign({}, {
                    "__metadata": {
                        "type": item["__metadata"].type
                    }
                }, updates);
                var customOptions = {
                    headers: utils_1.default.headers.getUpdateHeaders(digest, item["__metadata"].etag)
                };
                return _this._dao.post(item["__metadata"].uri, updates, customOptions);
            });
        });
    };
    /** deletes the item with the specified SharePoint Id */
    List.prototype.deleteItem = function (itemId, digest) {
        var _this = this;
        return this._dao._ensureRequestDigest(digest).then(function (digest) {
            return _this.getItemById(itemId).then(function (item) {
                var customOptions = {
                    headers: utils_1.default.headers.getDeleteHeaders(digest, item["__metadata"].etag)
                };
                return _this._dao.post(item["__metadata"].uri, "", customOptions);
            });
        });
    };
    return List;
}());
exports.default = List;
var appendOData = function (odata, prefix) {
    prefix = prefix || "?";
    if (odata)
        return prefix + odata;
    return "";
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.basePermissions = [{
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


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(0);
var Securable_1 = __webpack_require__(10);
var Web = (function () {
    function Web(ctx) {
        this.baseUrl = "/web";
        this._dao = ctx;
        this.permissions = new Securable_1.default(this.baseUrl, ctx);
    }
    /** Retrieves basic information about the site */
    Web.prototype.getInfo = function () {
        return this._dao
            .get(this.baseUrl)
            .then(utils_1.default.validateODataV2);
    };
    /** Retrieves all of the subsites */
    Web.prototype.getSubsites = function () {
        return this._dao
            .get(this.baseUrl + "/webinfos")
            .then(utils_1.default.validateODataV2);
    };
    Web.prototype.getUser = function (email) {
        var url = email ? this.baseUrl + "/SiteUsers/GetByEmail('" + email + "')" : this.baseUrl + "/CurrentUser";
        return this._dao.get(url).then(utils_1.default.validateODataV2);
    };
    Web.prototype.ensureUser = function (login) {
        return this._dao.post("/web/ensureUser('" + login + "')").then(utils_1.default.validateODataV2);
    };
    /** Retrieves a file by server relative url */
    Web.prototype.getFile = function (url) {
        var url = "/web/getfilebyserverrelativeurl('" + url + "')";
        return this._dao.get(url).then(utils_1.default.validateODataV2);
    };
    Web.prototype._copyFile = function (sourceUrl, destinationUrl, digest) {
        var url = "/web/getfilebyserverrelativeurl('" + sourceUrl + "')/CopyTo"; //(strnewurl='${destinationUrl}',boverwrite=true)`
        var options = {
            headers: utils_1.default.headers.getAddHeaders(digest)
        };
        var body = {
            strNewUrl: destinationUrl,
            bOverWrite: true
        };
        return this._dao.post(url, body, options);
    };
    // TODO: getFolder
    // TODO: uploadFile
    // TODO: fileAction
    // TODO: deleteFile
    /** Copies a file from one server relative url to another */
    Web.prototype.copyFile = function (sourceUrl, destinationUrl, digest) {
        var _this = this;
        return this._dao._ensureRequestDigest(digest)
            .then(function (digest) { return _this._copyFile(sourceUrl, destinationUrl, digest); });
    };
    return Web;
}());
exports.default = Web;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(0);
var searchMappers_1 = __webpack_require__(33);
var Search = (function () {
    function Search(ctx) {
        this._dao = ctx;
    }
    ;
    Object.defineProperty(Search.prototype, "defaultQueryOptions", {
        /** get default/empty QueryOptions */
        get: function () {
            return {
                sourceid: null,
                startrow: null,
                rowlimit: 100,
                selectedproperties: null,
                refiners: null,
                refinementfilters: null,
                hiddencontstraints: null,
                sortlist: null
            };
        },
        enumerable: true,
        configurable: true
    });
    ;
    /** Query the SP Search Service */
    Search.prototype.query = function (queryText, queryOptions) {
        if (queryOptions === void 0) { queryOptions = {}; }
        var optionsQueryString = utils_1.default.qs.fromObj(queryOptions, true);
        var url = "/search/query?querytext='" + queryText + "'&" + optionsQueryString;
        return this._dao.get(url)
            .then(utils_1.default.validateODataV2)
            .then(function (resp) {
            if (resp.query)
                return searchMappers_1.mapResponse(resp.query);
            throw new Error("Invalid response back from search service");
        });
    };
    ;
    /** Query for only People results */
    Search.prototype.people = function (queryText, queryOptions) {
        if (queryOptions === void 0) { queryOptions = {}; }
        queryOptions.sourceid = 'b09a7990-05ea-4af9-81ef-edfab16c4e31';
        return this.query(queryText, queryOptions);
    };
    ;
    /** Query for only sites (STS_Web). Optionally pass in a url scope. */
    Search.prototype.sites = function (queryText, urlScope, queryOptions) {
        if (queryText === void 0) { queryText = ""; }
        if (urlScope === void 0) { urlScope = ""; }
        if (queryOptions === void 0) { queryOptions = {}; }
        urlScope = urlScope ? "Path:" + urlScope + "*" : "";
        var query = (queryText + " contentclass:STS_Web " + urlScope).trim();
        queryOptions.rowlimit = queryOptions.rowlimit || 499;
        return this.query(query, queryOptions);
    };
    ;
    return Search;
}());
exports.default = Search;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.mapResponse = function (rawResponse) {
    return {
        elapsedTime: rawResponse.ElapsedTime,
        suggestion: rawResponse.SpellingSuggestion,
        resultsCount: rawResponse.PrimaryQueryResult.RelevantResults.RowCount,
        totalResults: rawResponse.PrimaryQueryResult.RelevantResults.TotalRows,
        totalResultsIncludingDuplicates: rawResponse.PrimaryQueryResult.RelevantResults.TotalRowsIncludingDuplicates,
        items: exports.mapItems(rawResponse.PrimaryQueryResult.RelevantResults.Table.Rows.results),
        refiners: exports.mapRefiners(rawResponse.PrimaryQueryResult.RefinementResults)
    };
};
exports.mapRefiners = function (refinementResults) {
    var refiners = [];
    if (refinementResults && refinementResults.Refiners && refinementResults.Refiners.results) {
        refiners = refinementResults.Refiners.results.map(function (r) {
            return {
                RefinerName: r.Name,
                RefinerOptions: r.Entries.results
            };
        });
    }
    return refiners;
};
exports.mapItems = function (itemRows) {
    var items = [];
    for (var i = 0; i < itemRows.length; i++) {
        var row = itemRows[i], item = {};
        for (var j = 0; j < row.Cells.results.length; j++) {
            item[row.Cells.results[j].Key] = row.Cells.results[j].Value;
        }
        items.push(item);
    }
    return items;
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(0);
var ICustomActions_1 = __webpack_require__(35);
var CustomActions = (function () {
    function CustomActions(ctx) {
        this._dao = ctx;
    }
    CustomActions.prototype.getScope = function (scopeId) {
        if (scopeId === 3)
            return ICustomActions_1.scopes.Web;
        if (scopeId === 2)
            return ICustomActions_1.scopes.Site;
        throw new Error("Invalid Custom Action Scope");
    };
    CustomActions.prototype.get = function (name) {
        var _this = this;
        // first get the site scoped ones, then the web scoped ones
        return this._dao.get(ICustomActions_1.scopes.Site.url)
            .then(utils_1.default.validateODataV2)
            .then(function (siteCustomActions) {
            return _this._dao.get(ICustomActions_1.scopes.Web.url)
                .then(utils_1.default.validateODataV2)
                .then(function (webCustomActions) { return siteCustomActions.concat(webCustomActions); });
        })
            .then(function (customActions) {
            // if a name was passed filter it otherwise return everything
            if (name) {
                var matches = customActions.filter(function (a) { return a.Name === name; });
                if (matches.length) {
                    return matches[0];
                }
                throw new Error("Unable to find Custom Action with name: " + name);
            }
            else
                return customActions;
        });
    };
    /** Gets the API url of a specific Custom Action */
    CustomActions.prototype._getUrl = function (name) {
        var _this = this;
        return this.get(name)
            .then(function (a) { return _this.getScope(a.Scope).url + "('" + a.Id + "')"; });
    };
    CustomActions.prototype._getUrlAndDigest = function (name) {
        var _this = this;
        var prep = {};
        return this._getUrl(name)
            .then(function (url) {
            prep.url = url;
            return _this._dao.getRequestDigest();
        })
            .then(function (digest) {
            prep.digest = digest;
            return prep;
        });
    };
    /** Update an existing Custom Action. You must pass a custom action with a 'Name' property */
    CustomActions.prototype.update = function (updates) {
        var _this = this;
        if (!updates || !updates.Name)
            throw new Error("You must at least pass a Custom Action 'Name'");
        return this._getUrlAndDigest(updates.Name)
            .then(function (prep) {
            updates = Object.assign({}, ICustomActions_1.metadata, updates);
            var opts = {
                headers: utils_1.default.headers.getUpdateHeaders(prep.digest)
            };
            return _this._dao.post(prep.url, updates, opts);
        });
    };
    /** Remove an existing Custom Action. Searches both Site and Web scoped */
    CustomActions.prototype.remove = function (name) {
        var _this = this;
        if (!name)
            throw new Error("You must at least pass an existing Custom Action name");
        return this._getUrlAndDigest(name)
            .then(function (prep) {
            var opts = {
                headers: utils_1.default.headers.getDeleteHeaders(prep.digest)
            };
            return _this._dao.post(prep.url, {}, opts);
        });
    };
    /** Adds a new custom action. If the custom action name already exists, it will be deleted first */
    CustomActions.prototype.add = function (customAction) {
        var _this = this;
        if (!customAction || !customAction.Name)
            throw new Error("You must at least pass a Custom Action 'Name'");
        var defaults = {
            Name: customAction.Name,
            Title: customAction.Name,
            Description: customAction.Name,
            Group: customAction.Name,
            Sequence: 100,
            Scope: "Site",
            Location: "ScriptLink",
        };
        customAction = Object.assign({}, defaults, customAction);
        // if it exists already, delete it
        return this.get()
            .then(function (existingCustomActions) {
            if (existingCustomActions.filter(function (ca) { return ca.Name === customAction.Name; }).length) {
                return _this.remove(customAction.Name);
            }
            return true;
        })
            .then(function () { return _this._dao.getRequestDigest(); })
            .then(function (digest) {
            customAction = Object.assign({}, ICustomActions_1.metadata, customAction);
            var scope = ICustomActions_1.scopes[customAction.Scope];
            customAction.Scope = scope.id;
            var opts = {
                headers: utils_1.default.headers.getAddHeaders(digest)
            };
            return _this._dao.post(scope.url, customAction, opts);
        });
    };
    CustomActions.prototype.addScriptBlock = function (name, block, opts) {
        if (opts === void 0) { opts = {}; }
        var customAction = {
            Name: name,
            ScriptBlock: block
        };
        customAction = Object.assign({}, customAction, opts);
        return this.add(customAction);
    };
    /** Injects a CSS file onto your site. Defaults to Site scoped */
    CustomActions.prototype.addCSSLink = function (name, url, opts) {
        if (opts === void 0) { opts = {}; }
        var scriptBlockStr = "\n\t\t(function() {\n\t\t\tvar head = document.querySelector(\"head\");\n\t\t\tvar styleTag = document.createElement(\"style\");\n\t\t\tstyleTag.appendChild(document.createTextNode(\"body { opacity: 0 }\"));\n\t\t\t\n\t\t\tvar linkTag = document.createElement(\"link\");\n\t\t\tlinkTag.rel = \"stylesheet\";\tlinkTag.href = \"" + url + "\"; linkTag.type = \"text/css\";\n\t\t\tlinkTag.addEventListener(\"load\", function() {\n\t\t\t\thead.removeChild(styleTag);\n\t\t\t});\n\n\t\t\thead.appendChild(styleTag);\n\t\t\thead.appendChild(linkTag);\n\t\t})();";
        return this.addScriptBlock(name, scriptBlockStr, opts);
    };
    CustomActions.prototype.addScriptLink = function (name, url, opts) {
        if (opts === void 0) { opts = {}; }
        var scriptBlockStr = "\n\t\t(function() {\n\t\t\tvar head = document.querySelector(\"head\");\n\t\t\tvar scriptTag = document.createElement(\"script\");\n            scriptTag.src = \"" + url + "\";\n            scriptTag.type = \"text/javascript\";\n\t\t\thead.appendChild(scriptTag);\n\t\t})();";
        return this.addScriptBlock(name, scriptBlockStr, opts);
    };
    return CustomActions;
}());
exports.default = CustomActions;
;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = {
    __metadata: {
        "type": "SP.UserCustomAction"
    }
};
exports.scopes = {
    "Web": {
        id: 3,
        name: "Web",
        url: "/web/usercustomactions"
    },
    "Site": {
        id: 2,
        name: "Site",
        url: "/site/usercustomactions"
    }
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(0);
var Profiles = (function () {
    function Profiles(ctx) {
        this._dao = ctx;
        this.baseUrl = "/SP.UserProfiles.PeopleManager";
    }
    /** Gets the profile of the current user.  */
    Profiles.prototype.current = function () {
        var url = this.baseUrl + "/GetMyProperties";
        return this._dao.get(url).then(utils_1.default.validateODataV2).then(transformPersonProperties);
    };
    Profiles.prototype.get = function (user) {
        var _this = this;
        if (!user)
            return this.current();
        return this.getUserObj(user).then(function (user) {
            var login = encodeURIComponent(user.LoginName || user.AccountName);
            var url = _this.baseUrl + "/GetPropertiesFor(accountName=@v)?@v='" + login + "'";
            return _this._dao.get(url).then(utils_1.default.validateODataV2).then(transformPersonProperties);
        });
    };
    Profiles.prototype.getUserObj = function (user) {
        if (!user || typeof user === "string") {
            return this._dao.web.getUser(user);
        }
        else if (user.AccountName || user.LoginName) {
            return Promise.resolve(user);
        }
        else
            throw new Error("profiles.setProperty Error: Invalid user parameter");
    };
    Profiles.prototype.setProperty = function (key, value, user) {
        var _this = this;
        return this.getUserObj(user).then(function (user) {
            var args = {
                propertyName: key,
                propertyValue: value,
                accountName: user.LoginName || user.AccountName
            };
            var url = _this.baseUrl + "/SetSingleValueProfileProperty";
            return _this._dao.authorizedPost(url, args);
        });
    };
    return Profiles;
}());
exports.default = Profiles;
var transformPersonProperties = function (profile) {
    profile.UserProfileProperties.results.forEach(function (keyvalue) {
        profile[keyvalue.Key] = keyvalue.Value;
    });
    return profile;
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = __webpack_require__(38);
var querystring = __webpack_require__(6);
var request_1 = __webpack_require__(9);
exports.getAppOnlyToken = function (url, clientId, clientSecret) {
    var urlParts = url_1.parse(url);
    return getRealm(url).then(function (authParams) {
        var tokenUrl = "https://accounts.accesscontrol.windows.net/" + authParams.realm + "/tokens/OAuth/2";
        var client_id = clientId + "@" + authParams.realm;
        var resource = authParams.client_id + "/" + urlParts.host + "@" + authParams.realm;
        var postBody = {
            grant_type: "client_credentials",
            client_id: client_id,
            client_secret: clientSecret,
            resource: resource,
            scope: resource
        };
        var bodyStr = querystring.stringify(postBody);
        var opts = {
            method: "POST",
            body: bodyStr,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": bodyStr.length
            }
        };
        return request_1.default(tokenUrl, opts).then(function (data) {
            return data.access_token;
        });
    });
};
var getRealm = function (url) {
    var endpointUrl = url + "/_api/web";
    var opts = {
        method: "GET",
        headers: {
            Authorization: "Bearer ",
            Accept: "application/json;odata=verbose",
            response_type: "code"
        }
    };
    return new Promise(function (resolve, reject) {
        fetch(endpointUrl, opts).then(function (res) {
            if (!res.ok) {
                var realm = parseRealm(res.headers["www-authenticate"] || res.headers._headers["www-authenticate"][0]);
                resolve(realm);
            }
            //this should fail
            reject("Get Realm succeeded somehow?!");
        });
    });
};
var parseRealm = function (raw) {
    var bearer = "Bearer realm=";
    if (raw && raw.startsWith("Bearer")) {
        raw = raw.substr(7);
        var params = raw.split(",").filter(function (p) { return p.indexOf("=") > -1; }).reduce(function (params, piece) {
            var parts = piece.split("=");
            if (parts.length === 2) {
                params[parts[0].trim()] = parts[1].trim().replace(/\"/g, "");
            }
            return params;
        }, {});
        return params;
    }
    return null;
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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



var punycode = __webpack_require__(39);
var util = __webpack_require__(40);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(6);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)(module), __webpack_require__(2)))

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(0);
var registerField = function (field, renderer, opts) {
    if (opts === void 0) { opts = {}; }
    if (!utils_1.default.validateNamespace("SPClientTemplates.TemplateManager")) {
        throw new Error("Unable to register CSR template.  SPClientTemplates.TemplateManager does not exist");
    }
    var renderers = {};
    //View, DisplayForm, EditForm, NewForm
    field.locations.forEach(function (l) { return renderers[l] = renderer; });
    var defaults = {
        Templates: {
            Fields: {}
        }
    };
    var templateOverride = Object.assign({}, defaults, opts);
    templateOverride.Templates.Fields[field.name] = renderers;
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(templateOverride);
    return field;
};
var registerDisplayField = function (fieldComponent, opts) {
    if (opts === void 0) { opts = {}; }
    var renderer = createDisplayFieldRenderer(fieldComponent);
    fieldComponent.locations = fieldComponent.locations || ["View", "DisplayForm"];
    return registerField(fieldComponent, renderer, opts);
};
var registerFormField = function (fieldComponent, opts) {
    if (opts === void 0) { opts = {}; }
    var renderer = createFormFieldRenderer(fieldComponent);
    fieldComponent.locations = fieldComponent.locations || ["NewForm", "EditForm"];
    return registerField(fieldComponent, renderer, opts);
};
function createFormFieldRenderer(field) {
    return function (ctx) {
        var formCtx = ctx.FormContext;
        // need to clone ctx, it is getting overwritten so we lost CurrentItem
        var clonedCtx = Object.assign({}, ctx);
        if (field.onReady) {
            if (formCtx) {
                formCtx.registerInitCallback(field.name, field.onReady.bind(null, clonedCtx));
            }
            else {
                setTimeout(field.onReady.bind(null, clonedCtx), 100);
            }
        }
        if (field.getValue && formCtx) {
            formCtx.registerGetValueCallback(field.name, field.getValue.bind(null, clonedCtx));
        }
        // tack on 'setValue' function
        if (formCtx && formCtx.updateControlValue) {
            field.setValue = function (value) {
                formCtx.updateControlValue(field.name, value);
            };
        }
        return field.render(ctx);
    };
}
function createDisplayFieldRenderer(field) {
    return function (ctx) {
        var formCtx = ctx.FormContext;
        if (formCtx && formCtx.registerInitCallback && field.onReady) {
            formCtx.registerInitCallback(field.name, field.onReady);
        }
        return field.render(ctx);
    };
}
var CSR = {
    registerDisplayField: registerDisplayField,
    registerFormField: registerFormField
};
exports.default = CSR;


/***/ })
/******/ ]);
});
//# sourceMappingURL=spscript.js.map