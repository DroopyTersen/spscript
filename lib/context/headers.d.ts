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
declare var headerUtils: HeaderUtils;
export default headerUtils;
