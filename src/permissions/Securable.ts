import Context from "../context/Context";
import utils from "../utils";
import { RoleAssignment, RoleDef, RoleMember, basePermissions } from "./IPermissions";

declare var _spPageContextInfo;

/** Allows you to check the permissions of a securable (list or site) */
export default class Securable {
    private _dao: Context;
    private baseUrl: string;

    constructor(baseUrl: string, ctx: Context) {
        this.baseUrl = baseUrl;
        this._dao = ctx;
    }

    /** Gets all the role assignments on that securable  */
    getRoleAssignments(): Promise<RoleAssignment[]> {
        var url = this.baseUrl + "/RoleAssignments?$expand=Member,RoleDefinitionBindings";

        return this._dao.get(url)
            .then(utils.validateODataV2)
            .then(results => results.map(transformRoleAssignment));
    }

    private checkPrivs(user) : Promise<any> {
            var login = encodeURIComponent(user.LoginName);
            var url = this.baseUrl + "/getusereffectivepermissions(@v)?@v='" + login + "'";
            return this._dao.get(url).then(utils.validateODataV2);
    }
    /** Gets all the role assignments on that securable. If you don't pass an email, it will use the current user. */
    check(email?: string): Promise<string[]> {

        if (!email && !utils.isBrowser()) {
            return Promise.reject("Can't check permissions. No email passed and no current user");
        }

        // If no email is passed, then get current user, else get user by email
        var req = !email
            ? this._dao.get('/web/getuserbyid(' + _spPageContextInfo.userId + ')').then(data => data.d)
            : this._dao.web.getUser(email)

        return req.then((user) => this.checkPrivs(user))
            .then(privs => permissionMaskToStrings(privs.GetUserEffectivePermissions.Low, privs.GetUserEffectivePermissions.High));
    }
}

var transformRoleAssignment = function (raw: any): RoleAssignment {
    var member: RoleMember = {
        login: raw.Member.LoginName,
        name: raw.Member.Title,
        id: raw.Member.Id
    };
    var roles: RoleDef[] = raw.RoleDefinitionBindings.results.map(roleDef => {
        return {
            name: roleDef.Name,
            description: roleDef.Description,
            basePermissions: permissionMaskToStrings(roleDef.BasePermissions.Low, roleDef.BasePermissions.High)
        }
    });
    return { member, roles };
}

var permissionMaskToStrings = function (lowMask, highMask): string[] {
    var permissions = [];
    basePermissions.forEach(function (basePermission) {
        if ((basePermission.low & lowMask) > 0 || (basePermission.high & highMask) > 0) {
            permissions.push(basePermission.name);
        }
    });
    return permissions;
};

