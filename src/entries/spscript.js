if (!global.Promise) {
	global.Promise = require("es6-promise");
}
var SPScript = {};
SPScript.RestDao = require("../restDao");
SPScript.queryString = require("../queryString");
SPScript.templating = require("droopy-templating");
SPScript.utils = require("../utils");

module.exports = global.SPScript = SPScript;

