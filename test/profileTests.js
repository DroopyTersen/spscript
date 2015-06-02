exports.run = function(dao) {
	describe("SPScript.RestDao.profiles.current()", function () {
        var profile = null;
        before(function (done) {
            dao.profiles.current().then(function (result) {
                profile = result;
                done();
            });
        });
        it("Should return a promise that resolves to a profile properties object", function () {
            profile.should.be.an("object");
            profile.should.have.property("AccountName");
            profile.should.have.property("Email");
            profile.should.have.property("PreferredName");
        });
    });

   describe("SPScript.RestDao.profiles.getByEmail(email)", function () {
        var profile = null;
        var email = "andrew@andrewpetersen.onmicrosoft.com";
        before(function (done) {
            dao.profiles.getByEmail(email).then(function (result) {
                profile = result;
                done();
            });
        });
        it("Should return a promise that resolves to a profile properties object", function () {
            profile.should.be.an("object");
            profile.should.have.property("AccountName");
            profile.should.have.property("Email");
            profile.should.have.property("PreferredName");
        });

        it("Should give you the matching person", function () {
            profile.should.have.property("Email");
            profile.Email.should.equal(email);
        });

        it("Should reject the promise for an invalid email", function (done) {
            dao.profiles.getByEmail("invalid@invalid123.com")
            .then(function (result) {
                ("one").should.equal("two");
                done();
            })
            .fail(function(xhr, status, msg) {
            	console.log(xhr.responseText);
            	xhr.responseText.should.be.a("string");
            	done();
            });
        });
    });
};