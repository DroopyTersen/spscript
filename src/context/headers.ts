import utils from "../utils";

export interface HeaderUtils {
	getStandardHeaders(digest?:string) : any;
	getFilestreamHeaders(digest:string) : any;
	getActionHeaders(verb:string, digest?:string): any;
	getAddHeaders(digest?:string) : any;
	getUpdateHeaders(digest?:string, etag?:string) : any;
	getDeleteHeaders(digest?:string, etag?:string) : any;
};

const jsonMimeType = "application/json;odata=verbose";
function getStandardHeaders(digest?:string) : any {
    var headers = {
		"Accept": jsonMimeType,
		"Content-Type": jsonMimeType
	};
	if (digest) headers["X-RequestDigest"] = digest;
	return headers;
}

var getAddHeaders = getStandardHeaders;

var getFilestreamHeaders = function(digest:string) {
	return {
		'Accept': jsonMimeType,
		'X-RequestDigest': digest,
		'Content-Type': "application/octet-stream",
		'binaryStringRequestBody': "true"
	}
};

var getActionHeaders = function(verb:string, digest?:string) {
	return Object.assign({}, getStandardHeaders(digest), {
		"X-HTTP-Method": verb
	});
};

var decorateETag = function(headers, etag) {
	if (etag) headers["If-Match"] = etag;
	return headers;
};

var getUpdateHeaders = (digest?:string, etag?:string) => decorateETag(getActionHeaders("MERGE", digest), etag)
var getDeleteHeaders = (digest?:string, etag?:string) => decorateETag(getActionHeaders("DELETE", digest), etag)

var headerUtils: HeaderUtils = {
    getStandardHeaders,
    getAddHeaders,
	getFilestreamHeaders,
	getActionHeaders,
	getUpdateHeaders,
	getDeleteHeaders,
}

export default headerUtils;