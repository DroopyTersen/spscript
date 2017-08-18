(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("SPScript", [], factory);
	else if(typeof exports === 'object')
		exports["SPScript"] = factory();
	else
		root["SPScript"] = factory();
})(this, function() {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 41);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(44);


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*!
 * Chai - flag utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### flag(object ,key, [value])
 *
 * Get or set a flag value on an object. If a
 * value is provided it will be set, else it will
 * return the currently set value or `undefined` if
 * the value is not set.
 *
 *     utils.flag(this, 'foo', 'bar'); // setter
 *     utils.flag(this, 'foo'); // getter, returns `bar`
 *
 * @param {Object} object (constructed Assertion
 * @param {String} key
 * @param {Mixed} value (optional)
 * @name flag
 * @api private
 */

module.exports = function (obj, key, value) {
  var flags = obj.__flags || (obj.__flags = Object.create(null));
  if (arguments.length === 3) {
    flags[key] = value;
  } else {
    return flags[key];
  }
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = {

  /**
   * ### config.includeStack
   *
   * User configurable property, influences whether stack trace
   * is included in Assertion error message. Default of false
   * suppresses stack trace in the error message.
   *
   *     chai.config.includeStack = true;  // enable stack on error
   *
   * @param {Boolean}
   * @api public
   */

   includeStack: false,

  /**
   * ### config.showDiff
   *
   * User configurable property, influences whether or not
   * the `showDiff` flag should be included in the thrown
   * AssertionErrors. `false` will always be `false`; `true`
   * will be true when the assertion has requested a diff
   * be shown.
   *
   * @param {Boolean}
   * @api public
   */

  showDiff: true,

  /**
   * ### config.truncateThreshold
   *
   * User configurable property, sets length threshold for actual and
   * expected values in assertion errors. If this threshold is exceeded,
   * the value is truncated.
   *
   * Set it to zero if you want to disable truncating altogether.
   *
   *     chai.config.truncateThreshold = 0;  // disable truncating
   *
   * @param {Number}
   * @api public
   */

  truncateThreshold: 40

};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(6);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(7)))

/***/ }),
/* 7 */
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
/* 8 */,
/* 9 */
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// This is (almost) directly from Node.js utils
// https://github.com/joyent/node/blob/f8c335d0caf47f16d31413f89aa28eda3878e3aa/lib/util.js

var getName = __webpack_require__(14);
var getProperties = __webpack_require__(50);
var getEnumerableProperties = __webpack_require__(51);

module.exports = inspect;

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Boolean} showHidden Flag that shows hidden (not enumerable)
 *    properties of objects.
 * @param {Number} depth Depth in which to descend in object. Default is 2.
 * @param {Boolean} colors Flag to turn on ANSI escape codes to color the
 *    output. Default is false (no coloring).
 */
function inspect(obj, showHidden, depth, colors) {
  var ctx = {
    showHidden: showHidden,
    seen: [],
    stylize: function (str) { return str; }
  };
  return formatValue(ctx, obj, (typeof depth === 'undefined' ? 2 : depth));
}

// Returns true if object is a DOM element.
var isDOMElement = function (object) {
  if (typeof HTMLElement === 'object') {
    return object instanceof HTMLElement;
  } else {
    return object &&
      typeof object === 'object' &&
      object.nodeType === 1 &&
      typeof object.nodeName === 'string';
  }
};

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (value && typeof value.inspect === 'function' &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes);
    if (typeof ret !== 'string') {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // If this is a DOM element, try to get the outer HTML.
  if (isDOMElement(value)) {
    if ('outerHTML' in value) {
      return value.outerHTML;
      // This value does not have an outerHTML attribute,
      //   it could still be an XML element
    } else {
      // Attempt to serialize it
      try {
        if (document.xmlVersion) {
          var xmlSerializer = new XMLSerializer();
          return xmlSerializer.serializeToString(value);
        } else {
          // Firefox 11- do not support outerHTML
          //   It does, however, support innerHTML
          //   Use the following to render the element
          var ns = "http://www.w3.org/1999/xhtml";
          var container = document.createElementNS(ns, '_');

          container.appendChild(value.cloneNode(false));
          html = container.innerHTML
            .replace('><', '>' + value.innerHTML + '<');
          container.innerHTML = '';
          return html;
        }
      } catch (err) {
        // This could be a non-native DOM implementation,
        //   continue with the normal flow:
        //   printing the element as if it is an object.
      }
    }
  }

  // Look up the keys of the object.
  var visibleKeys = getEnumerableProperties(value);
  var keys = ctx.showHidden ? getProperties(value) : visibleKeys;

  // Some type of object without properties can be shortcutted.
  // In IE, errors have a single `stack` property, or if they are vanilla `Error`,
  // a `stack` plus `description` property; ignore those for consistency.
  if (keys.length === 0 || (isError(value) && (
      (keys.length === 1 && keys[0] === 'stack') ||
      (keys.length === 2 && keys[0] === 'description' && keys[1] === 'stack')
     ))) {
    if (typeof value === 'function') {
      var name = getName(value);
      var nameSuffix = name ? ': ' + name : '';
      return ctx.stylize('[Function' + nameSuffix + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toUTCString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (typeof value === 'function') {
    var name = getName(value);
    var nameSuffix = name ? ': ' + name : '';
    base = ' [Function' + nameSuffix + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    return formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  switch (typeof value) {
    case 'undefined':
      return ctx.stylize('undefined', 'undefined');

    case 'string':
      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                               .replace(/'/g, "\\'")
                                               .replace(/\\"/g, '"') + '\'';
      return ctx.stylize(simple, 'string');

    case 'number':
      if (value === 0 && (1/value) === -Infinity) {
        return ctx.stylize('-0', 'number');
      }
      return ctx.stylize('' + value, 'number');

    case 'boolean':
      return ctx.stylize('' + value, 'boolean');
  }
  // For some reason typeof null is "object", so special case here.
  if (value === null) {
    return ctx.stylize('null', 'null');
  }
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (Object.prototype.hasOwnProperty.call(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str;
  if (value.__lookupGetter__) {
    if (value.__lookupGetter__(key)) {
      if (value.__lookupSetter__(key)) {
        str = ctx.stylize('[Getter/Setter]', 'special');
      } else {
        str = ctx.stylize('[Getter]', 'special');
      }
    } else {
      if (value.__lookupSetter__(key)) {
        str = ctx.stylize('[Setter]', 'special');
      }
    }
  }
  if (visibleKeys.indexOf(key) < 0) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(value[key]) < 0) {
      if (recurseTimes === null) {
        str = formatValue(ctx, value[key], null);
      } else {
        str = formatValue(ctx, value[key], recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (typeof name === 'undefined') {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}

function isArray(ar) {
  return Array.isArray(ar) ||
         (typeof ar === 'object' && objectToString(ar) === '[object Array]');
}

function isRegExp(re) {
  return typeof re === 'object' && objectToString(re) === '[object RegExp]';
}

function isDate(d) {
  return typeof d === 'object' && objectToString(d) === '[object Date]';
}

function isError(e) {
  return typeof e === 'object' && objectToString(e) === '[object Error]';
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


/***/ }),
/* 11 */,
/* 12 */,
/* 13 */
/***/ (function(module, exports) {

/*!
 * Chai - getActual utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * # getActual(object, [actual])
 *
 * Returns the `actual` value for an Assertion
 *
 * @param {Object} object (constructed Assertion)
 * @param {Arguments} chai.Assertion.prototype.assert arguments
 */

module.exports = function (obj, args) {
  return args.length > 4 ? args[4] : obj._obj;
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

/*!
 * Chai - getName utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * # getName(func)
 *
 * Gets the name of a function, in a cross-browser way.
 *
 * @param {Function} a function (usually a constructor)
 */

module.exports = function (func) {
  if (func.name) return func.name;

  var match = /^\s?function ([^(]*)\(/.exec(func);
  return match && match[1] ? match[1] : "";
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Chai - flag utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var inspect = __webpack_require__(10);
var config = __webpack_require__(4);

/**
 * ### .objDisplay (object)
 *
 * Determines if an object or an array matches
 * criteria to be inspected in-line for error
 * messages or should be truncated.
 *
 * @param {Mixed} javascript object to inspect
 * @name objDisplay
 * @api public
 */

module.exports = function (obj) {
  var str = inspect(obj)
    , type = Object.prototype.toString.call(obj);

  if (config.truncateThreshold && str.length >= config.truncateThreshold) {
    if (type === '[object Function]') {
      return !obj.name || obj.name === ''
        ? '[Function]'
        : '[Function: ' + obj.name + ']';
    } else if (type === '[object Array]') {
      return '[ Array(' + obj.length + ') ]';
    } else if (type === '[object Object]') {
      var keys = Object.keys(obj)
        , kstr = keys.length > 2
          ? keys.splice(0, 2).join(', ') + ', ...'
          : keys.join(', ');
      return '{ Object (' + kstr + ') }';
    } else {
      return str;
    }
  } else {
    return str;
  }
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

/*!
 * Chai - transferFlags utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### transferFlags(assertion, object, includeAll = true)
 *
 * Transfer all the flags for `assertion` to `object`. If
 * `includeAll` is set to `false`, then the base Chai
 * assertion flags (namely `object`, `ssfi`, and `message`)
 * will not be transferred.
 *
 *
 *     var newAssertion = new Assertion();
 *     utils.transferFlags(assertion, newAssertion);
 *
 *     var anotherAsseriton = new Assertion(myObj);
 *     utils.transferFlags(assertion, anotherAssertion, false);
 *
 * @param {Assertion} assertion the assertion to transfer the flags from
 * @param {Object} object the object to transfer the flags too; usually a new assertion
 * @param {Boolean} includeAll
 * @name getAllFlags
 * @api private
 */

module.exports = function (assertion, object, includeAll) {
  var flags = assertion.__flags || (assertion.__flags = Object.create(null));

  if (!object.__flags) {
    object.__flags = Object.create(null);
  }

  includeAll = arguments.length === 3 ? includeAll : true;

  for (var flag in flags) {
    if (includeAll ||
        (flag !== 'object' && flag !== 'ssfi' && flag != 'message')) {
      object.__flags[flag] = flags[flag];
    }
  }
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var should = __webpack_require__(2).should();
var create = exports.create = function (securable, action, email) {
	if (action === "check") {
		return function () {
			var permissions = null;
			before(function (done) {
				securable.permissions.check(email).then(function (privs) {
					permissions = privs;
					done();
				}).catch(function (err) {
					done(err);
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

/***/ }),
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// var promisePolyfill = require("promise-polyfill");
// if (!global.Promise) {
// 	global.Promise = promisePolyfill;
// }

mocha.setup("bdd");
chai.should();
var SPScript = __webpack_require__(42);
__webpack_require__(43).run(SPScript);

mocha.run();

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate, module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function webpackUniversalModuleDefinition(root, factory) {
    if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') module.exports = factory();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') exports["SPScript"] = factory();else root["SPScript"] = factory();
})(undefined, function () {
    return (/******/function (modules) {
            // webpackBootstrap
            /******/ // The module cache
            /******/var installedModules = {};
            /******/
            /******/ // The require function
            /******/function __webpack_require__(moduleId) {
                /******/
                /******/ // Check if module is in cache
                /******/if (installedModules[moduleId]) {
                    /******/return installedModules[moduleId].exports;
                    /******/
                }
                /******/ // Create a new module (and put it into the cache)
                /******/var module = installedModules[moduleId] = {
                    /******/i: moduleId,
                    /******/l: false,
                    /******/exports: {}
                    /******/ };
                /******/
                /******/ // Execute the module function
                /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
                /******/
                /******/ // Flag the module as loaded
                /******/module.l = true;
                /******/
                /******/ // Return the exports of the module
                /******/return module.exports;
                /******/
            }
            /******/
            /******/
            /******/ // expose the modules object (__webpack_modules__)
            /******/__webpack_require__.m = modules;
            /******/
            /******/ // expose the module cache
            /******/__webpack_require__.c = installedModules;
            /******/
            /******/ // define getter function for harmony exports
            /******/__webpack_require__.d = function (exports, name, getter) {
                /******/if (!__webpack_require__.o(exports, name)) {
                    /******/Object.defineProperty(exports, name, {
                        /******/configurable: false,
                        /******/enumerable: true,
                        /******/get: getter
                        /******/ });
                    /******/
                }
                /******/
            };
            /******/
            /******/ // getDefaultExport function for compatibility with non-harmony modules
            /******/__webpack_require__.n = function (module) {
                /******/var getter = module && module.__esModule ?
                /******/function getDefault() {
                    return module['default'];
                } :
                /******/function getModuleExports() {
                    return module;
                };
                /******/__webpack_require__.d(getter, 'a', getter);
                /******/return getter;
                /******/
            };
            /******/
            /******/ // Object.prototype.hasOwnProperty.call
            /******/__webpack_require__.o = function (object, property) {
                return Object.prototype.hasOwnProperty.call(object, property);
            };
            /******/
            /******/ // __webpack_public_path__
            /******/__webpack_require__.p = "";
            /******/
            /******/ // Load entry module and return exports
            /******/return __webpack_require__(__webpack_require__.s = 18);
            /******/
        }(
        /************************************************************************/
        /******/[
        /* 0 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            var __assign = this && this.__assign || Object.assign || function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s) {
                        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                    }
                }
                return t;
            };
            Object.defineProperty(exports, "__esModule", { value: true });
            var queryString_1 = __webpack_require__(21);
            var headers_1 = __webpack_require__(24);
            var loaders_1 = __webpack_require__(25);
            var dependencyManagement_1 = __webpack_require__(26);
            function isBrowser() {
                return !(typeof window === "undefined");
            }
            function parseJSON(data) {
                if (typeof data === "string") {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        return null;
                    }
                }
                return data;
            }
            var getArrayBuffer = function getArrayBuffer(file) {
                if (file && file instanceof File) {
                    return new Promise(function (resolve, reject) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            resolve(e.target.result);
                        };
                        reader.readAsArrayBuffer(file);
                    });
                } else {
                    throw "SPScript.utils.getArrayBuffer: Cant get ArrayBuffer if you don't pass in a file";
                }
            };
            function validateODataV2(data) {
                data = parseJSON(data);
                var results = null;
                if (data.d && data.d.results && data.d.results.length != null) {
                    results = data.d.results;
                } else if (data.d) {
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

            /***/
        },
        /* 1 */
        /***/function (module, exports) {

            var g;

            // This works in non-strict mode
            g = function () {
                return this;
            }();

            try {
                // This works if eval is allowed (see CSP)
                g = g || Function("return this")() || (1, eval)("this");
            } catch (e) {
                // This works if the window reference is available
                if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === "object") g = window;
            }

            // g can still be undefined, but nothing to do about it...
            // We return undefined, instead of nothing here, so it's
            // easier to handle this case. if(!global) { ...}

            module.exports = g;

            /***/
        },,,,
        /* 2 */
        /* 3 */
        /* 4 */
        /* 5 */
        /***/function (module, exports, __webpack_require__) {

            var apply = Function.prototype.apply;

            // DOM APIs, for completeness

            exports.setTimeout = function () {
                return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
            };
            exports.setInterval = function () {
                return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
            };
            exports.clearTimeout = exports.clearInterval = function (timeout) {
                if (timeout) {
                    timeout.close();
                }
            };

            function Timeout(id, clearFn) {
                this._id = id;
                this._clearFn = clearFn;
            }
            Timeout.prototype.unref = Timeout.prototype.ref = function () {};
            Timeout.prototype.close = function () {
                this._clearFn.call(window, this._id);
            };

            // Does not start the time, just sets up the members needed.
            exports.enroll = function (item, msecs) {
                clearTimeout(item._idleTimeoutId);
                item._idleTimeout = msecs;
            };

            exports.unenroll = function (item) {
                clearTimeout(item._idleTimeoutId);
                item._idleTimeout = -1;
            };

            exports._unrefActive = exports.active = function (item) {
                clearTimeout(item._idleTimeoutId);

                var msecs = item._idleTimeout;
                if (msecs >= 0) {
                    item._idleTimeoutId = setTimeout(function onTimeout() {
                        if (item._onTimeout) item._onTimeout();
                    }, msecs);
                }
            };

            // setimmediate attaches itself to the global object
            __webpack_require__(6);
            exports.setImmediate = setImmediate;
            exports.clearImmediate = clearImmediate;

            /***/
        },
        /* 6 */
        /***/function (module, exports, __webpack_require__) {

            /* WEBPACK VAR INJECTION */(function (global, process) {
                (function (global, undefined) {
                    "use strict";

                    if (global.setImmediate) {
                        return;
                    }

                    var nextHandle = 1; // Spec says greater than zero
                    var tasksByHandle = {};
                    var currentlyRunningATask = false;
                    var doc = global.document;
                    var registerImmediate;

                    function setImmediate(callback) {
                        // Callback can either be a function or a string
                        if (typeof callback !== "function") {
                            callback = new Function("" + callback);
                        }
                        // Copy function arguments
                        var args = new Array(arguments.length - 1);
                        for (var i = 0; i < args.length; i++) {
                            args[i] = arguments[i + 1];
                        }
                        // Store and register the task
                        var task = { callback: callback, args: args };
                        tasksByHandle[nextHandle] = task;
                        registerImmediate(nextHandle);
                        return nextHandle++;
                    }

                    function clearImmediate(handle) {
                        delete tasksByHandle[handle];
                    }

                    function run(task) {
                        var callback = task.callback;
                        var args = task.args;
                        switch (args.length) {
                            case 0:
                                callback();
                                break;
                            case 1:
                                callback(args[0]);
                                break;
                            case 2:
                                callback(args[0], args[1]);
                                break;
                            case 3:
                                callback(args[0], args[1], args[2]);
                                break;
                            default:
                                callback.apply(undefined, args);
                                break;
                        }
                    }

                    function runIfPresent(handle) {
                        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
                        // So if we're currently running a task, we'll need to delay this invocation.
                        if (currentlyRunningATask) {
                            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
                            // "too much recursion" error.
                            setTimeout(runIfPresent, 0, handle);
                        } else {
                            var task = tasksByHandle[handle];
                            if (task) {
                                currentlyRunningATask = true;
                                try {
                                    run(task);
                                } finally {
                                    clearImmediate(handle);
                                    currentlyRunningATask = false;
                                }
                            }
                        }
                    }

                    function installNextTickImplementation() {
                        registerImmediate = function registerImmediate(handle) {
                            process.nextTick(function () {
                                runIfPresent(handle);
                            });
                        };
                    }

                    function canUsePostMessage() {
                        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
                        // where `global.postMessage` means something completely different and can't be used for this purpose.
                        if (global.postMessage && !global.importScripts) {
                            var postMessageIsAsynchronous = true;
                            var oldOnMessage = global.onmessage;
                            global.onmessage = function () {
                                postMessageIsAsynchronous = false;
                            };
                            global.postMessage("", "*");
                            global.onmessage = oldOnMessage;
                            return postMessageIsAsynchronous;
                        }
                    }

                    function installPostMessageImplementation() {
                        // Installs an event handler on `global` for the `message` event: see
                        // * https://developer.mozilla.org/en/DOM/window.postMessage
                        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

                        var messagePrefix = "setImmediate$" + Math.random() + "$";
                        var onGlobalMessage = function onGlobalMessage(event) {
                            if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
                                runIfPresent(+event.data.slice(messagePrefix.length));
                            }
                        };

                        if (global.addEventListener) {
                            global.addEventListener("message", onGlobalMessage, false);
                        } else {
                            global.attachEvent("onmessage", onGlobalMessage);
                        }

                        registerImmediate = function registerImmediate(handle) {
                            global.postMessage(messagePrefix + handle, "*");
                        };
                    }

                    function installMessageChannelImplementation() {
                        var channel = new MessageChannel();
                        channel.port1.onmessage = function (event) {
                            var handle = event.data;
                            runIfPresent(handle);
                        };

                        registerImmediate = function registerImmediate(handle) {
                            channel.port2.postMessage(handle);
                        };
                    }

                    function installReadyStateChangeImplementation() {
                        var html = doc.documentElement;
                        registerImmediate = function registerImmediate(handle) {
                            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
                            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
                            var script = doc.createElement("script");
                            script.onreadystatechange = function () {
                                runIfPresent(handle);
                                script.onreadystatechange = null;
                                html.removeChild(script);
                                script = null;
                            };
                            html.appendChild(script);
                        };
                    }

                    function installSetTimeoutImplementation() {
                        registerImmediate = function registerImmediate(handle) {
                            setTimeout(runIfPresent, 0, handle);
                        };
                    }

                    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
                    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
                    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

                    // Don't get fooled by e.g. browserify environments.
                    if ({}.toString.call(global.process) === "[object process]") {
                        // For Node.js before 0.9
                        installNextTickImplementation();
                    } else if (canUsePostMessage()) {
                        // For non-IE10 modern browsers
                        installPostMessageImplementation();
                    } else if (global.MessageChannel) {
                        // For web workers, where supported
                        installMessageChannelImplementation();
                    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
                        // For IE 6–8
                        installReadyStateChangeImplementation();
                    } else {
                        // For older browsers
                        installSetTimeoutImplementation();
                    }

                    attachTo.setImmediate = setImmediate;
                    attachTo.clearImmediate = clearImmediate;
                })(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self);

                /* WEBPACK VAR INJECTION */
            }).call(exports, __webpack_require__(1), __webpack_require__(7));

            /***/
        },
        /* 7 */
        /***/function (module, exports) {

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
            function defaultClearTimeout() {
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
            })();
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
                } catch (e) {
                    try {
                        // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                        return cachedSetTimeout.call(null, fun, 0);
                    } catch (e) {
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
                } catch (e) {
                    try {
                        // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                        return cachedClearTimeout.call(null, marker);
                    } catch (e) {
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
                while (len) {
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

            process.listeners = function (name) {
                return [];
            };

            process.binding = function (name) {
                throw new Error('process.binding is not supported');
            };

            process.cwd = function () {
                return '/';
            };
            process.chdir = function (dir) {
                throw new Error('process.chdir is not supported');
            };
            process.umask = function () {
                return 0;
            };

            /***/
        },
        /* 8 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            exports.decode = exports.parse = __webpack_require__(22);
            exports.encode = exports.stringify = __webpack_require__(23);

            /***/
        },
        /* 9 */
        /***/function (module, exports) {

            module.exports = function (module) {
                if (!module.webpackPolyfill) {
                    module.deprecate = function () {};
                    module.paths = [];
                    // module.parent = undefined by default
                    if (!module.children) module.children = [];
                    Object.defineProperty(module, "loaded", {
                        enumerable: true,
                        get: function get() {
                            return module.l;
                        }
                    });
                    Object.defineProperty(module, "id", {
                        enumerable: true,
                        get: function get() {
                            return module.i;
                        }
                    });
                    module.webpackPolyfill = 1;
                }
                return module;
            };

            /***/
        },,
        /* 10 */
        /* 11 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            // require("isomorphic-fetch");
            var utils_1 = __webpack_require__(0);
            var defaults = {
                method: "GET",
                credentials: "include",
                redirect: "follow"
            };
            var request = function request(url, options) {
                var opts = _extends({}, defaults, options);
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

            /***/
        },
        /* 12 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var utils_1 = __webpack_require__(0);
            var IPermissions_1 = __webpack_require__(29);
            /** Allows you to check the permissions of a securable (list or site) */
            var Securable = function () {
                function Securable(baseUrl, ctx) {
                    this.baseUrl = baseUrl;
                    this._dao = ctx;
                }
                /** Gets all the role assignments on that securable  */
                Securable.prototype.getRoleAssignments = function () {
                    var url = this.baseUrl + "/RoleAssignments?$expand=Member,RoleDefinitionBindings";
                    return this._dao.get(url).then(utils_1.default.validateODataV2).then(function (results) {
                        return results.map(transformRoleAssignment);
                    });
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
                    var req = !email ? this._dao.get('/web/getuserbyid(' + _spPageContextInfo.userId + ')').then(function (data) {
                        return data.d;
                    }) : this._dao.web.getUser(email);
                    return req.then(function (user) {
                        return _this.checkPrivs(user);
                    }).then(function (privs) {
                        return permissionMaskToStrings(privs.GetUserEffectivePermissions.Low, privs.GetUserEffectivePermissions.High);
                    });
                };
                return Securable;
            }();
            exports.default = Securable;
            var transformRoleAssignment = function transformRoleAssignment(raw) {
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
            var permissionMaskToStrings = function permissionMaskToStrings(lowMask, highMask) {
                var permissions = [];
                IPermissions_1.basePermissions.forEach(function (basePermission) {
                    if ((basePermission.low & lowMask) > 0 || (basePermission.high & highMask) > 0) {
                        permissions.push(basePermission.name);
                    }
                });
                return permissions;
            };

            /***/
        },,,,,,
        /* 13 */
        /* 14 */
        /* 15 */
        /* 16 */
        /* 17 */
        /* 18 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* WEBPACK VAR INJECTION */
            (function (global) {
                var promise_polyfill_1 = __webpack_require__(19);
                var SPScript_1 = __webpack_require__(20);
                if (!global.Promise) {
                    global.Promise = promise_polyfill_1.default;
                }
                module.exports = SPScript_1.default;

                /* WEBPACK VAR INJECTION */
            }).call(exports, __webpack_require__(1));

            /***/
        },
        /* 19 */
        /***/function (module, exports, __webpack_require__) {

            /* WEBPACK VAR INJECTION */(function (setImmediate) {
                (function (root) {

                    // Store setTimeout reference so promise-polyfill will be unaffected by
                    // other code modifying setTimeout (like sinon.useFakeTimers())
                    var setTimeoutFunc = setTimeout;

                    function noop() {}

                    // Polyfill for Function.prototype.bind
                    function bind(fn, thisArg) {
                        return function () {
                            fn.apply(thisArg, arguments);
                        };
                    }

                    function Promise(fn) {
                        if (_typeof(this) !== 'object') throw new TypeError('Promises must be constructed via new');
                        if (typeof fn !== 'function') throw new TypeError('not a function');
                        this._state = 0;
                        this._handled = false;
                        this._value = undefined;
                        this._deferreds = [];

                        doResolve(fn, this);
                    }

                    function handle(self, deferred) {
                        while (self._state === 3) {
                            self = self._value;
                        }
                        if (self._state === 0) {
                            self._deferreds.push(deferred);
                            return;
                        }
                        self._handled = true;
                        Promise._immediateFn(function () {
                            var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
                            if (cb === null) {
                                (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
                                return;
                            }
                            var ret;
                            try {
                                ret = cb(self._value);
                            } catch (e) {
                                reject(deferred.promise, e);
                                return;
                            }
                            resolve(deferred.promise, ret);
                        });
                    }

                    function resolve(self, newValue) {
                        try {
                            // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
                            if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
                            if (newValue && ((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) === 'object' || typeof newValue === 'function')) {
                                var then = newValue.then;
                                if (newValue instanceof Promise) {
                                    self._state = 3;
                                    self._value = newValue;
                                    finale(self);
                                    return;
                                } else if (typeof then === 'function') {
                                    doResolve(bind(then, newValue), self);
                                    return;
                                }
                            }
                            self._state = 1;
                            self._value = newValue;
                            finale(self);
                        } catch (e) {
                            reject(self, e);
                        }
                    }

                    function reject(self, newValue) {
                        self._state = 2;
                        self._value = newValue;
                        finale(self);
                    }

                    function finale(self) {
                        if (self._state === 2 && self._deferreds.length === 0) {
                            Promise._immediateFn(function () {
                                if (!self._handled) {
                                    Promise._unhandledRejectionFn(self._value);
                                }
                            });
                        }

                        for (var i = 0, len = self._deferreds.length; i < len; i++) {
                            handle(self, self._deferreds[i]);
                        }
                        self._deferreds = null;
                    }

                    function Handler(onFulfilled, onRejected, promise) {
                        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
                        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
                        this.promise = promise;
                    }

                    /**
                     * Take a potentially misbehaving resolver function and make sure
                     * onFulfilled and onRejected are only called once.
                     *
                     * Makes no guarantees about asynchrony.
                     */
                    function doResolve(fn, self) {
                        var done = false;
                        try {
                            fn(function (value) {
                                if (done) return;
                                done = true;
                                resolve(self, value);
                            }, function (reason) {
                                if (done) return;
                                done = true;
                                reject(self, reason);
                            });
                        } catch (ex) {
                            if (done) return;
                            done = true;
                            reject(self, ex);
                        }
                    }

                    Promise.prototype['catch'] = function (onRejected) {
                        return this.then(null, onRejected);
                    };

                    Promise.prototype.then = function (onFulfilled, onRejected) {
                        var prom = new this.constructor(noop);

                        handle(this, new Handler(onFulfilled, onRejected, prom));
                        return prom;
                    };

                    Promise.all = function (arr) {
                        var args = Array.prototype.slice.call(arr);

                        return new Promise(function (resolve, reject) {
                            if (args.length === 0) return resolve([]);
                            var remaining = args.length;

                            function res(i, val) {
                                try {
                                    if (val && ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' || typeof val === 'function')) {
                                        var then = val.then;
                                        if (typeof then === 'function') {
                                            then.call(val, function (val) {
                                                res(i, val);
                                            }, reject);
                                            return;
                                        }
                                    }
                                    args[i] = val;
                                    if (--remaining === 0) {
                                        resolve(args);
                                    }
                                } catch (ex) {
                                    reject(ex);
                                }
                            }

                            for (var i = 0; i < args.length; i++) {
                                res(i, args[i]);
                            }
                        });
                    };

                    Promise.resolve = function (value) {
                        if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.constructor === Promise) {
                            return value;
                        }

                        return new Promise(function (resolve) {
                            resolve(value);
                        });
                    };

                    Promise.reject = function (value) {
                        return new Promise(function (resolve, reject) {
                            reject(value);
                        });
                    };

                    Promise.race = function (values) {
                        return new Promise(function (resolve, reject) {
                            for (var i = 0, len = values.length; i < len; i++) {
                                values[i].then(resolve, reject);
                            }
                        });
                    };

                    // Use polyfill for setImmediate for performance gains
                    Promise._immediateFn = typeof setImmediate === 'function' && function (fn) {
                        setImmediate(fn);
                    } || function (fn) {
                        setTimeoutFunc(fn, 0);
                    };

                    Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
                        if (typeof console !== 'undefined' && console) {
                            console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
                        }
                    };

                    /**
                     * Set the immediate function to execute callbacks
                     * @param fn {function} Function to execute
                     * @deprecated
                     */
                    Promise._setImmediateFn = function _setImmediateFn(fn) {
                        Promise._immediateFn = fn;
                    };

                    /**
                     * Change the function to execute on unhandled rejection
                     * @param {function} fn Function to execute on unhandled rejection
                     * @deprecated
                     */
                    Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
                        Promise._unhandledRejectionFn = fn;
                    };

                    if (typeof module !== 'undefined' && module.exports) {
                        module.exports = Promise;
                    } else if (!root.Promise) {
                        root.Promise = Promise;
                    }
                })(this);

                /* WEBPACK VAR INJECTION */
            }).call(exports, __webpack_require__(5).setImmediate);

            /***/
        },
        /* 20 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* WEBPACK VAR INJECTION */
            (function (global) {
                Object.defineProperty(exports, "__esModule", { value: true });
                var utils_1 = __webpack_require__(0);
                var Context_1 = __webpack_require__(27);
                var csr_1 = __webpack_require__(40);
                var spscript = {
                    utils: utils_1.default,
                    CSR: csr_1.default,
                    createContext: function createContext(url, options) {
                        try {
                            if (!url && global._spPageContextInfo) {
                                url = global._spPageContextInfo.webAbsoluteUrl;
                            }
                            return new Context_1.default(url, options);
                        } catch (ex) {
                            throw new Error("Unable to create SPScript Context: " + ex.message);
                        }
                    }
                };
                exports.default = spscript;

                /* WEBPACK VAR INJECTION */
            }).call(exports, __webpack_require__(1));

            /***/
        },
        /* 21 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var qs = __webpack_require__(8);
            function fromObj(obj, quoteValues) {
                var writeParam = function writeParam(key) {
                    var value = (obj[key] + "").trim();
                    // if there is a space, wrap in single quotes
                    if (value.indexOf(" ") > -1 || quoteValues) value = "'" + value + "'";
                    return key + "=" + value;
                };
                var str = Object.keys(obj).map(writeParam).join("&");
                return str;
            }
            exports.fromObj = fromObj;
            function toObj(str) {
                //if no string is passed use window.location.search
                if (str === undefined && window && window.location && window.location.search) {
                    str = window.location.search;
                }
                if (!str) return {};
                //trim off the leading '?' if its there
                if (str[0] === "?") str = str.substr(1);
                return qs.parse(str);
            }
            exports.toObj = toObj;

            /***/
        },
        /* 22 */
        /***/function (module, exports, __webpack_require__) {

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

            module.exports = function (qs, sep, eq, options) {
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
                        kstr,
                        vstr,
                        k,
                        v;

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

            /***/
        },
        /* 23 */
        /***/function (module, exports, __webpack_require__) {

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


            var stringifyPrimitive = function stringifyPrimitive(v) {
                switch (typeof v === 'undefined' ? 'undefined' : _typeof(v)) {
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

            module.exports = function (obj, sep, eq, name) {
                sep = sep || '&';
                eq = eq || '=';
                if (obj === null) {
                    obj = undefined;
                }

                if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
                    return map(objectKeys(obj), function (k) {
                        var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
                        if (isArray(obj[k])) {
                            return map(obj[k], function (v) {
                                return ks + encodeURIComponent(stringifyPrimitive(v));
                            }).join(sep);
                        } else {
                            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
                        }
                    }).join(sep);
                }

                if (!name) return '';
                return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
            };

            var isArray = Array.isArray || function (xs) {
                return Object.prototype.toString.call(xs) === '[object Array]';
            };

            function map(xs, f) {
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

            /***/
        },
        /* 24 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            ;
            var jsonMimeType = "application/json;odata=verbose";
            function getStandardHeaders(digest) {
                var headers = {
                    "Accept": jsonMimeType,
                    "Content-Type": jsonMimeType
                };
                if (digest) headers["X-RequestDigest"] = digest;
                return headers;
            }
            var getAddHeaders = getStandardHeaders;
            var getFilestreamHeaders = function getFilestreamHeaders(digest) {
                return {
                    'Accept': jsonMimeType,
                    'X-RequestDigest': digest,
                    'Content-Type': "application/octet-stream",
                    'binaryStringRequestBody': "true"
                };
            };
            var getActionHeaders = function getActionHeaders(verb, digest) {
                return _extends({}, getStandardHeaders(digest), {
                    "X-HTTP-Method": verb
                });
            };
            var decorateETag = function decorateETag(headers, etag) {
                if (etag) headers["If-Match"] = etag;
                return headers;
            };
            var getUpdateHeaders = function getUpdateHeaders(digest, etag) {
                return decorateETag(getActionHeaders("MERGE", digest), etag);
            };
            var getDeleteHeaders = function getDeleteHeaders(digest, etag) {
                return decorateETag(getActionHeaders("DELETE", digest), etag);
            };
            var headerUtils = {
                getStandardHeaders: getStandardHeaders,
                getAddHeaders: getAddHeaders,
                getFilestreamHeaders: getFilestreamHeaders,
                getUpdateHeaders: getUpdateHeaders,
                getDeleteHeaders: getDeleteHeaders,
                getActionHeaders: getActionHeaders
            };
            exports.default = headerUtils;

            /***/
        },
        /* 25 */
        /***/function (module, exports, __webpack_require__) {

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
                            if (!isAbort) resolve();else reject;
                        }
                    };
                    scriptTag.src = url;
                });
            };
            exports.loadScripts = function (urls) {
                return Promise.all(urls.map(exports.loadScript));
            };

            /***/
        },
        /* 26 */
        /***/function (module, exports, __webpack_require__) {

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
                    } else {
                        return false;
                    }
                }
                return true;
            };
            var _waitForLibraries = function _waitForLibraries(namespaces, resolve) {
                var missing = namespaces.filter(function (namespace) {
                    return !exports.validateNamespace(namespace);
                });
                if (missing.length === 0) resolve();else setTimeout(function () {
                    return _waitForLibraries(namespaces, resolve);
                }, 25);
            };
            exports.waitForLibraries = function (namespaces) {
                return new Promise(function (resolve, reject) {
                    return _waitForLibraries(namespaces, resolve);
                });
            };
            exports.waitForLibrary = function (namespace) {
                return exports.waitForLibraries([namespace]);
            };
            exports.waitForElement = function (selector, timeout) {
                if (timeout === void 0) {
                    timeout = 5000;
                }
                var counter = 0;
                var INTERVAL = 25; //milliseconds
                var MAX_ATTEMPTS = timeout / INTERVAL; // eventually give up
                return new Promise(function (resolve, reject) {
                    var _waitForElement = function _waitForElement() {
                        if (counter > MAX_ATTEMPTS) reject("Unable to find element: " + selector);
                        var elem = document.querySelector(selector);
                        if (!elem) {
                            counter++;
                            setTimeout(_waitForElement, INTERVAL);
                        } else resolve(elem);
                    };
                    _waitForElement();
                });
            };

            /***/
        },
        /* 27 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
                return new (P || (P = Promise))(function (resolve, reject) {
                    function fulfilled(value) {
                        try {
                            step(generator.next(value));
                        } catch (e) {
                            reject(e);
                        }
                    }
                    function rejected(value) {
                        try {
                            step(generator["throw"](value));
                        } catch (e) {
                            reject(e);
                        }
                    }
                    function step(result) {
                        result.done ? resolve(result.value) : new P(function (resolve) {
                            resolve(result.value);
                        }).then(fulfilled, rejected);
                    }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                });
            };
            var __generator = this && this.__generator || function (thisArg, body) {
                var _ = { label: 0, sent: function sent() {
                        if (t[0] & 1) throw t[1];return t[1];
                    }, trys: [], ops: [] },
                    f,
                    y,
                    t,
                    g;
                return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
                    return this;
                }), g;
                function verb(n) {
                    return function (v) {
                        return step([n, v]);
                    };
                }
                function step(op) {
                    if (f) throw new TypeError("Generator is already executing.");
                    while (_) {
                        try {
                            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                            if (y = 0, t) op = [0, t.value];
                            switch (op[0]) {
                                case 0:case 1:
                                    t = op;break;
                                case 4:
                                    _.label++;return { value: op[1], done: false };
                                case 5:
                                    _.label++;y = op[1];op = [0];continue;
                                case 7:
                                    op = _.ops.pop();_.trys.pop();continue;
                                default:
                                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                        _ = 0;continue;
                                    }
                                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                                        _.label = op[1];break;
                                    }
                                    if (op[0] === 6 && _.label < t[1]) {
                                        _.label = t[1];t = op;break;
                                    }
                                    if (t && _.label < t[2]) {
                                        _.label = t[2];_.ops.push(op);break;
                                    }
                                    if (t[2]) _.ops.pop();
                                    _.trys.pop();continue;
                            }
                            op = body.call(thisArg, _);
                        } catch (e) {
                            op = [6, e];y = 0;
                        } finally {
                            f = t = 0;
                        }
                    }if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
                }
            };
            Object.defineProperty(exports, "__esModule", { value: true });
            var request_1 = __webpack_require__(11);
            var utils_1 = __webpack_require__(0);
            var List_1 = __webpack_require__(28);
            var Web_1 = __webpack_require__(30);
            var Search_1 = __webpack_require__(31);
            var CustomActions_1 = __webpack_require__(33);
            var Profiles_1 = __webpack_require__(35);
            var tokenHelper_1 = __webpack_require__(36);
            var Context = function () {
                function Context(url, options) {
                    if (options === void 0) {
                        options = {};
                    }
                    var _this = this;
                    this.webUrl = url;
                    this.clientId = options.clientId;
                    this.clientSecret = options.clientSecret;
                    // TODO serverside: replace with tokenHelper.getAppOnlyToken(this.webUrl, this.clientKey, this.clientSecret).then(token => this.accessToken = token);
                    this.ensureToken = !options.clientId ? Promise.resolve(true) : tokenHelper_1.getAppOnlyToken(url, options.clientId, options.clientSecret).then(function (token) {
                        return _this.accessToken = token;
                    });
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
                                case 0:
                                    return [4 /*yield*/, this.ensureToken];
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
                                    requestOptions = _extends({}, defaultOptions, opts);
                                    if (this.accessToken) {
                                        requestOptions.headers["Authorization"] = "Bearer " + this.accessToken;
                                    }
                                    return [2 /*return*/, request_1.default(fullUrl, requestOptions)];
                            }
                        });
                    });
                };
                /** Make a 'GET' request to the '<site>/_api' relative url. */
                Context.prototype.get = function (url, opts) {
                    var options = _extends({}, { method: "GET" }, opts);
                    return this.executeRequest(url, options).then(utils_1.default.parseJSON);
                };
                /** Make a 'POST' request to the '<site>/_api' relative url. */
                Context.prototype.post = function (url, body, opts) {
                    body = this._packagePostBody(body, opts);
                    var options = {
                        method: "POST",
                        body: body
                    };
                    options = _extends({}, options, opts);
                    return this.executeRequest(url, options).then(utils_1.default.parseJSON);
                };
                /** Make a 'POST' request to the '<site>/_api' relative url. SPScript will handle authorizing the request for you.*/
                Context.prototype.authorizedPost = function (url, body, verb) {
                    var _this = this;
                    return this.getRequestDigest().then(function (digest) {
                        return utils_1.default.headers.getActionHeaders(verb, digest);
                    }).then(function (headers) {
                        return _this.post(url, body, { headers: headers });
                    });
                };
                Context.prototype._ensureRequestDigest = function (digest) {
                    return digest ? Promise.resolve(digest) : this.getRequestDigest();
                };
                /** Get a Request Digest token to authorize a request */
                Context.prototype.getRequestDigest = function () {
                    return this.post("/contextInfo", {}).then(function (data) {
                        return data["d"].GetContextWebInformation.FormDigestValue;
                    });
                };
                /** Get an SPScript List instance */
                Context.prototype.lists = function (name) {
                    return new List_1.default(name, this);
                };
                Context.prototype._packagePostBody = function (body, opts) {
                    // if its already a string just return
                    if (typeof body === "string") return body;
                    // if it has an explicit content-type, asssume the body is already that type
                    if (opts && opts.headers && opts.headers["Content-Type"] && opts.headers["Content-Type"].indexOf("json") === -1) {
                        return body;
                    }
                    //others stringify
                    return JSON.stringify(body);
                };
                return Context;
            }();
            exports.default = Context;

            /***/
        },
        /* 28 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var utils_1 = __webpack_require__(0);
            var Securable_1 = __webpack_require__(12);
            var List = function () {
                function List(name, ctx) {
                    this.listName = name;
                    this.baseUrl = "/web/lists/getbytitle('" + this.listName + "')";
                    this._dao = ctx;
                    this.permissions = new Securable_1.default(this.baseUrl, ctx);
                }
                /** Get items from the list. Will return all items if no OData is passed. */
                List.prototype.getItems = function (odata) {
                    return this._dao.get(this.baseUrl + "/items" + appendOData(odata)).then(utils_1.default.validateODataV2);
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
                    return this._dao.get(viewUrl).then(utils_1.default.validateODataV2).then(function (view) {
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
                    }).then(utils_1.default.validateODataV2);
                };
                /** Gets you all items whose field(key) matches the value. Currently only text and number columns are supported. */
                List.prototype.findItems = function (key, value, odata) {
                    var filterValue = typeof value === "string" ? "'" + value + "'" : value;
                    odata = "$filter=" + key + " eq " + filterValue + appendOData(odata, "&");
                    return this.getItems(odata);
                };
                /** Get the item whose field(key) matches the value. If multiple matches are found, the first is returned. Currently only text and number columns are supported. */
                List.prototype.findItem = function (key, value, odata) {
                    return this.findItems(key, value, odata).then(function (items) {
                        if (items && items.length && items.length > 0) return items[0];
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
                        return _this._dao.get(_this.baseUrl).then(function (data) {
                            //decorate the item with the 'type' metadata
                            item = _extends({}, {
                                "__metadata": {
                                    "type": data["d"].ListItemEntityTypeFullName
                                }
                            }, item);
                            var customOptions = {
                                headers: utils_1.default.headers.getAddHeaders(digest)
                            };
                            return _this._dao.post(_this.baseUrl + "/items", item, customOptions);
                        }).then(utils_1.default.validateODataV2);
                    });
                };
                /** Takes a SharePoint Id, and updates that item ONLY with properties that are found in the passed in updates object. */
                List.prototype.updateItem = function (itemId, updates, digest) {
                    var _this = this;
                    return this._dao._ensureRequestDigest(digest).then(function (digest) {
                        return _this.getItemById(itemId).then(function (item) {
                            //decorate the item with the 'type' metadata
                            updates = _extends({}, {
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
            }();
            exports.default = List;
            var appendOData = function appendOData(odata, prefix) {
                prefix = prefix || "?";
                if (odata) return prefix + odata;
                return "";
            };

            /***/
        },
        /* 29 */
        /***/function (module, exports, __webpack_require__) {

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

            /***/
        },
        /* 30 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var utils_1 = __webpack_require__(0);
            var Securable_1 = __webpack_require__(12);
            var Web = function () {
                function Web(ctx) {
                    this.baseUrl = "/web";
                    this._dao = ctx;
                    this.permissions = new Securable_1.default(this.baseUrl, ctx);
                }
                /** Retrieves basic information about the site */
                Web.prototype.getInfo = function () {
                    return this._dao.get(this.baseUrl).then(utils_1.default.validateODataV2);
                };
                /** Retrieves all of the subsites */
                Web.prototype.getSubsites = function () {
                    return this._dao.get(this.baseUrl + "/webinfos").then(utils_1.default.validateODataV2);
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
                    return this._dao._ensureRequestDigest(digest).then(function (digest) {
                        return _this._copyFile(sourceUrl, destinationUrl, digest);
                    });
                };
                return Web;
            }();
            exports.default = Web;

            /***/
        },
        /* 31 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var utils_1 = __webpack_require__(0);
            var searchMappers_1 = __webpack_require__(32);
            var Search = function () {
                function Search(ctx) {
                    this._dao = ctx;
                }
                ;
                Object.defineProperty(Search.prototype, "defaultQueryOptions", {
                    /** get default/empty QueryOptions */
                    get: function get() {
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
                    if (queryOptions === void 0) {
                        queryOptions = {};
                    }
                    var optionsQueryString = utils_1.default.qs.fromObj(queryOptions, true);
                    var url = "/search/query?querytext='" + queryText + "'&" + optionsQueryString;
                    return this._dao.get(url).then(utils_1.default.validateODataV2).then(function (resp) {
                        if (resp.query) return searchMappers_1.mapResponse(resp.query);
                        throw new Error("Invalid response back from search service");
                    });
                };
                ;
                /** Query for only People results */
                Search.prototype.people = function (queryText, queryOptions) {
                    if (queryOptions === void 0) {
                        queryOptions = {};
                    }
                    queryOptions.sourceid = 'b09a7990-05ea-4af9-81ef-edfab16c4e31';
                    return this.query(queryText, queryOptions);
                };
                ;
                /** Query for only sites (STS_Web). Optionally pass in a url scope. */
                Search.prototype.sites = function (queryText, urlScope, queryOptions) {
                    if (queryText === void 0) {
                        queryText = "";
                    }
                    if (urlScope === void 0) {
                        urlScope = "";
                    }
                    if (queryOptions === void 0) {
                        queryOptions = {};
                    }
                    urlScope = urlScope ? "Path:" + urlScope + "*" : "";
                    var query = (queryText + " contentclass:STS_Web " + urlScope).trim();
                    queryOptions.rowlimit = queryOptions.rowlimit || 499;
                    return this.query(query, queryOptions);
                };
                ;
                return Search;
            }();
            exports.default = Search;

            /***/
        },
        /* 32 */
        /***/function (module, exports, __webpack_require__) {

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
                    var row = itemRows[i],
                        item = {};
                    for (var j = 0; j < row.Cells.results.length; j++) {
                        item[row.Cells.results[j].Key] = row.Cells.results[j].Value;
                    }
                    items.push(item);
                }
                return items;
            };

            /***/
        },
        /* 33 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var utils_1 = __webpack_require__(0);
            var ICustomActions_1 = __webpack_require__(34);
            var CustomActions = function () {
                function CustomActions(ctx) {
                    this._dao = ctx;
                }
                CustomActions.prototype.getScope = function (scopeId) {
                    if (scopeId === 3) return ICustomActions_1.scopes.Web;
                    if (scopeId === 2) return ICustomActions_1.scopes.Site;
                    throw new Error("Invalid Custom Action Scope");
                };
                CustomActions.prototype.get = function (name) {
                    var _this = this;
                    // first get the site scoped ones, then the web scoped ones
                    return this._dao.get(ICustomActions_1.scopes.Site.url).then(utils_1.default.validateODataV2).then(function (siteCustomActions) {
                        return _this._dao.get(ICustomActions_1.scopes.Web.url).then(utils_1.default.validateODataV2).then(function (webCustomActions) {
                            return siteCustomActions.concat(webCustomActions);
                        });
                    }).then(function (customActions) {
                        // if a name was passed filter it otherwise return everything
                        if (name) {
                            var matches = customActions.filter(function (a) {
                                return a.Name === name;
                            });
                            if (matches.length) {
                                return matches[0];
                            }
                            throw new Error("Unable to find Custom Action with name: " + name);
                        } else return customActions;
                    });
                };
                /** Gets the API url of a specific Custom Action */
                CustomActions.prototype._getUrl = function (name) {
                    var _this = this;
                    return this.get(name).then(function (a) {
                        return _this.getScope(a.Scope).url + "('" + a.Id + "')";
                    });
                };
                CustomActions.prototype._getUrlAndDigest = function (name) {
                    var _this = this;
                    var prep = {};
                    return this._getUrl(name).then(function (url) {
                        prep.url = url;
                        return _this._dao.getRequestDigest();
                    }).then(function (digest) {
                        prep.digest = digest;
                        return prep;
                    });
                };
                /** Update an existing Custom Action. You must pass a custom action with a 'Name' property */
                CustomActions.prototype.update = function (updates) {
                    var _this = this;
                    if (!updates || !updates.Name) throw new Error("You must at least pass a Custom Action 'Name'");
                    return this._getUrlAndDigest(updates.Name).then(function (prep) {
                        updates = _extends({}, ICustomActions_1.metadata, updates);
                        var opts = {
                            headers: utils_1.default.headers.getUpdateHeaders(prep.digest)
                        };
                        return _this._dao.post(prep.url, updates, opts);
                    });
                };
                /** Remove an existing Custom Action. Searches both Site and Web scoped */
                CustomActions.prototype.remove = function (name) {
                    var _this = this;
                    if (!name) throw new Error("You must at least pass an existing Custom Action name");
                    return this._getUrlAndDigest(name).then(function (prep) {
                        var opts = {
                            headers: utils_1.default.headers.getDeleteHeaders(prep.digest)
                        };
                        return _this._dao.post(prep.url, {}, opts);
                    });
                };
                /** Adds a new custom action. If the custom action name already exists, it will be deleted first */
                CustomActions.prototype.add = function (customAction) {
                    var _this = this;
                    if (!customAction || !customAction.Name) throw new Error("You must at least pass a Custom Action 'Name'");
                    var defaults = {
                        Name: customAction.Name,
                        Title: customAction.Name,
                        Description: customAction.Name,
                        Group: customAction.Name,
                        Sequence: 100,
                        Scope: "Site",
                        Location: "ScriptLink"
                    };
                    customAction = _extends({}, defaults, customAction);
                    // if it exists already, delete it
                    return this.get().then(function (existingCustomActions) {
                        if (existingCustomActions.filter(function (ca) {
                            return ca.Name === customAction.Name;
                        }).length) {
                            return _this.remove(customAction.Name);
                        }
                        return true;
                    }).then(function () {
                        return _this._dao.getRequestDigest();
                    }).then(function (digest) {
                        customAction = _extends({}, ICustomActions_1.metadata, customAction);
                        var scope = ICustomActions_1.scopes[customAction.Scope];
                        customAction.Scope = scope.id;
                        var opts = {
                            headers: utils_1.default.headers.getAddHeaders(digest)
                        };
                        return _this._dao.post(scope.url, customAction, opts);
                    });
                };
                CustomActions.prototype.addScriptBlock = function (name, block, opts) {
                    if (opts === void 0) {
                        opts = {};
                    }
                    var customAction = {
                        Name: name,
                        ScriptBlock: block
                    };
                    customAction = _extends({}, customAction, opts);
                    return this.add(customAction);
                };
                /** Injects a CSS file onto your site. Defaults to Site scoped */
                CustomActions.prototype.addCSSLink = function (name, url, opts) {
                    if (opts === void 0) {
                        opts = {};
                    }
                    var scriptBlockStr = "\n\t\t(function() {\n\t\t\tvar head = document.querySelector(\"head\");\n\t\t\tvar styleTag = document.createElement(\"style\");\n\t\t\tstyleTag.appendChild(document.createTextNode(\"body { opacity: 0 }\"));\n\t\t\t\n\t\t\tvar linkTag = document.createElement(\"link\");\n\t\t\tlinkTag.rel = \"stylesheet\";\tlinkTag.href = \"" + url + "\"; linkTag.type = \"text/css\";\n\t\t\tlinkTag.addEventListener(\"load\", function() {\n\t\t\t\thead.removeChild(styleTag);\n\t\t\t});\n\n\t\t\thead.appendChild(styleTag);\n\t\t\thead.appendChild(linkTag);\n\t\t})();";
                    return this.addScriptBlock(name, scriptBlockStr, opts);
                };
                CustomActions.prototype.addScriptLink = function (name, url, opts) {
                    if (opts === void 0) {
                        opts = {};
                    }
                    var scriptBlockStr = "\n\t\t(function() {\n\t\t\tvar head = document.querySelector(\"head\");\n\t\t\tvar scriptTag = document.createElement(\"script\");\n            scriptTag.src = \"" + url + "\";\n            scriptTag.type = \"text/javascript\";\n\t\t\thead.appendChild(scriptTag);\n\t\t})();";
                    return this.addScriptBlock(name, scriptBlockStr, opts);
                };
                return CustomActions;
            }();
            exports.default = CustomActions;
            ;

            /***/
        },
        /* 34 */
        /***/function (module, exports, __webpack_require__) {

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

            /***/
        },
        /* 35 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var utils_1 = __webpack_require__(0);
            var Profiles = function () {
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
                    if (!user) return this.current();
                    return this.getUserObj(user).then(function (user) {
                        var login = encodeURIComponent(user.LoginName || user.AccountName);
                        var url = _this.baseUrl + "/GetPropertiesFor(accountName=@v)?@v='" + login + "'";
                        return _this._dao.get(url).then(utils_1.default.validateODataV2).then(transformPersonProperties);
                    });
                };
                Profiles.prototype.getUserObj = function (user) {
                    if (!user || typeof user === "string") {
                        return this._dao.web.getUser(user);
                    } else if (user.AccountName || user.LoginName) {
                        return Promise.resolve(user);
                    } else throw new Error("profiles.setProperty Error: Invalid user parameter");
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
            }();
            exports.default = Profiles;
            var transformPersonProperties = function transformPersonProperties(profile) {
                console.log(profile);
                profile.UserProfileProperties.results.forEach(function (keyvalue) {
                    profile[keyvalue.Key] = keyvalue.Value;
                });
                return profile;
            };

            /***/
        },
        /* 36 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var url_1 = __webpack_require__(37);
            var querystring = __webpack_require__(8);
            var request_1 = __webpack_require__(11);
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
                        console.log(data);
                        return data.access_token;
                    });
                });
            };
            var getRealm = function getRealm(url) {
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
            var parseRealm = function parseRealm(raw) {
                var bearer = "Bearer realm=";
                if (raw && raw.startsWith("Bearer")) {
                    raw = raw.substr(7);
                    var params = raw.split(",").filter(function (p) {
                        return p.indexOf("=") > -1;
                    }).reduce(function (params, piece) {
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

            /***/
        },
        /* 37 */
        /***/function (module, exports, __webpack_require__) {

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


            var punycode = __webpack_require__(38);
            var util = __webpack_require__(39);

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
                querystring = __webpack_require__(8);

            function urlParse(url, parseQueryString, slashesDenoteHost) {
                if (url && util.isObject(url) && url instanceof Url) return url;

                var u = new Url();
                u.parse(url, parseQueryString, slashesDenoteHost);
                return u;
            }

            Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
                if (!util.isString(url)) {
                    throw new TypeError("Parameter 'url' must be a string, not " + (typeof url === 'undefined' ? 'undefined' : _typeof(url)));
                }

                // Copy chrome, IE, opera backslash-handling behavior.
                // Back slashes before the query string get converted to forward slashes
                // See: https://code.google.com/p/chromium/issues/detail?id=25916
                var queryIndex = url.indexOf('?'),
                    splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#',
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

                if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {

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
                        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
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
                        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
                    }
                    // if we still have not hit it, then the entire thing is a host.
                    if (hostEnd === -1) hostEnd = rest.length;

                    this.host = rest.slice(0, hostEnd);
                    rest = rest.slice(hostEnd);

                    // pull out port.
                    this.parseHost();

                    // we've indicated that there is a hostname,
                    // so even if it's empty, it has to be present.
                    this.hostname = this.hostname || '';

                    // if hostname begins with [ and ends with ]
                    // assume that it's an IPv6 address.
                    var ipv6Hostname = this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']';

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
                        if (rest.indexOf(ae) === -1) continue;
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
                if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
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

            Url.prototype.format = function () {
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
                    host = auth + (this.hostname.indexOf(':') === -1 ? this.hostname : '[' + this.hostname + ']');
                    if (this.port) {
                        host += ':' + this.port;
                    }
                }

                if (this.query && util.isObject(this.query) && Object.keys(this.query).length) {
                    query = querystring.stringify(this.query);
                }

                var search = this.search || query && '?' + query || '';

                if (protocol && protocol.substr(-1) !== ':') protocol += ':';

                // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
                // unless they had them to begin with.
                if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
                    host = '//' + (host || '');
                    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
                } else if (!host) {
                    host = '';
                }

                if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
                if (search && search.charAt(0) !== '?') search = '?' + search;

                pathname = pathname.replace(/[?#]/g, function (match) {
                    return encodeURIComponent(match);
                });
                search = search.replace('#', '%23');

                return protocol + host + pathname + search + hash;
            };

            function urlResolve(source, relative) {
                return urlParse(source, false, true).resolve(relative);
            }

            Url.prototype.resolve = function (relative) {
                return this.resolveObject(urlParse(relative, false, true)).format();
            };

            function urlResolveObject(source, relative) {
                if (!source) return relative;
                return urlParse(source, false, true).resolveObject(relative);
            }

            Url.prototype.resolveObject = function (relative) {
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
                        if (rkey !== 'protocol') result[rkey] = relative[rkey];
                    }

                    //urlParse appends trailing / to urls like http://www.example.com
                    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
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
                        while (relPath.length && !(relative.host = relPath.shift())) {}
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

                var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
                    isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === '/',
                    mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname,
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
                        if (srcPath[0] === '') srcPath[0] = result.host;else srcPath.unshift(result.host);
                    }
                    result.host = '';
                    if (relative.protocol) {
                        relative.hostname = null;
                        relative.port = null;
                        if (relative.host) {
                            if (relPath[0] === '') relPath[0] = relative.host;else relPath.unshift(relative.host);
                        }
                        relative.host = null;
                    }
                    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
                }

                if (isRelAbs) {
                    // it's absolute.
                    result.host = relative.host || relative.host === '' ? relative.host : result.host;
                    result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
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
                        var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
                        if (authInHost) {
                            result.auth = authInHost.shift();
                            result.host = result.hostname = authInHost.shift();
                        }
                    }
                    result.search = relative.search;
                    result.query = relative.query;
                    //to support http.request
                    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
                        result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
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
                var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === '.' || last === '..') || last === '';

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

                if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
                    srcPath.unshift('');
                }

                if (hasTrailingSlash && srcPath.join('/').substr(-1) !== '/') {
                    srcPath.push('');
                }

                var isAbsolute = srcPath[0] === '' || srcPath[0] && srcPath[0].charAt(0) === '/';

                // put the host back
                if (psychotic) {
                    result.hostname = result.host = isAbsolute ? '' : srcPath.length ? srcPath.shift() : '';
                    //occationaly the auth can get stuck only in host
                    //this especially happens in cases like
                    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
                    var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
                    if (authInHost) {
                        result.auth = authInHost.shift();
                        result.host = result.hostname = authInHost.shift();
                    }
                }

                mustEndAbs = mustEndAbs || result.host && srcPath.length;

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
                    result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
                }
                result.auth = relative.auth || result.auth;
                result.slashes = result.slashes || relative.slashes;
                result.href = result.format();
                return result;
            };

            Url.prototype.parseHost = function () {
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

            /***/
        },
        /* 38 */
        /***/function (module, exports, __webpack_require__) {

            /* WEBPACK VAR INJECTION */(function (module, global) {
                var __WEBPACK_AMD_DEFINE_RESULT__; /*! https://mths.be/punycode v1.4.1 by @mathias */
                ;(function (root) {

                    /** Detect free variables */
                    var freeExports = (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;
                    var freeModule = (typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;
                    var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global;
                    if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
                        root = freeGlobal;
                    }

                    /**
                     * The `punycode` object.
                     * @name punycode
                     * @type Object
                     */
                    var punycode,


                    /** Highest positive signed 32-bit float value */
                    maxInt = 2147483647,
                        // aka. 0x7FFFFFFF or 2^31-1

                    /** Bootstring parameters */
                    base = 36,
                        tMin = 1,
                        tMax = 26,
                        skew = 38,
                        damp = 700,
                        initialBias = 72,
                        initialN = 128,
                        // 0x80
                    delimiter = '-',
                        // '\x2D'

                    /** Regular expressions */
                    regexPunycode = /^xn--/,
                        regexNonASCII = /[^\x20-\x7E]/,
                        // unprintable ASCII chars + non-ASCII chars
                    regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,
                        // RFC 3490 separators

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
                                if ((extra & 0xFC00) == 0xDC00) {
                                    // low surrogate
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
                        return map(array, function (value) {
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
                        for (; /* no initialization */delta > baseMinusTMin * tMax >> 1; k += base) {
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

                        for (index = basic > 0 ? basic + 1 : 0; index < inputLength;) /* no final expression */{

                            // `index` is the index of the next character to be consumed.
                            // Decode a generalized variable-length integer into `delta`,
                            // which gets added to `i`. The overflow checking is easier
                            // if we increase `i` as we go, then subtract off its starting
                            // value at the end to obtain `delta`.
                            for (oldi = i, w = 1, k = base;; /* no condition */k += base) {

                                if (index >= inputLength) {
                                    error('invalid-input');
                                }

                                digit = basicToDigit(input.charCodeAt(index++));

                                if (digit >= base || digit > floor((maxInt - i) / w)) {
                                    error('overflow');
                                }

                                i += digit * w;
                                t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

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
                                    for (q = delta, k = base;; /* no condition */k += base) {
                                        t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                                        if (q < t) {
                                            break;
                                        }
                                        qMinusT = q - t;
                                        baseMinusT = base - t;
                                        output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
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
                        return mapDomain(input, function (string) {
                            return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
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
                        return mapDomain(input, function (string) {
                            return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
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
                    if (true) {
                        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
                            return punycode;
                        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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
                })(this);

                /* WEBPACK VAR INJECTION */
            }).call(exports, __webpack_require__(9)(module), __webpack_require__(1));

            /***/
        },
        /* 39 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            module.exports = {
                isString: function isString(arg) {
                    return typeof arg === 'string';
                },
                isObject: function isObject(arg) {
                    return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
                },
                isNull: function isNull(arg) {
                    return arg === null;
                },
                isNullOrUndefined: function isNullOrUndefined(arg) {
                    return arg == null;
                }
            };

            /***/
        },
        /* 40 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var utils_1 = __webpack_require__(0);
            var registerField = function registerField(field, renderer, opts) {
                if (opts === void 0) {
                    opts = {};
                }
                if (!utils_1.default.validateNamespace("SPClientTemplates.TemplateManager")) {
                    throw new Error("Unable to register CSR template.  SPClientTemplates.TemplateManager does not exist");
                }
                var renderers = {};
                //View, DisplayForm, EditForm, NewForm
                field.locations.forEach(function (l) {
                    return renderers[l] = renderer;
                });
                var defaults = {
                    Templates: {
                        Fields: {}
                    }
                };
                var templateOverride = _extends({}, defaults, opts);
                templateOverride.Templates.Fields[field.name] = renderers;
                SPClientTemplates.TemplateManager.RegisterTemplateOverrides(templateOverride);
                return field;
            };
            var registerDisplayField = function registerDisplayField(fieldComponent, opts) {
                if (opts === void 0) {
                    opts = {};
                }
                var renderer = createDisplayFieldRenderer(fieldComponent);
                fieldComponent.locations = fieldComponent.locations || ["View", "DisplayForm"];
                return registerField(fieldComponent, renderer, opts);
            };
            var registerFormField = function registerFormField(fieldComponent, opts) {
                if (opts === void 0) {
                    opts = {};
                }
                var renderer = createFormFieldRenderer(fieldComponent);
                fieldComponent.locations = fieldComponent.locations || ["NewForm", "EditForm"];
                return registerField(fieldComponent, renderer, opts);
            };
            function createFormFieldRenderer(field) {
                return function (ctx) {
                    var formCtx = ctx.FormContext;
                    // need to clone ctx, it is getting overwritten so we lost CurrentItem
                    var clonedCtx = _extends({}, ctx);
                    if (field.onReady) {
                        if (formCtx) {
                            formCtx.registerInitCallback(field.name, field.onReady.bind(null, clonedCtx));
                        } else {
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

            /***/
        }]
        /******/)
    );
});
//# sourceMappingURL=spscript.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).setImmediate, __webpack_require__(5).clearImmediate, __webpack_require__(9)(module)))

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.run = function (SPScript, ctx) {
	console.log("SPScript Env: " + SPScript._env);
	var should = __webpack_require__(2).should();

	describe("SPScript Global Namespace", function () {
		it("Should have a 'SPScript.createContext()' method", function () {
			SPScript.should.have.property("createContext");
			SPScript.createContext.should.be.a("function");
		});
		it("Should have a 'SPScript.utils' namespace", function () {
			SPScript.should.not.be.null;
			SPScript.should.have.property("utils");
		});
	});
	if (!ctx) __webpack_require__(72).run(SPScript);
	ctx = ctx || SPScript.createContext();

	__webpack_require__(73).run(ctx);
	__webpack_require__(74).run(ctx);
	__webpack_require__(76).run(ctx);
	__webpack_require__(77).run(ctx);
	__webpack_require__(78).run(ctx);
	__webpack_require__(75).run(SPScript.utils);
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var used = []
  , exports = module.exports = {};

/*!
 * Chai version
 */

exports.version = '1.10.0';

/*!
 * Assertion Error
 */

exports.AssertionError = __webpack_require__(45);

/*!
 * Utils for plugins (not exported)
 */

var util = __webpack_require__(46);

/**
 * # .use(function)
 *
 * Provides a way to extend the internals of Chai
 *
 * @param {Function}
 * @returns {this} for chaining
 * @api public
 */

exports.use = function (fn) {
  if (!~used.indexOf(fn)) {
    fn(this, util);
    used.push(fn);
  }

  return this;
};

/*!
 * Configuration
 */

var config = __webpack_require__(4);
exports.config = config;

/*!
 * Primary `Assertion` prototype
 */

var assertion = __webpack_require__(67);
exports.use(assertion);

/*!
 * Core Assertions
 */

var core = __webpack_require__(68);
exports.use(core);

/*!
 * Expect interface
 */

var expect = __webpack_require__(69);
exports.use(expect);

/*!
 * Should interface
 */

var should = __webpack_require__(70);
exports.use(should);

/*!
 * Assert interface
 */

var assert = __webpack_require__(71);
exports.use(assert);


/***/ }),
/* 45 */
/***/ (function(module, exports) {

/*!
 * assertion-error
 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Return a function that will copy properties from
 * one object to another excluding any originally
 * listed. Returned function will create a new `{}`.
 *
 * @param {String} excluded properties ...
 * @return {Function}
 */

function exclude () {
  var excludes = [].slice.call(arguments);

  function excludeProps (res, obj) {
    Object.keys(obj).forEach(function (key) {
      if (!~excludes.indexOf(key)) res[key] = obj[key];
    });
  }

  return function extendExclude () {
    var args = [].slice.call(arguments)
      , i = 0
      , res = {};

    for (; i < args.length; i++) {
      excludeProps(res, args[i]);
    }

    return res;
  };
};

/*!
 * Primary Exports
 */

module.exports = AssertionError;

/**
 * ### AssertionError
 *
 * An extension of the JavaScript `Error` constructor for
 * assertion and validation scenarios.
 *
 * @param {String} message
 * @param {Object} properties to include (optional)
 * @param {callee} start stack function (optional)
 */

function AssertionError (message, _props, ssf) {
  var extend = exclude('name', 'message', 'stack', 'constructor', 'toJSON')
    , props = extend(_props || {});

  // default values
  this.message = message || 'Unspecified AssertionError';
  this.showDiff = false;

  // copy from properties
  for (var key in props) {
    this[key] = props[key];
  }

  // capture stack trace
  ssf = ssf || arguments.callee;
  if (ssf && Error.captureStackTrace) {
    Error.captureStackTrace(this, ssf);
  }
}

/*!
 * Inherit from Error.prototype
 */

AssertionError.prototype = Object.create(Error.prototype);

/*!
 * Statically set name
 */

AssertionError.prototype.name = 'AssertionError';

/*!
 * Ensure correct constructor
 */

AssertionError.prototype.constructor = AssertionError;

/**
 * Allow errors to be converted to JSON for static transfer.
 *
 * @param {Boolean} include stack (default: `true`)
 * @return {Object} object that can be `JSON.stringify`
 */

AssertionError.prototype.toJSON = function (stack) {
  var extend = exclude('constructor', 'toJSON', 'stack')
    , props = extend({ name: this.name }, this);

  // include stack if exists and not turned off
  if (false !== stack && this.stack) {
    props.stack = this.stack;
  }

  return props;
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * chai
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Main exports
 */

var exports = module.exports = {};

/*!
 * test utility
 */

exports.test = __webpack_require__(47);

/*!
 * type utility
 */

exports.type = __webpack_require__(48);

/*!
 * message utility
 */

exports.getMessage = __webpack_require__(49);

/*!
 * actual utility
 */

exports.getActual = __webpack_require__(13);

/*!
 * Inspect util
 */

exports.inspect = __webpack_require__(10);

/*!
 * Object Display util
 */

exports.objDisplay = __webpack_require__(15);

/*!
 * Flag utility
 */

exports.flag = __webpack_require__(3);

/*!
 * Flag transferring utility
 */

exports.transferFlags = __webpack_require__(16);

/*!
 * Deep equal utility
 */

exports.eql = __webpack_require__(52);

/*!
 * Deep path value
 */

exports.getPathValue = __webpack_require__(60);

/*!
 * Function name
 */

exports.getName = __webpack_require__(14);

/*!
 * add Property
 */

exports.addProperty = __webpack_require__(61);

/*!
 * add Method
 */

exports.addMethod = __webpack_require__(62);

/*!
 * overwrite Property
 */

exports.overwriteProperty = __webpack_require__(63);

/*!
 * overwrite Method
 */

exports.overwriteMethod = __webpack_require__(64);

/*!
 * Add a chainable method
 */

exports.addChainableMethod = __webpack_require__(65);

/*!
 * Overwrite chainable method
 */

exports.overwriteChainableMethod = __webpack_require__(66);



/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Chai - test utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var flag = __webpack_require__(3);

/**
 * # test(object, expression)
 *
 * Test and object for expression.
 *
 * @param {Object} object (constructed Assertion)
 * @param {Arguments} chai.Assertion.prototype.assert arguments
 */

module.exports = function (obj, args) {
  var negate = flag(obj, 'negate')
    , expr = args[0];
  return negate ? !expr : expr;
};


/***/ }),
/* 48 */
/***/ (function(module, exports) {

/*!
 * Chai - type utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Detectable javascript natives
 */

var natives = {
    '[object Arguments]': 'arguments'
  , '[object Array]': 'array'
  , '[object Date]': 'date'
  , '[object Function]': 'function'
  , '[object Number]': 'number'
  , '[object RegExp]': 'regexp'
  , '[object String]': 'string'
};

/**
 * ### type(object)
 *
 * Better implementation of `typeof` detection that can
 * be used cross-browser. Handles the inconsistencies of
 * Array, `null`, and `undefined` detection.
 *
 *     utils.type({}) // 'object'
 *     utils.type(null) // `null'
 *     utils.type(undefined) // `undefined`
 *     utils.type([]) // `array`
 *
 * @param {Mixed} object to detect type of
 * @name type
 * @api private
 */

module.exports = function (obj) {
  var str = Object.prototype.toString.call(obj);
  if (natives[str]) return natives[str];
  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  if (obj === Object(obj)) return 'object';
  return typeof obj;
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Chai - message composition utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var flag = __webpack_require__(3)
  , getActual = __webpack_require__(13)
  , inspect = __webpack_require__(10)
  , objDisplay = __webpack_require__(15);

/**
 * ### .getMessage(object, message, negateMessage)
 *
 * Construct the error message based on flags
 * and template tags. Template tags will return
 * a stringified inspection of the object referenced.
 *
 * Message template tags:
 * - `#{this}` current asserted object
 * - `#{act}` actual value
 * - `#{exp}` expected value
 *
 * @param {Object} object (constructed Assertion)
 * @param {Arguments} chai.Assertion.prototype.assert arguments
 * @name getMessage
 * @api public
 */

module.exports = function (obj, args) {
  var negate = flag(obj, 'negate')
    , val = flag(obj, 'object')
    , expected = args[3]
    , actual = getActual(obj, args)
    , msg = negate ? args[2] : args[1]
    , flagMsg = flag(obj, 'message');

  if(typeof msg === "function") msg = msg();
  msg = msg || '';
  msg = msg
    .replace(/#{this}/g, objDisplay(val))
    .replace(/#{act}/g, objDisplay(actual))
    .replace(/#{exp}/g, objDisplay(expected));

  return flagMsg ? flagMsg + ': ' + msg : msg;
};


/***/ }),
/* 50 */
/***/ (function(module, exports) {

/*!
 * Chai - getProperties utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .getProperties(object)
 *
 * This allows the retrieval of property names of an object, enumerable or not,
 * inherited or not.
 *
 * @param {Object} object
 * @returns {Array}
 * @name getProperties
 * @api public
 */

module.exports = function getProperties(object) {
  var result = Object.getOwnPropertyNames(subject);

  function addProperty(property) {
    if (result.indexOf(property) === -1) {
      result.push(property);
    }
  }

  var proto = Object.getPrototypeOf(subject);
  while (proto !== null) {
    Object.getOwnPropertyNames(proto).forEach(addProperty);
    proto = Object.getPrototypeOf(proto);
  }

  return result;
};


/***/ }),
/* 51 */
/***/ (function(module, exports) {

/*!
 * Chai - getEnumerableProperties utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .getEnumerableProperties(object)
 *
 * This allows the retrieval of enumerable property names of an object,
 * inherited or not.
 *
 * @param {Object} object
 * @returns {Array}
 * @name getEnumerableProperties
 * @api public
 */

module.exports = function getEnumerableProperties(object) {
  var result = [];
  for (var name in object) {
    result.push(name);
  }
  return result;
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(53);


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * deep-eql
 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var type = __webpack_require__(54);

/*!
 * Buffer.isBuffer browser shim
 */

var Buffer;
try { Buffer = __webpack_require__(56).Buffer; }
catch(ex) {
  Buffer = {};
  Buffer.isBuffer = function() { return false; }
}

/*!
 * Primary Export
 */

module.exports = deepEqual;

/**
 * Assert super-strict (egal) equality between
 * two objects of any type.
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @param {Array} memoised (optional)
 * @return {Boolean} equal match
 */

function deepEqual(a, b, m) {
  if (sameValue(a, b)) {
    return true;
  } else if ('date' === type(a)) {
    return dateEqual(a, b);
  } else if ('regexp' === type(a)) {
    return regexpEqual(a, b);
  } else if (Buffer.isBuffer(a)) {
    return bufferEqual(a, b);
  } else if ('arguments' === type(a)) {
    return argumentsEqual(a, b, m);
  } else if (!typeEqual(a, b)) {
    return false;
  } else if (('object' !== type(a) && 'object' !== type(b))
  && ('array' !== type(a) && 'array' !== type(b))) {
    return sameValue(a, b);
  } else {
    return objectEqual(a, b, m);
  }
}

/*!
 * Strict (egal) equality test. Ensures that NaN always
 * equals NaN and `-0` does not equal `+0`.
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @return {Boolean} equal match
 */

function sameValue(a, b) {
  if (a === b) return a !== 0 || 1 / a === 1 / b;
  return a !== a && b !== b;
}

/*!
 * Compare the types of two given objects and
 * return if they are equal. Note that an Array
 * has a type of `array` (not `object`) and arguments
 * have a type of `arguments` (not `array`/`object`).
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @return {Boolean} result
 */

function typeEqual(a, b) {
  return type(a) === type(b);
}

/*!
 * Compare two Date objects by asserting that
 * the time values are equal using `saveValue`.
 *
 * @param {Date} a
 * @param {Date} b
 * @return {Boolean} result
 */

function dateEqual(a, b) {
  if ('date' !== type(b)) return false;
  return sameValue(a.getTime(), b.getTime());
}

/*!
 * Compare two regular expressions by converting them
 * to string and checking for `sameValue`.
 *
 * @param {RegExp} a
 * @param {RegExp} b
 * @return {Boolean} result
 */

function regexpEqual(a, b) {
  if ('regexp' !== type(b)) return false;
  return sameValue(a.toString(), b.toString());
}

/*!
 * Assert deep equality of two `arguments` objects.
 * Unfortunately, these must be sliced to arrays
 * prior to test to ensure no bad behavior.
 *
 * @param {Arguments} a
 * @param {Arguments} b
 * @param {Array} memoize (optional)
 * @return {Boolean} result
 */

function argumentsEqual(a, b, m) {
  if ('arguments' !== type(b)) return false;
  a = [].slice.call(a);
  b = [].slice.call(b);
  return deepEqual(a, b, m);
}

/*!
 * Get enumerable properties of a given object.
 *
 * @param {Object} a
 * @return {Array} property names
 */

function enumerable(a) {
  var res = [];
  for (var key in a) res.push(key);
  return res;
}

/*!
 * Simple equality for flat iterable objects
 * such as Arrays or Node.js buffers.
 *
 * @param {Iterable} a
 * @param {Iterable} b
 * @return {Boolean} result
 */

function iterableEqual(a, b) {
  if (a.length !==  b.length) return false;

  var i = 0;
  var match = true;

  for (; i < a.length; i++) {
    if (a[i] !== b[i]) {
      match = false;
      break;
    }
  }

  return match;
}

/*!
 * Extension to `iterableEqual` specifically
 * for Node.js Buffers.
 *
 * @param {Buffer} a
 * @param {Mixed} b
 * @return {Boolean} result
 */

function bufferEqual(a, b) {
  if (!Buffer.isBuffer(b)) return false;
  return iterableEqual(a, b);
}

/*!
 * Block for `objectEqual` ensuring non-existing
 * values don't get in.
 *
 * @param {Mixed} object
 * @return {Boolean} result
 */

function isValue(a) {
  return a !== null && a !== undefined;
}

/*!
 * Recursively check the equality of two objects.
 * Once basic sameness has been established it will
 * defer to `deepEqual` for each enumerable key
 * in the object.
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @return {Boolean} result
 */

function objectEqual(a, b, m) {
  if (!isValue(a) || !isValue(b)) {
    return false;
  }

  if (a.prototype !== b.prototype) {
    return false;
  }

  var i;
  if (m) {
    for (i = 0; i < m.length; i++) {
      if ((m[i][0] === a && m[i][1] === b)
      ||  (m[i][0] === b && m[i][1] === a)) {
        return true;
      }
    }
  } else {
    m = [];
  }

  try {
    var ka = enumerable(a);
    var kb = enumerable(b);
  } catch (ex) {
    return false;
  }

  ka.sort();
  kb.sort();

  if (!iterableEqual(ka, kb)) {
    return false;
  }

  m.push([ a, b ]);

  var key;
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], m)) {
      return false;
    }
  }

  return true;
}


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(55);


/***/ }),
/* 55 */
/***/ (function(module, exports) {

/*!
 * type-detect
 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Primary Exports
 */

var exports = module.exports = getType;

/*!
 * Detectable javascript natives
 */

var natives = {
    '[object Array]': 'array'
  , '[object RegExp]': 'regexp'
  , '[object Function]': 'function'
  , '[object Arguments]': 'arguments'
  , '[object Date]': 'date'
};

/**
 * ### typeOf (obj)
 *
 * Use several different techniques to determine
 * the type of object being tested.
 *
 *
 * @param {Mixed} object
 * @return {String} object type
 * @api public
 */

function getType (obj) {
  var str = Object.prototype.toString.call(obj);
  if (natives[str]) return natives[str];
  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  if (obj === Object(obj)) return 'object';
  return typeof obj;
}

exports.Library = Library;

/**
 * ### Library
 *
 * Create a repository for custom type detection.
 *
 * ```js
 * var lib = new type.Library;
 * ```
 *
 */

function Library () {
  this.tests = {};
}

/**
 * #### .of (obj)
 *
 * Expose replacement `typeof` detection to the library.
 *
 * ```js
 * if ('string' === lib.of('hello world')) {
 *   // ...
 * }
 * ```
 *
 * @param {Mixed} object to test
 * @return {String} type
 */

Library.prototype.of = getType;

/**
 * #### .define (type, test)
 *
 * Add a test to for the `.test()` assertion.
 *
 * Can be defined as a regular expression:
 *
 * ```js
 * lib.define('int', /^[0-9]+$/);
 * ```
 *
 * ... or as a function:
 *
 * ```js
 * lib.define('bln', function (obj) {
 *   if ('boolean' === lib.of(obj)) return true;
 *   var blns = [ 'yes', 'no', 'true', 'false', 1, 0 ];
 *   if ('string' === lib.of(obj)) obj = obj.toLowerCase();
 *   return !! ~blns.indexOf(obj);
 * });
 * ```
 *
 * @param {String} type
 * @param {RegExp|Function} test
 * @api public
 */

Library.prototype.define = function (type, test) {
  if (arguments.length === 1) return this.tests[type];
  this.tests[type] = test;
  return this;
};

/**
 * #### .test (obj, test)
 *
 * Assert that an object is of type. Will first
 * check natives, and if that does not pass it will
 * use the user defined custom tests.
 *
 * ```js
 * assert(lib.test('1', 'int'));
 * assert(lib.test('yes', 'bln'));
 * ```
 *
 * @param {Mixed} object
 * @param {String} type
 * @return {Boolean} result
 * @api public
 */

Library.prototype.test = function (obj, type) {
  if (type === getType(obj)) return true;
  var test = this.tests[type];

  if (test && 'regexp' === getType(test)) {
    return test.test(obj);
  } else if (test && 'function' === getType(test)) {
    return test(obj);
  } else {
    throw new ReferenceError('Type test "' + type + '" not defined or invalid.');
  }
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(57)
var ieee754 = __webpack_require__(58)
var isArray = __webpack_require__(59)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 58 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 59 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 60 */
/***/ (function(module, exports) {

/*!
 * Chai - getPathValue utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * @see https://github.com/logicalparadox/filtr
 * MIT Licensed
 */

/**
 * ### .getPathValue(path, object)
 *
 * This allows the retrieval of values in an
 * object given a string path.
 *
 *     var obj = {
 *         prop1: {
 *             arr: ['a', 'b', 'c']
 *           , str: 'Hello'
 *         }
 *       , prop2: {
 *             arr: [ { nested: 'Universe' } ]
 *           , str: 'Hello again!'
 *         }
 *     }
 *
 * The following would be the results.
 *
 *     getPathValue('prop1.str', obj); // Hello
 *     getPathValue('prop1.att[2]', obj); // b
 *     getPathValue('prop2.arr[0].nested', obj); // Universe
 *
 * @param {String} path
 * @param {Object} object
 * @returns {Object} value or `undefined`
 * @name getPathValue
 * @api public
 */

var getPathValue = module.exports = function (path, obj) {
  var parsed = parsePath(path);
  return _getPathValue(parsed, obj);
};

/*!
 * ## parsePath(path)
 *
 * Helper function used to parse string object
 * paths. Use in conjunction with `_getPathValue`.
 *
 *      var parsed = parsePath('myobject.property.subprop');
 *
 * ### Paths:
 *
 * * Can be as near infinitely deep and nested
 * * Arrays are also valid using the formal `myobject.document[3].property`.
 *
 * @param {String} path
 * @returns {Object} parsed
 * @api private
 */

function parsePath (path) {
  var str = path.replace(/\[/g, '.[')
    , parts = str.match(/(\\\.|[^.]+?)+/g);
  return parts.map(function (value) {
    var re = /\[(\d+)\]$/
      , mArr = re.exec(value)
    if (mArr) return { i: parseFloat(mArr[1]) };
    else return { p: value };
  });
};

/*!
 * ## _getPathValue(parsed, obj)
 *
 * Helper companion function for `.parsePath` that returns
 * the value located at the parsed address.
 *
 *      var value = getPathValue(parsed, obj);
 *
 * @param {Object} parsed definition from `parsePath`.
 * @param {Object} object to search against
 * @returns {Object|Undefined} value
 * @api private
 */

function _getPathValue (parsed, obj) {
  var tmp = obj
    , res;
  for (var i = 0, l = parsed.length; i < l; i++) {
    var part = parsed[i];
    if (tmp) {
      if ('undefined' !== typeof part.p)
        tmp = tmp[part.p];
      else if ('undefined' !== typeof part.i)
        tmp = tmp[part.i];
      if (i == (l - 1)) res = tmp;
    } else {
      res = undefined;
    }
  }
  return res;
};


/***/ }),
/* 61 */
/***/ (function(module, exports) {

/*!
 * Chai - addProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### addProperty (ctx, name, getter)
 *
 * Adds a property to the prototype of an object.
 *
 *     utils.addProperty(chai.Assertion.prototype, 'foo', function () {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.instanceof(Foo);
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.addProperty('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.be.foo;
 *
 * @param {Object} ctx object to which the property is added
 * @param {String} name of property to add
 * @param {Function} getter function to be used for name
 * @name addProperty
 * @api public
 */

module.exports = function (ctx, name, getter) {
  Object.defineProperty(ctx, name,
    { get: function () {
        var result = getter.call(this);
        return result === undefined ? this : result;
      }
    , configurable: true
  });
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Chai - addMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var config = __webpack_require__(4);

/**
 * ### .addMethod (ctx, name, method)
 *
 * Adds a method to the prototype of an object.
 *
 *     utils.addMethod(chai.Assertion.prototype, 'foo', function (str) {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.equal(str);
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.addMethod('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(fooStr).to.be.foo('bar');
 *
 * @param {Object} ctx object to which the method is added
 * @param {String} name of method to add
 * @param {Function} method function to be used for name
 * @name addMethod
 * @api public
 */
var flag = __webpack_require__(3);

module.exports = function (ctx, name, method) {
  ctx[name] = function () {
    var old_ssfi = flag(this, 'ssfi');
    if (old_ssfi && config.includeStack === false)
      flag(this, 'ssfi', ctx[name]);
    var result = method.apply(this, arguments);
    return result === undefined ? this : result;
  };
};


/***/ }),
/* 63 */
/***/ (function(module, exports) {

/*!
 * Chai - overwriteProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### overwriteProperty (ctx, name, fn)
 *
 * Overwites an already existing property getter and provides
 * access to previous value. Must return function to use as getter.
 *
 *     utils.overwriteProperty(chai.Assertion.prototype, 'ok', function (_super) {
 *       return function () {
 *         var obj = utils.flag(this, 'object');
 *         if (obj instanceof Foo) {
 *           new chai.Assertion(obj.name).to.equal('bar');
 *         } else {
 *           _super.call(this);
 *         }
 *       }
 *     });
 *
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.overwriteProperty('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.be.ok;
 *
 * @param {Object} ctx object whose property is to be overwritten
 * @param {String} name of property to overwrite
 * @param {Function} getter function that returns a getter function to be used for name
 * @name overwriteProperty
 * @api public
 */

module.exports = function (ctx, name, getter) {
  var _get = Object.getOwnPropertyDescriptor(ctx, name)
    , _super = function () {};

  if (_get && 'function' === typeof _get.get)
    _super = _get.get

  Object.defineProperty(ctx, name,
    { get: function () {
        var result = getter(_super).call(this);
        return result === undefined ? this : result;
      }
    , configurable: true
  });
};


/***/ }),
/* 64 */
/***/ (function(module, exports) {

/*!
 * Chai - overwriteMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### overwriteMethod (ctx, name, fn)
 *
 * Overwites an already existing method and provides
 * access to previous function. Must return function
 * to be used for name.
 *
 *     utils.overwriteMethod(chai.Assertion.prototype, 'equal', function (_super) {
 *       return function (str) {
 *         var obj = utils.flag(this, 'object');
 *         if (obj instanceof Foo) {
 *           new chai.Assertion(obj.value).to.equal(str);
 *         } else {
 *           _super.apply(this, arguments);
 *         }
 *       }
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.overwriteMethod('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.equal('bar');
 *
 * @param {Object} ctx object whose method is to be overwritten
 * @param {String} name of method to overwrite
 * @param {Function} method function that returns a function to be used for name
 * @name overwriteMethod
 * @api public
 */

module.exports = function (ctx, name, method) {
  var _method = ctx[name]
    , _super = function () { return this; };

  if (_method && 'function' === typeof _method)
    _super = _method;

  ctx[name] = function () {
    var result = method(_super).apply(this, arguments);
    return result === undefined ? this : result;
  }
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Chai - addChainingMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var transferFlags = __webpack_require__(16);
var flag = __webpack_require__(3);
var config = __webpack_require__(4);

/*!
 * Module variables
 */

// Check whether `__proto__` is supported
var hasProtoSupport = '__proto__' in Object;

// Without `__proto__` support, this module will need to add properties to a function.
// However, some Function.prototype methods cannot be overwritten,
// and there seems no easy cross-platform way to detect them (@see chaijs/chai/issues/69).
var excludeNames = /^(?:length|name|arguments|caller)$/;

// Cache `Function` properties
var call  = Function.prototype.call,
    apply = Function.prototype.apply;

/**
 * ### addChainableMethod (ctx, name, method, chainingBehavior)
 *
 * Adds a method to an object, such that the method can also be chained.
 *
 *     utils.addChainableMethod(chai.Assertion.prototype, 'foo', function (str) {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.equal(str);
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.addChainableMethod('foo', fn, chainingBehavior);
 *
 * The result can then be used as both a method assertion, executing both `method` and
 * `chainingBehavior`, or as a language chain, which only executes `chainingBehavior`.
 *
 *     expect(fooStr).to.be.foo('bar');
 *     expect(fooStr).to.be.foo.equal('foo');
 *
 * @param {Object} ctx object to which the method is added
 * @param {String} name of method to add
 * @param {Function} method function to be used for `name`, when called
 * @param {Function} chainingBehavior function to be called every time the property is accessed
 * @name addChainableMethod
 * @api public
 */

module.exports = function (ctx, name, method, chainingBehavior) {
  if (typeof chainingBehavior !== 'function') {
    chainingBehavior = function () { };
  }

  var chainableBehavior = {
      method: method
    , chainingBehavior: chainingBehavior
  };

  // save the methods so we can overwrite them later, if we need to.
  if (!ctx.__methods) {
    ctx.__methods = {};
  }
  ctx.__methods[name] = chainableBehavior;

  Object.defineProperty(ctx, name,
    { get: function () {
        chainableBehavior.chainingBehavior.call(this);

        var assert = function assert() {
          var old_ssfi = flag(this, 'ssfi');
          if (old_ssfi && config.includeStack === false)
            flag(this, 'ssfi', assert);
          var result = chainableBehavior.method.apply(this, arguments);
          return result === undefined ? this : result;
        };

        // Use `__proto__` if available
        if (hasProtoSupport) {
          // Inherit all properties from the object by replacing the `Function` prototype
          var prototype = assert.__proto__ = Object.create(this);
          // Restore the `call` and `apply` methods from `Function`
          prototype.call = call;
          prototype.apply = apply;
        }
        // Otherwise, redefine all properties (slow!)
        else {
          var asserterNames = Object.getOwnPropertyNames(ctx);
          asserterNames.forEach(function (asserterName) {
            if (!excludeNames.test(asserterName)) {
              var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
              Object.defineProperty(assert, asserterName, pd);
            }
          });
        }

        transferFlags(this, assert);
        return assert;
      }
    , configurable: true
  });
};


/***/ }),
/* 66 */
/***/ (function(module, exports) {

/*!
 * Chai - overwriteChainableMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### overwriteChainableMethod (ctx, name, fn)
 *
 * Overwites an already existing chainable method
 * and provides access to the previous function or
 * property.  Must return functions to be used for
 * name.
 *
 *     utils.overwriteChainableMethod(chai.Assertion.prototype, 'length',
 *       function (_super) {
 *       }
 *     , function (_super) {
 *       }
 *     );
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.overwriteChainableMethod('foo', fn, fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.have.length(3);
 *     expect(myFoo).to.have.length.above(3);
 *
 * @param {Object} ctx object whose method / property is to be overwritten
 * @param {String} name of method / property to overwrite
 * @param {Function} method function that returns a function to be used for name
 * @param {Function} chainingBehavior function that returns a function to be used for property
 * @name overwriteChainableMethod
 * @api public
 */

module.exports = function (ctx, name, method, chainingBehavior) {
  var chainableBehavior = ctx.__methods[name];

  var _chainingBehavior = chainableBehavior.chainingBehavior;
  chainableBehavior.chainingBehavior = function () {
    var result = chainingBehavior(_chainingBehavior).call(this);
    return result === undefined ? this : result;
  };

  var _method = chainableBehavior.method;
  chainableBehavior.method = function () {
    var result = method(_method).apply(this, arguments);
    return result === undefined ? this : result;
  };
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var config = __webpack_require__(4);
var NOOP = function() { };

module.exports = function (_chai, util) {
  /*!
   * Module dependencies.
   */

  var AssertionError = _chai.AssertionError
    , flag = util.flag;

  /*!
   * Module export.
   */

  _chai.Assertion = Assertion;

  /*!
   * Assertion Constructor
   *
   * Creates object for chaining.
   *
   * @api private
   */

  function Assertion (obj, msg, stack) {
    flag(this, 'ssfi', stack || arguments.callee);
    flag(this, 'object', obj);
    flag(this, 'message', msg);
  }

  Object.defineProperty(Assertion, 'includeStack', {
    get: function() {
      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
      return config.includeStack;
    },
    set: function(value) {
      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
      config.includeStack = value;
    }
  });

  Object.defineProperty(Assertion, 'showDiff', {
    get: function() {
      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
      return config.showDiff;
    },
    set: function(value) {
      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
      config.showDiff = value;
    }
  });

  Assertion.addProperty = function (name, fn) {
    util.addProperty(this.prototype, name, fn);
  };

  Assertion.addMethod = function (name, fn) {
    util.addMethod(this.prototype, name, fn);
  };

  Assertion.addChainableMethod = function (name, fn, chainingBehavior) {
    util.addChainableMethod(this.prototype, name, fn, chainingBehavior);
  };

  Assertion.addChainableNoop = function(name, fn) {
    util.addChainableMethod(this.prototype, name, NOOP, fn);
  };

  Assertion.overwriteProperty = function (name, fn) {
    util.overwriteProperty(this.prototype, name, fn);
  };

  Assertion.overwriteMethod = function (name, fn) {
    util.overwriteMethod(this.prototype, name, fn);
  };

  Assertion.overwriteChainableMethod = function (name, fn, chainingBehavior) {
    util.overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
  };

  /*!
   * ### .assert(expression, message, negateMessage, expected, actual)
   *
   * Executes an expression and check expectations. Throws AssertionError for reporting if test doesn't pass.
   *
   * @name assert
   * @param {Philosophical} expression to be tested
   * @param {String or Function} message or function that returns message to display if fails
   * @param {String or Function} negatedMessage or function that returns negatedMessage to display if negated expression fails
   * @param {Mixed} expected value (remember to check for negation)
   * @param {Mixed} actual (optional) will default to `this.obj`
   * @api private
   */

  Assertion.prototype.assert = function (expr, msg, negateMsg, expected, _actual, showDiff) {
    var ok = util.test(this, arguments);
    if (true !== showDiff) showDiff = false;
    if (true !== config.showDiff) showDiff = false;

    if (!ok) {
      var msg = util.getMessage(this, arguments)
        , actual = util.getActual(this, arguments);
      throw new AssertionError(msg, {
          actual: actual
        , expected: expected
        , showDiff: showDiff
      }, (config.includeStack) ? this.assert : flag(this, 'ssfi'));
    }
  };

  /*!
   * ### ._obj
   *
   * Quick reference to stored `actual` value for plugin developers.
   *
   * @api private
   */

  Object.defineProperty(Assertion.prototype, '_obj',
    { get: function () {
        return flag(this, 'object');
      }
    , set: function (val) {
        flag(this, 'object', val);
      }
  });
};


/***/ }),
/* 68 */
/***/ (function(module, exports) {

/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports = function (chai, _) {
  var Assertion = chai.Assertion
    , toString = Object.prototype.toString
    , flag = _.flag;

  /**
   * ### Language Chains
   *
   * The following are provided as chainable getters to
   * improve the readability of your assertions. They
   * do not provide testing capabilities unless they
   * have been overwritten by a plugin.
   *
   * **Chains**
   *
   * - to
   * - be
   * - been
   * - is
   * - that
   * - and
   * - has
   * - have
   * - with
   * - at
   * - of
   * - same
   *
   * @name language chains
   * @api public
   */

  [ 'to', 'be', 'been'
  , 'is', 'and', 'has', 'have'
  , 'with', 'that', 'at'
  , 'of', 'same' ].forEach(function (chain) {
    Assertion.addProperty(chain, function () {
      return this;
    });
  });

  /**
   * ### .not
   *
   * Negates any of assertions following in the chain.
   *
   *     expect(foo).to.not.equal('bar');
   *     expect(goodFn).to.not.throw(Error);
   *     expect({ foo: 'baz' }).to.have.property('foo')
   *       .and.not.equal('bar');
   *
   * @name not
   * @api public
   */

  Assertion.addProperty('not', function () {
    flag(this, 'negate', true);
  });

  /**
   * ### .deep
   *
   * Sets the `deep` flag, later used by the `equal` and
   * `property` assertions.
   *
   *     expect(foo).to.deep.equal({ bar: 'baz' });
   *     expect({ foo: { bar: { baz: 'quux' } } })
   *       .to.have.deep.property('foo.bar.baz', 'quux');
   *
   * @name deep
   * @api public
   */

  Assertion.addProperty('deep', function () {
    flag(this, 'deep', true);
  });

  /**
   * ### .a(type)
   *
   * The `a` and `an` assertions are aliases that can be
   * used either as language chains or to assert a value's
   * type.
   *
   *     // typeof
   *     expect('test').to.be.a('string');
   *     expect({ foo: 'bar' }).to.be.an('object');
   *     expect(null).to.be.a('null');
   *     expect(undefined).to.be.an('undefined');
   *
   *     // language chain
   *     expect(foo).to.be.an.instanceof(Foo);
   *
   * @name a
   * @alias an
   * @param {String} type
   * @param {String} message _optional_
   * @api public
   */

  function an (type, msg) {
    if (msg) flag(this, 'message', msg);
    type = type.toLowerCase();
    var obj = flag(this, 'object')
      , article = ~[ 'a', 'e', 'i', 'o', 'u' ].indexOf(type.charAt(0)) ? 'an ' : 'a ';

    this.assert(
        type === _.type(obj)
      , 'expected #{this} to be ' + article + type
      , 'expected #{this} not to be ' + article + type
    );
  }

  Assertion.addChainableMethod('an', an);
  Assertion.addChainableMethod('a', an);

  /**
   * ### .include(value)
   *
   * The `include` and `contain` assertions can be used as either property
   * based language chains or as methods to assert the inclusion of an object
   * in an array or a substring in a string. When used as language chains,
   * they toggle the `contain` flag for the `keys` assertion.
   *
   *     expect([1,2,3]).to.include(2);
   *     expect('foobar').to.contain('foo');
   *     expect({ foo: 'bar', hello: 'universe' }).to.include.keys('foo');
   *
   * @name include
   * @alias contain
   * @param {Object|String|Number} obj
   * @param {String} message _optional_
   * @api public
   */

  function includeChainingBehavior () {
    flag(this, 'contains', true);
  }

  function include (val, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    var expected = false;
    if (_.type(obj) === 'array' && _.type(val) === 'object') {
      for (var i in obj) {
        if (_.eql(obj[i], val)) {
          expected = true;
          break;
        }
      }
    } else if (_.type(val) === 'object') {
      if (!flag(this, 'negate')) {
        for (var k in val) new Assertion(obj).property(k, val[k]);
        return;
      }
      var subset = {}
      for (var k in val) subset[k] = obj[k]
      expected = _.eql(subset, val);
    } else {
      expected = obj && ~obj.indexOf(val)
    }
    this.assert(
        expected
      , 'expected #{this} to include ' + _.inspect(val)
      , 'expected #{this} to not include ' + _.inspect(val));
  }

  Assertion.addChainableMethod('include', include, includeChainingBehavior);
  Assertion.addChainableMethod('contain', include, includeChainingBehavior);

  /**
   * ### .ok
   *
   * Asserts that the target is truthy.
   *
   *     expect('everthing').to.be.ok;
   *     expect(1).to.be.ok;
   *     expect(false).to.not.be.ok;
   *     expect(undefined).to.not.be.ok;
   *     expect(null).to.not.be.ok;
   *
   * Can also be used as a function, which prevents some linter errors.
   *
   *     expect('everthing').to.be.ok();
   *     
   * @name ok
   * @api public
   */

  Assertion.addChainableNoop('ok', function () {
    this.assert(
        flag(this, 'object')
      , 'expected #{this} to be truthy'
      , 'expected #{this} to be falsy');
  });

  /**
   * ### .true
   *
   * Asserts that the target is `true`.
   *
   *     expect(true).to.be.true;
   *     expect(1).to.not.be.true;
   *
   * Can also be used as a function, which prevents some linter errors.
   *
   *     expect(true).to.be.true();
   *
   * @name true
   * @api public
   */

  Assertion.addChainableNoop('true', function () {
    this.assert(
        true === flag(this, 'object')
      , 'expected #{this} to be true'
      , 'expected #{this} to be false'
      , this.negate ? false : true
    );
  });

  /**
   * ### .false
   *
   * Asserts that the target is `false`.
   *
   *     expect(false).to.be.false;
   *     expect(0).to.not.be.false;
   *
   * Can also be used as a function, which prevents some linter errors.
   *
   *     expect(false).to.be.false();
   *
   * @name false
   * @api public
   */

  Assertion.addChainableNoop('false', function () {
    this.assert(
        false === flag(this, 'object')
      , 'expected #{this} to be false'
      , 'expected #{this} to be true'
      , this.negate ? true : false
    );
  });

  /**
   * ### .null
   *
   * Asserts that the target is `null`.
   *
   *     expect(null).to.be.null;
   *     expect(undefined).not.to.be.null;
   *
   * Can also be used as a function, which prevents some linter errors.
   *
   *     expect(null).to.be.null();
   *
   * @name null
   * @api public
   */

  Assertion.addChainableNoop('null', function () {
    this.assert(
        null === flag(this, 'object')
      , 'expected #{this} to be null'
      , 'expected #{this} not to be null'
    );
  });

  /**
   * ### .undefined
   *
   * Asserts that the target is `undefined`.
   *
   *     expect(undefined).to.be.undefined;
   *     expect(null).to.not.be.undefined;
   *
   * Can also be used as a function, which prevents some linter errors.
   *
   *     expect(undefined).to.be.undefined();
   *
   * @name undefined
   * @api public
   */

  Assertion.addChainableNoop('undefined', function () {
    this.assert(
        undefined === flag(this, 'object')
      , 'expected #{this} to be undefined'
      , 'expected #{this} not to be undefined'
    );
  });

  /**
   * ### .exist
   *
   * Asserts that the target is neither `null` nor `undefined`.
   *
   *     var foo = 'hi'
   *       , bar = null
   *       , baz;
   *
   *     expect(foo).to.exist;
   *     expect(bar).to.not.exist;
   *     expect(baz).to.not.exist;
   *
   * Can also be used as a function, which prevents some linter errors.
   *
   *     expect(foo).to.exist();
   *
   * @name exist
   * @api public
   */

  Assertion.addChainableNoop('exist', function () {
    this.assert(
        null != flag(this, 'object')
      , 'expected #{this} to exist'
      , 'expected #{this} to not exist'
    );
  });


  /**
   * ### .empty
   *
   * Asserts that the target's length is `0`. For arrays, it checks
   * the `length` property. For objects, it gets the count of
   * enumerable keys.
   *
   *     expect([]).to.be.empty;
   *     expect('').to.be.empty;
   *     expect({}).to.be.empty;
   *
   * Can also be used as a function, which prevents some linter errors.
   *
   *     expect([]).to.be.empty();
   *
   * @name empty
   * @api public
   */

  Assertion.addChainableNoop('empty', function () {
    var obj = flag(this, 'object')
      , expected = obj;

    if (Array.isArray(obj) || 'string' === typeof object) {
      expected = obj.length;
    } else if (typeof obj === 'object') {
      expected = Object.keys(obj).length;
    }

    this.assert(
        !expected
      , 'expected #{this} to be empty'
      , 'expected #{this} not to be empty'
    );
  });

  /**
   * ### .arguments
   *
   * Asserts that the target is an arguments object.
   *
   *     function test () {
   *       expect(arguments).to.be.arguments;
   *     }
   *
   * Can also be used as a function, which prevents some linter errors.
   *
   *     function test () {
   *       expect(arguments).to.be.arguments();
   *     }
   *
   * @name arguments
   * @alias Arguments
   * @api public
   */

  function checkArguments () {
    var obj = flag(this, 'object')
      , type = Object.prototype.toString.call(obj);
    this.assert(
        '[object Arguments]' === type
      , 'expected #{this} to be arguments but got ' + type
      , 'expected #{this} to not be arguments'
    );
  }

  Assertion.addChainableNoop('arguments', checkArguments);
  Assertion.addChainableNoop('Arguments', checkArguments);

  /**
   * ### .equal(value)
   *
   * Asserts that the target is strictly equal (`===`) to `value`.
   * Alternately, if the `deep` flag is set, asserts that
   * the target is deeply equal to `value`.
   *
   *     expect('hello').to.equal('hello');
   *     expect(42).to.equal(42);
   *     expect(1).to.not.equal(true);
   *     expect({ foo: 'bar' }).to.not.equal({ foo: 'bar' });
   *     expect({ foo: 'bar' }).to.deep.equal({ foo: 'bar' });
   *
   * @name equal
   * @alias equals
   * @alias eq
   * @alias deep.equal
   * @param {Mixed} value
   * @param {String} message _optional_
   * @api public
   */

  function assertEqual (val, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'deep')) {
      return this.eql(val);
    } else {
      this.assert(
          val === obj
        , 'expected #{this} to equal #{exp}'
        , 'expected #{this} to not equal #{exp}'
        , val
        , this._obj
        , true
      );
    }
  }

  Assertion.addMethod('equal', assertEqual);
  Assertion.addMethod('equals', assertEqual);
  Assertion.addMethod('eq', assertEqual);

  /**
   * ### .eql(value)
   *
   * Asserts that the target is deeply equal to `value`.
   *
   *     expect({ foo: 'bar' }).to.eql({ foo: 'bar' });
   *     expect([ 1, 2, 3 ]).to.eql([ 1, 2, 3 ]);
   *
   * @name eql
   * @alias eqls
   * @param {Mixed} value
   * @param {String} message _optional_
   * @api public
   */

  function assertEql(obj, msg) {
    if (msg) flag(this, 'message', msg);
    this.assert(
        _.eql(obj, flag(this, 'object'))
      , 'expected #{this} to deeply equal #{exp}'
      , 'expected #{this} to not deeply equal #{exp}'
      , obj
      , this._obj
      , true
    );
  }

  Assertion.addMethod('eql', assertEql);
  Assertion.addMethod('eqls', assertEql);

  /**
   * ### .above(value)
   *
   * Asserts that the target is greater than `value`.
   *
   *     expect(10).to.be.above(5);
   *
   * Can also be used in conjunction with `length` to
   * assert a minimum length. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.above(2);
   *     expect([ 1, 2, 3 ]).to.have.length.above(2);
   *
   * @name above
   * @alias gt
   * @alias greaterThan
   * @param {Number} value
   * @param {String} message _optional_
   * @api public
   */

  function assertAbove (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len > n
        , 'expected #{this} to have a length above #{exp} but got #{act}'
        , 'expected #{this} to not have a length above #{exp}'
        , n
        , len
      );
    } else {
      this.assert(
          obj > n
        , 'expected #{this} to be above ' + n
        , 'expected #{this} to be at most ' + n
      );
    }
  }

  Assertion.addMethod('above', assertAbove);
  Assertion.addMethod('gt', assertAbove);
  Assertion.addMethod('greaterThan', assertAbove);

  /**
   * ### .least(value)
   *
   * Asserts that the target is greater than or equal to `value`.
   *
   *     expect(10).to.be.at.least(10);
   *
   * Can also be used in conjunction with `length` to
   * assert a minimum length. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.of.at.least(2);
   *     expect([ 1, 2, 3 ]).to.have.length.of.at.least(3);
   *
   * @name least
   * @alias gte
   * @param {Number} value
   * @param {String} message _optional_
   * @api public
   */

  function assertLeast (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len >= n
        , 'expected #{this} to have a length at least #{exp} but got #{act}'
        , 'expected #{this} to have a length below #{exp}'
        , n
        , len
      );
    } else {
      this.assert(
          obj >= n
        , 'expected #{this} to be at least ' + n
        , 'expected #{this} to be below ' + n
      );
    }
  }

  Assertion.addMethod('least', assertLeast);
  Assertion.addMethod('gte', assertLeast);

  /**
   * ### .below(value)
   *
   * Asserts that the target is less than `value`.
   *
   *     expect(5).to.be.below(10);
   *
   * Can also be used in conjunction with `length` to
   * assert a maximum length. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.below(4);
   *     expect([ 1, 2, 3 ]).to.have.length.below(4);
   *
   * @name below
   * @alias lt
   * @alias lessThan
   * @param {Number} value
   * @param {String} message _optional_
   * @api public
   */

  function assertBelow (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len < n
        , 'expected #{this} to have a length below #{exp} but got #{act}'
        , 'expected #{this} to not have a length below #{exp}'
        , n
        , len
      );
    } else {
      this.assert(
          obj < n
        , 'expected #{this} to be below ' + n
        , 'expected #{this} to be at least ' + n
      );
    }
  }

  Assertion.addMethod('below', assertBelow);
  Assertion.addMethod('lt', assertBelow);
  Assertion.addMethod('lessThan', assertBelow);

  /**
   * ### .most(value)
   *
   * Asserts that the target is less than or equal to `value`.
   *
   *     expect(5).to.be.at.most(5);
   *
   * Can also be used in conjunction with `length` to
   * assert a maximum length. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.of.at.most(4);
   *     expect([ 1, 2, 3 ]).to.have.length.of.at.most(3);
   *
   * @name most
   * @alias lte
   * @param {Number} value
   * @param {String} message _optional_
   * @api public
   */

  function assertMost (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len <= n
        , 'expected #{this} to have a length at most #{exp} but got #{act}'
        , 'expected #{this} to have a length above #{exp}'
        , n
        , len
      );
    } else {
      this.assert(
          obj <= n
        , 'expected #{this} to be at most ' + n
        , 'expected #{this} to be above ' + n
      );
    }
  }

  Assertion.addMethod('most', assertMost);
  Assertion.addMethod('lte', assertMost);

  /**
   * ### .within(start, finish)
   *
   * Asserts that the target is within a range.
   *
   *     expect(7).to.be.within(5,10);
   *
   * Can also be used in conjunction with `length` to
   * assert a length range. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.within(2,4);
   *     expect([ 1, 2, 3 ]).to.have.length.within(2,4);
   *
   * @name within
   * @param {Number} start lowerbound inclusive
   * @param {Number} finish upperbound inclusive
   * @param {String} message _optional_
   * @api public
   */

  Assertion.addMethod('within', function (start, finish, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , range = start + '..' + finish;
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len >= start && len <= finish
        , 'expected #{this} to have a length within ' + range
        , 'expected #{this} to not have a length within ' + range
      );
    } else {
      this.assert(
          obj >= start && obj <= finish
        , 'expected #{this} to be within ' + range
        , 'expected #{this} to not be within ' + range
      );
    }
  });

  /**
   * ### .instanceof(constructor)
   *
   * Asserts that the target is an instance of `constructor`.
   *
   *     var Tea = function (name) { this.name = name; }
   *       , Chai = new Tea('chai');
   *
   *     expect(Chai).to.be.an.instanceof(Tea);
   *     expect([ 1, 2, 3 ]).to.be.instanceof(Array);
   *
   * @name instanceof
   * @param {Constructor} constructor
   * @param {String} message _optional_
   * @alias instanceOf
   * @api public
   */

  function assertInstanceOf (constructor, msg) {
    if (msg) flag(this, 'message', msg);
    var name = _.getName(constructor);
    this.assert(
        flag(this, 'object') instanceof constructor
      , 'expected #{this} to be an instance of ' + name
      , 'expected #{this} to not be an instance of ' + name
    );
  };

  Assertion.addMethod('instanceof', assertInstanceOf);
  Assertion.addMethod('instanceOf', assertInstanceOf);

  /**
   * ### .property(name, [value])
   *
   * Asserts that the target has a property `name`, optionally asserting that
   * the value of that property is strictly equal to  `value`.
   * If the `deep` flag is set, you can use dot- and bracket-notation for deep
   * references into objects and arrays.
   *
   *     // simple referencing
   *     var obj = { foo: 'bar' };
   *     expect(obj).to.have.property('foo');
   *     expect(obj).to.have.property('foo', 'bar');
   *
   *     // deep referencing
   *     var deepObj = {
   *         green: { tea: 'matcha' }
   *       , teas: [ 'chai', 'matcha', { tea: 'konacha' } ]
   *     };

   *     expect(deepObj).to.have.deep.property('green.tea', 'matcha');
   *     expect(deepObj).to.have.deep.property('teas[1]', 'matcha');
   *     expect(deepObj).to.have.deep.property('teas[2].tea', 'konacha');
   *
   * You can also use an array as the starting point of a `deep.property`
   * assertion, or traverse nested arrays.
   *
   *     var arr = [
   *         [ 'chai', 'matcha', 'konacha' ]
   *       , [ { tea: 'chai' }
   *         , { tea: 'matcha' }
   *         , { tea: 'konacha' } ]
   *     ];
   *
   *     expect(arr).to.have.deep.property('[0][1]', 'matcha');
   *     expect(arr).to.have.deep.property('[1][2].tea', 'konacha');
   *
   * Furthermore, `property` changes the subject of the assertion
   * to be the value of that property from the original object. This
   * permits for further chainable assertions on that property.
   *
   *     expect(obj).to.have.property('foo')
   *       .that.is.a('string');
   *     expect(deepObj).to.have.property('green')
   *       .that.is.an('object')
   *       .that.deep.equals({ tea: 'matcha' });
   *     expect(deepObj).to.have.property('teas')
   *       .that.is.an('array')
   *       .with.deep.property('[2]')
   *         .that.deep.equals({ tea: 'konacha' });
   *
   * @name property
   * @alias deep.property
   * @param {String} name
   * @param {Mixed} value (optional)
   * @param {String} message _optional_
   * @returns value of property for chaining
   * @api public
   */

  Assertion.addMethod('property', function (name, val, msg) {
    if (msg) flag(this, 'message', msg);

    var descriptor = flag(this, 'deep') ? 'deep property ' : 'property '
      , negate = flag(this, 'negate')
      , obj = flag(this, 'object')
      , value = flag(this, 'deep')
        ? _.getPathValue(name, obj)
        : obj[name];

    if (negate && undefined !== val) {
      if (undefined === value) {
        msg = (msg != null) ? msg + ': ' : '';
        throw new Error(msg + _.inspect(obj) + ' has no ' + descriptor + _.inspect(name));
      }
    } else {
      this.assert(
          undefined !== value
        , 'expected #{this} to have a ' + descriptor + _.inspect(name)
        , 'expected #{this} to not have ' + descriptor + _.inspect(name));
    }

    if (undefined !== val) {
      this.assert(
          val === value
        , 'expected #{this} to have a ' + descriptor + _.inspect(name) + ' of #{exp}, but got #{act}'
        , 'expected #{this} to not have a ' + descriptor + _.inspect(name) + ' of #{act}'
        , val
        , value
      );
    }

    flag(this, 'object', value);
  });


  /**
   * ### .ownProperty(name)
   *
   * Asserts that the target has an own property `name`.
   *
   *     expect('test').to.have.ownProperty('length');
   *
   * @name ownProperty
   * @alias haveOwnProperty
   * @param {String} name
   * @param {String} message _optional_
   * @api public
   */

  function assertOwnProperty (name, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    this.assert(
        obj.hasOwnProperty(name)
      , 'expected #{this} to have own property ' + _.inspect(name)
      , 'expected #{this} to not have own property ' + _.inspect(name)
    );
  }

  Assertion.addMethod('ownProperty', assertOwnProperty);
  Assertion.addMethod('haveOwnProperty', assertOwnProperty);

  /**
   * ### .length(value)
   *
   * Asserts that the target's `length` property has
   * the expected value.
   *
   *     expect([ 1, 2, 3]).to.have.length(3);
   *     expect('foobar').to.have.length(6);
   *
   * Can also be used as a chain precursor to a value
   * comparison for the length property.
   *
   *     expect('foo').to.have.length.above(2);
   *     expect([ 1, 2, 3 ]).to.have.length.above(2);
   *     expect('foo').to.have.length.below(4);
   *     expect([ 1, 2, 3 ]).to.have.length.below(4);
   *     expect('foo').to.have.length.within(2,4);
   *     expect([ 1, 2, 3 ]).to.have.length.within(2,4);
   *
   * @name length
   * @alias lengthOf
   * @param {Number} length
   * @param {String} message _optional_
   * @api public
   */

  function assertLengthChain () {
    flag(this, 'doLength', true);
  }

  function assertLength (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    new Assertion(obj, msg).to.have.property('length');
    var len = obj.length;

    this.assert(
        len == n
      , 'expected #{this} to have a length of #{exp} but got #{act}'
      , 'expected #{this} to not have a length of #{act}'
      , n
      , len
    );
  }

  Assertion.addChainableMethod('length', assertLength, assertLengthChain);
  Assertion.addMethod('lengthOf', assertLength);

  /**
   * ### .match(regexp)
   *
   * Asserts that the target matches a regular expression.
   *
   *     expect('foobar').to.match(/^foo/);
   *
   * @name match
   * @param {RegExp} RegularExpression
   * @param {String} message _optional_
   * @api public
   */

  Assertion.addMethod('match', function (re, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    this.assert(
        re.exec(obj)
      , 'expected #{this} to match ' + re
      , 'expected #{this} not to match ' + re
    );
  });

  /**
   * ### .string(string)
   *
   * Asserts that the string target contains another string.
   *
   *     expect('foobar').to.have.string('bar');
   *
   * @name string
   * @param {String} string
   * @param {String} message _optional_
   * @api public
   */

  Assertion.addMethod('string', function (str, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    new Assertion(obj, msg).is.a('string');

    this.assert(
        ~obj.indexOf(str)
      , 'expected #{this} to contain ' + _.inspect(str)
      , 'expected #{this} to not contain ' + _.inspect(str)
    );
  });


  /**
   * ### .keys(key1, [key2], [...])
   *
   * Asserts that the target has exactly the given keys, or
   * asserts the inclusion of some keys when using the
   * `include` or `contain` modifiers.
   *
   *     expect({ foo: 1, bar: 2 }).to.have.keys(['foo', 'bar']);
   *     expect({ foo: 1, bar: 2, baz: 3 }).to.contain.keys('foo', 'bar');
   *
   * @name keys
   * @alias key
   * @param {String...|Array} keys
   * @api public
   */

  function assertKeys (keys) {
    var obj = flag(this, 'object')
      , str
      , ok = true;

    keys = keys instanceof Array
      ? keys
      : Array.prototype.slice.call(arguments);

    if (!keys.length) throw new Error('keys required');

    var actual = Object.keys(obj)
      , expected = keys
      , len = keys.length;

    // Inclusion
    ok = keys.every(function(key){
      return ~actual.indexOf(key);
    });

    // Strict
    if (!flag(this, 'negate') && !flag(this, 'contains')) {
      ok = ok && keys.length == actual.length;
    }

    // Key string
    if (len > 1) {
      keys = keys.map(function(key){
        return _.inspect(key);
      });
      var last = keys.pop();
      str = keys.join(', ') + ', and ' + last;
    } else {
      str = _.inspect(keys[0]);
    }

    // Form
    str = (len > 1 ? 'keys ' : 'key ') + str;

    // Have / include
    str = (flag(this, 'contains') ? 'contain ' : 'have ') + str;

    // Assertion
    this.assert(
        ok
      , 'expected #{this} to ' + str
      , 'expected #{this} to not ' + str
      , expected.sort()
      , actual.sort()
      , true
    );
  }

  Assertion.addMethod('keys', assertKeys);
  Assertion.addMethod('key', assertKeys);

  /**
   * ### .throw(constructor)
   *
   * Asserts that the function target will throw a specific error, or specific type of error
   * (as determined using `instanceof`), optionally with a RegExp or string inclusion test
   * for the error's message.
   *
   *     var err = new ReferenceError('This is a bad function.');
   *     var fn = function () { throw err; }
   *     expect(fn).to.throw(ReferenceError);
   *     expect(fn).to.throw(Error);
   *     expect(fn).to.throw(/bad function/);
   *     expect(fn).to.not.throw('good function');
   *     expect(fn).to.throw(ReferenceError, /bad function/);
   *     expect(fn).to.throw(err);
   *     expect(fn).to.not.throw(new RangeError('Out of range.'));
   *
   * Please note that when a throw expectation is negated, it will check each
   * parameter independently, starting with error constructor type. The appropriate way
   * to check for the existence of a type of error but for a message that does not match
   * is to use `and`.
   *
   *     expect(fn).to.throw(ReferenceError)
   *        .and.not.throw(/good function/);
   *
   * @name throw
   * @alias throws
   * @alias Throw
   * @param {ErrorConstructor} constructor
   * @param {String|RegExp} expected error message
   * @param {String} message _optional_
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
   * @returns error for chaining (null if no error)
   * @api public
   */

  function assertThrows (constructor, errMsg, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    new Assertion(obj, msg).is.a('function');

    var thrown = false
      , desiredError = null
      , name = null
      , thrownError = null;

    if (arguments.length === 0) {
      errMsg = null;
      constructor = null;
    } else if (constructor && (constructor instanceof RegExp || 'string' === typeof constructor)) {
      errMsg = constructor;
      constructor = null;
    } else if (constructor && constructor instanceof Error) {
      desiredError = constructor;
      constructor = null;
      errMsg = null;
    } else if (typeof constructor === 'function') {
      name = constructor.prototype.name || constructor.name;
      if (name === 'Error' && constructor !== Error) {
        name = (new constructor()).name;
      }
    } else {
      constructor = null;
    }

    try {
      obj();
    } catch (err) {
      // first, check desired error
      if (desiredError) {
        this.assert(
            err === desiredError
          , 'expected #{this} to throw #{exp} but #{act} was thrown'
          , 'expected #{this} to not throw #{exp}'
          , (desiredError instanceof Error ? desiredError.toString() : desiredError)
          , (err instanceof Error ? err.toString() : err)
        );

        flag(this, 'object', err);
        return this;
      }

      // next, check constructor
      if (constructor) {
        this.assert(
            err instanceof constructor
          , 'expected #{this} to throw #{exp} but #{act} was thrown'
          , 'expected #{this} to not throw #{exp} but #{act} was thrown'
          , name
          , (err instanceof Error ? err.toString() : err)
        );

        if (!errMsg) {
          flag(this, 'object', err);
          return this;
        }
      }

      // next, check message
      var message = 'object' === _.type(err) && "message" in err
        ? err.message
        : '' + err;

      if ((message != null) && errMsg && errMsg instanceof RegExp) {
        this.assert(
            errMsg.exec(message)
          , 'expected #{this} to throw error matching #{exp} but got #{act}'
          , 'expected #{this} to throw error not matching #{exp}'
          , errMsg
          , message
        );

        flag(this, 'object', err);
        return this;
      } else if ((message != null) && errMsg && 'string' === typeof errMsg) {
        this.assert(
            ~message.indexOf(errMsg)
          , 'expected #{this} to throw error including #{exp} but got #{act}'
          , 'expected #{this} to throw error not including #{act}'
          , errMsg
          , message
        );

        flag(this, 'object', err);
        return this;
      } else {
        thrown = true;
        thrownError = err;
      }
    }

    var actuallyGot = ''
      , expectedThrown = name !== null
        ? name
        : desiredError
          ? '#{exp}' //_.inspect(desiredError)
          : 'an error';

    if (thrown) {
      actuallyGot = ' but #{act} was thrown'
    }

    this.assert(
        thrown === true
      , 'expected #{this} to throw ' + expectedThrown + actuallyGot
      , 'expected #{this} to not throw ' + expectedThrown + actuallyGot
      , (desiredError instanceof Error ? desiredError.toString() : desiredError)
      , (thrownError instanceof Error ? thrownError.toString() : thrownError)
    );

    flag(this, 'object', thrownError);
  };

  Assertion.addMethod('throw', assertThrows);
  Assertion.addMethod('throws', assertThrows);
  Assertion.addMethod('Throw', assertThrows);

  /**
   * ### .respondTo(method)
   *
   * Asserts that the object or class target will respond to a method.
   *
   *     Klass.prototype.bar = function(){};
   *     expect(Klass).to.respondTo('bar');
   *     expect(obj).to.respondTo('bar');
   *
   * To check if a constructor will respond to a static function,
   * set the `itself` flag.
   *
   *     Klass.baz = function(){};
   *     expect(Klass).itself.to.respondTo('baz');
   *
   * @name respondTo
   * @param {String} method
   * @param {String} message _optional_
   * @api public
   */

  Assertion.addMethod('respondTo', function (method, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , itself = flag(this, 'itself')
      , context = ('function' === _.type(obj) && !itself)
        ? obj.prototype[method]
        : obj[method];

    this.assert(
        'function' === typeof context
      , 'expected #{this} to respond to ' + _.inspect(method)
      , 'expected #{this} to not respond to ' + _.inspect(method)
    );
  });

  /**
   * ### .itself
   *
   * Sets the `itself` flag, later used by the `respondTo` assertion.
   *
   *     function Foo() {}
   *     Foo.bar = function() {}
   *     Foo.prototype.baz = function() {}
   *
   *     expect(Foo).itself.to.respondTo('bar');
   *     expect(Foo).itself.not.to.respondTo('baz');
   *
   * @name itself
   * @api public
   */

  Assertion.addProperty('itself', function () {
    flag(this, 'itself', true);
  });

  /**
   * ### .satisfy(method)
   *
   * Asserts that the target passes a given truth test.
   *
   *     expect(1).to.satisfy(function(num) { return num > 0; });
   *
   * @name satisfy
   * @param {Function} matcher
   * @param {String} message _optional_
   * @api public
   */

  Assertion.addMethod('satisfy', function (matcher, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    var result = matcher(obj);
    this.assert(
        result
      , 'expected #{this} to satisfy ' + _.objDisplay(matcher)
      , 'expected #{this} to not satisfy' + _.objDisplay(matcher)
      , this.negate ? false : true
      , result
    );
  });

  /**
   * ### .closeTo(expected, delta)
   *
   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
   *
   *     expect(1.5).to.be.closeTo(1, 0.5);
   *
   * @name closeTo
   * @param {Number} expected
   * @param {Number} delta
   * @param {String} message _optional_
   * @api public
   */

  Assertion.addMethod('closeTo', function (expected, delta, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');

    new Assertion(obj, msg).is.a('number');
    if (_.type(expected) !== 'number' || _.type(delta) !== 'number') {
      throw new Error('the arguments to closeTo must be numbers');
    }

    this.assert(
        Math.abs(obj - expected) <= delta
      , 'expected #{this} to be close to ' + expected + ' +/- ' + delta
      , 'expected #{this} not to be close to ' + expected + ' +/- ' + delta
    );
  });

  function isSubsetOf(subset, superset, cmp) {
    return subset.every(function(elem) {
      if (!cmp) return superset.indexOf(elem) !== -1;

      return superset.some(function(elem2) {
        return cmp(elem, elem2);
      });
    })
  }

  /**
   * ### .members(set)
   *
   * Asserts that the target is a superset of `set`,
   * or that the target and `set` have the same strictly-equal (===) members.
   * Alternately, if the `deep` flag is set, set members are compared for deep
   * equality.
   *
   *     expect([1, 2, 3]).to.include.members([3, 2]);
   *     expect([1, 2, 3]).to.not.include.members([3, 2, 8]);
   *
   *     expect([4, 2]).to.have.members([2, 4]);
   *     expect([5, 2]).to.not.have.members([5, 2, 1]);
   *
   *     expect([{ id: 1 }]).to.deep.include.members([{ id: 1 }]);
   *
   * @name members
   * @param {Array} set
   * @param {String} message _optional_
   * @api public
   */

  Assertion.addMethod('members', function (subset, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');

    new Assertion(obj).to.be.an('array');
    new Assertion(subset).to.be.an('array');

    var cmp = flag(this, 'deep') ? _.eql : undefined;

    if (flag(this, 'contains')) {
      return this.assert(
          isSubsetOf(subset, obj, cmp)
        , 'expected #{this} to be a superset of #{act}'
        , 'expected #{this} to not be a superset of #{act}'
        , obj
        , subset
      );
    }

    this.assert(
        isSubsetOf(obj, subset, cmp) && isSubsetOf(subset, obj, cmp)
        , 'expected #{this} to have the same members as #{act}'
        , 'expected #{this} to not have the same members as #{act}'
        , obj
        , subset
    );
  });
};


/***/ }),
/* 69 */
/***/ (function(module, exports) {

/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports = function (chai, util) {
  chai.expect = function (val, message) {
    return new chai.Assertion(val, message);
  };
};



/***/ }),
/* 70 */
/***/ (function(module, exports) {

/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports = function (chai, util) {
  var Assertion = chai.Assertion;

  function loadShould () {
    // explicitly define this method as function as to have it's name to include as `ssfi`
    function shouldGetter() {
      if (this instanceof String || this instanceof Number) {
        return new Assertion(this.constructor(this), null, shouldGetter);
      } else if (this instanceof Boolean) {
        return new Assertion(this == true, null, shouldGetter);
      }
      return new Assertion(this, null, shouldGetter);
    }
    function shouldSetter(value) {
      // See https://github.com/chaijs/chai/issues/86: this makes
      // `whatever.should = someValue` actually set `someValue`, which is
      // especially useful for `global.should = require('chai').should()`.
      //
      // Note that we have to use [[DefineProperty]] instead of [[Put]]
      // since otherwise we would trigger this very setter!
      Object.defineProperty(this, 'should', {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    }
    // modify Object.prototype to have `should`
    Object.defineProperty(Object.prototype, 'should', {
      set: shouldSetter
      , get: shouldGetter
      , configurable: true
    });

    var should = {};

    should.equal = function (val1, val2, msg) {
      new Assertion(val1, msg).to.equal(val2);
    };

    should.Throw = function (fn, errt, errs, msg) {
      new Assertion(fn, msg).to.Throw(errt, errs);
    };

    should.exist = function (val, msg) {
      new Assertion(val, msg).to.exist;
    }

    // negation
    should.not = {}

    should.not.equal = function (val1, val2, msg) {
      new Assertion(val1, msg).to.not.equal(val2);
    };

    should.not.Throw = function (fn, errt, errs, msg) {
      new Assertion(fn, msg).to.not.Throw(errt, errs);
    };

    should.not.exist = function (val, msg) {
      new Assertion(val, msg).to.not.exist;
    }

    should['throw'] = should['Throw'];
    should.not['throw'] = should.not['Throw'];

    return should;
  };

  chai.should = loadShould;
  chai.Should = loadShould;
};


/***/ }),
/* 71 */
/***/ (function(module, exports) {

/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */


module.exports = function (chai, util) {

  /*!
   * Chai dependencies.
   */

  var Assertion = chai.Assertion
    , flag = util.flag;

  /*!
   * Module export.
   */

  /**
   * ### assert(expression, message)
   *
   * Write your own test expressions.
   *
   *     assert('foo' !== 'bar', 'foo is not bar');
   *     assert(Array.isArray([]), 'empty arrays are arrays');
   *
   * @param {Mixed} expression to test for truthiness
   * @param {String} message to display on error
   * @name assert
   * @api public
   */

  var assert = chai.assert = function (express, errmsg) {
    var test = new Assertion(null, null, chai.assert);
    test.assert(
        express
      , errmsg
      , '[ negation message unavailable ]'
    );
  };

  /**
   * ### .fail(actual, expected, [message], [operator])
   *
   * Throw a failure. Node.js `assert` module-compatible.
   *
   * @name fail
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @param {String} operator
   * @api public
   */

  assert.fail = function (actual, expected, message, operator) {
    message = message || 'assert.fail()';
    throw new chai.AssertionError(message, {
        actual: actual
      , expected: expected
      , operator: operator
    }, assert.fail);
  };

  /**
   * ### .ok(object, [message])
   *
   * Asserts that `object` is truthy.
   *
   *     assert.ok('everything', 'everything is ok');
   *     assert.ok(false, 'this will fail');
   *
   * @name ok
   * @param {Mixed} object to test
   * @param {String} message
   * @api public
   */

  assert.ok = function (val, msg) {
    new Assertion(val, msg).is.ok;
  };

  /**
   * ### .notOk(object, [message])
   *
   * Asserts that `object` is falsy.
   *
   *     assert.notOk('everything', 'this will fail');
   *     assert.notOk(false, 'this will pass');
   *
   * @name notOk
   * @param {Mixed} object to test
   * @param {String} message
   * @api public
   */

  assert.notOk = function (val, msg) {
    new Assertion(val, msg).is.not.ok;
  };

  /**
   * ### .equal(actual, expected, [message])
   *
   * Asserts non-strict equality (`==`) of `actual` and `expected`.
   *
   *     assert.equal(3, '3', '== coerces values to strings');
   *
   * @name equal
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @api public
   */

  assert.equal = function (act, exp, msg) {
    var test = new Assertion(act, msg, assert.equal);

    test.assert(
        exp == flag(test, 'object')
      , 'expected #{this} to equal #{exp}'
      , 'expected #{this} to not equal #{act}'
      , exp
      , act
    );
  };

  /**
   * ### .notEqual(actual, expected, [message])
   *
   * Asserts non-strict inequality (`!=`) of `actual` and `expected`.
   *
   *     assert.notEqual(3, 4, 'these numbers are not equal');
   *
   * @name notEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @api public
   */

  assert.notEqual = function (act, exp, msg) {
    var test = new Assertion(act, msg, assert.notEqual);

    test.assert(
        exp != flag(test, 'object')
      , 'expected #{this} to not equal #{exp}'
      , 'expected #{this} to equal #{act}'
      , exp
      , act
    );
  };

  /**
   * ### .strictEqual(actual, expected, [message])
   *
   * Asserts strict equality (`===`) of `actual` and `expected`.
   *
   *     assert.strictEqual(true, true, 'these booleans are strictly equal');
   *
   * @name strictEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @api public
   */

  assert.strictEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.equal(exp);
  };

  /**
   * ### .notStrictEqual(actual, expected, [message])
   *
   * Asserts strict inequality (`!==`) of `actual` and `expected`.
   *
   *     assert.notStrictEqual(3, '3', 'no coercion for strict equality');
   *
   * @name notStrictEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @api public
   */

  assert.notStrictEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.not.equal(exp);
  };

  /**
   * ### .deepEqual(actual, expected, [message])
   *
   * Asserts that `actual` is deeply equal to `expected`.
   *
   *     assert.deepEqual({ tea: 'green' }, { tea: 'green' });
   *
   * @name deepEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @api public
   */

  assert.deepEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.eql(exp);
  };

  /**
   * ### .notDeepEqual(actual, expected, [message])
   *
   * Assert that `actual` is not deeply equal to `expected`.
   *
   *     assert.notDeepEqual({ tea: 'green' }, { tea: 'jasmine' });
   *
   * @name notDeepEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @api public
   */

  assert.notDeepEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.not.eql(exp);
  };

  /**
   * ### .isTrue(value, [message])
   *
   * Asserts that `value` is true.
   *
   *     var teaServed = true;
   *     assert.isTrue(teaServed, 'the tea has been served');
   *
   * @name isTrue
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.isTrue = function (val, msg) {
    new Assertion(val, msg).is['true'];
  };

  /**
   * ### .isFalse(value, [message])
   *
   * Asserts that `value` is false.
   *
   *     var teaServed = false;
   *     assert.isFalse(teaServed, 'no tea yet? hmm...');
   *
   * @name isFalse
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.isFalse = function (val, msg) {
    new Assertion(val, msg).is['false'];
  };

  /**
   * ### .isNull(value, [message])
   *
   * Asserts that `value` is null.
   *
   *     assert.isNull(err, 'there was no error');
   *
   * @name isNull
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.isNull = function (val, msg) {
    new Assertion(val, msg).to.equal(null);
  };

  /**
   * ### .isNotNull(value, [message])
   *
   * Asserts that `value` is not null.
   *
   *     var tea = 'tasty chai';
   *     assert.isNotNull(tea, 'great, time for tea!');
   *
   * @name isNotNull
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.isNotNull = function (val, msg) {
    new Assertion(val, msg).to.not.equal(null);
  };

  /**
   * ### .isUndefined(value, [message])
   *
   * Asserts that `value` is `undefined`.
   *
   *     var tea;
   *     assert.isUndefined(tea, 'no tea defined');
   *
   * @name isUndefined
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.isUndefined = function (val, msg) {
    new Assertion(val, msg).to.equal(undefined);
  };

  /**
   * ### .isDefined(value, [message])
   *
   * Asserts that `value` is not `undefined`.
   *
   *     var tea = 'cup of chai';
   *     assert.isDefined(tea, 'tea has been defined');
   *
   * @name isDefined
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.isDefined = function (val, msg) {
    new Assertion(val, msg).to.not.equal(undefined);
  };

  /**
   * ### .isFunction(value, [message])
   *
   * Asserts that `value` is a function.
   *
   *     function serveTea() { return 'cup of tea'; };
   *     assert.isFunction(serveTea, 'great, we can have tea now');
   *
   * @name isFunction
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.isFunction = function (val, msg) {
    new Assertion(val, msg).to.be.a('function');
  };

  /**
   * ### .isNotFunction(value, [message])
   *
   * Asserts that `value` is _not_ a function.
   *
   *     var serveTea = [ 'heat', 'pour', 'sip' ];
   *     assert.isNotFunction(serveTea, 'great, we have listed the steps');
   *
   * @name isNotFunction
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.isNotFunction = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('function');
  };

  /**
   * ### .isObject(value, [message])
   *
   * Asserts that `value` is an object (as revealed by
   * `Object.prototype.toString`).
   *
   *     var selection = { name: 'Chai', serve: 'with spices' };
   *     assert.isObject(selection, 'tea selection is an object');
   *
   * @name isObject
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.isObject = function (val, msg) {
    new Assertion(val, msg).to.be.a('object');
  };

  /**
   * ### .isNotObject(value, [message])
   *
   * Asserts that `value` is _not_ an object.
   *
   *     var selection = 'chai'
   *     assert.isNotObject(selection, 'tea selection is not an object');
   *     assert.isNotObject(null, 'null is not an object');
   *
   * @name isNotObject
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.isNotObject = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('object');
  };

  /**
   * ### .isArray(value, [message])
   *
   * Asserts that `value` is an array.
   *
   *     var menu = [ 'green', 'chai', 'oolong' ];
   *     assert.isArray(menu, 'what kind of tea do we want?');
   *
   * @name isArray
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.isArray = function (val, msg) {
    new Assertion(val, msg).to.be.an('array');
  };

  /**
   * ### .isNotArray(value, [message])
   *
   * Asserts that `value` is _not_ an array.
   *
   *     var menu = 'green|chai|oolong';
   *     assert.isNotArray(menu, 'what kind of tea do we want?');
   *
   * @name isNotArray
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.isNotArray = function (val, msg) {
    new Assertion(val, msg).to.not.be.an('array');
  };

  /**
   * ### .isString(value, [message])
   *
   * Asserts that `value` is a string.
   *
   *     var teaOrder = 'chai';
   *     assert.isString(teaOrder, 'order placed');
   *
   * @name isString
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.isString = function (val, msg) {
    new Assertion(val, msg).to.be.a('string');
  };

  /**
   * ### .isNotString(value, [message])
   *
   * Asserts that `value` is _not_ a string.
   *
   *     var teaOrder = 4;
   *     assert.isNotString(teaOrder, 'order placed');
   *
   * @name isNotString
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.isNotString = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('string');
  };

  /**
   * ### .isNumber(value, [message])
   *
   * Asserts that `value` is a number.
   *
   *     var cups = 2;
   *     assert.isNumber(cups, 'how many cups');
   *
   * @name isNumber
   * @param {Number} value
   * @param {String} message
   * @api public
   */

  assert.isNumber = function (val, msg) {
    new Assertion(val, msg).to.be.a('number');
  };

  /**
   * ### .isNotNumber(value, [message])
   *
   * Asserts that `value` is _not_ a number.
   *
   *     var cups = '2 cups please';
   *     assert.isNotNumber(cups, 'how many cups');
   *
   * @name isNotNumber
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.isNotNumber = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('number');
  };

  /**
   * ### .isBoolean(value, [message])
   *
   * Asserts that `value` is a boolean.
   *
   *     var teaReady = true
   *       , teaServed = false;
   *
   *     assert.isBoolean(teaReady, 'is the tea ready');
   *     assert.isBoolean(teaServed, 'has tea been served');
   *
   * @name isBoolean
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.isBoolean = function (val, msg) {
    new Assertion(val, msg).to.be.a('boolean');
  };

  /**
   * ### .isNotBoolean(value, [message])
   *
   * Asserts that `value` is _not_ a boolean.
   *
   *     var teaReady = 'yep'
   *       , teaServed = 'nope';
   *
   *     assert.isNotBoolean(teaReady, 'is the tea ready');
   *     assert.isNotBoolean(teaServed, 'has tea been served');
   *
   * @name isNotBoolean
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.isNotBoolean = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('boolean');
  };

  /**
   * ### .typeOf(value, name, [message])
   *
   * Asserts that `value`'s type is `name`, as determined by
   * `Object.prototype.toString`.
   *
   *     assert.typeOf({ tea: 'chai' }, 'object', 'we have an object');
   *     assert.typeOf(['chai', 'jasmine'], 'array', 'we have an array');
   *     assert.typeOf('tea', 'string', 'we have a string');
   *     assert.typeOf(/tea/, 'regexp', 'we have a regular expression');
   *     assert.typeOf(null, 'null', 'we have a null');
   *     assert.typeOf(undefined, 'undefined', 'we have an undefined');
   *
   * @name typeOf
   * @param {Mixed} value
   * @param {String} name
   * @param {String} message
   * @api public
   */

  assert.typeOf = function (val, type, msg) {
    new Assertion(val, msg).to.be.a(type);
  };

  /**
   * ### .notTypeOf(value, name, [message])
   *
   * Asserts that `value`'s type is _not_ `name`, as determined by
   * `Object.prototype.toString`.
   *
   *     assert.notTypeOf('tea', 'number', 'strings are not numbers');
   *
   * @name notTypeOf
   * @param {Mixed} value
   * @param {String} typeof name
   * @param {String} message
   * @api public
   */

  assert.notTypeOf = function (val, type, msg) {
    new Assertion(val, msg).to.not.be.a(type);
  };

  /**
   * ### .instanceOf(object, constructor, [message])
   *
   * Asserts that `value` is an instance of `constructor`.
   *
   *     var Tea = function (name) { this.name = name; }
   *       , chai = new Tea('chai');
   *
   *     assert.instanceOf(chai, Tea, 'chai is an instance of tea');
   *
   * @name instanceOf
   * @param {Object} object
   * @param {Constructor} constructor
   * @param {String} message
   * @api public
   */

  assert.instanceOf = function (val, type, msg) {
    new Assertion(val, msg).to.be.instanceOf(type);
  };

  /**
   * ### .notInstanceOf(object, constructor, [message])
   *
   * Asserts `value` is not an instance of `constructor`.
   *
   *     var Tea = function (name) { this.name = name; }
   *       , chai = new String('chai');
   *
   *     assert.notInstanceOf(chai, Tea, 'chai is not an instance of tea');
   *
   * @name notInstanceOf
   * @param {Object} object
   * @param {Constructor} constructor
   * @param {String} message
   * @api public
   */

  assert.notInstanceOf = function (val, type, msg) {
    new Assertion(val, msg).to.not.be.instanceOf(type);
  };

  /**
   * ### .include(haystack, needle, [message])
   *
   * Asserts that `haystack` includes `needle`. Works
   * for strings and arrays.
   *
   *     assert.include('foobar', 'bar', 'foobar contains string "bar"');
   *     assert.include([ 1, 2, 3 ], 3, 'array contains value');
   *
   * @name include
   * @param {Array|String} haystack
   * @param {Mixed} needle
   * @param {String} message
   * @api public
   */

  assert.include = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.include).include(inc);
  };

  /**
   * ### .notInclude(haystack, needle, [message])
   *
   * Asserts that `haystack` does not include `needle`. Works
   * for strings and arrays.
   *i
   *     assert.notInclude('foobar', 'baz', 'string not include substring');
   *     assert.notInclude([ 1, 2, 3 ], 4, 'array not include contain value');
   *
   * @name notInclude
   * @param {Array|String} haystack
   * @param {Mixed} needle
   * @param {String} message
   * @api public
   */

  assert.notInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.notInclude).not.include(inc);
  };

  /**
   * ### .match(value, regexp, [message])
   *
   * Asserts that `value` matches the regular expression `regexp`.
   *
   *     assert.match('foobar', /^foo/, 'regexp matches');
   *
   * @name match
   * @param {Mixed} value
   * @param {RegExp} regexp
   * @param {String} message
   * @api public
   */

  assert.match = function (exp, re, msg) {
    new Assertion(exp, msg).to.match(re);
  };

  /**
   * ### .notMatch(value, regexp, [message])
   *
   * Asserts that `value` does not match the regular expression `regexp`.
   *
   *     assert.notMatch('foobar', /^foo/, 'regexp does not match');
   *
   * @name notMatch
   * @param {Mixed} value
   * @param {RegExp} regexp
   * @param {String} message
   * @api public
   */

  assert.notMatch = function (exp, re, msg) {
    new Assertion(exp, msg).to.not.match(re);
  };

  /**
   * ### .property(object, property, [message])
   *
   * Asserts that `object` has a property named by `property`.
   *
   *     assert.property({ tea: { green: 'matcha' }}, 'tea');
   *
   * @name property
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @api public
   */

  assert.property = function (obj, prop, msg) {
    new Assertion(obj, msg).to.have.property(prop);
  };

  /**
   * ### .notProperty(object, property, [message])
   *
   * Asserts that `object` does _not_ have a property named by `property`.
   *
   *     assert.notProperty({ tea: { green: 'matcha' }}, 'coffee');
   *
   * @name notProperty
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @api public
   */

  assert.notProperty = function (obj, prop, msg) {
    new Assertion(obj, msg).to.not.have.property(prop);
  };

  /**
   * ### .deepProperty(object, property, [message])
   *
   * Asserts that `object` has a property named by `property`, which can be a
   * string using dot- and bracket-notation for deep reference.
   *
   *     assert.deepProperty({ tea: { green: 'matcha' }}, 'tea.green');
   *
   * @name deepProperty
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @api public
   */

  assert.deepProperty = function (obj, prop, msg) {
    new Assertion(obj, msg).to.have.deep.property(prop);
  };

  /**
   * ### .notDeepProperty(object, property, [message])
   *
   * Asserts that `object` does _not_ have a property named by `property`, which
   * can be a string using dot- and bracket-notation for deep reference.
   *
   *     assert.notDeepProperty({ tea: { green: 'matcha' }}, 'tea.oolong');
   *
   * @name notDeepProperty
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @api public
   */

  assert.notDeepProperty = function (obj, prop, msg) {
    new Assertion(obj, msg).to.not.have.deep.property(prop);
  };

  /**
   * ### .propertyVal(object, property, value, [message])
   *
   * Asserts that `object` has a property named by `property` with value given
   * by `value`.
   *
   *     assert.propertyVal({ tea: 'is good' }, 'tea', 'is good');
   *
   * @name propertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.propertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg).to.have.property(prop, val);
  };

  /**
   * ### .propertyNotVal(object, property, value, [message])
   *
   * Asserts that `object` has a property named by `property`, but with a value
   * different from that given by `value`.
   *
   *     assert.propertyNotVal({ tea: 'is good' }, 'tea', 'is bad');
   *
   * @name propertyNotVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.propertyNotVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg).to.not.have.property(prop, val);
  };

  /**
   * ### .deepPropertyVal(object, property, value, [message])
   *
   * Asserts that `object` has a property named by `property` with value given
   * by `value`. `property` can use dot- and bracket-notation for deep
   * reference.
   *
   *     assert.deepPropertyVal({ tea: { green: 'matcha' }}, 'tea.green', 'matcha');
   *
   * @name deepPropertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.deepPropertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg).to.have.deep.property(prop, val);
  };

  /**
   * ### .deepPropertyNotVal(object, property, value, [message])
   *
   * Asserts that `object` has a property named by `property`, but with a value
   * different from that given by `value`. `property` can use dot- and
   * bracket-notation for deep reference.
   *
   *     assert.deepPropertyNotVal({ tea: { green: 'matcha' }}, 'tea.green', 'konacha');
   *
   * @name deepPropertyNotVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @api public
   */

  assert.deepPropertyNotVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg).to.not.have.deep.property(prop, val);
  };

  /**
   * ### .lengthOf(object, length, [message])
   *
   * Asserts that `object` has a `length` property with the expected value.
   *
   *     assert.lengthOf([1,2,3], 3, 'array has length of 3');
   *     assert.lengthOf('foobar', 5, 'string has length of 6');
   *
   * @name lengthOf
   * @param {Mixed} object
   * @param {Number} length
   * @param {String} message
   * @api public
   */

  assert.lengthOf = function (exp, len, msg) {
    new Assertion(exp, msg).to.have.length(len);
  };

  /**
   * ### .throws(function, [constructor/string/regexp], [string/regexp], [message])
   *
   * Asserts that `function` will throw an error that is an instance of
   * `constructor`, or alternately that it will throw an error with message
   * matching `regexp`.
   *
   *     assert.throw(fn, 'function throws a reference error');
   *     assert.throw(fn, /function throws a reference error/);
   *     assert.throw(fn, ReferenceError);
   *     assert.throw(fn, ReferenceError, 'function throws a reference error');
   *     assert.throw(fn, ReferenceError, /function throws a reference error/);
   *
   * @name throws
   * @alias throw
   * @alias Throw
   * @param {Function} function
   * @param {ErrorConstructor} constructor
   * @param {RegExp} regexp
   * @param {String} message
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
   * @api public
   */

  assert.Throw = function (fn, errt, errs, msg) {
    if ('string' === typeof errt || errt instanceof RegExp) {
      errs = errt;
      errt = null;
    }

    var assertErr = new Assertion(fn, msg).to.Throw(errt, errs);
    return flag(assertErr, 'object');
  };

  /**
   * ### .doesNotThrow(function, [constructor/regexp], [message])
   *
   * Asserts that `function` will _not_ throw an error that is an instance of
   * `constructor`, or alternately that it will not throw an error with message
   * matching `regexp`.
   *
   *     assert.doesNotThrow(fn, Error, 'function does not throw');
   *
   * @name doesNotThrow
   * @param {Function} function
   * @param {ErrorConstructor} constructor
   * @param {RegExp} regexp
   * @param {String} message
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
   * @api public
   */

  assert.doesNotThrow = function (fn, type, msg) {
    if ('string' === typeof type) {
      msg = type;
      type = null;
    }

    new Assertion(fn, msg).to.not.Throw(type);
  };

  /**
   * ### .operator(val1, operator, val2, [message])
   *
   * Compares two values using `operator`.
   *
   *     assert.operator(1, '<', 2, 'everything is ok');
   *     assert.operator(1, '>', 2, 'this will fail');
   *
   * @name operator
   * @param {Mixed} val1
   * @param {String} operator
   * @param {Mixed} val2
   * @param {String} message
   * @api public
   */

  assert.operator = function (val, operator, val2, msg) {
    if (!~['==', '===', '>', '>=', '<', '<=', '!=', '!=='].indexOf(operator)) {
      throw new Error('Invalid operator "' + operator + '"');
    }
    var test = new Assertion(eval(val + operator + val2), msg);
    test.assert(
        true === flag(test, 'object')
      , 'expected ' + util.inspect(val) + ' to be ' + operator + ' ' + util.inspect(val2)
      , 'expected ' + util.inspect(val) + ' to not be ' + operator + ' ' + util.inspect(val2) );
  };

  /**
   * ### .closeTo(actual, expected, delta, [message])
   *
   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
   *
   *     assert.closeTo(1.5, 1, 0.5, 'numbers are close');
   *
   * @name closeTo
   * @param {Number} actual
   * @param {Number} expected
   * @param {Number} delta
   * @param {String} message
   * @api public
   */

  assert.closeTo = function (act, exp, delta, msg) {
    new Assertion(act, msg).to.be.closeTo(exp, delta);
  };

  /**
   * ### .sameMembers(set1, set2, [message])
   *
   * Asserts that `set1` and `set2` have the same members.
   * Order is not taken into account.
   *
   *     assert.sameMembers([ 1, 2, 3 ], [ 2, 1, 3 ], 'same members');
   *
   * @name sameMembers
   * @param {Array} set1
   * @param {Array} set2
   * @param {String} message
   * @api public
   */

  assert.sameMembers = function (set1, set2, msg) {
    new Assertion(set1, msg).to.have.same.members(set2);
  }

  /**
   * ### .includeMembers(superset, subset, [message])
   *
   * Asserts that `subset` is included in `superset`.
   * Order is not taken into account.
   *
   *     assert.includeMembers([ 1, 2, 3 ], [ 2, 1 ], 'include members');
   *
   * @name includeMembers
   * @param {Array} superset
   * @param {Array} subset
   * @param {String} message
   * @api public
   */

  assert.includeMembers = function (superset, subset, msg) {
    new Assertion(superset, msg).to.include.members(subset);
  }

  /*!
   * Undocumented / untested
   */

  assert.ifError = function (val, msg) {
    new Assertion(val, msg).to.not.be.ok;
  };

  /*!
   * Aliases.
   */

  (function alias(name, as){
    assert[as] = assert[name];
    return alias;
  })
  ('Throw', 'throw')
  ('Throw', 'throws');
};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var should = __webpack_require__(2).should();

exports.run = function (SPScript) {
	describe("SPScript Context", function () {
		var ctx = SPScript.createContext();
		describe("var ctx = SPScript.createContext(url)", function () {
			it("Should create the primary object you use to interact with the site", function () {
				if (!ctx) throw new Error("Context is null");
				ctx.should.have.property("webUrl");
				ctx.should.have.property("executeRequest");
				ctx.should.have.property("get");
				ctx.should.have.property("post");
				ctx.should.have.property("authorizedPost");
				ctx.should.have.property("lists");
			});
			it("Should allow a url to be passed in", function () {
				var url = "http://blah.sharepoint.com";
				var context = SPScript.createContext(url);
				context.webUrl.should.equal(url);
			});
			it("Should default to the current web if no url is passed", function () {
				var context = SPScript.createContext();
				context.webUrl.should.equal(_spPageContextInfo.webAbsoluteUrl);
			});
		});

		describe("Namespaces", function () {
			describe("ctx.web", function () {
				it("Should have an SPScript Web object with site methods (getUser, getSubsites etc...)", function () {
					ctx.should.have.property("web");
					ctx.web.should.have.property("getUser");
					ctx.web.should.have.property("getSubsites");
				});
			});

			describe("ctx.search", function () {
				it("Should have an SPScript Search object with search methods (query, people, sites etc...)", function () {
					ctx.search.should.have.property("query");
					ctx.search.should.have.property("people");
				});
			});

			describe("ctx.profiles", function () {
				it("Should have an SPScript Profiles object with methods to hit the Profile Service (current, setProperty etc...)", function () {
					ctx.should.have.property("profiles");
					ctx.profiles.should.have.property("get");
					ctx.profiles.should.have.property("setProperty");
				});
			});
		});

		describe("Methods", function () {
			describe("ctx.list(name)", function () {
				it("Should return an SPScript List instance", function () {
					var list = ctx.lists("My List");
					list.should.have.property("listName");
					list.should.have.property("getInfo");
				});
			});
			describe("ctx.get(url, [opts])", function () {
				var promise;
				before(function () {
					promise = ctx.get("/lists?$select=Title");
				});
				it("Should return a Promise", function () {
					if (!promise) throw new Error("Promise is null");
					promise.should.have.property("then");
				});
				it("Should resolve to a JS object, not a JSON string", function (done) {
					promise.then(function (data) {
						data.should.have.property("d");
						done();
					}).catch(function (err) {
						return done(err);
					});
				});
				it("Should return valid API results: ctx.get('/lists')", function (done) {
					promise.then(function (data) {
						data.should.have.property("d");
						data.d.should.have.property("results");
						data.d.results.should.be.an("array");
						done();
					}).catch(function (err) {
						return done(err);
					});
				});
			});

			describe("ctx.post(url, [body], [opts]", function () {
				it("Should return a Promise");
				it("Should resolve to a JS object, not a JSON string");
			});

			describe("ctx.authorizedPost(url, [body], [opts]", function () {
				it("Should include a request digest in the headers");
				it("Should return a Promise");
				it("Should resolve to a JS object, not a JSON string");
			});

			describe("ctx.getRequestDigest()", function () {
				it("Should resolve to a string request digest", function (done) {
					ctx.getRequestDigest().then(function (digest) {
						digest.should.be.a("string");
						digest.should.not.be.empty;
						done();
					});
				});
			});
		});
	});
};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var permissionsTests = __webpack_require__(17);
var should = __webpack_require__(2).should();

exports.run = function (dao) {
    describe("var web = ctx.web", function () {
        this.timeout(5000);
        describe("ctx.web.getInfo()", function () {
            it("Should return a promise that resolves to web info", function (done) {
                dao.web.getInfo().then(function (webInfo) {
                    webInfo.should.have.property("Url");
                    webInfo.should.have.property("Title");
                    done();
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });

        describe("ctx.web.getSubsites()", function () {
            it("Should return a promise that resolves to an array of subsite web infos.", function (done) {
                dao.web.getSubsites().then(function (subsites) {
                    subsites.should.be.an("array");
                    if (subsites.length) {
                        subsites[0].should.have.property("Title");
                        subsites[0].should.have.property("ServerRelativeUrl");
                    }
                    done();
                });
            });
        });

        // var folderPath = "/shared documents";
        // describe("web.getFolder(serverRelativeUrl)", function() {
        //     var folder = null;
        //     before(function(done) {
        //         dao.web.getFolder(folderPath).then(function(result) {
        //             folder = result;
        //             done();
        //         });
        //     });
        //     it("Should return a promise that resolves to a folder with files and folders", function() {
        //         folder.should.be.an("object");
        //         folder.should.have.property("name");
        //         folder.should.have.property("serverRelativeUrl");
        //         folder.should.have.property("files");
        //         folder.files.should.be.an("array");
        //         folder.should.have.property("folders");
        //         folder.folders.should.be.an("array");
        //     });
        // });

        describe("ctx.web.getUser()", function () {
            var user = null;
            before(function (done) {
                dao.web.getUser().then(function (result) {
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
            it("Should return the current user", function () {
                user.should.have.property("Id");
                user.Id.should.equal(_spPageContextInfo.userId);
            });
        });

        describe("ctx.web.getUser(email)", function () {
            var email = "andrew@andrewpetersen.onmicrosoft.com";
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
            it("Should return a user whose email matches the specified email", function () {
                user.should.have.property("Email");
                user.Email.should.equal(email);
            });
        });
        var folderUrl = "/spscript/Shared Documents";
        var filename = "testfile.txt";
        var fileUrl = folderUrl + "/" + filename;

        // describe("web.uploadFile(fileContent, serverRelativeFolderUrl)", function() {
        //     var fileContent = "file content";
        //     var fileTitle = "test title";
        //     var response = null;
        //     before(function(done){
        //         dao.web.uploadFile(fileContent, folderUrl, { name: filename, Title: fileTitle})
        //             .then(function(data){
        //                 response = data;
        //                 done();
        //             })
        //     })
        //     it("Should return a promise that resolves to an object with file and item", function() {
        //         response.should.not.be.null;
        //         response.should.have.property("file");
        //         response.should.have.property("item");
        //         response.file.should.have.property("ServerRelativeUrl");
        //     });
        //     it("Should return an item that has the parent list expanded", function() {
        //         response.item.should.have.property("Id");
        //         response.item.should.have.property("ParentList");
        //         response.item.ParentList.should.have.property("Title");
        //     })
        //     it("Should save the file to the right location", function() {
        //         response.file.ServerRelativeUrl.toLowerCase().should.equal(fileUrl.toLowerCase());
        //     });
        //     it("Should allow setting fields after the upload completes", function(done) {
        //         dao.lists(response.item.ParentList.Title).getItemById(response.item.Id).then(function(retrievedItem){
        //             retrievedItem.should.have.property("Title");
        //             retrievedItem.Title.should.equal(fileTitle);
        //             done();
        //         })
        //     })
        // })

        describe("ctx.web.getFile(serverRelativeFileUrl)", function () {
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
        describe("ctx.web.copyFile(serverRelativeSourceUrl, serverRelativeDestUrl)", function () {
            var startTestTime = new Date();
            var file = null;
            before(function (done) {
                dao.web.copyFile(fileUrl, destinationUrl).then(function () {
                    return dao.web.getFile(destinationUrl);
                }).then(function (result) {
                    file = result;
                    done();
                }).catch(function (resp) {
                    "one".should.equal("two", "Error in CopyFile requst");
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
                // var modified = new Date(file["TimeLastModified"])
                // modified.should.be.above(startTestTime);
            });
        });

        // describe("web.deleteFile(serverRelativeFileUrl)", function() {
        //     var file = null;
        //     it("Ensure there is a file to delete.", function(done){
        //         dao.web.getFile(destinationUrl).then(function(result){
        //             result.should.not.be.null;
        //             result.should.have.property("Name");
        //             done();
        //         });
        //     })

        //     it("Should return a promise, and once resolved, the file should NOT be retrievable", function(done){
        //         dao.web.deleteFile(destinationUrl).then(function(result){
        //             dao.web.getFile(destinationUrl)
        //                 .then(function(){
        //                     // the call to get file succeeded so for a a failure
        //                     ("one").should.equal("two");
        //                     done();
        //                 })
        //                 .catch(function(){
        //                     done();
        //                     // call to get file failed as expected because file is gone
        //                 })
        //         })
        //     })
        // }); 

        describe("ctx.web.permissions.getRoleAssignments()", permissionsTests.create(dao.web));

        if (isBrowser()) {
            describe("ctx.web.permissions.check()", permissionsTests.create(dao.web, "check"));
        }

        describe("ctx.web.permissions.check(email)", permissionsTests.create(dao.web, "check", "andrew@andrewpetersen.onmicrosoft.com"));
    });
};

function isBrowser() {
    return !(typeof window === 'undefined');
}

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var permissionsTests = __webpack_require__(17);
var should = __webpack_require__(2).should();

exports.run = function (dao) {
	describe("var list = ctx.lists(listname)", function () {
		this.timeout(4000);
		var list = dao.lists("TestList");
		describe("list.info()", function () {
			var listInfo = null;
			before(function (done) {
				list.getInfo().then(function (info) {
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
			});

			it("Should return all the items in the list", function (done) {
				list.getInfo().then(function (listInfo) {
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
			it("Should be able to return attachments using the optional odata query", function (done) {
				list.getItemById(validId, "$expand=AttachmentFiles").then(function (item) {
					item.should.have.property("AttachmentFiles");
					item.AttachmentFiles.should.have.property("results");
					item.AttachmentFiles.results.should.be.an("Array");
					done();
				});
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

		// var itemIdWithAttachment = null;
		// var attachmentFilename = "testAttachment.txt";
		// var attachmentContent = "test content";

		// describe("list.addAttachment(id, filename, content)", function() {

		//     before(function(done) {
		//         list.getItems("$orderby=Id").then(function(items) {
		//             itemIdWithAttachment = items[items.length - 1].Id;
		//             return list.addAttachment(itemIdWithAttachment, attachmentFilename, attachmentContent);
		//         }).then(function() {
		//             done();
		//         });
		//     });
		//     it("Should add an attachment file to the list item", function(done) {
		//         list.getItemById(itemIdWithAttachment, "$expand=AttachmentFiles").then(function(item){
		//             item.should.have.property('AttachmentFiles');
		//             item.AttachmentFiles.should.have.property('results');
		//             item.AttachmentFiles.results.should.be.an('Array');
		//             item.AttachmentFiles.results.should.not.be.empty;
		//             done();
		//         });
		//     })
		// });

		// describe("list.deleteAttachment(id, filename)", function() {
		//     var getAttachment = function(id, filename) {
		//         return list.getItemById(itemIdWithAttachment, "$expand=AttachmentFiles").then(function(item){
		//             var attachments = item.AttachmentFiles.results;
		//             return attachments.find(function(a) { return a.FileName === attachmentFilename});
		//         });
		//     };
		//     before(function(done) {
		//         getAttachment(itemIdWithAttachment, attachmentFilename).then(function(attachment) {
		//             if (attachment) {
		//                 return list.deleteAttachment(itemIdWithAttachment, attachmentFilename);
		//             }
		//             return false;
		//         }).then(function(){
		//             done();
		//         }).catch(function(res) {
		//             done();
		//             console.log("REQUEST ERROR")
		//         });
		//     });
		//     it("Should delete the attachment", function(done) {
		//         getAttachment(itemIdWithAttachment, attachmentFilename).then(function(attachment) {
		//             if (attachment) ("attachment").should.equal("null");
		//             done();
		//         });
		//     })
		// });

		describe("list.deleteItem(id)", function () {
			var itemToDelete = null;
			before(function (done) {
				list.getItems("$orderby=Id").then(function (items) {
					console.log(items);
					itemToDelete = items[items.length - 1];
					return list.deleteItem(itemToDelete.Id);
				}).then(function () {
					done();
				}).catch(function (err) {
					done(err);
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

		if (isBrowser()) {
			describe("list.permissions.check()", permissionsTests.create(list, "check"));
		}

		describe("list.permissions.check(email)", permissionsTests.create(list, "check", "andrew@andrewpetersen.onmicrosoft.com"));
	});
};

function isBrowser() {
	return !(typeof window === "undefined");
}

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var should = __webpack_require__(2).should();

exports.run = function (utils) {
    describe("var utils = SPScript.utils", function () {
        describe("utils.parseJSON(data)", function () {
            it("Should exist on the utils object", function () {
                utils.should.have.property("parseJSON");
                utils.parseJSON.should.be.a("function");
            });
            it("Should take a string or an object and return an object", function () {
                var obj = { one: "value of one", two: "value of two" };
                var jsonStr = JSON.stringify(obj);

                var res1 = utils.parseJSON(obj);
                res1.should.not.be.null;
                res1.should.have.property("one");
                res1.one.should.equal(obj.one);

                var res2 = utils.parseJSON(jsonStr);
                res2.should.not.be.null;
                res2.should.have.property("one");
                res2.one.should.equal(obj.one);
            });
        });

        describe("Query String", function () {
            describe("utils.qs.toObj(str)", function () {
                it("Should take in a string in the form of key=value&key2=value and return an Object", function () {
                    var str1 = "key1=value1";
                    var str2 = "key1=value1&key2=value2";
                    var obj1 = utils.qs.toObj(str1);
                    obj1.should.have.property("key1");
                    obj1.key1.should.equal("value1");

                    var obj2 = utils.qs.toObj(str2);
                    obj2.should.have.property("key1");
                    obj2.should.have.property("key2");
                    obj2.key2.should.equal("value2");
                });
                it("Should support an optional leading '?' ", function () {
                    var str1 = "?key1=value1";
                    var obj1 = utils.qs.toObj(str1);
                    obj1.should.have.property("key1");
                    obj1.key1.should.equal("value1");
                });
                it("Should default to 'window.location.search' if no value is passed");
            });

            describe("utils.qs.fromObj(obj, quoteValues?)", function () {
                it("Should turn { key1: 'value1', key2: 'value2' } into 'key1=value1&key2=value2'", function () {
                    var obj = { key1: "value1", key2: "value2" };
                    var str = utils.qs.fromObj(obj);
                    str.should.equal("key1=value1&key2=value2");
                });
                it("Should put single quotes around words with spaces", function () {
                    var obj = { key1: "my value" };
                    var str = utils.qs.fromObj(obj);
                    str.should.equal("key1='my value'");
                });
                it("Should put single quotes around every value is an optional 'quoteValues' param is set to true", function () {
                    var obj = { key1: "value1", key2: "value2" };
                    var str = utils.qs.fromObj(obj, true);
                    str.should.equal("key1='value1'&key2='value2'");
                });
            });
        });

        describe("Headers", function () {

            describe("utils.headers.getStandardHeaders(digest?)", function () {
                var jsonMimeType = "application/json;odata=verbose";
                it("Should set the Accept header", function () {
                    var headers = utils.headers.getStandardHeaders();
                    headers.should.have.property("Accept");
                    headers.Accept.should.equal(jsonMimeType);
                });
                it("Should set the Request Digest if a digest is passed", function () {
                    var digest = "123Fake";
                    var headers = utils.headers.getStandardHeaders(digest);
                    headers.should.have.property("Accept");
                    headers.Accept.should.equal(jsonMimeType);
                    headers.should.have.property("X-RequestDigest");
                    headers["X-RequestDigest"].should.equal(digest);
                });
            });

            describe("utils.headers.getAddHeaders(digest)", function () {
                var jsonMimeType = "application/json;odata=verbose";
                it("Should set the Request Digest if a digest is passed", function () {
                    var digest = "123Fake";
                    var headers = utils.headers.getAddHeaders(digest);
                    headers.should.have.property("Accept");
                    headers.Accept.should.equal(jsonMimeType);
                    headers.should.have.property("X-RequestDigest");
                    headers["X-RequestDigest"].should.equal(digest);
                });
            });

            describe("utils.headers.getUpdateHeaders(digest)", function () {
                var jsonMimeType = "application/json;odata=verbose";
                it("Should set X-HTTP-Method to MERGE and include X-RequestDigest", function () {
                    var digest = "123Fake";
                    var headers = utils.headers.getUpdateHeaders(digest);
                    headers.should.have.property("Accept");
                    headers.Accept.should.equal(jsonMimeType);
                    headers.should.have.property("X-RequestDigest");
                    headers["X-RequestDigest"].should.equal(digest);
                    headers.should.have.property("X-HTTP-Method");
                    headers["X-HTTP-Method"].should.equal("MERGE");
                });
            });

            describe("utils.headers.getDeleteHeaders(digest)", function () {
                var jsonMimeType = "application/json;odata=verbose";
                it("Should set X-HTTP-Method to DELETE and include X-RequestDigest", function () {
                    var digest = "123Fake";
                    var headers = utils.headers.getDeleteHeaders(digest);
                    headers.should.have.property("Accept");
                    headers.Accept.should.equal(jsonMimeType);
                    headers.should.have.property("X-RequestDigest");
                    headers["X-RequestDigest"].should.equal(digest);
                    headers.should.have.property("X-HTTP-Method");
                    headers["X-HTTP-Method"].should.equal("DELETE");
                });
            });
        });

        describe("Dependency Management", function () {
            describe("utils.validateNamespace(namespace)", function () {
                it("Should return false if that namespace is not on global window");
                it("Should return true if that namespace is on global window");
            });

            describe("utils.waitForLibrary(namespace)", function () {
                it("Should return a promise that resolves when that namespace is on the global");
            });

            describe("utils.waitForLibraries(namespaces)", function () {
                it("Should return a promise that resolves when all the namespacea are on the global");
            });

            describe("utils.waitForElement(selector)", function () {
                it("Should return a promise that resolves an element that matches the selector is on the page");
                it("Should eventually time out");
            });
        });
    });
};

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var should = __webpack_require__(2).should();

exports.run = function (dao) {
    describe("var search = ctx.search;", function () {
        this.timeout(5000);
        describe("ctx.search.query(queryText)", function () {
            it("Should return promise that resolves to a SearchResults object", function (done) {
                var queryText = "andrew";
                dao.search.query(queryText).then(function (searchResults) {
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

        describe("ctx.search.query(queryText, queryOptions)", function () {
            it("Should obey the extra query options that were passed", function (done) {
                var queryText = "andrew";
                var options = {
                    rowLimit: 1
                };
                dao.search.query(queryText, options).then(function (searchResults) {
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

        describe("ctx.search.query(queryText, queryOptions) - w/ Refiners", function () {
            it("Should return SearchResults that include a refiners array", function (done) {
                var refinerName = "FileType";
                var queryText = "andrew";
                var options = {
                    refiners: refinerName
                };
                dao.search.query(queryText, options).then(function (searchResults) {
                    searchResults.should.be.an("object");
                    searchResults.should.have.property("refiners");
                    searchResults.refiners.should.not.be.empty;
                    var firstRefiner = searchResults.refiners[0];
                    firstRefiner.should.have.property("RefinerName");
                    firstRefiner.should.have.property("RefinerOptions");
                    firstRefiner.RefinerName.should.equal(refinerName);
                    firstRefiner.RefinerOptions.should.be.an("array");
                    done();
                });
            });
        });
        describe("ctx.search.people(queryText)", function () {
            it("Should only return search results that are people", function (done) {
                var queryText = "andrew";
                dao.search.people(queryText).then(function (searchResults) {
                    searchResults.should.be.an("object");
                    searchResults.should.have.property("items");
                    searchResults.items.should.be.an("array");
                    searchResults.items.should.not.be.empty;

                    var person = searchResults.items[0];
                    person.should.have.property("AccountName");
                    person.should.have.property("PreferredName");
                    person.should.have.property("AboutMe");
                    person.should.have.property("WorkEmail");
                    person.should.have.property("PictureURL");
                    done();
                });
            });
        });

        describe("ctx.search.sites(queryText, scope)", function () {
            it("Should only return search results that are sites", function (done) {
                var queryText = "";
                dao.search.sites(queryText).then(function (searchResults) {
                    searchResults.should.be.an("object");
                    searchResults.should.have.property("items");
                    searchResults.items.should.be.an("array");
                    searchResults.items.should.not.be.empty();

                    var site;
                    for (var i = 0; i < searchResults.items.length; i++) {
                        site = searchResults.items[i];
                        site.should.have.property("Path");
                        site.should.have.property("contentclass");
                        site.contentclass.should.equal("STS_Web");
                    }

                    done();
                });
            });

            it("Should only return sites underneath the specified scope", function (done) {
                var scope = "https://andrewpetersen.sharepoint.com/sites/ep";
                dao.search.sites("", scope).then(function (searchResults) {
                    searchResults.should.be.an("object");
                    searchResults.should.have.property("items");
                    searchResults.items.should.be.an("array");
                    searchResults.items.should.not.be.empty();

                    var site;
                    for (var i = 0; i < searchResults.items.length; i++) {
                        site = searchResults.items[i];
                        site.should.have.property("Path");
                        site.Path.indexOf(scope).should.equal(0);
                        site.should.have.property("contentclass");
                        site.contentclass.should.equal("STS_Web");
                    }

                    done();
                });
            });
        });
    });
};

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.run = function (dao) {
	describe("ctx.customActions", function () {
		this.timeout(10000);

		var customAction = {
			Name: "spscript-test",
			Location: "ScriptLink",
			ScriptBlock: "console.log('deployed from spscript-mocha test');"
		};
		describe("ctx.customActions.add(customAction)", function () {
			var beforeCount = 0;
			before(function (done) {
				dao.customActions.get().then(function (all) {
					beforeCount = all.length;
					done();
				});
			});

			it("Should add a Custom Action with the given name", function (done) {
				dao.customActions.add(customAction).then(function () {
					dao.customActions.get().then(function (all) {
						all.length.should.equal(beforeCount + 1);
						done();
					});
				});
			});

			it("Should not add duplicate Custom Action names. It should remove old one first.", function (done) {
				dao.customActions.add(customAction).then(function () {
					dao.customActions.get().then(function (all) {
						all.length.should.equal(beforeCount + 1);
						done();
					});
				});
			});
		});

		describe("ctx.customActions.get()", function () {
			var results = null;
			before(function (done) {
				dao.customActions.get().then(function (data) {
					results = data;
					done();
				});
			});

			it("Should return a promise that resolves to an array of custom actions", function () {
				results.should.be.an("array");
				results.should.not.be.empty;
			});

			it("Should bring back properties like Name, Url, and Location", function () {
				var firstItem = results[0];
				firstItem.should.have.property("Name");
				firstItem.should.have.property("Url");
				firstItem.should.have.property("Location");
			});
		});

		describe("ctx.customActions.get(name)", function () {
			var result = null;
			before(function (done) {
				dao.customActions.get().then(function (allCustomActions) {
					dao.customActions.get(allCustomActions[0].Name).then(function (res) {
						result = res;
						done();
					});
				});
			});

			it("Should return one object w/ properties like Name, Location, Url, Id", function () {
				result.should.not.be.null;
				result.should.have.property("Name");
				result.should.have.property("Location");
				result.should.have.property("Id");
			});

			it("Should reject the promise with a decent error if the Custom Action name is not found", function (done) {
				dao.customActions.get("INVALID-NAME").then(function () {
					"one".should.equal("two");
					done();
				}).catch(function (err) {
					console.log(err);
					done();
				});
			});
		});

		describe("ctx.customActions.update(updates)", function () {
			var result = null;
			before(function (done) {
				dao.customActions.get(customAction.Name).then(function (ca) {
					result = ca;
					done();
				});
			});
			var newTitle = "updated title - " + Date.now();
			it("Should update the property", function (done) {
				dao.customActions.update({ Name: result.Name, Title: newTitle }).then(function () {
					dao.customActions.get(result.Name).then(function (i) {
						i.Title.should.equal(newTitle);
						done();
					});
				});
			});
		});

		describe("dao.customActions.remove(name)", function () {
			var beforeCount = 0;
			before(function (done) {
				dao.customActions.get().then(function (all) {
					beforeCount = all.filter(function (a) {
						return a.Name === customAction.Name;
					}).length;
					done();
				}).catch(function (err) {
					console.log(err);
					done();
				});
			});

			it("Should remove all custom actions with that name", function (done) {
				dao.customActions.remove(customAction.Name).then(function () {
					dao.customActions.get().then(function (all) {
						var matches = all.filter(function (a) {
							return a.Name === customAction.Name;
						});
						matches.should.be.empty();
						done();
					});
				});
			});
		});

		describe("ctx.customActions.addScriptLink(name, url)", function () {
			var jsUrl = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js";
			var caName = "SPScriptJSTest-Web";

			before(function (done) {
				dao.customActions.addScriptLink(caName, jsUrl).then(function () {
					done();
				});
			});

			it("Should add a custom action with that name and ScriptBlock with specified URL", function (done) {
				dao.customActions.get(caName).then(function (ca) {
					ca.should.have.property("Name");
					ca.Name.should.equal(caName);
					ca.should.have.property("ScriptBlock");
					ca.ScriptBlock.should.contain(jsUrl);
					done();
				});
			});

			after(function (done) {
				dao.customActions.remove(caName).then(function () {
					done();
				});
			});
		});

		describe("ctx.customActions.addScriptLink(name, url, opts)", function () {
			var jsUrl = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js";
			var caName = "SPScriptJSTest-Site";
			var opts = { Sequence: 25, Group: "Custom Group" };

			before(function (done) {
				dao.customActions.addScriptLink(caName, jsUrl, opts).then(function () {
					done();
				});
			});

			it("Should add a custom action with that name and ScriptBlock with specified URL", function (done) {
				dao.customActions.get(caName).then(function (ca) {
					ca.should.have.property("Name");
					ca.Name.should.equal(caName);
					ca.should.have.property("ScriptBlock");
					ca.ScriptBlock.should.contain(jsUrl);
					ca.should.have.property("Group");
					ca.Group.should.equal(opts.Group);
					ca.should.have.property("Sequence");
					ca.Sequence.should.equal(25);
					done();
				});
			});

			after(function (done) {
				dao.customActions.remove(caName).then(function () {
					done();
				});
			});
		});

		describe("ctx.customActions.addCSSLink(name, url)", function () {
			var cssUrl = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
			var caName = "SPScriptCSSTest-Web";

			before(function (done) {
				dao.customActions.addCSSLink(caName, cssUrl).then(function () {
					done();
				});
			});

			it("Should add a custom action with that name and ScriptBlock containing specified URL", function (done) {
				dao.customActions.get(caName).then(function (ca) {
					ca.should.have.property("Name");
					ca.Name.should.equal(caName);
					ca.should.have.property("ScriptBlock");
					ca.ScriptBlock.should.contain(cssUrl);
					done();
				});
			});

			after(function (done) {
				dao.customActions.remove(caName).then(function () {
					done();
				});
			});
		});

		describe("ctx.customActions.addCSSLink(name, url, opts)", function () {
			var cssUrl = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
			var caName = "SPScriptCSSTest-Site";
			var opts = { Sequence: 50, Group: "Custom Group" };

			before(function (done) {
				dao.customActions.addCSSLink(caName, cssUrl, opts).then(function () {
					done();
				});
			});

			it("Should add a custom action with that name and ScriptBlock containing specified URL with Site scope", function (done) {
				dao.customActions.get(caName).then(function (ca) {
					ca.should.have.property("Name");
					ca.Name.should.equal(caName);
					ca.should.have.property("ScriptBlock");
					ca.ScriptBlock.should.contain(cssUrl);
					ca.should.have.property("Group");
					ca.Group.should.equal(opts.Group);
					ca.should.have.property("Sequence");
					ca.Sequence.should.equal(50);
					done();
				});
			});

			after(function (done) {
				dao.customActions.remove(caName).then(function () {
					done();
				});
			});
		});
	});
};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var should = __webpack_require__(2).should();

exports.run = function (dao) {
    console.log("HERE I AM");
    describe("var profiles = ctx.profiles", function () {
        this.timeout(5000);

        describe("ctx.profiles.current()", function () {
            var profile = null;
            before(function (done) {
                dao.profiles.current().then(function (result) {
                    profile = result;
                    console.log(profile);
                    done();
                });
            });

            it("Should return a promise that resolves to a profile properties object", function () {
                profile.should.be.an("object");
                profile.should.have.property("AccountName");
                profile.should.have.property("Email");
                profile.should.have.property("PreferredName");
            });
            it("Should return the profile of the current user", function () {
                profile.should.have.property("Email");
                profile.Email.should.equal(_spPageContextInfo.userEmail);
            });
        });

        describe("ctx.profiles.get()", function () {
            var profile = null;
            before(function (done) {
                dao.profiles.get().then(function (result) {
                    profile = result;
                    done();
                });
            });
            it("Should return a promise that resolves to a profile properties object", function () {
                profile.should.be.an("object");
                profile.should.have.property("AccountName");
                profile.should.have.property("Email");
                profile.should.have.property("PreferredName");
            });

            it("Should return the profile of the current user", function () {
                profile.should.have.property("Email");
                profile.Email.should.equal(_spPageContextInfo.userEmail);
            });
        });

        describe("ctx.profiles.get(email)", function () {
            var email = "andrew@andrewpetersen.onmicrosoft.com";
            var profile = null;
            before(function (done) {
                dao.profiles.get(email).then(function (result) {
                    profile = result;
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
            it("Should return a promise that resolves to a profile properties object", function () {
                profile.should.be.an("object");
                profile.should.have.property("AccountName");
                profile.should.have.property("Email");
                profile.should.have.property("PreferredName");
            });

            it("Should give you the matching person", function () {
                profile.should.have.property("Email");
                profile.Email.should.equal(email);
            });

            it("Should reject the promise for an invalid email", function (done) {
                dao.profiles.get("invalid@invalid123.com").then(function (result) {
                    done("The request should have failed.");
                }).catch(function () {
                    done();
                });
            });
        });

        describe("ctx.profiles.get({ AccountName })", function () {
            var email = "andrew@andrewpetersen.onmicrosoft.com";
            var accountName = "i:0#.f|membership|andrew@andrewpetersen.onmicrosoft.com";
            var profile = null;
            before(function (done) {
                dao.profiles.get({ AccountName: accountName }).then(function (result) {
                    profile = result;
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
            it("Should return a promise that resolves to a profile properties object", function () {
                profile.should.be.an("object");
                profile.should.have.property("AccountName");
                profile.should.have.property("Email");
                profile.should.have.property("PreferredName");
            });

            it("Should give you the matching person", function () {
                profile.should.have.property("Email");
                profile.Email.should.equal(email);
            });

            it("Should reject the promise for an invalid account name", function (done) {
                dao.profiles.get({ AccountName: "Invalid" }).then(function (result) {
                    done("The request should have failed.");
                }).catch(function () {
                    done();
                });
            });
        });

        describe("ctx.profiles.get({ LoginName })", function () {
            var email = "andrew@andrewpetersen.onmicrosoft.com";
            var accountName = "i:0#.f|membership|andrew@andrewpetersen.onmicrosoft.com";
            var profile = null;
            before(function (done) {
                dao.profiles.get({ LoginName: accountName }).then(function (result) {
                    profile = result;
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
            it("Should return a promise that resolves to a profile properties object", function () {
                profile.should.be.an("object");
                profile.should.have.property("AccountName");
                profile.should.have.property("Email");
                profile.should.have.property("PreferredName");
            });

            it("Should give you the matching person", function () {
                profile.should.have.property("Email");
                profile.Email.should.equal(email);
            });

            it("Should reject the promise for an invalid account name", function (done) {
                dao.profiles.get({ LoginName: "Invalid" }).then(function (result) {
                    done("The request should have failed.");
                }).catch(function () {
                    done();
                });
            });
        });

        describe("ctx.profiles.setProperty(propertyName, propertyValue)", function () {
            it("Should update the About Me profile property of the current user", function (done) {
                var aboutMeValue = "Hi there. I was updated with SPScript 1";
                dao.profiles.setProperty("AboutMe", aboutMeValue).then(function () {
                    return dao.profiles.current();
                }).then(function (profile) {
                    profile.should.have.property("AboutMe");
                    profile.AboutMe.should.equal(aboutMeValue);
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
        });

        describe("ctx.profiles.setProperty(propertyName, propertyValue, email)", function () {
            var email = "andrew@andrewpetersen.onmicrosoft.com";
            it("Should update the About Me profile property based on the specified email", function (done) {
                var aboutMeValue = "Hi there. I was updated with SPScript 2";
                dao.profiles.setProperty("AboutMe", aboutMeValue, email).then(function () {
                    return dao.profiles.get(email);
                }).then(function (profile) {
                    profile.should.have.property("AboutMe");
                    profile.AboutMe.should.equal(aboutMeValue);
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
        });

        describe("ctx.profiles.setProperty(propertyName, propertyValue, { AccountName|LoginName })", function () {
            var accountName = "i:0#.f|membership|andrew@andrewpetersen.onmicrosoft.com";
            var email = "andrew@andrewpetersen.onmicrosoft.com";
            it("Should update the About Me profile property of the passed in User object", function (done) {
                var aboutMeValue = "Hi there. I was updated with SPScript 3";
                dao.profiles.setProperty("AboutMe", aboutMeValue, { AccountName: accountName }).then(function () {
                    return dao.profiles.get({ AccountName: accountName });
                }).then(function (profile) {
                    profile.should.have.property("AboutMe");
                    profile.AboutMe.should.equal(aboutMeValue);
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
        });
    });
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=tests.js.map