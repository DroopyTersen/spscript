export interface BasePermission {
    name:string,
    low:number,
    high:number
}

export interface RoleMember {
    login:string,
    name:string,
    id:string
}

export interface RoleDef {
    /** Role definition name */
    name:string,
    description:string,
    /** An array of base permission names */
    basePermissions: string[]
}

export interface RoleAssignment {
    /** User or Group */
    member:RoleMember,
    /** An array of role definitions */
    roles:RoleDef[]
}

export var basePermissions : BasePermission[] = [{
   "name": "emptyMask",
   "low": 0,
   "high": 0
}, {
   "name": "viewListItems",
   "low": 1,
   "high": 0
}, {
   "name": "addListItems",
   "low": 2,
   "high": 0
}, {
   "name": "editListItems",
   "low": 4,
   "high": 0
}, {
   "name": "deleteListItems",
   "low": 8,
   "high": 0
}, {
   "name": "approveItems",
   "low": 16,
   "high": 0
}, {
   "name": "openItems",
   "low": 32,
   "high": 0
}, {
   "name": "viewVersions",
   "low": 64,
   "high": 0
}, {
   "name": "deleteVersions",
   "low": 128,
   "high": 0
}, {
   "name": "cancelCheckout",
   "low": 256,
   "high": 0
}, {
   "name": "managePersonalViews",
   "low": 512,
   "high": 0
}, {
   "name": "manageLists",
   "low": 2048,
   "high": 0
}, {
   "name": "viewFormPages",
   "low": 4096,
   "high": 0
}, {
   "name": "anonymousSearchAccessList",
   "low": 8192,
   "high": 0
}, {
   "name": "open",
   "low": 65536,
   "high": 0
}, {
   "name": "viewPages",
   "low": 131072,
   "high": 0
}, {
   "name": "addAndCustomizePages",
   "low": 262144,
   "high": 0
}, {
   "name": "applyThemeAndBorder",
   "low": 524288,
   "high": 0
}, {
   "name": "applyStyleSheets",
   "low": 1048576,
   "high": 0
}, {
   "name": "viewUsageData",
   "low": 2097152,
   "high": 0
}, {
   "name": "createSSCSite",
   "low": 4194304,
   "high": 0
}, {
   "name": "manageSubwebs",
   "low": 8388608,
   "high": 0
}, {
   "name": "createGroups",
   "low": 16777216,
   "high": 0
}, {
   "name": "managePermissions",
   "low": 33554432,
   "high": 0
}, {
   "name": "browseDirectories",
   "low": 67108864,
   "high": 0
}, {
   "name": "browseUserInfo",
   "low": 134217728,
   "high": 0
}, {
   "name": "addDelPrivateWebParts",
   "low": 268435456,
   "high": 0
}, {
   "name": "updatePersonalWebParts",
   "low": 536870912,
   "high": 0
}, {
   "name": "manageWeb",
   "low": 1073741824,
   "high": 0
}, {
   "name": "anonymousSearchAccessWebLists",
   "low": -2147483648,
   "high": 0
}, {
   "name": "useClientIntegration",
   "low": 0,
   "high": 16
}, {
   "name": "useRemoteAPIs",
   "low": 0,
   "high": 32
}, {
   "name": "manageAlerts",
   "low": 0,
   "high": 64
}, {
   "name": "createAlerts",
   "low": 0,
   "high": 128
}, {
   "name": "editMyUserInfo",
   "low": 0,
   "high": 256
}, {
   "name": "enumeratePermissions",
   "low": 0,
   "high": 1073741824
}];
