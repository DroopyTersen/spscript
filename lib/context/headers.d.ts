export interface HeaderUtils {
    getStandardHeaders(digest?: string): any;
    getFilestreamHeaders(digest: string): any;
    getActionHeaders(verb: string, digest?: string): any;
    getAddHeaders(digest?: string): any;
    getUpdateHeaders(digest?: string, etag?: string): any;
    getDeleteHeaders(digest?: string, etag?: string): any;
}
declare var headerUtils: HeaderUtils;
export default headerUtils;
