var utils = require("./utils");

var Profiles = function(dao) {
	this._dao = dao;
	this.baseUrl = "/SP.UserProfiles.PeopleManager";
};

var transformPersonProperties = function(profile) {
	profile.UserProfileProperties.results.forEach(function(keyvalue){
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

Profiles.prototype.setProperty = function(userOrEmail, key, value) {
	var self = this;
	var url = this.baseUrl + "/SetSingleValueProfileProperty";
	var args = {
		propertyName: key,
		propertyValue: value,
	};
	var customOptions = {
		headers: {
			"Accept": utils.acceptHeader,
			"X-RequestDigest": utils.getRequestDigest()
		}
	};

	// if a string is passed, assume its an email address
	if (typeof userOrEmail === "string") {
		return self.getByEmail(userOrEmail).then(function(user){
			args.accountName = user.AccountName;
			return self._dao.post(url, args, customOptions);
		})
	} else {
		args.accountName = userOrEmail.LoginName || userOrEmail.AccountName;
		return self._dao.post(url, args, customOptions);
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
	var self = this;
	return self._dao.web.getUser(email)
		.then(function(user) {
			return self.getProfile(user);
		});
};

module.exports = Profiles;