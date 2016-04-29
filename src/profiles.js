var utils 		= require("./utils");
var headers 	= require("./requestHeaders");

var Profiles = function(dao) {
	this._dao = dao;
	this.baseUrl = "/SP.UserProfiles.PeopleManager";
};

var transformPersonProperties = function(profile) {
	profile.UserProfileProperties.results.forEach(keyvalue => {
		profile[keyvalue.Key] = keyvalue.Value;
	});
	return profile;
};

Profiles.prototype.current = function() {
	var url = this.baseUrl + "/GetMyProperties";
	return this._dao.get(url)
				.then(utils.validateODataV2)
				.then(transformPersonProperties);
};


Profiles.prototype.setProperty = function(userOrEmail, key, value, digest) {
	if (digest) return this._setProperty(userOrEmail, key, value, digest);
	return this._dao.getRequestDigest().then(digest => this._setProperty(userOrEmail, key, value, digest));
};

// Supports email string or a user object
Profiles.prototype._setProperty = function(userOrEmail, key, value, digest) {
	var url = this.baseUrl + "/SetSingleValueProfileProperty";
	var args = {
		propertyName: key,
		propertyValue: value,
	};

	var customOptions = {
		headers: headers.getStandardHeaders(digest)
	};

	// if a string is passed, assume its an email address, otherwise a user was passed
	if (typeof userOrEmail === "string") {
		return this.getByEmail(userOrEmail).then(user => {
			args.accountName = user.AccountName;
			return this._dao.post(url, args, customOptions);
		})
	} else {
		args.accountName = userOrEmail.LoginName || userOrEmail.AccountName;
		return this._dao.post(url, args, customOptions);
	}
};

Profiles.prototype.getProfile = function(user) {
	var login = encodeURIComponent(user.LoginName);
	var url = this.baseUrl + "/GetPropertiesFor(accountName=@v)?@v='" + login + "'";
	return this._dao.get(url)
		.then(utils.validateODataV2)
		.then(transformPersonProperties);
};

Profiles.prototype.getByEmail = function(email) {
	return this._dao.web.getUser(email).then(user => this.getProfile(user));
};

module.exports = Profiles;