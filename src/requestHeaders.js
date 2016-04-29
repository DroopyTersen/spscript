var utils = require("./utils");

var getStandardHeaders = exports.getStandardHeaders = function(digest) {
	var headers = {
		"Accept": utils.acceptHeader,
		"Content-Type": utils.acceptHeader
	};
	if (digest) headers["X-RequestDigest"] = digest;
	return headers;
};

exports.getAddHeaders = getStandardHeaders;

var getActionHeaders = function(verb, digest) {
	return Object.assign({}, getStandardHeaders(digest), { "X-HTTP-Method": verb });
};

var decorateETag = function(headers, etag) {
	if (etag) headers["If-Match"] = etag;
	return headers;
};

exports.getUpdateHeaders = (digest, etag) => decorateETag(getActionHeaders("MERGE", digest), etag);
exports.getDeleteHeaders = (digest, etag) => decorateETag(getActionHeaders("DELETE", digest), etag);
