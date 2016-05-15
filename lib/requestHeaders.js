"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var utils = require("./utils");

var jsonMimeType = "application/json;odata=verbose";
var getStandardHeaders = exports.getStandardHeaders = function (digest) {
	var headers = {
		"Accept": jsonMimeType,
		"Content-Type": jsonMimeType
	};
	if (digest) headers["X-RequestDigest"] = digest;
	return headers;
};

exports.getAddHeaders = getStandardHeaders;

var getFilestreamHeaders = exports.getFilestreamHeaders = function (digest) {
	return {
		'Accept': jsonMimeType,
		'X-RequestDigest': digest,
		'Content-Type': "application/octet-stream;odata=verbose"
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

exports.getUpdateHeaders = function (digest, etag) {
	return decorateETag(getActionHeaders("MERGE", digest), etag);
};
exports.getDeleteHeaders = function (digest, etag) {
	return decorateETag(getActionHeaders("DELETE", digest), etag);
};
//# sourceMappingURL=requestHeaders.js.map