"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
const jsonMimeType = "application/json;odata=verbose";
function getStandardHeaders(digest) {
    var headers = {
        "Accept": jsonMimeType,
        "Content-Type": jsonMimeType
    };
    if (digest)
        headers["X-RequestDigest"] = digest;
    return headers;
}
var getAddHeaders = getStandardHeaders;
var getFilestreamHeaders = function (digest) {
    return {
        'Accept': jsonMimeType,
        'X-RequestDigest': digest,
        'Content-Type': "application/octet-stream",
        'binaryStringRequestBody': "true"
    };
};
var getActionHeaders = function (verb, digest) {
    return Object.assign({}, getStandardHeaders(digest), {
        "X-HTTP-Method": verb
    });
};
var decorateETag = function (headers, etag) {
    if (etag)
        headers["If-Match"] = etag;
    return headers;
};
var getUpdateHeaders = (digest, etag) => decorateETag(getActionHeaders("MERGE", digest), etag);
var getDeleteHeaders = (digest, etag) => decorateETag(getActionHeaders("DELETE", digest), etag);
var headerUtils = {
    getStandardHeaders,
    getAddHeaders,
    getFilestreamHeaders,
    getActionHeaders,
    getUpdateHeaders,
    getDeleteHeaders,
};
exports.default = headerUtils;
//# sourceMappingURL=headers.js.map