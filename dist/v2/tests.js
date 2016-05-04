/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(26);

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;var require;/* WEBPACK VAR INJECTION */(function(process, global, module) {/*!
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
	        var vertx = __webpack_require__(7);
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
	    if ("function" === 'function' && __webpack_require__(8)['amd']) {
	      !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return lib$es6$promise$umd$$ES6Promise; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module['exports']) {
	      module['exports'] = lib$es6$promise$umd$$ES6Promise;
	    } else if (typeof this !== 'undefined') {
	      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
	    }
	
	    lib$es6$promise$polyfill$$default();
	}).call(this);
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), (function() { return this; }()), __webpack_require__(6)(module)))

/***/ },
/* 5 */
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
/* 6 */
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
/* 7 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var promisePolyfill = __webpack_require__(4);
	if (!global.Promise) {
	    global.Promise = promisePolyfill;
	}
	
	mocha.setup('bdd');
	chai.should();
	
	var url = _spPageContextInfo.webAbsoluteUrl;
	var dao = new SPScript.RestDao(url);
	
	describe("var dao = new SPScript.RestDao(_spPageContextInfo.webAbsoluteUrl)", function() {
	    it("Should create the primary Data Access Objec (DAO) you use to interact with the site", function() {
	        dao.should.not.be.null;
	        dao.should.have.property("web");
	        dao.should.have.property("lists");
	        dao.should.have.property("search");
	        dao.should.have.property("profiles");
	    })
	});
	
	var webTests = __webpack_require__(27);
	webTests.run(dao);
	
	var listTests = __webpack_require__(29);
	listTests.run(dao);
	
	var searchTests = __webpack_require__(30);
	searchTests.run(dao);
	
	var profileTests = __webpack_require__(31);
	profileTests.run(dao);
	
	var utilsTests = __webpack_require__(32);
	utilsTests.run();
	
	mocha.run();
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var permissionsTests = __webpack_require__(28);
	
	exports.run = function(dao) {
	    describe("var web = dao.web", function() {
	        this.timeout(10000);
	        describe("web.info()", function() {
	            it("Should return a promise that resolves to web info", function(done) {
	                dao.web.info().then(function(webInfo) {
	                    webInfo.should.have.property("Url");
	                    webInfo.should.have.property("Title");
	                    done();
	                });
	            });
	        });
	
	        describe("web.subsites()", function() {
	            it("Should return a promise that resolves to an array of subsite web infos.", function(done) {
	                dao.web.subsites().then(function(subsites) {
	                    subsites.should.be.an("array");
	                    if (subsites.length) {
	                        subsites[0].should.have.property("Title");
	                        subsites[0].should.have.property("ServerRelativeUrl");
	                    }
	                    done();
	                });
	            });
	        });
	
	        describe("web.getRequestDigest()", function() {
	            it("Should return a promise that resolves to a request digest string", function(done) {
	                dao.web.getRequestDigest().then(function(digest) {
	                    digest.should.not.be.null;
	                    done();
	                })
	            });
	        })
	
	        var folderPath = "/shared documents";
	        describe("web.getFolder(serverRelativeUrl)", function() {
	            var folder = null;
	            before(function(done) {
	                dao.web.getFolder(folderPath).then(function(result) {
	                    folder = result;
	                    done();
	                });
	            });
	            it("Should return a promise that resolves to a folder with files and folders", function() {
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
	        describe("web.getUser(email)", function() {
	            var user = null;
	            before(function(done){
	                dao.web.getUser(email).then(function(result){
	                    user = result;
	                    done();
	                })
	            })
	
	            it("Should return a promise that resolves to a user object", function(){
	                user.should.not.be.null;
	                user.should.have.property("Id");
	                user.should.have.property("LoginName");
	                user.should.have.property("Email");
	            })
	        })
	
	        var fileUrl = "/spscript/Shared%20Documents/testfile.txt";
	        describe("web.getFile(serverRelativeFileUrl)", function() {
	            var file = null;
	            before(function(done){
	                dao.web.getFile(fileUrl).then(function(result) {
	                    file = result;
	                    done();
	                })
	            })
	            it("Should return a promise that resolves to a file object", function() {
	                file.should.not.be.null;
	                file.should.property("CheckOutType");
	                file.should.property("ETag");
	                file.should.property("Exists");
	                file.should.property("TimeLastModified");
	                file.should.property("Name");
	                file.should.property("UIVersionLabel");
	            })
	        });
	
	        var destinationUrl = "/spscript/Shared%20Documents/testfile2.txt";
	
	        describe("web.copyFile(serverRelativeSourceUrl, serverRelativeDestUrl)", function() {
	            var startTestTime = new Date();
	            var file = null;
	            before(function(done){
	                dao.web.copyFile(fileUrl, destinationUrl)
	                .then(function(){
	                    return dao.web.getFile(destinationUrl);
	                })
	                .then(function(result) {
	                    file = result;
	                    done();
	                })
	            })
	            it("Should return a promise, and once resolved, the new (copied) file should be retrievable.", function() {
	                file.should.not.be.null;
	                file.should.property("CheckOutType");
	                file.should.property("ETag");
	                file.should.property("Exists");
	                file.should.property("TimeLastModified");
	                file.should.property("Name");
	                file.should.property("UIVersionLabel");
	                var modified = new Date(file["TimeLastModified"])
	                modified.should.be.above(startTestTime);
	            })
	        })
	
	        describe("web.deleteFile(serverRelativeFileUrl)", function() {
	            var file = null;
	            it("Ensure there is a file to delete.", function(done){
	                dao.web.getFile(destinationUrl).then(function(result){
	                    result.should.not.be.null;
	                    result.should.have.property("Name");
	                    done();
	                });
	            })
	
	            it("Should return a promise, and once resolved, the file should NOT be retrievable", function(done){
	                dao.web.deleteFile(destinationUrl).then(function(result){
	                    dao.web.getFile(destinationUrl)
	                        .then(function(){
	                            // the call to get file succeeded so for a a failure
	                            ("one").should.equal("two");
	                            done();
	                        })
	                        .catch(function(){
	                            console.log(arguments);
	                            done();
	                            // call to get file failed as expected because file is gone
	                        })
	                })
	            })
	        }); 
	        describe("web.permissions.getRoleAssignments()", permissionsTests.create(dao.web));
	
	        describe("web.permissions.check()", permissionsTests.create(dao.web, "check"));
	
	        describe("web.permissions.check(email)", permissionsTests.create(dao.web, "check", "andrew@andrewpetersen.onmicrosoft.com"))
	    });
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	var create = exports.create = function(securable, action, email) {
		if (action === "check") {
			return function() {
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
	
	                securable.permissions.check("invalid@invalid123.com")
		                .then(function (privs) {
		                    ("one").should.equal("two");
		                    done();
		                }).catch(function(error){
		                    done();
		                });
	            });
			}
		}
		else {
			return function() {
				var permissions = null;
				before(function(done) {
					securable.permissions.getRoleAssignments().then(function(privs) {
						permissions = privs;
						done();
					});
				});
				it("Should return a promise that resolves to an array of objects", function() {
					permissions.should.be.an("array");
					permissions.should.not.be.empty;
				});
				it("Should return objects that each have a member and a roles array", function() {
					permissions.forEach(function(permission) {
						permission.should.have.property("member");
						permission.should.have.property("roles");
						permission.roles.should.be.an("array");
					});
				});
				it("Should return permission objects that contain member.name, member.login, and member.id", function() {
					permissions.forEach(function(permission) {
						permission.member.should.have.property("name");
						permission.member.should.have.property("login");
						permission.member.should.have.property("id");
					});
				});
				it("Should return permission objects, each with a roles array that has a name and description", function() {
					permissions.forEach(function(permission) {
						permission.roles.forEach(function(role) {
							role.should.have.property("name");
							role.should.have.property("description");
						});
					});
				});
			}
		}
	}

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var permissionsTests = __webpack_require__(28);
	
	exports.run = function(dao) {
	    describe("dao.lists()", function() {
	        this.timeout(10000);
	        var results = null;
	        before(function(done) {
	            dao.lists().then(function(data) {
	                results = data;
	                done();
	            });
	        });
	        it("Should return a promise that resolves to an array of lists", function() {
	            results.should.be.an("array");
	            results.should.not.be.empty;
	        });
	        it("Should bring back list info like Title, ItemCount, and ListItemEntityTypeFullName", function() {
	            var firstItem = results[0];
	            firstItem.should.have.property("Title");
	            firstItem.should.have.property("ItemCount");
	            firstItem.should.have.property("ListItemEntityTypeFullName");
	        });
	    });
	
	    describe("var list = SPScript.RestDao.lists(listname)", function() {
	        this.timeout(10000);
	        var list = dao.lists("TestList");
	        describe("list.info()", function() {
	            var listInfo = null;
	            before(function(done) {
	                list.info().then(function(info) {
	                    listInfo = info;
	                    done();
	                });
	            });
	            it("Should return a promise that resolves to list info", function() {
	                listInfo.should.be.an("object");
	            });
	            it("Should bring back list info like Title, ItemCount, and ListItemEntityTypeFullName", function() {
	                listInfo.should.have.property("Title");
	                listInfo.should.have.property("ItemCount");
	                listInfo.should.have.property("ListItemEntityTypeFullName");
	            });
	        });
	
	        describe("list.getItems()", function() {
	            var items = null;
	            before(function(done) {
	                list.getItems().then(function(results) {
	                    items = results;
	                    done();
	                });
	            });
	
	            it("Should return a promise that resolves to an array of items", function() {
	                items.should.be.an("array");
	            });
	            
	            it("Should return all the items in the list", function(done) {
	                list.info().then(function(listInfo) {
	                    items.length.should.equal(listInfo.ItemCount);
	                    done();
	                });
	            });
	        });
	
	        describe("list.getItems(odata)", function() {
	            //Get items where BoolColumn == TRUE
	            var odata = "$filter=MyStatus eq 'Green'";
	            var items = null;
	            before(function(done) {
	                list.getItems(odata).then(function(results) {
	                    items = results;
	                    done();
	                });
	            });
	            it("Should return a promise that resolves to an array of items", function() {
	                items.should.be.an("array");
	            });
	            it("Should return only items that match the OData params", function() {
	                items.forEach(function(item) {
	                    item.should.have.property("MyStatus");
	                    item.MyStatus.should.equal("Green");
	                });
	            });
	        });
	
	        describe("list.getItemById(id)", function() {
	            var item = null;
	            var validId = -1;
	            before(function(done) {
	                list.getItems()
	                    .then(function(allItems) {
	                        validId = allItems[0].Id;
	                        return validId;
	                    })
	                    .then(function(id) {
	                        return list.getItemById(id);
	                    })
	                    .then(function(result) {
	                        item = result;
	                        done();
	                    });
	            });
	            it("Should return a promise that resolves to a single item", function() {
	                item.should.be.an("object");
	                item.should.have.property("Title");
	            });
	            it("Should resolve an item with a matching ID", function() {
	                item.should.have.property("Id");
	                item.Id.should.equal(validId);
	            });
	        });
	
	        describe("list.findItems(key, value)", function() {
	            var matches = null;
	            before(function(done) {
	                list.findItems("MyStatus", "Green").then(function(results) {
	                    matches = results;
	                    done();
	                });
	            });
	            it("Should return a promise that resolves to an array of list items", function() {
	                matches.should.be.an("array");
	                matches.should.not.be.empty;
	            });
	            it("Should only bring back items the match the key value query", function() {
	                matches.forEach(function(item) {
	                    item.should.have.property("MyStatus");
	                    item.MyStatus.should.equal("Green");
	                });
	            });
	        });
	        describe("list.findItem(key, value)", function() {
	            var match = null;
	            before(function(done) {
	                list.findItem("MyStatus", "Green").then(function(result) {
	                    match = result;
	                    done();
	                });
	            });
	            it("Should resolve to one list item", function() {
	                match.should.be.an("object");
	            });
	            it("Should only bring back an item if it matches the key value query", function() {
	                match.should.have.property("MyStatus");
	                match.MyStatus.should.equal("Green");
	            });
	        });
	
	        describe("list.addItem()", function() {
	            var newItem = {
	                Title: "Test Created Item",
	                MyStatus: "Red"
	            };
	            var insertedItem = null;
	            before(function(done) {
	                list.addItem(newItem).then(function(result) {
	                    insertedItem = result;
	                    done();
	                }).catch(function(error) {
	                    console.log(error);
	                    done();
	                });
	            });
	            it("Should return a promise that resolves with the new list item", function() {
	                insertedItem.should.not.be.null;
	                insertedItem.should.be.an("object");
	                insertedItem.should.have.property("Id");
	            });
	            it("Should save the item right away so it can be queried.", function() {
	                list.getItemById(insertedItem.Id).then(function(foundItem) {
	                    foundItem.should.not.be.null;
	                    foundItem.should.have.property("Title");
	                    foundItem.Title.should.equal(newItem.Title);
	                });
	            });
	            it("Should throw an error if a invalid field is set", function(done) {
	                newItem.InvalidColumn = "test";
	                list.addItem(newItem)
	                    .then(function() {
	                        //supposed to fail
	                        ("one").should.equal("two");
	                    })
	                    .catch(function(xhr, status, msg) {
	                        done();
	                    });
	            });
	        });
	
	        describe("list.deleteItem(id)", function() {
	            var itemToDelete = null;
	            before(function(done) {
	                list.getItems("$orderby=Id").then(function(items) {
	                    itemToDelete = items[items.length - 1];
	                    return list.deleteItem(itemToDelete.Id);
	                }).then(function() {
	                    done();
	                });
	            });
	            it("Should delete that item", function(done) {
	                list.getItemById(itemToDelete.Id)
	                    .then(function() {
	                        throw "Should have failed because item has been deleted";
	                    })
	                    .catch(function() {
	                        done();
	                    });
	            });
	            it("Should reject the promise if the item id can not be found", function(done) {
	                list.deleteItem(99999999).then(function() {
	                        throw "Should have failed because id doesnt exist";
	                    })
	                    .catch(function() {
	                        done();
	                    })
	            });
	        });
	
	        describe("list.updateItem()", function() {
	            var itemToUpdate = null;
	            var updates = {
	                Title: "Updated Title"
	            };
	            before(function(done) {
	                list.getItems("$orderby=Id desc").then(function(items) {
	                    itemToUpdate = items[items.length - 1];
	                    done();
	                });
	            });
	            it("Should return a promise", function(done) {
	                list.updateItem(itemToUpdate.Id, updates).then(function() {
	                    done();
	                });
	            });
	            it("Should update only the properties that were passed", function(done) {
	                list.getItemById(itemToUpdate.Id).then(function(item) {
	                    item.should.have.property("Title");
	                    item.Title.should.equal(updates.Title);
	                    done();
	                });
	            });
	        });
	
	        describe("list.permissions.getRoleAssignments()", permissionsTests.create(list));
	
	        describe("list.permissions.check()", permissionsTests.create(list, "check"));
	
	        describe("list.permissions.check(email)", permissionsTests.create(list, "check", "andrew@andrewpetersen.onmicrosoft.com"))
	
	    });
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	exports.run = function(dao) {
	    describe("var search = dao.search;", function() {
	        this.timeout(10000);
	        describe("search.query(queryText)", function() {
	            it("Should return promise that resolves to a SearchResults object", function(done) {
	                var queryText = "andrew";
	                dao.search.query(queryText).then(function(searchResults) {
	                    searchResults.should.be.an("object");
	                    searchResults.should.have.property("resultsCount");
	                    searchResults.should.have.property("totalResults");
	                    searchResults.should.have.property("items");
	                    searchResults.should.have.property("refiners");
	                    searchResults.items.should.be.an("array");
	                    searchResults.items.should.not.be.empty;
	                    done();
	                });
	            });
	        });
	        describe("search.query(queryText, queryOptions)", function() {
	            it("Should obey the extra query options that were passed", function(done) {
	                var queryText = "andrew";
	                var options = {
	                    rowLimit: 1
	                };
	                dao.search.query(queryText, options).then(function(searchResults) {
	                    searchResults.should.be.an("object");
	                    searchResults.should.have.property("resultsCount");
	                    searchResults.should.have.property("totalResults");
	                    searchResults.should.have.property("items");
	                    searchResults.should.have.property("refiners");
	                    searchResults.items.should.be.an("array");
	                    searchResults.items.should.not.be.empty;
	                    searchResults.items.length.should.equal(1);
	                    done();
	                });
	            });
	        });
	        describe("search.people(queryText)", function() {
	            it("Should only return search results that are people", function(done) {
	                var queryText = "andrew";
	                dao.search.people(queryText).then(function(searchResults) {
	                    searchResults.should.be.an("object");
	                    searchResults.should.have.property("items");
	                    searchResults.items.should.be.an("array");
	                    searchResults.items.should.not.be.empty;
	
	                    var person = searchResults.items[0];
	                    person.should.have.property("AccountName")
	                    person.should.have.property("PreferredName")
	                    person.should.have.property("AboutMe")
	                    person.should.have.property("WorkEmail")
	                    person.should.have.property("PictureURL")
	                    done();
	                })
	            });
	        });
	    })
	
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	exports.run = function(dao) {
	    var email = "andrew@andrewpetersen.onmicrosoft.com";
	    describe("var profiles = dao.profiles", function() {
	        this.timeout(10000);
	
	        describe("profiles.current()", function() {
	            var profile = null;
	            before(function(done) {
	                dao.profiles.current().then(function(result) {
	                    profile = result;
	                    done();
	                });
	            });
	            it("Should return a promise that resolves to a profile properties object", function() {
	                profile.should.be.an("object");
	                profile.should.have.property("AccountName");
	                profile.should.have.property("Email");
	                profile.should.have.property("PreferredName");
	            });
	        });
	
	        describe("profiles.getByEmail(email)", function() {
	            var profile = null;
	            before(function(done) {
	                dao.profiles.getByEmail(email).then(function(result) {
	                    profile = result;
	                    done();
	                });
	            });
	            it("Should return a promise that resolves to a profile properties object", function() {
	                profile.should.be.an("object");
	                profile.should.have.property("AccountName");
	                profile.should.have.property("Email");
	                profile.should.have.property("PreferredName");
	            });
	
	            it("Should give you the matching person", function() {
	                profile.should.have.property("Email");
	                profile.Email.should.equal(email);
	            });
	
	            it("Should reject the promise for an invalid email", function(done) {
	                dao.profiles.getByEmail("invalid@invalid123.com")
	                    .then(function(result) {
	                        ("one").should.equal("two");
	                        done();
	                    })
	                    .catch(function() {
	                        done();
	                    });
	            });
	        });
	
	        describe("profiles.setProperty(email, propertyName, propertyValue)", function() {
	            it("Should update the About Me profile property", function(done) {
	                var aboutMeValue = "Hi there. I was updated with SPScript";
	                dao.profiles.setProperty(email, "AboutMe", aboutMeValue)
	                    .then(dao.profiles.current.bind(dao.profiles))
	                    .then(function(profile) {
	                        profile.should.have.property("AboutMe");
	                        profile.AboutMe.should.equal(aboutMeValue);
	                        done();
	                    })
	                    .catch(function() {
	                        console.log("Failed");
	                        console.log(arguments);
	                    });
	            });
	        });
	    });
	
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	var utils = SPScript.utils;
	
	exports.run = function() {
		describe("var utils = SPScript.utils", function() {
			this.timeout(10000);
	
	
			describe("utils.getScript(scriptUrl)", function() {
				var underscoreUrl = "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js";
				it("Should return a promise that resolves when script has been loaded.", function(done) {
					utils.getScript(underscoreUrl).then(function(){
						_.should.not.be.null;
						_.map.should.be.a("function");
						done();
					})
				})
			});
	
			describe("utils.getScripts(scriptUrls[])", function() {
	
				var reactUrl = "https://cdnjs.cloudflare.com/ajax/libs/react/15.0.1/react.js";
				var jsZipUrl = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.0.0/jszip.js";
	
				it ("Should return a promise that resolves when all the scripts have been loaded.", function(done) {
					utils.getScripts([reactUrl, jsZipUrl]).then(function() {
						React.should.not.be.null;
						JSZip.should.not.be.null;
						done();
					})
				})
			});
	
			describe("utils.waitForLibraries(namespaces[])", function() {
				it("Should return a promise that resolves when all the namespaces are valid.", function(done){
					var momentUrl = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.js";
					utils.waitForLibraries(["moment"]).then(function(){
						moment.should.not.be.null;
						moment.should.be.a("function");
						moment().format.should.be.a("function");
						done();
					});
	
					// delay it a bit on purpose
					setTimeout(function() { utils.getScript(momentUrl) }, 1000);
				})
			});
		})
	}

/***/ }
/******/ ]);
//# sourceMappingURL=tests.js.map