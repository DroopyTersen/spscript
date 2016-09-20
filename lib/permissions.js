"use strict";

var utils = require("./utils");

/**
 * Allows you to to check on the security of a list or site. You shouldn't be creating instances of the this class, you will get it from the Web or List class.
 * @class
 * @param {string} baseUrl - Url to the securable
 * @param {IBaseDao} dao - Data access object used to make requests.
 * @example <caption>Access Permissions class using the 'permissions' property on a Web</caption>
 * var dao = new SPScript.RestDao(_spPageContextInfo.webAbsoluteUrl);
 *
 * dao.web.permissions.getRoleAssignments()
 *     .then(function(roleAssignments) { console.log(roleAssignments) });
 * @example <caption>Access Permissions class using the 'permissions' property on a List</caption>
 * dao.lists("Restricted Library").permissions.getRoleAssignments()
 *     .then(function(roleAssignments) { console.log(roleAssignments) });
 */
var Permissions = function Permissions(baseUrl, dao) {
   this._dao = dao;
   this.baseUrl = baseUrl;
};

/**
 * Gets all the role assignments on that securable
 * @returns {Promise<Array<RoleAssignment>>} - A Promise that resolves to an array of role assignments
 * @example
 * dao.web.permissions.getRoleAssignments()
 *     .then(function(roleAssignments) { console.log(roleAssignments) });
 */
Permissions.prototype.getRoleAssignments = function () {
   var url = this.baseUrl + "/RoleAssignments?$expand=Member,RoleDefinitionBindings";
   return this._dao.get(url).then(utils.validateODataV2).then(function (results) {
      return results.map(transforms.roleAssignment);
   });
};

/**
 * Gets all the role assignments on that securable. If you don't pass an email, it will use the current user.
 * @param {string} [email] - If you don't pass an email it will use current user
 * @returns {Promise<Array>} - A Promise that resolves to an array of string base permission values
 * @example <caption>Get the current users permissions on a site</caption>
 * dao.web.permissions.check()
 *     .then(function(basePermissions) { console.log(basePermissions) });
 * @example <caption>Get a specified user's permissions on a list</caption>
 * var email = "andrew@andrewpetersen.onmicrosoft.com"
 * dao.lists("Restricted Library").permissions.check(email)
 *     .then(function(basePermissions) { console.log(basePermissions) });
 */
Permissions.prototype.check = function (email) {
   var _this = this;

   var checkPrivs = function checkPrivs(user) {
      var login = encodeURIComponent(user.LoginName);
      var url = _this.baseUrl + "/getusereffectivepermissions(@v)?@v='" + login + "'";
      return _this._dao.get(url).then(utils.validateODataV2);
   };

   //if no email, and no current user id, reject
   if (!email && !utils.isBrowser()) {
      return Promise.reject("Can't Check Permissions.  No email passed and no current user");
   }

   // If no email is passed, then get current user, else get user by email
   var req = !email ? this._dao.get('/web/getuserbyid(' + _spPageContextInfo.userId + ')').then(function (data) {
      return data.d;
   }) : this._dao.web.getUser(email);

   return req.then(checkPrivs).then(function (privs) {
      return permissionMaskToStrings(privs.GetUserEffectivePermissions.Low, privs.GetUserEffectivePermissions.High);
   });
};

/**
 * Represents a permission on the securable
 * @typedef {Object} RoleMember
 * @property {string} login - Login Name
 * @property {string} name - User or Group title
 * @property {string} id - Member Id
 */

/**
 * Represents a permission on the securable
 * @typedef {Object} RoleDef
 * @property {string} name - Role Definition name
 * @property {string} description - Role Definition description
 * @property {Array} basePermissions - Array of base permission strings
 */

/**
 * Represents a permission on the securable
 * @typedef {Object} RoleAssignment
 * @property {RoleMember} member - User or group
 * @property {Array<RoleDef>} roles - An array of role definitions
 */
var transforms = {
   roleAssignment: function roleAssignment(raw) {
      var priv = {
         member: {
            login: raw.Member.LoginName,
            name: raw.Member.Title,
            id: raw.Member.Id
         }
      };
      priv.roles = raw.RoleDefinitionBindings.results.map(function (roleDef) {
         return {
            name: roleDef.Name,
            description: roleDef.Description,
            basePermissions: permissionMaskToStrings(roleDef.BasePermissions.Low, roleDef.BasePermissions.High)
         };
      });
      return priv;
   }
};

var permissionMaskToStrings = function permissionMaskToStrings(lowMask, highMask) {
   var basePermissions = [];
   spBasePermissions.forEach(function (basePermission) {
      if ((basePermission.low & lowMask) > 0 || (basePermission.high & highMask) > 0) {
         basePermissions.push(basePermission.name);
      }
   });
   return basePermissions;
};

// Scraped it from SP.PermissionKind. 
// Storing it in here to remove sp.js dependency

// var basePermissions = [];
// Object.keys(SP.PermissionKind).forEach(function(key) { 
// 	var perm = new SP.BasePermissions();
//     perm.set(SP.PermissionKind[key]);
//     var permisison = {
//     	name: key,
//     	low: perm.$A_1,
//     	high: perm.$9_1
//     };
//     basePermissions.push(permisison);
// });

var spBasePermissions = [{
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

module.exports = Permissions;
//# sourceMappingURL=permissions.js.map