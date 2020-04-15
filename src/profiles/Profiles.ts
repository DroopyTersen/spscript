import Context from "../context/Context";
import utils from "../utils";

export default class Profiles {
  private _dao: Context;
  private baseUrl: string;
  constructor(ctx: Context) {
    this._dao = ctx;
    this.baseUrl = "/SP.UserProfiles.PeopleManager";
  }

  /** Gets the profile of the current user.  */
  current(): Promise<any> {
    var url = this.baseUrl + "/GetMyProperties";
    return this._dao.get(url).then(utils.validateODataV2).then(transformPersonProperties);
  }

  /** Gets the current user's profile */
  get(): Promise<any>;
  /** Gets the profile of the passed in email name. */
  get(email: string): Promise<any>;
  /** Gets the profile of the passed in user object (AccountName or LoginName) must be set */
  get(user: any): Promise<any>;
  get(user?: any): Promise<any> {
    if (!user) return this.current();
    return this.getUserObj(user).then((user) => {
      var login = encodeURIComponent(user.LoginName || user.AccountName);
      var url = this.baseUrl + "/GetPropertiesFor(accountName=@v)?@v='" + login + "'";
      return this._dao.get(url).then(utils.validateODataV2).then(transformPersonProperties);
    });
  }

  private getUserObj(user?: any): Promise<any> {
    if (!user || typeof user === "string") {
      return this._dao.web.getUser(user);
    } else if (user.AccountName || user.LoginName) {
      return Promise.resolve(user);
    } else throw new Error("profiles.setProperty Error: Invalid user parameter");
  }

  /** Sets a profile property on the current user */
  setProperty(key: string, value: any): Promise<any>;
  /** Sets a profile property on the specified email */
  setProperty(key: string, value: any, email: string): Promise<any>;
  /** Sets a profile property on the specified User object (needs AccountName or LoginName property) */
  setProperty(key: string, value: any, userObj: any): Promise<any>;
  setProperty(key: string, value: any, user?: any): Promise<any> {
    return this.getUserObj(user).then((user) => {
      var args = {
        propertyName: key,
        propertyValue: value,
        accountName: user.LoginName || user.AccountName,
      };
      var url = this.baseUrl + "/SetSingleValueProfileProperty";
      return this._dao.post(url, args);
    });
  }
}

var transformPersonProperties = function (profile): any[] {
  profile.UserProfileProperties.forEach((keyvalue) => {
    profile[keyvalue.Key] = keyvalue.Value;
  });
  return profile;
};
