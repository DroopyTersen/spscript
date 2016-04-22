(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
(function (process,global){
/*!
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
        var vertx = r('vertx');
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
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
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
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);


}).call(this,require("e/U+97"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"e/U+97":4}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

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
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],5:[function(require,module,exports){
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
 var Promise = require('es6-promise').Promise;
 
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
	  //url = url.replace(/:([^\/]+)|\{([^\/]+)\}/g, function (match, p) {return options[p] ? options[p] : p})

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
},{"es6-promise":2}],6:[function(require,module,exports){
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
},{"./filesystem":8,"./list":9,"./profiles":11,"./search":14,"./utils":15,"./web":16,"object-assign":3}],7:[function(require,module,exports){
(function (global){
var SPScript = {};
SPScript.RestDao = require("../restDao");
SPScript.queryString = require("../queryString");
SPScript.templating = require("droopy-templating");
SPScript.utils = require("../utils");

module.exports = global.SPScript = SPScript;


}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../queryString":12,"../restDao":13,"../utils":15,"droopy-templating":1}],8:[function(require,module,exports){
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
},{"./utils":15}],9:[function(require,module,exports){
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
},{"./permissions":10,"./utils":15,"object-assign":3}],10:[function(require,module,exports){
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
},{"./utils":15}],11:[function(require,module,exports){
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
},{"./utils":15}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
var BaseDao = require("./baseDao");
var objAssign = require("object-assign");
var ajax = require('./ajax') 

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
},{"./ajax":5,"./baseDao":6,"object-assign":3}],14:[function(require,module,exports){
var queryString = require('./queryString');
var utils = require('./utils')
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
	return self._dao.get(url).then(utils.validateODataV2).then(function(resp) {
		if (resp.query) {
			return new SearchResults(resp.query);
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
},{"./queryString":12,"./utils":15}],15:[function(require,module,exports){
var getRequestDigest = exports.getRequestDigest = function() {
	return document.querySelector("#__REQUESTDIGEST").value
};
var acceptHeader = exports.acceptHeader = "application/json;odata=verbose";

var validateODataV2 = exports.validateODataV2= function(data) {
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
},{}],16:[function(require,module,exports){
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
},{"./permissions":10,"./utils":15,"object-assign":3}]},{},[7])