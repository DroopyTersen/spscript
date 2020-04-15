export interface HeaderUtils {
  /** returns a Headers object with 'Accept', 'Content-Type' and optional 'X-RequestDigest' */
  getStandardHeaders(digest?: string): any;
  /** returns a Headers object with values configured for binary stream*/
  getFilestreamHeaders(digest: string): any;
  /** returns a Headers object with values configured ADDING an item */
  getAddHeaders(digest?: string): any;
  /** returns a Headers object with values configured UPDATING an item */
  getUpdateHeaders(digest?: string, etag?: string): any;
  /** returns a Headers object with values configured DELETING an item */
  getDeleteHeaders(digest?: string, etag?: string): any;
  getActionHeaders(verb: string, digest?: string): any;
}

const jsonMimeType = "application/json";
function getStandardHeaders(digest?: string): any {
  var headers = {
    Accept: jsonMimeType,
    "Content-Type": jsonMimeType,
  };
  if (digest) headers["X-RequestDigest"] = digest;
  return headers;
}

var getAddHeaders = getStandardHeaders;

var getFilestreamHeaders = function (digest: string) {
  return {
    Accept: jsonMimeType,
    "X-RequestDigest": digest,
    "Content-Type": "application/octet-stream",
    binaryStringRequestBody: "true",
  };
};

var getActionHeaders = function (verb: string, digest?: string) {
  return Object.assign({}, getStandardHeaders(digest), {
    "X-HTTP-Method": verb,
    "If-Match": "*",
  });
};

var decorateETag = function (headers, etag) {
  if (etag) headers["If-Match"] = etag;
  return headers;
};

var getUpdateHeaders = (digest?: string, etag?: string) =>
  decorateETag(getActionHeaders("MERGE", digest), etag);
var getDeleteHeaders = (digest?: string, etag?: string) =>
  decorateETag(getActionHeaders("DELETE", digest), etag);

var headerUtils: HeaderUtils = {
  getStandardHeaders,
  getAddHeaders,
  getFilestreamHeaders,
  getUpdateHeaders,
  getDeleteHeaders,
  getActionHeaders,
};

export default headerUtils;
