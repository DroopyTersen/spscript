import utils from "../utils/index";
import Context from "../context/Context";

export default class Auth {
  private ctx: Context;
  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  ensureRequestDigest(digest?: string): Promise<string> {
    return digest ? Promise.resolve(digest) : this.getRequestDigest();
  }

  /** Get a Request Digest token to authorize a request */
  getRequestDigest(): Promise<string> {
    return this.ctx.post("/contextInfo", {}).then((data) => data.FormDigestValue);
  }

  getGraphToken(): Promise<string> {
    let endpoint = "/SP.OAuth.Token/Acquire";
    return this.ctx
      .authorizedPost(endpoint, { resource: "https://graph.microsoft.com" })
      .then(utils.validateODataV2);
  }
}
