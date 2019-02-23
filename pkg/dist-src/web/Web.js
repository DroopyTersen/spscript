import utils from "../utils/index.js";
import Securable from "../permissions/Securable.js";
export default class Web {
  constructor(ctx) {
    this.baseUrl = `/web`;
    this._dao = ctx;
    this.permissions = new Securable(this.baseUrl, ctx);
  }
  /** Retrieves basic information about the site */


  getInfo() {
    return this._dao.get(this.baseUrl).then(utils.validateODataV2);
  }
  /** Retrieves all of the subsites */


  getSubsites() {
    return this._dao.get(this.baseUrl + "/webinfos").then(utils.validateODataV2);
  }
  /** Retrieves the current user */


  getUser(email) {
    var url = email ? this.baseUrl + "/SiteUsers/GetByEmail('" + email + "')" : this.baseUrl + "/CurrentUser";
    return this._dao.get(url).then(utils.validateODataV2);
  }

  ensureUser(login) {
    return this._dao.post(`/web/ensureUser('${login}')`).then(utils.validateODataV2);
  }
  /** Retrieves a file by server relative url */


  getFile(url) {
    var url = `/web/getfilebyserverrelativeurl('${url}')`;
    return this._dao.get(url).then(utils.validateODataV2);
  }

  _copyFile(sourceUrl, destinationUrl, digest) {
    var url = `/web/getfilebyserverrelativeurl('${sourceUrl}')/CopyTo`; //(strnewurl='${destinationUrl}',boverwrite=true)`

    var options = {
      headers: utils.headers.getAddHeaders(digest)
    };
    var body = {
      strNewUrl: destinationUrl,
      bOverWrite: true
    };
    return this._dao.post(url, body, options);
  } // TODO: getFolder
  // TODO: uploadFile
  // TODO: fileAction
  // TODO: deleteFile

  /** Copies a file from one server relative url to another */


  copyFile(sourceUrl, destinationUrl, digest) {
    return this._dao.auth.ensureRequestDigest(digest).then(digest => this._copyFile(sourceUrl, destinationUrl, digest));
  }

}