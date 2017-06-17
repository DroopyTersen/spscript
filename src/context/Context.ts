import request, { RequestOptions } from "./request";
import utils from "../utils";
import headersUtils from "./headers";
import List from "../List";

export default class Context {
    webUrl: string;
    private clientId: string;
    private clientSecret:string;
    private ensureToken: Promise<any>;
    private accessToken: string;

    constructor(url:string, clientId?:string, clientSecret?:string) {
        this.webUrl = url;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        // TODO serverside: replace with tokenHelper.getAppOnlyToken(this.webUrl, this.clientKey, this.clientSecret).then(token => this.accessToken = token);
        this.ensureToken = !clientId ? Promise.resolve() : Promise.resolve();
    }

    private executeRequest(url:string, opts:RequestOptions): Promise<any> {
        var fullUrl = (/^http/i).test(url) ? url : this.webUrl + "/_api" + url;
        var defaultOptions:RequestOptions = {
            url: fullUrl,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose",
                "Content-Type": "application/json; odata=verbose"
            }
        };
        if (this.accessToken) {
            defaultOptions.headers['Authorization'] = 'Bearer ' + this.accessToken;
        }
        var requestOptions = Object.assign({}, defaultOptions, opts);
        return request(requestOptions);
    };

    get(url:string, opts?:RequestOptions) {
        let options:RequestOptions = Object.assign({}, { method: "GET" }, opts);
        return this.executeRequest(url, options).then(utils.parseJSON);
    };

    post(url:string, body?:any, opts?:RequestOptions) {
        body = this._packagePostBody(body, opts);
        var options:RequestOptions = {
            method: "POST",
            data: body,
        }
        options = Object.assign({}, options, opts);
        return this.executeRequest(url, options).then(utils.parseJSON);
    };

    authorizedPost(url:string, body?:any, verb?:string) {
        return this.getRequestDigest()
            .then(digest => headersUtils.getActionHeaders(verb, digest))
            .then(headers => this.post(url, body, { headers }))
    };

    ensureRequestDigest(digest?:string): Promise<string> {
        return digest ? Promise.resolve(digest) : this.getRequestDigest();
    };

    getRequestDigest(): Promise<string> {
        return this.post("/contextInfo", {}).then(data => data["d"].GetContextWebInformation.FormDigestValue);
    };

    lists(name:string) : List {
        return new List(name, this);
    }

    private _packagePostBody(body:any, opts:RequestOptions) {
        // if its already a string just return
        if (typeof body === "string") return body;
        // if it has an explicit content-type, asssume the body is already that type
        if (opts && opts.headers && opts.headers["Content-Type"] && opts.headers["Content-Type"].indexOf("json") === -1) {
            return body
        }
        //others stringify
        return JSON.stringify(body);
    };
}
