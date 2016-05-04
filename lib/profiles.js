"use strict";

var utils = require("./utils");
var headers = require("./requestHeaders");

/**
 * Allows you to perform queries agains the SP Profile Service. You shouldn't ever be new'ing this class up up yourself, instead you'll get it from your dao as shown in first example.
 * @class
 * @param {IBaseDao} dao - Data access object used to make requests.
 * @example <caption>You access this Profiles class using the 'profiles' property of the dao</caption>
 * var dao = new SPScript.RestDao(_spPageContextInfo.webAbsoluteUrl);
 * dao.profiles.current().then(function(profile) { console.log(profile) });
 */
var Profiles = function Profiles(dao) {
	this._dao = dao;
	this.baseUrl = "/SP.UserProfiles.PeopleManager";
};

var transformPersonProperties = function transformPersonProperties(profile) {
	profile.UserProfileProperties.results.forEach(function (keyvalue) {
		profile[keyvalue.Key] = keyvalue.Value;
	});
	return profile;
};

/**
 * Gets the profile of the current user
 * @returns {Promise} - A Promise that resolves an object containing all the profile properties
 * @example
 * dao.profiles.current().then(function(profile) { console.log(profile.PreferredName) });
 */
Profiles.prototype.current = function () {
	var url = this.baseUrl + "/GetMyProperties";
	return this._dao.get(url).then(utils.validateODataV2).then(transformPersonProperties);
};

/**
 * Sets a profile property
 * @param {User|string} userOrEmail - Pass in a User object (must have 'AccountName' or 'LoginName') or an email address
 * @returns {Promise} - A Promise
 * @example
 * var email = "andrew@andrewpetersen.onmicrosoft.com";
 * var aboutMe = "I am a web developer";
 * dao.profiles.setProperty(email, "AboutMe", aboutMe).then(function() { console.log("Success") });
 */
Profiles.prototype.setProperty = function (userOrEmail, key, value, digest) {
	var _this = this;

	if (digest) return this._setProperty(userOrEmail, key, value, digest);
	return this._dao.getRequestDigest().then(function (digest) {
		return _this._setProperty(userOrEmail, key, value, digest);
	});
};

// Supports email string or a user object
Profiles.prototype._setProperty = function (userOrEmail, key, value, digest) {
	var _this2 = this;

	var url = this.baseUrl + "/SetSingleValueProfileProperty";
	var args = {
		propertyName: key,
		propertyValue: value
	};

	var customOptions = {
		headers: headers.getStandardHeaders(digest)
	};

	// if a string is passed, assume its an email address, otherwise a user was passed
	if (typeof userOrEmail === "string") {
		return this.getByEmail(userOrEmail).then(function (user) {
			args.accountName = user.AccountName;
			return _this2._dao.post(url, args, customOptions);
		});
	} else {
		args.accountName = userOrEmail.LoginName || userOrEmail.AccountName;
		return this._dao.post(url, args, customOptions);
	}
};

Profiles.prototype.getProfile = function (user) {
	var login = encodeURIComponent(user.LoginName);
	var url = this.baseUrl + "/GetPropertiesFor(accountName=@v)?@v='" + login + "'";
	return this._dao.get(url).then(utils.validateODataV2).then(transformPersonProperties);
};

/**
 * Gets the profile of the user tied to the specified email
 * @returns {Promise} - A Promise that resolves an object containing all the profile properties
 * @example
 * var email = "andrew@andrewpetersen.onmicrosoft.com";
 * dao.profiles.getByEmail(email)
 *    .then(function(profile) { console.log(profile.PreferredName) });
 */
Profiles.prototype.getByEmail = function (email) {
	var _this3 = this;

	return this._dao.web.getUser(email).then(function (user) {
		return _this3.getProfile(user);
	});
};

module.exports = Profiles;
//# sourceMappingURL=profiles.js.map