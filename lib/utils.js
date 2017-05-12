"use strict";

/**
* @namespace SPScript.utils
*/

var isBrowser = exports.isBrowser = function () {
	return !(typeof window === 'undefined');
};
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
	var data = parseJSON(data);
	var results = null;
	if (data.d && data.d.results && data.d.results.length != null) {
		results = data.d.results;
	} else if (data.d) {
		results = data.d;
	}
	return results || data;
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

var getArrayBuffer = exports.getArrayBuffer = function (file) {
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
var loadCss = exports.loadCss = function (url) {
	var link = document.createElement("link");
	link.setAttribute("rel", "stylesheet");
	link.setAttribute("type", "text/css");
	link.setAttribute("href", url);
	document.querySelector("head").appendChild(link);
};

var handleErrorResponse = exports.handleErrorResponse = function (err, res) {
	console.log("REQUEST ERROR - " + err.statusCode || err.code);
	var msg = err.body;
	try {
		var data = err.body;
		if (typeof data === "string") data = JSON.parse(err.body);
		if (data.error) msg = data.error.message.value;
	} catch (ex) {}
	console.log(msg);
	return err;
};
//# sourceMappingURL=utils.js.map