const jsonMimeType = "application/json";
/** returns a Headers object with 'Accept', 'Content-Type' and optional 'X-RequestDigest' */
export function getStandardHeaders(digest?: string): any {
  var headers = {
    Accept: jsonMimeType,
    "Content-Type": jsonMimeType,
  };
  if (digest) headers["X-RequestDigest"] = digest;
  return headers;
}

/** returns a Headers object with values configured for binary stream*/
export const getFilestreamHeaders = function (digest: string) {
  return {
    Accept: jsonMimeType,
    "X-RequestDigest": digest,
    "Content-Type": "application/octet-stream",
    binaryStringRequestBody: "true",
  };
};

/** returns a Headers object with including the X-HTTP-Method with the specified verb */
export const getActionHeaders = function (verb: string, digest?: string) {
  let headers = getStandardHeaders(digest);
  if (verb) {
    headers = {
      ...headers,
      ...{
        "X-HTTP-Method": verb,
        "If-Match": "*",
      },
    };
  }
  return headers;
};
/** returns a Headers object with values configured ADDING an item */
export const getAddHeaders = getStandardHeaders;
/** returns a Headers object with values configured UPDATING an item */
export const getUpdateHeaders = (digest?: string) => getActionHeaders("MERGE", digest);
/** returns a Headers object with values configured DELETING an item */
export const getDeleteHeaders = (digest?: string) => getActionHeaders("DELETE", digest);
