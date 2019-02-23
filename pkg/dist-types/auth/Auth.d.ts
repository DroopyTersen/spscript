import Context from "../context/Context";
export default class Auth {
    private ctx;
    constructor(ctx: Context);
    ensureRequestDigest(digest?: string): Promise<string>;
    /** Get a Request Digest token to authorize a request */
    getRequestDigest(): Promise<string>;
    getGraphToken(): Promise<string>;
}
