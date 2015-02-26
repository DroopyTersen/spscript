SPScript = window.SPScript || {};

(function(sp) {
	sp.models = {};

	sp.models.roleAssignment = {};
	sp.models.roleAssignment.fromRaw = function(raw) {
		var priv = {
			member: {
				login: raw.Member.LoginName,
				name: raw.Member.Title,
				id: raw.Member.Id
			}
		};
		priv.roles = raw.RoleDefinitionBindings.results.map(function(roleDef){
			return {
				name: roleDef.Name,
				description: roleDef.Description
			};
		});
		return priv;
	};
})(SPScript);