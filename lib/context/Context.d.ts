import { RequestOptions } from "./request";
import List from "../List/List";
import Search from "../search/Search";
import CustomActions from "../customActions/CustomActions";
export default class Context {
    /** The url of the SPScript data context */
    webUrl: string;
    /** Methods to hit the SP Search Service */
    search: Search;
    /** Work with Site/Web scoped Custom Actions */
    customActions: CustomActions;
    private clientId;
    private clientSecret;
    private ensureToken;
    private accessToken;
    constructor(url: string, clientId?: string, clientSecret?: string);
    private executeRequest(url, opts);
    /** Make a 'GET' request to the '<site>/_api' relative url. */
    get(url: string, opts?: RequestOptions): Promise<any>;
    /** Make a 'POST' request to the '<site>/_api' relative url. */
    post(url: string, body?: any, opts?: RequestOptions): Promise<any>;
    /** Make a 'POST' request to the '<site>/_api' relative url. SPScript will handle authorizing the request for you.*/
    authorizedPost(url: string, body?: any, verb?: string): Promise<any>;
    _ensureRequestDigest(digest?: string): Promise<string>;
    /** Get a Request Digest token to authorize a request */
    getRequestDigest(): Promise<string>;
    /** Get an SPScript List instance */
    lists(name: string): List;
    private _packagePostBody(body, opts);
}
