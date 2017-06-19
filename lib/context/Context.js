"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("./request");
const utils_1 = require("../utils");
const headers_1 = require("./headers");
const List_1 = require("../List");
const Search_1 = require("../search/Search");
class Context {
    constructor(url, clientId, clientSecret) {
        this.webUrl = url;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        // TODO serverside: replace with tokenHelper.getAppOnlyToken(this.webUrl, this.clientKey, this.clientSecret).then(token => this.accessToken = token);
        this.ensureToken = !clientId ? Promise.resolve() : Promise.resolve();
        this.search = new Search_1.default(this);
    }
    executeRequest(url, opts) {
        var fullUrl = (/^http/i).test(url) ? url : this.webUrl + "/_api" + url;
        var defaultOptions = {
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
        return request_1.default(requestOptions);
    }
    ;
    get(url, opts) {
        let options = Object.assign({}, { method: "GET" }, opts);
        return this.executeRequest(url, options).then(utils_1.default.parseJSON);
    }
    ;
    post(url, body, opts) {
        body = this._packagePostBody(body, opts);
        var options = {
            method: "POST",
            data: body,
        };
        options = Object.assign({}, options, opts);
        return this.executeRequest(url, options).then(utils_1.default.parseJSON);
    }
    ;
    authorizedPost(url, body, verb) {
        return this.getRequestDigest()
            .then(digest => headers_1.default.getActionHeaders(verb, digest))
            .then(headers => this.post(url, body, { headers }));
    }
    ;
    ensureRequestDigest(digest) {
        return digest ? Promise.resolve(digest) : this.getRequestDigest();
    }
    ;
    getRequestDigest() {
        return this.post("/contextInfo", {}).then(data => data["d"].GetContextWebInformation.FormDigestValue);
    }
    ;
    lists(name) {
        return new List_1.default(name, this);
    }
    _packagePostBody(body, opts) {
        // if its already a string just return
        if (typeof body === "string")
            return body;
        // if it has an explicit content-type, asssume the body is already that type
        if (opts && opts.headers && opts.headers["Content-Type"] && opts.headers["Content-Type"].indexOf("json") === -1) {
            return body;
        }
        //others stringify
        return JSON.stringify(body);
    }
    ;
}
exports.default = Context;
//# sourceMappingURL=Context.js.map