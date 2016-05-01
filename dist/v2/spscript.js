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

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	var promisePolyfill = __webpack_require__(1);
	if (!global.Promise) {
		global.Promise = promisePolyfill;
	}
	var SPScript = {};
	SPScript.RestDao = __webpack_require__(6);
	SPScript.queryString = __webpack_require__(16);
	SPScript.templating = __webpack_require__(21);
	SPScript.utils = __webpack_require__(9);
	SPScript.ajax = __webpack_require__(20);

	module.exports = global.SPScript = SPScript;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var require;var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process, global, module) {/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
	 * @version   3.1.2
	 */

	(function() {
	    "use strict";
	    function lib$es6$promise$utils$$objectOrFunction(x) {
	      return typeof x === 'function' || (typeof x === 'object' && x !== null);
	    }

	    function lib$es6$promise$utils$$isFunction(x) {
	      return typeof x === 'function';
	    }

	    function lib$es6$promise$utils$$isMaybeThenable(x) {
	      return typeof x === 'object' && x !== null;
	    }

	    var lib$es6$promise$utils$$_isArray;
	    if (!Array.isArray) {
	      lib$es6$promise$utils$$_isArray = function (x) {
	        return Object.prototype.toString.call(x) === '[object Array]';
	      };
	    } else {
	      lib$es6$promise$utils$$_isArray = Array.isArray;
	    }

	    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
	    var lib$es6$promise$asap$$len = 0;
	    var lib$es6$promise$asap$$vertxNext;
	    var lib$es6$promise$asap$$customSchedulerFn;

	    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
	      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
	      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
	      lib$es6$promise$asap$$len += 2;
	      if (lib$es6$promise$asap$$len === 2) {
	        // If len is 2, that means that we need to schedule an async flush.
	        // If additional callbacks are queued before the queue is flushed, they
	        // will be processed by this flush that we are scheduling.
	        if (lib$es6$promise$asap$$customSchedulerFn) {
	          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
	        } else {
	          lib$es6$promise$asap$$scheduleFlush();
	        }
	      }
	    }

	    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
	      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
	    }

	    function lib$es6$promise$asap$$setAsap(asapFn) {
	      lib$es6$promise$asap$$asap = asapFn;
	    }

	    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
	    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
	    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
	    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

	    // test for web worker but not in IE10
	    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
	      typeof importScripts !== 'undefined' &&
	      typeof MessageChannel !== 'undefined';

	    // node
	    function lib$es6$promise$asap$$useNextTick() {
	      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	      // see https://github.com/cujojs/when/issues/410 for details
	      return function() {
	        process.nextTick(lib$es6$promise$asap$$flush);
	      };
	    }

	    // vertx
	    function lib$es6$promise$asap$$useVertxTimer() {
	      return function() {
	        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
	      };
	    }

	    function lib$es6$promise$asap$$useMutationObserver() {
	      var iterations = 0;
	      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
	      var node = document.createTextNode('');
	      observer.observe(node, { characterData: true });

	      return function() {
	        node.data = (iterations = ++iterations % 2);
	      };
	    }

	    // web worker
	    function lib$es6$promise$asap$$useMessageChannel() {
	      var channel = new MessageChannel();
	      channel.port1.onmessage = lib$es6$promise$asap$$flush;
	      return function () {
	        channel.port2.postMessage(0);
	      };
	    }

	    function lib$es6$promise$asap$$useSetTimeout() {
	      return function() {
	        setTimeout(lib$es6$promise$asap$$flush, 1);
	      };
	    }

	    var lib$es6$promise$asap$$queue = new Array(1000);
	    function lib$es6$promise$asap$$flush() {
	      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
	        var callback = lib$es6$promise$asap$$queue[i];
	        var arg = lib$es6$promise$asap$$queue[i+1];

	        callback(arg);

	        lib$es6$promise$asap$$queue[i] = undefined;
	        lib$es6$promise$asap$$queue[i+1] = undefined;
	      }

	      lib$es6$promise$asap$$len = 0;
	    }

	    function lib$es6$promise$asap$$attemptVertx() {
	      try {
	        var r = require;
	        var vertx = __webpack_require__(4);
	        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
	        return lib$es6$promise$asap$$useVertxTimer();
	      } catch(e) {
	        return lib$es6$promise$asap$$useSetTimeout();
	      }
	    }

	    var lib$es6$promise$asap$$scheduleFlush;
	    // Decide what async method to use to triggering processing of queued callbacks:
	    if (lib$es6$promise$asap$$isNode) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
	    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
	    } else if (lib$es6$promise$asap$$isWorker) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
	    } else if (lib$es6$promise$asap$$browserWindow === undefined && "function" === 'function') {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx();
	    } else {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
	    }
	    function lib$es6$promise$then$$then(onFulfillment, onRejection) {
	      var parent = this;
	      var state = parent._state;

	      if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
	        return this;
	      }

	      var child = new this.constructor(lib$es6$promise$$internal$$noop);
	      var result = parent._result;

	      if (state) {
	        var callback = arguments[state - 1];
	        lib$es6$promise$asap$$asap(function(){
	          lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
	        });
	      } else {
	        lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
	      }

	      return child;
	    }
	    var lib$es6$promise$then$$default = lib$es6$promise$then$$then;
	    function lib$es6$promise$promise$resolve$$resolve(object) {
	      /*jshint validthis:true */
	      var Constructor = this;

	      if (object && typeof object === 'object' && object.constructor === Constructor) {
	        return object;
	      }

	      var promise = new Constructor(lib$es6$promise$$internal$$noop);
	      lib$es6$promise$$internal$$resolve(promise, object);
	      return promise;
	    }
	    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;

	    function lib$es6$promise$$internal$$noop() {}

	    var lib$es6$promise$$internal$$PENDING   = void 0;
	    var lib$es6$promise$$internal$$FULFILLED = 1;
	    var lib$es6$promise$$internal$$REJECTED  = 2;

	    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

	    function lib$es6$promise$$internal$$selfFulfillment() {
	      return new TypeError("You cannot resolve a promise with itself");
	    }

	    function lib$es6$promise$$internal$$cannotReturnOwn() {
	      return new TypeError('A promises callback cannot return that same promise.');
	    }

	    function lib$es6$promise$$internal$$getThen(promise) {
	      try {
	        return promise.then;
	      } catch(error) {
	        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
	        return lib$es6$promise$$internal$$GET_THEN_ERROR;
	      }
	    }

	    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	      try {
	        then.call(value, fulfillmentHandler, rejectionHandler);
	      } catch(e) {
	        return e;
	      }
	    }

	    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
	       lib$es6$promise$asap$$asap(function(promise) {
	        var sealed = false;
	        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
	          if (sealed) { return; }
	          sealed = true;
	          if (thenable !== value) {
	            lib$es6$promise$$internal$$resolve(promise, value);
	          } else {
	            lib$es6$promise$$internal$$fulfill(promise, value);
	          }
	        }, function(reason) {
	          if (sealed) { return; }
	          sealed = true;

	          lib$es6$promise$$internal$$reject(promise, reason);
	        }, 'Settle: ' + (promise._label || ' unknown promise'));

	        if (!sealed && error) {
	          sealed = true;
	          lib$es6$promise$$internal$$reject(promise, error);
	        }
	      }, promise);
	    }

	    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
	      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
	        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
	      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
	        lib$es6$promise$$internal$$reject(promise, thenable._result);
	      } else {
	        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
	          lib$es6$promise$$internal$$resolve(promise, value);
	        }, function(reason) {
	          lib$es6$promise$$internal$$reject(promise, reason);
	        });
	      }
	    }

	    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable, then) {
	      if (maybeThenable.constructor === promise.constructor &&
	          then === lib$es6$promise$then$$default &&
	          constructor.resolve === lib$es6$promise$promise$resolve$$default) {
	        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
	      } else {
	        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
	          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
	        } else if (then === undefined) {
	          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
	        } else if (lib$es6$promise$utils$$isFunction(then)) {
	          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
	        } else {
	          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
	        }
	      }
	    }

	    function lib$es6$promise$$internal$$resolve(promise, value) {
	      if (promise === value) {
	        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment());
	      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
	        lib$es6$promise$$internal$$handleMaybeThenable(promise, value, lib$es6$promise$$internal$$getThen(value));
	      } else {
	        lib$es6$promise$$internal$$fulfill(promise, value);
	      }
	    }

	    function lib$es6$promise$$internal$$publishRejection(promise) {
	      if (promise._onerror) {
	        promise._onerror(promise._result);
	      }

	      lib$es6$promise$$internal$$publish(promise);
	    }

	    function lib$es6$promise$$internal$$fulfill(promise, value) {
	      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

	      promise._result = value;
	      promise._state = lib$es6$promise$$internal$$FULFILLED;

	      if (promise._subscribers.length !== 0) {
	        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
	      }
	    }

	    function lib$es6$promise$$internal$$reject(promise, reason) {
	      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
	      promise._state = lib$es6$promise$$internal$$REJECTED;
	      promise._result = reason;

	      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
	    }

	    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
	      var subscribers = parent._subscribers;
	      var length = subscribers.length;

	      parent._onerror = null;

	      subscribers[length] = child;
	      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
	      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

	      if (length === 0 && parent._state) {
	        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
	      }
	    }

	    function lib$es6$promise$$internal$$publish(promise) {
	      var subscribers = promise._subscribers;
	      var settled = promise._state;

	      if (subscribers.length === 0) { return; }

	      var child, callback, detail = promise._result;

	      for (var i = 0; i < subscribers.length; i += 3) {
	        child = subscribers[i];
	        callback = subscribers[i + settled];

	        if (child) {
	          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
	        } else {
	          callback(detail);
	        }
	      }

	      promise._subscribers.length = 0;
	    }

	    function lib$es6$promise$$internal$$ErrorObject() {
	      this.error = null;
	    }

	    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

	    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
	      try {
	        return callback(detail);
	      } catch(e) {
	        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
	        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
	      }
	    }

	    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
	      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
	          value, error, succeeded, failed;

	      if (hasCallback) {
	        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

	        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
	          failed = true;
	          error = value.error;
	          value = null;
	        } else {
	          succeeded = true;
	        }

	        if (promise === value) {
	          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
	          return;
	        }

	      } else {
	        value = detail;
	        succeeded = true;
	      }

	      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
	        // noop
	      } else if (hasCallback && succeeded) {
	        lib$es6$promise$$internal$$resolve(promise, value);
	      } else if (failed) {
	        lib$es6$promise$$internal$$reject(promise, error);
	      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
	        lib$es6$promise$$internal$$fulfill(promise, value);
	      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
	        lib$es6$promise$$internal$$reject(promise, value);
	      }
	    }

	    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
	      try {
	        resolver(function resolvePromise(value){
	          lib$es6$promise$$internal$$resolve(promise, value);
	        }, function rejectPromise(reason) {
	          lib$es6$promise$$internal$$reject(promise, reason);
	        });
	      } catch(e) {
	        lib$es6$promise$$internal$$reject(promise, e);
	      }
	    }

	    function lib$es6$promise$promise$all$$all(entries) {
	      return new lib$es6$promise$enumerator$$default(this, entries).promise;
	    }
	    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
	    function lib$es6$promise$promise$race$$race(entries) {
	      /*jshint validthis:true */
	      var Constructor = this;

	      var promise = new Constructor(lib$es6$promise$$internal$$noop);

	      if (!lib$es6$promise$utils$$isArray(entries)) {
	        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
	        return promise;
	      }

	      var length = entries.length;

	      function onFulfillment(value) {
	        lib$es6$promise$$internal$$resolve(promise, value);
	      }

	      function onRejection(reason) {
	        lib$es6$promise$$internal$$reject(promise, reason);
	      }

	      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
	        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
	      }

	      return promise;
	    }
	    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
	    function lib$es6$promise$promise$reject$$reject(reason) {
	      /*jshint validthis:true */
	      var Constructor = this;
	      var promise = new Constructor(lib$es6$promise$$internal$$noop);
	      lib$es6$promise$$internal$$reject(promise, reason);
	      return promise;
	    }
	    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

	    var lib$es6$promise$promise$$counter = 0;

	    function lib$es6$promise$promise$$needsResolver() {
	      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	    }

	    function lib$es6$promise$promise$$needsNew() {
	      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	    }

	    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
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
	      var promise = new Promise(function(resolve, reject) {
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
	          var xhr = new XMLHttpRequest();

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
	    function lib$es6$promise$promise$$Promise(resolver) {
	      this._id = lib$es6$promise$promise$$counter++;
	      this._state = undefined;
	      this._result = undefined;
	      this._subscribers = [];

	      if (lib$es6$promise$$internal$$noop !== resolver) {
	        typeof resolver !== 'function' && lib$es6$promise$promise$$needsResolver();
	        this instanceof lib$es6$promise$promise$$Promise ? lib$es6$promise$$internal$$initializePromise(this, resolver) : lib$es6$promise$promise$$needsNew();
	      }
	    }

	    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
	    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
	    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
	    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
	    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
	    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
	    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

	    lib$es6$promise$promise$$Promise.prototype = {
	      constructor: lib$es6$promise$promise$$Promise,

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
	      var result;

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
	      var author, books;

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
	      then: lib$es6$promise$then$$default,

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
	      'catch': function(onRejection) {
	        return this.then(null, onRejection);
	      }
	    };
	    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;
	    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
	      this._instanceConstructor = Constructor;
	      this.promise = new Constructor(lib$es6$promise$$internal$$noop);

	      if (Array.isArray(input)) {
	        this._input     = input;
	        this.length     = input.length;
	        this._remaining = input.length;

	        this._result = new Array(this.length);

	        if (this.length === 0) {
	          lib$es6$promise$$internal$$fulfill(this.promise, this._result);
	        } else {
	          this.length = this.length || 0;
	          this._enumerate();
	          if (this._remaining === 0) {
	            lib$es6$promise$$internal$$fulfill(this.promise, this._result);
	          }
	        }
	      } else {
	        lib$es6$promise$$internal$$reject(this.promise, this._validationError());
	      }
	    }

	    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
	      return new Error('Array Methods must be provided an Array');
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
	      var length  = this.length;
	      var input   = this._input;

	      for (var i = 0; this._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
	        this._eachEntry(input[i], i);
	      }
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
	      var c = this._instanceConstructor;
	      var resolve = c.resolve;

	      if (resolve === lib$es6$promise$promise$resolve$$default) {
	        var then = lib$es6$promise$$internal$$getThen(entry);

	        if (then === lib$es6$promise$then$$default &&
	            entry._state !== lib$es6$promise$$internal$$PENDING) {
	          this._settledAt(entry._state, i, entry._result);
	        } else if (typeof then !== 'function') {
	          this._remaining--;
	          this._result[i] = entry;
	        } else if (c === lib$es6$promise$promise$$default) {
	          var promise = new c(lib$es6$promise$$internal$$noop);
	          lib$es6$promise$$internal$$handleMaybeThenable(promise, entry, then);
	          this._willSettleAt(promise, i);
	        } else {
	          this._willSettleAt(new c(function(resolve) { resolve(entry); }), i);
	        }
	      } else {
	        this._willSettleAt(resolve(entry), i);
	      }
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
	      var promise = this.promise;

	      if (promise._state === lib$es6$promise$$internal$$PENDING) {
	        this._remaining--;

	        if (state === lib$es6$promise$$internal$$REJECTED) {
	          lib$es6$promise$$internal$$reject(promise, value);
	        } else {
	          this._result[i] = value;
	        }
	      }

	      if (this._remaining === 0) {
	        lib$es6$promise$$internal$$fulfill(promise, this._result);
	      }
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
	      var enumerator = this;

	      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
	        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
	      }, function(reason) {
	        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
	      });
	    };
	    function lib$es6$promise$polyfill$$polyfill() {
	      var local;

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

	      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
	        return;
	      }

	      local.Promise = lib$es6$promise$promise$$default;
	    }
	    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

	    var lib$es6$promise$umd$$ES6Promise = {
	      'Promise': lib$es6$promise$promise$$default,
	      'polyfill': lib$es6$promise$polyfill$$default
	    };

	    /* global define:true module:true window: true */
	    if ("function" === 'function' && __webpack_require__(5)['amd']) {
	      !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return lib$es6$promise$umd$$ES6Promise; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module['exports']) {
	      module['exports'] = lib$es6$promise$umd$$ES6Promise;
	    } else if (typeof this !== 'undefined') {
	      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
	    }

	    lib$es6$promise$polyfill$$default();
	}).call(this);


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), (function() { return this; }()), __webpack_require__(3)(module)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
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
	    var timeout = setTimeout(cleanUpNextTick);
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
	    clearTimeout(timeout);
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
	        setTimeout(drainQueue, 0);
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

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var BaseDao = __webpack_require__(7);
	var ajax = __webpack_require__(20);

	/**
	 * Main point of entry. Big Daddy class that all SP requests are routed through. 
	 * @class
	 * @augments BaseDao

	 * @param {string} [url] - Url of the site you are connected to. _spPageContextInfo.webAbsoluteUrl will be used if no value is passed.
	 * @property {string} webUrl - Url of the site you are connected to
	 * @property {Web} web - Allows interacting with the SharePoint site you connected to
	 * @property {Search} search - Allows querying through the SP Search Service
	 * @property {Profiles} profiles - Allows interacting with the SP Profile Service
	 * @example
	 * var dao = new SPScript.RestDao(_spPageContextInfo.webAbsoluteUrl);
	 */
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

		var ajaxOptions = _extends({}, defaultOptions, options);
		return ajax(ajaxOptions);
	};

	module.exports = RestDao;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var List = __webpack_require__(8);
	var Web = __webpack_require__(12);
	var Profiles = __webpack_require__(14);
	var Search = __webpack_require__(15);
	var utils = __webpack_require__(9);

	/**
	 * Abstract class. You'll never work with this directly. 
	 * @abstract
	 * @private
	 * @property {Web} web - Allows interacting with the SharePoint site you connected to
	 * @property {Search} search - Allows querying through the SP Search Service
	 * @property {Profiles} profiles - Allows interacting with the SP Profile Service
	 */
	var BaseDao = function BaseDao() {
	  this.web = new Web(this);
	  this.search = new Search(this);
	  this.profiles = new Profiles(this);
	};

	BaseDao.prototype.executeRequest = function () {
	  throw "Not implemented exception";
	};

	/**
	 * Generic helper to make AJAX GET request
	  * @example <caption>Example usage of to log a site's content types</caption>
	 * dao.get('/web/contentTypes').then(function(data) { console.log(data.d.results)})
	 * @param {string} relativeQueryUrl - the API url relative to "/_api"
	 * @param {Object} [extendedOptions] - AJAX options (like custom request headers)
	 * @returns {Promise} - An ES6 Promise that resolves to the an object probably in the form of data.d
	 */
	BaseDao.prototype.get = function (relativeQueryUrl, extendedOptions) {
	  var options = _extends({}, {
	    method: "GET"
	  }, extendedOptions);
	  return this.executeRequest(relativeQueryUrl, options).then(utils.parseJSON);
	};

	BaseDao.prototype.getRequestDigest = function () {
	  return this.web.getRequestDigest();
	};
	/**
	 * If a list name is passed, an SPScript.List object, otherwise performs a request to get all the site's lists
	 * @param {string} [listname] - If a list name is passed, method is synchronous returning an SPScript.List
	 * @returns {List|Promise<lists[]>} - SPScript.List object or a Promise that resolves to an Array of lists
	 * @example <caption>Option 1: No List Name gets all the lists of a site</caption>
	 * dao.lists().then(function(lists) { console.log(lists)});
	 * @example <caption>Option 2: Pass a List Name to get a list object</caption>
	 * var list = dao.lists('MyList');
	 * list.getItemById(12).then(function(item) { console.log(item)});
	 */
	BaseDao.prototype.lists = function (listname) {
	  if (!listname) {
	    return this.get("/web/lists").then(utils.validateODataV2);
	  }
	  return new List(listname, this);
	};

	/**
	 * Generic helper to make AJAX POST request
	 * @param {string} relativeQueryUrl - the API url relative to "/_api"
	 * @param {Object} [extendedOptions] - AJAX options (like custom request headers)
	 * @returns {Promise} - An ES6 Promise
	 */
	BaseDao.prototype.post = function (relativePostUrl, body, extendedOptions) {
	  var strBody = JSON.stringify(body);
	  var options = {
	    method: "POST",
	    data: strBody,
	    contentType: "application/json;odata=verbose"
	  };
	  options = _extends({}, options, extendedOptions);
	  return this.executeRequest(relativePostUrl, options).then(utils.parseJSON);
	};

	module.exports = BaseDao;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
			item = _extends({}, {
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
			updates = _extends({}, {
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

	/**
	* @namespace SPScript.utils
	*/

	/**
	 * If you pass in string, it will try to run JSON.parse(). The SPScript get() and post() methods already run the response through this method, so you'd really only need this if you are doing a manual ajax request. Different browsers handle JSON response differently so it is safest to call this method if you aren't going through SPScript.
	 * @param {string} data - Raw response from JSON request
	 * @returns {object} - JSON parsed object. Returns null if JSON.parse fails
	 * @function parseJSON
	 * @memberof SPScript.utils
	 * @example
	 * dao.executeRequest('/web/contentTypes')
	 *		.then(SPScript.utils.parseJSON)
	 *		.then(function(data) { console.log(data.d.results)})
	 */
	var parseJSON = exports.parseJSON = function (data) {
	  if (typeof data === "string") {
	    try {
	      data = JSON.parse(data);
	    } catch (e) {
	      return null;
	    }
	  }
	  return data;
	};

	/**
	 * Helps parse raw json response to remove ceremonious OData data.d namespace. Tries JSON.parse() and then pulling out actual result from data.d or data.d.results
	 * @function validateODataV2
	 * @memberof SPScript.utils
	 * @param {string|object} data - Raw response from JSON request
	 * @returns {object} - JSON parsed object with that removes data.d OData structure 
	 * @example
	 * dao.get('/web/contentTypes')
	 *		.then(SPScript.utils.validateODataV2)
	 *		.then(function(contentTypes) { console.log(contentTypes)})
	 */
	var validateODataV2 = exports.validateODataV2 = function (data) {
	  var results = parseJSON(data);
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

	var _waitForLibraries = function _waitForLibraries(namespaces, resolve) {
	  var missing = namespaces.filter(function (namespace) {
	    return !validateNamespace(namespace);
	  });

	  if (missing.length === 0) resolve();else setTimeout(function () {
	    return _waitForLibraries(namespaces, resolve);
	  }, 25);
	};

	/**
	 * A method to allow you to wait for script dependencies to load.
	 * @param {Array} namespaces - An array of global namespaces, things on the global 'window'. For example, when jQuery is on the page, window.jQuery is valid.  So 'jQuery' is the namespace.
	 * @returns {Promise} - A Promise that resolves when all your namespaces are on the page
	 * @function waitForLibraries
	 * @memberof SPScript.utils
	 * @example
	 * function doMyStuff() { };
	 * SPScript.utils.waitForLibraries(["jQuery", "SP.UI.Dialog"]).then(doMyStuff);
	 */
	var waitForLibraries = exports.waitForLibraries = function (namespaces) {
	  return new Promise(function (resolve, reject) {
	    return _waitForLibraries(namespaces, resolve);
	  });
	};

	/**
	 * A method to allow you to wait for a single script dependency to load.
	 * @param {string} namespace - A global namespace. For example, when jQuery is on the page, window.jQuery is valid. So 'jQuery' is the namespace.
	 * @returns {Promise} - A Promise that resolves when all your namespace is on the page
	 * @function waitForLibrary
	 * @memberof SPScript.utils
	 * @example
	 * function doMyStuff() { };
	 * SPScript.utils.waitForLibrary("jQuery").then(doMyStuff);
	 */
	var waitForLibrary = exports.waitForLibrary = function (namespace) {
	  return waitForLibraries([namespace]);
	};

	/**
	 * A method to check if a given namespace is on the global object (window).
	 * @param {string} namespace - A global namespace
	 * @returns {Bool} - True or False if the namespace is on the page
	 * @function validateNamespace
	 * @memberof SPScript.utils
	 * @example
	 * var canUseModals = SPScript.utils.validateNamespace("SP.UI.Dialog");
	 */
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

	/**
	 * A method to load a javascript file onto your page
	 * @param {Array<string>} urls - An Array of urls to javascript files you want to load on your page
	 * @returns {Promise} - A Promise that resolves when all the files are done loading
	 * @function getScripts
	 * @memberof SPScript.utils
	 * @example
	 * function doMyStuff() { };
	 * var momentjsUrl = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js"
	 * var jQueryUrl = "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js"
	 * SPScript.utils.getScript([momentjsUrl, jQueryUrl]).then(doMyStuff);
	 */
	var getScripts = exports.getScripts = function (urls) {
	  return Promise.all(urls.map(getScript));
	};

	/**
	 * A method to load a javascript file onto your page
	 * @param {string} url - Url to the java script file you want to load
	 * @returns {Promise} - A Promise that resolves when the file is done loading
	 * @function getScript
	 * @memberof SPScript.utils
	 * @example
	 * function doMyStuff() { };
	 * var momentjsUrl = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js"
	 * SPScript.utils.getScript(momentjsUrl).then(doMyStuff);
	 */
	var getScript = exports.getScript = function (url) {
	  return new Promise(function (resolve, reject) {
	    var scriptTag = window.document.createElement("script");
	    var firstScriptTag = document.getElementsByTagName('script')[0];
	    scriptTag.async = 1;
	    firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);

	    scriptTag.onload = scriptTag.onreadystatechange = function (arg, isAbort) {
	      // if its been aborted, readyState is gone, or readyState is in a 'done' status
	      if (isAbort || !scriptTag.readyState || /loaded|complete/.test(script.readyState)) {
	        //clean up
	        scriptTag.onload = scriptTag.onreadystatechange = null;
	        scriptTag = undefined;

	        // resolve/reject the promise
	        if (!isAbort) resolve();else reject;
	      }
	    };
	    scriptTag.src = url;
	  });
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

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var utils = __webpack_require__(9);

	var jsonMimeType = "application/json;odata=verbose";
	var getStandardHeaders = exports.getStandardHeaders = function (digest) {
		var headers = {
			"Accept": jsonMimeType,
			"Content-Type": jsonMimeType
		};
		if (digest) headers["X-RequestDigest"] = digest;
		return headers;
	};

	exports.getAddHeaders = getStandardHeaders;

	var getActionHeaders = function getActionHeaders(verb, digest) {
		return _extends({}, getStandardHeaders(digest), { "X-HTTP-Method": verb });
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

	/**
	 * Represents a SharePoint site. You shouldn't ever be new'ing this class up up yourself, instead you'll get it from your dao as shown in first example.
	 * @class
	 * @param {IBaseDao} dao - Data access object used to make requests.
	 * @property {Permissions} permissions - allows checking security information of the Web
	 * @property {string} baseUrl - API relative url (value = "/web")
	 * @example <caption>You access this Web class using the 'web' property of the dao</caption>
	 * var dao = new SPScript.RestDao(_spPageContextInfo.webAbsoluteUrl);
	 * dao.web.info().then(function(info) { console.log(info) });
	 */
	var Web = function Web(dao) {
	  this._dao = dao;
	  this.baseUrl = "/web";
	  this.permissions = new Permissions(this.baseUrl, this._dao);
	};

	/**
	 * Retrieves basic information about the site
	 * @returns {Promise<SP.Web>} - A Promise that resolves to an object containing non-deferred properties of SP.Web (https://msdn.microsoft.com/en-us/library/office/jj244873.aspx)
	 * @example
	 * dao.web.info().then(function(info) { console.log(info) });
	 */
	Web.prototype.info = function () {
	  return this._dao.get(this.baseUrl).then(utils.validateODataV2);
	};

	/**
	 * Retrieves all of the subsites
	 * @returns {Promise<SP.Web[]>} - A Promise that resolves to an array of subsite object, each loaded with all non-deferred properties
	 * @example
	 *  dao.web.subsites().then(function(sites) { console.log(sites) });
	 */
	Web.prototype.subsites = function () {
	  return this._dao.get(this.baseUrl + "/webinfos").then(utils.validateODataV2);
	};

	/**
	 * Retrieves a token needed to authorize any updates
	 * @return {string} - A Promise that resolves to a the token that needs to added to the "X-RequestDigest" request header
	 * @example
	 *  dao.web.getRequestDigest().then(function(digest) { console.log(digest) });
	 */
	Web.prototype.getRequestDigest = function () {
	  return this._dao.post('/contextinfo', {}).then(function (data) {
	    return data.d.GetContextWebInformation.FormDigestValue;
	  });
	};

	/**
	 * Retrieves a folder
	 * @param {string} serverRelativeUrl - The server relative url of the folder
	 * @returns {Promise<Folder>} - A Promise that resolves to a folder object contain a files and folders arrays
	 * @example
	 *  dao.web.getFolder("/sites/mysite/Shared Documents")
	 *			.then(function(folder) { console.log(folder) });
	*/
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

	/**
	 * Retrieves a file object
	 * @param {string} url - The server relative url of the file
	 * @returns {Promise<File>} - A Promise that resolves to a file object
	 * @example
	 *  dao.web.getFile("/sites/mysite/Shared Documents/myfile.docx")
	 *			.then(function(file) { console.log(file) });
	 */
	Web.prototype.getFile = function (url) {
	  var url = "/web/getfilebyserverrelativeurl('" + url + "')";
	  return this._dao.get(url).then(utils.validateODataV2);
	};

	/**
	 * Copies a file
	 * @param {string} sourceUrl - The server relative url of the file you want to copy
	 * @param {string} destinationUrl - The server relative url of the destination
	 * @param {string} [[requestDigest]] - The request digest token used to authorize the request. One will be automatically retrieved if not passed.
	 * @example
	 * var sourceFile = "/sites/mysite/Shared Documents/myfile.docx";
	 * var destination = "/sites/mysite/Restricted Docs/myFile.docx";
	 * dao.web.copyFile(sourceFile, destination).then(function() { console.log("Success") });
	 */
	Web.prototype.copyFile = function (sourceUrl, destinationUrl, digest) {
	  var _this = this;

	  if (digest) return this._copyFile(sourceUrl, destinationUrl, digest);

	  return this.getRequestDigest().then(function (requestDigest) {
	    return _this._copyFile(sourceUrl, destinationUrl, requestDigest);
	  });
	};

	Web.prototype._copyFile = function (sourceUrl, destinationUrl, digest) {
	  var url = "/web/getfilebyserverrelativeurl('" + sourceUrl + "')/CopyTo(strnewurl='" + destinationUrl + "',boverwrite=true)";
	  var options = {
	    headers: headers.getAddHeaders(digest)
	  };
	  return this._dao.post(url, {}, options);
	};

	/**
	 * Deletes a file
	 * @param {string} fileUrl - The server relative url of the file you want to delete
	 * @param {string} [[requestDigest]] - The request digest token used to authorize the request. One will be automatically retrieved if not passed.
	 * @example
	 * dao.web.deleteFile("/sites/mysite/Shared Documents/myFile.docx")
	 *			.then(function() { console.log("Success")});
	 */
	Web.prototype.deleteFile = function (fileUrl, digest) {
	  var _this2 = this;

	  if (digest) return this._deleteFile(fileUrl, digest);

	  return this.getRequestDigest().then(function (requestDigest) {
	    return _this2._deleteFile(fileUrl, requestDigest);
	  });
	};

	Web.prototype._deleteFile = function (sourceUrl, requestDigest) {
	  var url = "/web/getfilebyserverrelativeurl(@url)/?@Url='" + sourceUrl + "'";
	  var options = {
	    headers: headers.getDeleteHeaders(requestDigest)
	  };
	  return this._dao.post(url, {}, options);
	};

	/**
	 * Retrieves a users object based on an email address
	 * @param {string} email - The email address of the user to retrieve
	 * @returns {Promise<SP.User>} - A Promise that resolves to a an SP.User object
	  * @example
	 * dao.web.getUser("andrew@andrewpetersen.onmicrosoft.com")
	 * 			.then(function(user) { console.log(user)});
	 */
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

	/**
	 * Represents a SharePoint Folder.  Keep in mind, and File or Folder objects obtained from the 'files' and 'folders' array will not have their child items populated.
	 * @typedef Folder
	 * @property {string} name - Folder name
	 * @property {string} serverRelativeUrl - Server relative url
	 * @property {int} itemCount - Number of items in the folder
	 * @property {string} guid - Unique ID of the folder
	 * @property {string} uri - API url to get the raw SP.Folder object
	 * @property {Array<File>} files - An array of files in that folder
	 * @property {Array<Folder>} folders - An array of sub folders
	 * @example
	 *  dao.web.getFolder("/sites/mysite/Shared Documents")
	 *			.then(function(folder) { 
	 *				console.log(folder.name);
	 *				console.log(folder.files);
	 *			});
	 */
	var Folder = function Folder(spFolder) {
	  this.mapProperties(spFolder);
	  this.populateChildren(spFolder);
	};

	Folder.prototype.populateChildren = function (spFolder) {
	  if (spFolder && spFolder.Folders && spFolder.Folders.results) {
	    this.folders = spFolder.Folders.results.map(function (f) {
	      return new Folder(f);
	    });
	  }
	  if (spFolder && spFolder.Files && spFolder.Files.results) {
	    this.files = spFolder.Files.results.map(function (f) {
	      return new File(f);
	    });
	  }
	};

	Folder.prototype.mapProperties = function (spFolder) {
	  this.name = spFolder.Name;
	  this.serverRelativeUrl = spFolder.ServerRelativeUrl;
	  this.itemCount = spFolder.ItemCount;
	  this.guid = spFolder.UniqueId;
	  this.uri = spFolder.__metadata.uri;
	};

	/**
	 * Represents a SharePoint File
	 * @typedef File
	 * @property {string} name - Folder name
	 * @property {string} title - Folder title
	 * @property {string} serverRelativeUrl - Server relative url
	 * @property {int} byteLength - File size in bytes
	 * @property {string} checkoutType - Checked out status of file.  "none", "offline", "online".
	 * @property {number} majorVersion - Major version of the file
	 * @property {number} minorVersion - Minor version of the file
	 * @property {string} uri - API url to get the raw SP.Folder object
	 * @example
	 *  dao.web.getFile("/sites/mysite/Shared Documents/myFile.docx")
	 *			.then(function(file) { 
	 *				console.log(file.name);
	 *				console.log("Size:" + (file.byteLength / 1000) + "KB");
	 *			});
	 */
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

	/**
	 * Allows you to perform queries agains the SP Search Service. You shouldn't ever be new'ing this class up up yourself, instead you'll get it from your dao as shown in first example.
	 * @class
	 * @param {IBaseDao} dao - Data access object used to make requests.
	 * @example <caption>You access this Search class using the 'search' property of the dao</caption>
	 * var dao = new SPScript.RestDao(_spPageContextInfo.webAbsoluteUrl);
	 * dao.search.query('andrew').then(function(result) { console.log(result.items) });
	 */
	var Search = function Search(dao) {
		this._dao = dao;
	};

	/**
	 * Represents the response sent back from the Search Service after a query
	 * @typedef {Object} QueryOptions
	 * @property {string} sourceid - Special id that allows filter of types
	 * @property {int} startrow - 
	 * @property {int} rowlimit - How many items to bring back
	 * @property {Array<string>} selectedproperties - An array of the property names to bring back
	 * @property {Array<string>} refiners - An array of the refiners to bring back
	 * @property {?} hiddenconstraints - 
	 * @property {?} sortlist - 
	 */
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

	/**
	 * Represents the response sent back from the Search Service after a query
	 * @typedef {Object} SearchResults
	 * @property {string} elapsedTime - How long the query took
	 * @property {object} suggestion - Spelling suggestion
	 * @property {int} resultsCount - Number of results in this batch
	 * @property {int} totalResults - Total number of results that could be returned
	 * @property {int} totalResultsIncludingDuplicates - Total number of results that could be returned including duplicates
	 * @property {Array} items - An array of search result items.  Properties will depend of the item type.
	 * @property {?Array<Refiner>} refiners - An array of refiners. Can be null.
	 */
	var SearchResults = function SearchResults(queryResponse) {
		this.elapsedTime = queryResponse.ElapsedTime;
		this.suggestion = queryResponse.SpellingSuggestion;
		this.resultsCount = queryResponse.PrimaryQueryResult.RelevantResults.RowCount;
		this.totalResults = queryResponse.PrimaryQueryResult.RelevantResults.TotalRows;
		this.totalResultsIncludingDuplicates = queryResponse.PrimaryQueryResult.RelevantResults.TotalRowsIncludingDuplicates;
		this.items = convertRowsToObjects(queryResponse.PrimaryQueryResult.RelevantResults.Table.Rows.results);
		this.refiners = mapRefiners(queryResponse.PrimaryQueryResult.RefinementResults);
	};

	/**
	 * Represents the response sent back from the Search Service after a query
	 * @typedef {Object} Refiner
	 * @property {string} RefinerName - How long the query took
	 * @property {Array} RefinerOptions - An array of valid refiner values
	 */

	var mapRefiners = function mapRefiners(refinementResults) {
		var refiners = [];

		if (refinementResults && refinementResults.Refiners && refinementResults.Refiners.results) {
			refiners = refinerResults.map(function (r) {
				return {
					RefinerName: r.Name,
					RefinerOptions: r.Entries.results
				};
			});
		}
		return refiners;
	};

	/**
	 * Performs a query using the search service
	 * @param {string} queryText - The query text to send to the Search Service
	 * @param {QueryOptions} [[queryOptions]] - Override the default query options
	 * @returns {Promise<SearchResults>} - A Promise that resolves to a SearchResults object
	 * @example
	 * dao.search.query('audit').then(function(result) { console.log(result.items) });
	 */
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

	/**
	 * Performs a query using the search service
	 * @param {string} queryText - The query text to send to the Search Service
	 * @param {QueryOptions} [[queryOptions]] - Override the default query options
	 * @returns {Promise<SearchResults>} - A Promise that resolves to a SearchResults object
	 * @example
	 * dao.search.people('andrew').then(function(result) { console.log(result.items) });
	 */
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

	/**
	* @namespace SPScript.queryString
	*/

	/**
	 * Turns a normal js Object into a string in form of "key1=value1&key2=value2..."
	 * @param {Object} obj - Javascript object to query stringify
	 * @param {bool} [[quoteValues]] - By default, if the value has a space, it will be single quoted. Passing true will cause all values to be quoted.
	 * @returns {string} - Note: tt does NOT prepend '?' char
	 * @function fromObj
	 * @memberof SPScript.queryString
	 * @example
	 * var myObj = { id: 123, title: "My Title" }
	 * var qs = SPScript.queryString.fromObj(myObj);
	 * // qs would output: "id=123&title='MyTitle'"
	 */
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

	/**
	 * Turns a string in form of "key1=value1&key2=value2..." into a javascript object
	 * @param {string} str - must be in query string format to work
	 * @returns {Object} - A javascript object with properties for each key found in the query string passed in.
	 * @function toObj
	 * @memberof SPScript.queryString
	 * @example
	 * // your url is "https://sharepoint.com/sites/mysite/home.aspx?id=123&title='My Title'"
	 * var myObj = SPScript.queryString.toObj(window.location.search);
	 * //myObj would be { id: 123, title: "My Title" }
	 */
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
/***/ function(module, exports) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	/**
	* @namespace SPScript.ajax
	*/

	var defaults = {
		method: "GET",
		async: true,
		type: "json", //XMLHttpRequest.responseType
		data: undefined
	};

	var validMethods = ["GET", "POST", "PUT", "HEAD", "DELETE", "PATCH"];

	var errorHandlers = [];

	var validateOptions = function validateOptions(options) {
		if (!options || !options.url || validMethods.indexOf(options.method) < 0) return false;else return true;
	};

	var setHeaders = function setHeaders(xhr, headersObj) {
		if (headersObj) {
			Object.keys(headersObj).forEach(function (key) {
				xhr.setRequestHeader(key, headersObj[key]);
			});
		}
	};

	/**
	 * Performs and AJAX request based on options you pass you. Your options must at least have a url.
	 * @param {object} options - Request options like { url, headers, method };
	 * @returns {Promise} - A ES6 Promise that resolves or rejects when the request comes back
	 * @function ajax
	 * @memberof SPScript.ajax
	 * @example
	 * var ajaxOptions = { 
	 *    url: '/_api/web/contentTypes', 
	 *    method: "GET", 
	 *    headers: { Accept: "application/json;odata=verbose" } 
	 * };
	 * SPScript.utils.ajax(ajaxOptions)
	 *		.then(SPScript.utils.parseJSON)
	 *		.then(function(data){ console.log(data.d.results) })
	 *		.catch(function(error) { console.log(error)})
	 */
	var ajax = function ajax(options) {
		var opts = _extends({}, defaults, options);
		if (!validateOptions(options)) return Promise.reject(new Error("Invalid options passed into ajax call."));

		var xhr = new XMLHttpRequest();
		if (xhr == null) return Promise.reject(new Error("Your browser doesn't support XMLHttpRequest (ajax)."));

		xhr.open(opts.method, opts.url, opts.async);
		setHeaders(xhr, opts.headers);
		xhr.responseType = opts.type;

		return new Promise(function (resolve, reject) {
			xhr.onreadystatechange = function () {
				//completed
				if (xhr.readyState === 4) {
					// SUCCESS
					if (xhr.status < 400 && xhr.status >= 100) {
						resolve(xhr.response);
					} else {
						var error = new Error("AJAX Request Error: Response Code = " + xhr.status);
						error.code = xhr.status;
						errorHandlers.forEach(function (fn) {
							return fn(error, xhr);
						});
						reject(error);
					}
				}
			};

			xhr.send(opts.data);
		});
	};

	ajax.addErrorHandler = function (fn) {
		return errorHandlers.push(fn);
	};
	ajax.setDefaults = function (options) {
		return _extends(defaults, options);
	};

	module.exports = ajax;

/***/ },
/* 21 */
/***/ function(module, exports) {

	var templating = {

		Placeholder: function(raw) {
			this.raw = raw;
			this.fullProperty = raw.slice(2, raw.length - 2);
		},

		getPlaceHolders: function(template, regexp) {
			var regExpPattern = regexp || /\{\{[^\}]+\}\}?/g;
			var matches = template.match(regExpPattern);
			return matches || [];
		},

		getObjectValue: function(obj, fullProperty) {
			var value = obj,
				propertyChain = fullProperty.split('.');

			for (var i = 0; i < propertyChain.length; i++) {
				var property = propertyChain[i];
				value = value[property] != null ? value[property] : "";
			}

			if(fullProperty === "_") {
				value = obj;
			}
			
			if ((typeof value === "string") && value.indexOf("/Date(") !== -1) {
				var dateValue = UTCJsonToDate(value);
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

	templating.Each = {

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
						arrayHtml += templating.populateTemplate(itemTemplate, array[i], templating.Each.regExp);
					}
				}

				$itemHtml.find($(this)).html(arrayHtml);
			});

			var temp = $itemHtml.clone().wrap("<div>");
			return temp.parent().html();
		}
	};

	templating.renderTemplate = function(template, item, renderEachTemplate) {
		var itemHtml = templating.populateTemplate(template, item);
		if (renderEachTemplate) {
			itemHtml = templating.Each.populateEachTemplates(itemHtml, item);
		}
		return itemHtml;
	};

	var UTCJsonToDate = function(jsonDate) {
		var utcStr = jsonDate.substring(jsonDate.indexOf("(") + 1);
		utcStr = utcStr.substring(0, utcStr.indexOf(")"));

		var returnDate = new Date(parseInt(utcStr, 10));
		var hourOffset = returnDate.getTimezoneOffset() / 60;
		returnDate.setHours(returnDate.getHours() + hourOffset);

		return returnDate;
	};

	module.exports = templating;

/***/ }
/******/ ]);