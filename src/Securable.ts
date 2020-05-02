import Context from "./Context";
import { parseOData, isBrowser } from "./utils";

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

    return this._dao
      .get(url)
      .then(parseOData)
      .then((results) => results.map(transformRoleAssignment));
  }

  private checkPrivs(user): Promise<any> {
    var url =
      this.baseUrl + `/getusereffectivepermissions('${encodeURIComponent(user.LoginName)}')`;
    return this._dao.get(url).then(parseOData);
  }
  /** Gets all the role assignments on that securable. If you don't pass an email, it will use the current user. */
  async check(email?: string): Promise<string[]> {
    let user = await this._dao.web.getUser(email);
    return this.checkPrivs(user).then((privs) => permissionMaskToStrings(privs.Low, privs.High));
  }
}

var transformRoleAssignment = function (raw: any): RoleAssignment {
  var member: RoleMember = {
    login: raw.Member.LoginName,
    name: raw.Member.Title,
    id: raw.Member.Id,
    principalType: raw.Member.PrincipalType,
  };
  var roles: RoleDef[] = raw.RoleDefinitionBindings.map((roleDef) => {
    return {
      name: roleDef.Name,
      description: roleDef.Description,
      basePermissions: permissionMaskToStrings(
        roleDef.BasePermissions.Low,
        roleDef.BasePermissions.High
      ),
    };
  });
  return { member, roles };
};

var permissionMaskToStrings = function (lowMask, highMask): string[] {
  var permissions = [];
  basePermissions.forEach(function (basePermission) {
    if ((basePermission.low & lowMask) > 0 || (basePermission.high & highMask) > 0) {
      permissions.push(basePermission.name);
    }
  });
  return permissions;
};

export interface BasePermission {
  name: string;
  low: number;
  high: number;
}

export interface RoleMember {
  login: string;
  name: string;
  id: string;
  principalType: number;
}

export interface RoleDef {
  /** Role definition name */
  name: string;
  description: string;
  /** An array of base permission names */
  basePermissions: string[];
}

export interface RoleAssignment {
  /** User or Group */
  member: RoleMember;
  /** An array of role definitions */
  roles: RoleDef[];
}

export var basePermissions: BasePermission[] = [
  {
    name: "emptyMask",
    low: 0,
    high: 0,
  },
  {
    name: "viewListItems",
    low: 1,
    high: 0,
  },
  {
    name: "addListItems",
    low: 2,
    high: 0,
  },
  {
    name: "editListItems",
    low: 4,
    high: 0,
  },
  {
    name: "deleteListItems",
    low: 8,
    high: 0,
  },
  {
    name: "approveItems",
    low: 16,
    high: 0,
  },
  {
    name: "openItems",
    low: 32,
    high: 0,
  },
  {
    name: "viewVersions",
    low: 64,
    high: 0,
  },
  {
    name: "deleteVersions",
    low: 128,
    high: 0,
  },
  {
    name: "cancelCheckout",
    low: 256,
    high: 0,
  },
  {
    name: "managePersonalViews",
    low: 512,
    high: 0,
  },
  {
    name: "manageLists",
    low: 2048,
    high: 0,
  },
  {
    name: "viewFormPages",
    low: 4096,
    high: 0,
  },
  {
    name: "anonymousSearchAccessList",
    low: 8192,
    high: 0,
  },
  {
    name: "open",
    low: 65536,
    high: 0,
  },
  {
    name: "viewPages",
    low: 131072,
    high: 0,
  },
  {
    name: "addAndCustomizePages",
    low: 262144,
    high: 0,
  },
  {
    name: "applyThemeAndBorder",
    low: 524288,
    high: 0,
  },
  {
    name: "applyStyleSheets",
    low: 1048576,
    high: 0,
  },
  {
    name: "viewUsageData",
    low: 2097152,
    high: 0,
  },
  {
    name: "createSSCSite",
    low: 4194304,
    high: 0,
  },
  {
    name: "manageSubwebs",
    low: 8388608,
    high: 0,
  },
  {
    name: "createGroups",
    low: 16777216,
    high: 0,
  },
  {
    name: "managePermissions",
    low: 33554432,
    high: 0,
  },
  {
    name: "browseDirectories",
    low: 67108864,
    high: 0,
  },
  {
    name: "browseUserInfo",
    low: 134217728,
    high: 0,
  },
  {
    name: "addDelPrivateWebParts",
    low: 268435456,
    high: 0,
  },
  {
    name: "updatePersonalWebParts",
    low: 536870912,
    high: 0,
  },
  {
    name: "manageWeb",
    low: 1073741824,
    high: 0,
  },
  {
    name: "anonymousSearchAccessWebLists",
    low: -2147483648,
    high: 0,
  },
  {
    name: "useClientIntegration",
    low: 0,
    high: 16,
  },
  {
    name: "useRemoteAPIs",
    low: 0,
    high: 32,
  },
  {
    name: "manageAlerts",
    low: 0,
    high: 64,
  },
  {
    name: "createAlerts",
    low: 0,
    high: 128,
  },
  {
    name: "editMyUserInfo",
    low: 0,
    high: 256,
  },
  {
    name: "enumeratePermissions",
    low: 0,
    high: 1073741824,
  },
];
