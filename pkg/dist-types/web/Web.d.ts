import Context from "../context/Context";
import Securable from "../permissions/Securable";
export default class Web {
    private baseUrl;
    private _dao;
    permissions: Securable;
    constructor(ctx: Context);
    /** Retrieves basic information about the site */
    getInfo(): Promise<any>;
    /** Retrieves all of the subsites */
    getSubsites(): Promise<any[]>;
    /** Retrieves the current user */
    getUser(): Promise<any>;
    /** Retrieves a users object based on an email address */
    getUser(email: string): Promise<any>;
    ensureUser(login: string): Promise<any>;
    /** Retrieves a file by server relative url */
    getFile(url: string): Promise<any>;
    private _copyFile;
    /** Copies a file from one server relative url to another */
    copyFile(sourceUrl: string, destinationUrl: string, digest?: string): Promise<any>;
}
