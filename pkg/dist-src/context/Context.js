import request from "./request.js";
import utils from "../utils/index.js";
import List from "../list/List.js";
import Web from "../web/Web.js";
import Search from "../search/Search.js";
import CustomActions from "../customActions/CustomActions.js";
import Profiles from "../profiles/Profiles.js";
import { getAppOnlyToken } from "./tokenHelper.js";
import Auth from "../auth/Auth.js";
export default class Context {
  /** The url of the SPScript data context */

  /** Methods to hit the SP Search Service */

  /** Methods against the SP Web object */

  /** Methods to get the SP Profile Service */

  /** Work with Site/Web scoped Custom Actions */

  /** Request Digest and Access token helpers */
  constructor(url, options = {}) {
    this.webUrl = url;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.accessToken = options.token; // TODO serverside: replace with tokenHelper.getAppOnlyToken(this.webUrl, this.clientKey, this.clientSecret).then(token => this.accessToken = token);

    this.ensureToken = options.clientSecret ? getAppOnlyToken(url, options.clientId, options.clientSecret).then(token => this.accessToken = token) : Promise.resolve(this.accessToken || true);
    this.search = new Search(this);
    this.customActions = new CustomActions(this);
    this.web = new Web(this);
    this.profiles = new Profiles(this);
    this.auth = new Auth(this);
  }

  async executeRequest(url, opts) {
    await this.ensureToken;
    var fullUrl = /^http/i.test(url) ? url : this.webUrl + "/_api" + url;
    var defaultOptions = {
      method: "GET",
      headers: {
        Accept: "application/json; odata=verbose",
        "Content-Type": "application/json; odata=verbose"
      }
    };
    var requestOptions = Object.assign({}, defaultOptions, opts);

    if (this.accessToken) {
      requestOptions.headers["Authorization"] = "Bearer " + this.accessToken;
    }

    return request(fullUrl, requestOptions);
  }
  /** Make a 'GET' request to the '<site>/_api' relative url. */


  get(url, opts) {
    let options = Object.assign({}, {
      method: "GET"
    }, opts);
    return this.executeRequest(url, options).then(utils.parseJSON);
  }
  /** Make a 'POST' request to the '<site>/_api' relative url. */


  post(url, body, opts) {
    body = this._packagePostBody(body, opts);
    var options = {
      method: "POST",
      body
    };
    options = Object.assign({}, options, opts);
    return this.executeRequest(url, options).then(utils.parseJSON);
  }
  /** Make a 'POST' request to the '<site>/_api' relative url. SPScript will handle authorizing the request for you.*/


  authorizedPost(url, body, verb) {
    return this.auth.getRequestDigest().then(digest => utils.headers.getActionHeaders(verb, digest)).then(headers => this.post(url, body, {
      headers
    }));
  }
  /** Get an SPScript List instance */


  lists(name) {
    return new List(name, this);
  }

  _packagePostBody(body, opts) {
    // if its already a string just return
    if (typeof body === "string") return body; // if it has an explicit content-type, asssume the body is already that type

    if (opts && opts.headers && opts.headers["Content-Type"] && opts.headers["Content-Type"].indexOf("json") === -1) {
      return body;
    } //others stringify


    return JSON.stringify(body);
  }

}