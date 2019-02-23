import { ContextOptions } from "./interfaces";
import List from "../list/List";
import Web from "../web/Web";
import Search from "../search/Search";
import CustomActions from "../customActions/CustomActions";
import Profiles from "../profiles/Profiles";
import Auth from "../auth/Auth";
export default class Context {
    /** The url of the SPScript data context */
    webUrl: string;
    /** Methods to hit the SP Search Service */
    search: Search;
    /** Methods against the SP Web object */
    web: Web;
    /** Methods to get the SP Profile Service */
    profiles: Profiles;
    /** Work with Site/Web scoped Custom Actions */
    customActions: CustomActions;
    /** Request Digest and Access token helpers */
    auth: Auth;
    private request;
    private clientId;
    private clientSecret;
    private ensureToken;
    private accessToken;
    constructor(url: string, options?: ContextOptions);
    private executeRequest;
    /** Make a 'GET' request to the '<site>/_api' relative url. */
    get(url: string, opts?: RequestInit): Promise<any>;
    /** Make a 'POST' request to the '<site>/_api' relative url. */
    post(url: string, body?: any, opts?: RequestInit): Promise<any>;
    /** Make a 'POST' request to the '<site>/_api' relative url. SPScript will handle authorizing the request for you.*/
    authorizedPost(url: string, body?: any, verb?: string): Promise<any>;
    /** Get an SPScript List instance */
    lists(name: string): List;
    private _packagePostBody;
}
