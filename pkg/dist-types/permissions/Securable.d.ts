import Context from "../context/Context";
import { RoleAssignment } from "./IPermissions";
/** Allows you to check the permissions of a securable (list or site) */
export default class Securable {
    private _dao;
    private baseUrl;
    constructor(baseUrl: string, ctx: Context);
    /** Gets all the role assignments on that securable  */
    getRoleAssignments(): Promise<RoleAssignment[]>;
    private checkPrivs;
    /** Gets all the role assignments on that securable. If you don't pass an email, it will use the current user. */
    check(email?: string): Promise<string[]>;
}
