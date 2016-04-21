var utils = require("./utils");

var Permissions = function(baseUrl, dao) {
   this._dao = dao;
   this.baseUrl = baseUrl
};

Permissions.prototype.getRoleAssignments = function() {
   var url = baseUrl + "/RoleAssignments?$expand=Member,RoleDefinitionBindings";
   return dao.get(url)
      .then(utils.validateODataV2)
      .then(function(results) {
         return results.map(transforms.roleAssignment);
      });
};

Permissions.prototype.check = function(email) {
   var self = this;
   var checkPrivs = function(user) {
      var login = encodeURIComponent(user.LoginName);
      var url = self.baseUrl + "/getusereffectivepermissions(@v)?@v='" + login + "'";
      return self._dao.get(url).then(utils.validateODataV2);
   };

   // If no email is passed, then get current user, else get user by email
   var req = !email ? self._dao.get('/web/getuserbyid(' + _spPageContextInfo.userId + ')').then(function(data) {
      return data.d
   }) : self._dao.web.getUser(email)

   return req.then(checkPrivs)
      .then(function(privs) {
         return permissionMaskToStrings(privs.GetUserEffectivePermissions.Low, privs.GetUserEffectivePermissions.High);
      });
}

var transforms = {
   roleAssignment: function(raw) {
      var priv = {
         member: {
            login: raw.Member.LoginName,
            name: raw.Member.Title,
            id: raw.Member.Id
         }
      };
      priv.roles = raw.RoleDefinitionBindings.results.map(function(roleDef) {
         return {
            name: roleDef.Name,
            description: roleDef.Description,
            basePermissions: permissionMaskToStrings(roleDef.BasePermissions.Low, roleDef.BasePermissions.High)
         }; 
      });
      return priv;
   }
};

var permissionMaskToStrings = function(lowMask, highMask) {
   var basePermissions = [];
   spBasePermissions.forEach(function(basePermission) {
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