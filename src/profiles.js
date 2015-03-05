var SPScript = require;("./spscript");
SPScript.helpers = require("./helpers");

(function(sp) {
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
					.then(sp.helpers.validateODataV2)
					.then(transformPersonProperties);
	};

	Profiles.prototype.getProfile = function(user) {
		var login = encodeURIComponent(user.LoginName);
		var url = this.baseUrl + "/GetPropertiesFor(accountName=@v)?@v='" + login + "'";
		return this._dao.get(url)
			.then(sp.helpers.validateODataV2)
			.then(transformPersonProperties);
	};

	Profiles.prototype.getByEmail = function(email) {
		var self = this;
		return self._dao.web.getUser(email)
			.then(function(user) {
				return self.getProfile(user);
			})
			.fail(function() {
				throw "User not found";
			});
	};

	sp.Profiles = Profiles;
})(SPScript);

module.exports = SPScript.Profiles;