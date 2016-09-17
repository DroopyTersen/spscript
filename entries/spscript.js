var promisePolyfill = require("es6-promise");
if (!global.Promise) {
	global.Promise = promisePolyfill;
}
var SPScript = {};
SPScript.RestDao = require("../lib/restDao");
SPScript.queryString = require("../lib/queryString");
SPScript.templating = require("mustache");
SPScript.templating.renderTemplate = SPScript.templating.render;
SPScript.utils = require("../lib/utils");
SPScript.ajax = require("../lib/ajax");
SPScript.CSR = require("../lib/csr");
module.exports = global.SPScript = SPScript;

