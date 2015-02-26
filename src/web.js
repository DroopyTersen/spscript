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

	Web.prototype.permissions = function() {
		var url = baseUrl + "/RoleAssignments?$expand=Member,RoleDefinitionBindings";
		return this._dao.get(url)
			.then(sp.helpers.validateODataV2)
			.then(function(results){
				return results.map(sp.models.roleAssignment.fromRaw);
			});
	};
	sp.Web = Web;
})(SPScript);