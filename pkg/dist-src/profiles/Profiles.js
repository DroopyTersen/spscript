import utils from "../utils/index.js";
export default class Profiles {
  constructor(ctx) {
    this._dao = ctx;
    this.baseUrl = "/SP.UserProfiles.PeopleManager";
  }
  /** Gets the profile of the current user.  */


  current() {
    var url = this.baseUrl + "/GetMyProperties";
    return this._dao.get(url).then(utils.validateODataV2).then(transformPersonProperties);
  }
  /** Gets the current user's profile */


  get(user) {
    if (!user) return this.current();
    return this.getUserObj(user).then(user => {
      var login = encodeURIComponent(user.LoginName || user.AccountName);
      var url = this.baseUrl + "/GetPropertiesFor(accountName=@v)?@v='" + login + "'";
      return this._dao.get(url).then(utils.validateODataV2).then(transformPersonProperties);
    });
  }

  getUserObj(user) {
    if (!user || typeof user === "string") {
      return this._dao.web.getUser(user);
    } else if (user.AccountName || user.LoginName) {
      return Promise.resolve(user);
    } else throw new Error("profiles.setProperty Error: Invalid user parameter");
  }
  /** Sets a profile property on the current user */


  setProperty(key, value, user) {
    return this.getUserObj(user).then(user => {
      var args = {
        propertyName: key,
        propertyValue: value,
        accountName: user.LoginName || user.AccountName
      };
      var url = this.baseUrl + "/SetSingleValueProfileProperty";
      return this._dao.authorizedPost(url, args);
    });
  }

}

var transformPersonProperties = function (profile) {
  profile.UserProfileProperties.results.forEach(keyvalue => {
    profile[keyvalue.Key] = keyvalue.Value;
  });
  return profile;
};