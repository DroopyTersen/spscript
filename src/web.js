SPScript = window.SPScript || {};

(function(sp) {
	var baseUrl = "/web";
	var Web = function(dao) {
		this._dao = dao;
	};

	Web.prototype.info = function() {
		return this._dao
			.get(baseUrl)
			.then(sp.helpers.validateODataV2);
	};

	Web.prototype.subsites = function() {
		return this._dao
			.get(baseUrl + "/webinfos")
			.then(sp.helpers.validateODataV2);
	};

	Web.prototype.permissions = function(email) {
		return sp.permissions(baseUrl, this._dao, email);
	};

	var fail = function() {
		console.log("uh oh");
		return null;
	};
	Web.prototype.getUser = function(email) {
		var url = baseUrl + "/SiteUsers/GetByEmail('" + email + "')";
		return this._dao.get(url).then(sp.helpers.validateODataV2);
	};

	sp.Web = Web;
})(SPScript);