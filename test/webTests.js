exports.run = function(dao) {
    describe("SPScript.RestDao.web", function () {
        describe("SPScript.RestDao.web.info()", function () {
            it("Should return a promise that resolves to web info", function (done) {
                dao.web.info().then(function (webInfo) {
                    webInfo.should.have.property("Url");
                    webInfo.should.have.property("Title");
                    done();
                });
            });
        });

        describe("SPScript.RestDao.web.subsites()", function () {
            it("Should return a promise that resolves to an array of subsite web infos.", function (done) {
                dao.web.subsites().then(function (subsites) {
                    subsites.should.be.an("array");
                    if (subsites.length) {
                        subsites[0].should.have.property("Title");
                        subsites[0].should.have.property("ServerRelativeUrl");
                    }
                    done();
                });
            });
        });

        describe("SPScript.RestDao.web.permissions()", function () {
            var permissions = null;
            before(function (done) {
                dao.web.permissions().then(function (privs) {
                    permissions = privs;
                    console.log("Permission:");
                    console.log(privs);
                    done();
                });
            });
            it("Should return a promise that resolves to an array of objects", function () {
                permissions.should.be.an("array");
                permissions.should.not.be.empty;
            });
            it("Should return objects that each have a member and a roles array", function () {
                permissions.forEach(function (permission) {
                    permission.should.have.property("member");
                    permission.should.have.property("roles");
                    permission.roles.should.be.an("array");
                });
            });
            it("Should return permission objects that contain member.name, member.login, and member.id", function () {
                permissions.forEach(function (permission) {
                    permission.member.should.have.property("name");
                    permission.member.should.have.property("login");
                    permission.member.should.have.property("id");
                });
            });
            it("Should return permission objects, each with a roles array that has a name and description", function () {
                permissions.forEach(function (permission) {
                    permission.roles.forEach(function (role) {
                        role.should.have.property("name");
                        role.should.have.property("description");
                    });
                });
            });
        });

        describe("SPScript.RestDao.web.permissions(email)", function () {
            var permissions = null;
            var email = "andrew@andrewpetersen.onmicrosoft.com"
            before(function (done) {
                dao.web.permissions(email).then(function (privs) {
                    permissions = privs;
                    done();
                });
            });
            it("Should return a promise that resolves to an array of base permission strings", function () {
                permissions.should.be.an("array");
                permissions.should.not.be.empty;
            });

            it("Should reject the promise for an invalid email", function (done) {

                dao.web.permissions("invalid@invalid123.com")
                .then(function (privs) {
                    ("one").should.equal("two");
                    done();
                }).fail(function(xhr, status, error){
                    console.log(error);
                    console.log(xhr.responseText)
                    done();
                });
            });
        });
    });
};
    
