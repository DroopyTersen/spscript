exports.run = function(dao) {
    var email = "andrew@andrewpetersen.onmicrosoft.com";
    describe("var profiles = dao.profiles", function() {
        this.timeout(10000);

        describe("profiles.current()", function() {
            var profile = null;
            before(function(done) {
                dao.profiles.current().then(function(result) {
                    profile = result;
                    done();
                });
            });
            it("Should return a promise that resolves to a profile properties object", function() {
                profile.should.be.an("object");
                profile.should.have.property("AccountName");
                profile.should.have.property("Email");
                profile.should.have.property("PreferredName");
            });
        });

        describe("profiles.getByEmail(email)", function() {
            var profile = null;
            before(function(done) {
                dao.profiles.getByEmail(email).then(function(result) {
                    profile = result;
                    done();
                });
            });
            it("Should return a promise that resolves to a profile properties object", function() {
                profile.should.be.an("object");
                profile.should.have.property("AccountName");
                profile.should.have.property("Email");
                profile.should.have.property("PreferredName");
            });

            it("Should give you the matching person", function() {
                profile.should.have.property("Email");
                profile.Email.should.equal(email);
            });

            it("Should reject the promise for an invalid email", function(done) {
                dao.profiles.getByEmail("invalid@invalid123.com")
                    .then(function(result) {
                        ("one").should.equal("two");
                        done();
                    })
                    .catch(function() {
                        done();
                    });
            });
        });

        describe("profiles.setProperty(email, propertyName, propertyValue)", function() {
            it("Should update the About Me profile property", function(done) {
                var aboutMeValue = "Hi there. I was updated with SPScript";
                dao.profiles.setProperty(email, "AboutMe", aboutMeValue)
                    .then(dao.profiles.current.bind(dao.profiles))
                    .then(function(profile) {
                        profile.should.have.property("AboutMe");
                        profile.AboutMe.should.equal(aboutMeValue);
                        done();
                    })
                    .catch(function() {
                        console.log("Failed");
                        console.log(arguments);
                    });
            });
        });
    });

};