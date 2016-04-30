var promisePolyfill = require("es6-promise");
if (!global.Promise) {
	global.Promise = promisePolyfill;
}
var SPScript = {};
SPScript.RestDao = require("../restDao");
SPScript.queryString = require("../queryString");
SPScript.templating = require("droopy-templating");
SPScript.utils = require("../utils");
SPScript.ajax = require("../ajax");

module.exports = global.SPScript = SPScript;

