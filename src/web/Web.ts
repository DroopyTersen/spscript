import utils from "../utils";
import Context from "../context/Context";
import Securable from "../permissions/Securable";

export default class Web {
	private baseUrl: string;
	private _dao: Context;
	permissions: Securable;

	constructor(ctx: Context) {
		this.baseUrl = `/web`;
		this._dao = ctx;
		this.permissions = new Securable(this.baseUrl, ctx);
	}

	/** Retrieves basic information about the site */
	getInfo(): Promise<any> {
		return this._dao.get(this.baseUrl).then(utils.validateODataV2);
	}

	/** Retrieves all of the subsites */
	getSubsites(): Promise<any[]> {
		return this._dao.get(this.baseUrl + "/webinfos").then(utils.validateODataV2);
	}

	/** Retrieves the current user */
	getUser(): Promise<any>;
	/** Retrieves a users object based on an email address */
	getUser(email: string): Promise<any>;
	getUser(email?: string): Promise<any> {
		var url = email
			? this.baseUrl + "/SiteUsers/GetByEmail('" + email + "')"
			: this.baseUrl + "/CurrentUser";
		return this._dao.get(url).then(utils.validateODataV2);
	}

	ensureUser(login: string): Promise<any> {
		return this._dao.post(`/web/ensureUser('${login}')`).then(utils.validateODataV2);
	}

	/** Retrieves a file by server relative url */
	getFile(url: string): Promise<any> {
		var url = `/web/getfilebyserverrelativeurl('${url}')`;
		return this._dao.get(url).then(utils.validateODataV2);
	}

	private _copyFile(sourceUrl: string, destinationUrl: string, digest: string) {
		var url = `/web/getfilebyserverrelativeurl('${sourceUrl}')/CopyTo`; //(strnewurl='${destinationUrl}',boverwrite=true)`
		var options = {
			headers: utils.headers.getAddHeaders(digest),
		};
		var body = {
			strNewUrl: destinationUrl,
			bOverWrite: true,
		};
		return this._dao.post(url, body, options);
	}
	// TODO: getFolder
	// TODO: uploadFile
	// TODO: fileAction
	// TODO: deleteFile

	/** Copies a file from one server relative url to another */
	copyFile(sourceUrl: string, destinationUrl: string, digest?: string) {
		return this._dao.auth
			.ensureRequestDigest(digest)
			.then(digest => this._copyFile(sourceUrl, destinationUrl, digest));
	}
}
