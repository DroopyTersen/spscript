// var promisePolyfill = require("es6-promise");
var promisePolyfill = require("promise-polyfill");

if (!global.Promise) {
	global.Promise = promisePolyfill;
}
var SPScript = {};
SPScript.RestDao = require("../lib/restDao");
SPScript.queryString = require("../lib/queryString");
SPScript.utils = require("../lib/utils");
SPScript.ajax = require("../lib/ajax");
SPScript.CSR = require("../lib/csr");
SPScript.headers = require("../lib/requestHeaders");
module.exports = global.SPScript = SPScript;

