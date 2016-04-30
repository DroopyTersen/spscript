var qs = require("querystring");

/**
* @namespace SPScript.queryString
*/

/**
 * Turns a normal js Object into a string in form of "key1=value1&key2=value2..."
 * @param {Object} obj - Javascript object to query stringify
 * @param {bool} [[quoteValues]] - By default, if the value has a space, it will be single quoted. Passing true will cause all values to be quoted.
 * @returns {string} - Note: tt does NOT prepend '?' char
 * @function fromObj
 * @memberof SPScript.queryString
 * @example
 * var myObj = { id: 123, title: "My Title" }
 * var qs = SPScript.queryString.fromObj(myObj);
 * // qs would output: "id=123&title='MyTitle'"
 */
var fromObj = exports.fromObj = function(obj, quoteValues) {

	var writeParam = function(key) {
		var value = (obj[key] + "").trim();
		// if there is a space, wrap in single quotes
		if (value.indexOf(" ") > -1 || quoteValues) value = "'" + value + "'";

		return key + "=" + value;
	};

	var str = Object.keys(obj)
					.map(writeParam)
					.join("&");
	return str;
};

/**
 * Turns a string in form of "key1=value1&key2=value2..." into a javascript object
 * @param {string} str - must be in query string format to work
 * @returns {Object} - A javascript object with properties for each key found in the query string passed in.
 * @function toObj
 * @memberof SPScript.queryString
 * @example
 * // your url is "https://sharepoint.com/sites/mysite/home.aspx?id=123&title='My Title'"
 * var myObj = SPScript.queryString.toObj(window.location.search);
 * //myObj would be { id: 123, title: "My Title" }
 */
var toObj = exports.toObj = function(str) {
	//if no string is passed use window.location.search
	if (str === undefined && window && window.location && window.location.search) {
		str = window.location.search;
	}
	if (!str) return {};
	//trim off the leading '?' if its there
	if (str[0] === "?") str = str.substr(1);

	return qs.parse(str);
};

exports.contains = (key, text) => toObj(text).hasOwnProperty(key);
exports.getValue = (key, text) => toObj(text)[key] || "";
