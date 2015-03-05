var SPScript = require;("./spscript");
SPScript.helpers = require("./helpers");

(function(sp) {
	var baseUrl = "/web";
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

	// Web.prototype.getUser = function(email) {
	// 	var url = baseUrl + "/SiteUsers/GetByEmail('" + email + "')";
	// 	return this._dao.get(url).then(sp.helpers.validateODataV2);
	// };

	sp.Profiles = Profiles;
})(SPScript);

module.exports = SPScript.Profiles;