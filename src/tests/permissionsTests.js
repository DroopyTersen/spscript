var create = exports.create = function(securable, action, email) {
	if (action === "check") {
		return function() {
		 	var permissions = null;
            before(function (done) {
                securable.permissions.check(email).then(function (privs) {
                    permissions = privs;
                    done();
                });
            });
            
            it("Should return a promise that resolves to an array of base permission strings", function () {
                permissions.should.be.an("array");
                permissions.should.not.be.empty;
            });

            it("Should reject the promise for an invalid email", function (done) {

                securable.permissions.check("invalid@invalid123.com")
	                .then(function (privs) {
	                    ("one").should.equal("two");
	                    done();
	                }).catch(function(error){
	                    done();
	                });
            });
		}
	}
	else {
		return function() {
			var permissions = null;
			before(function(done) {
				securable.permissions.getRoleAssignments().then(function(privs) {
					permissions = privs;
					done();
				});
			});
			it("Should return a promise that resolves to an array of objects", function() {
				permissions.should.be.an("array");
				permissions.should.not.be.empty;
			});
			it("Should return objects that each have a member and a roles array", function() {
				permissions.forEach(function(permission) {
					permission.should.have.property("member");
					permission.should.have.property("roles");
					permission.roles.should.be.an("array");
				});
			});
			it("Should return permission objects that contain member.name, member.login, and member.id", function() {
				permissions.forEach(function(permission) {
					permission.member.should.have.property("name");
					permission.member.should.have.property("login");
					permission.member.should.have.property("id");
				});
			});
			it("Should return permission objects, each with a roles array that has a name and description", function() {
				permissions.forEach(function(permission) {
					permission.roles.forEach(function(role) {
						role.should.have.property("name");
						role.should.have.property("description");
					});
				});
			});
		}
	}
}