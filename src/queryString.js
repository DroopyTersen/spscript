var qs = require("querystring");

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
