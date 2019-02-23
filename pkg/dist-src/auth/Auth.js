import utils from "../utils/index.js";
export default class Auth {
  constructor(ctx) {
    this.ctx = ctx;
  }

  ensureRequestDigest(digest) {
    return digest ? Promise.resolve(digest) : this.getRequestDigest();
  }
  /** Get a Request Digest token to authorize a request */


  getRequestDigest() {
    return this.ctx.post("/contextInfo", {}).then(data => data["d"].GetContextWebInformation.FormDigestValue);
  }

  getGraphToken() {
    let endpoint = "/SP.OAuth.Token/Acquire";
    return this.ctx.authorizedPost(endpoint, {
      resource: "https://graph.microsoft.com"
    }).then(utils.validateODataV2);
  }

}