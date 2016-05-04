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
//# sourceMappingURL=ajax.js.map