var promisePolyfill = require("es6-promise");
if (!global.Promise) {
	global.Promise = promisePolyfill;
}
var SPScript = {};
SPScript.RestDao = require("../lib/restDao");
SPScript.queryString = require("../lib/queryString");
SPScript.templating = require("mustache");
SPScript.utils = require("../lib/utils");
SPScript.ajax = require("../lib/ajax");
SPScript.jsLink = require("../lib/jsLink");
module.exports = global.SPScript = SPScript;

