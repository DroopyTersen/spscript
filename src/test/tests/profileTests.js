var should = require("chai").should();

exports.run = function(dao) {
    console.log("HERE I AM");
    describe("var profiles = ctx.profiles", function() {
        this.timeout(5000);

        describe("ctx.profiles.current()", function() {
            var profile = null;
            before(function(done) {
                dao.profiles.current().then(function(result) {
                    profile = result;
                    console.log(profile);
                    done();
                });
            });

            it("Should return a promise that resolves to a profile properties object", function() {
                profile.should.be.an("object");
                profile.should.have.property("AccountName");
                profile.should.have.property("Email");
                profile.should.have.property("PreferredName");
            });
            it("Should return the profile of the current user", function() {
                profile.should.have.property("Email");
                profile.Email.should.equal(_spPageContextInfo.userEmail);
            })
        });

        describe("ctx.profiles.get()", function() {
            var profile = null;
            before(function(done) {
                dao.profiles.get().then(function(result) {
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

            it("Should return the profile of the current user", function() {
                profile.should.have.property("Email");
                profile.Email.should.equal(_spPageContextInfo.userEmail);
            })
        });

        describe("ctx.profiles.get(email)", function() {
            var email = "andrew@andrewpetersen.onmicrosoft.com";
            var profile = null;
            before(function(done) {
                dao.profiles.get(email)
                    .then(function(result) {
                        profile = result;
                        done();
                    }).catch(function(err) {
                        done(err);
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
                dao.profiles.get("invalid@invalid123.com")
                    .then(function(result) {
                        done("The request should have failed.");
                    })
                    .catch(function() {
                        done();
                    });
            });
        });


        describe("ctx.profiles.get({ AccountName })", function() {
            var email = "andrew@andrewpetersen.onmicrosoft.com";
            var accountName = "i:0#.f|membership|andrew@andrewpetersen.onmicrosoft.com";
            var profile = null;
            before(function(done) {
                dao.profiles.get({ AccountName: accountName })
                    .then(function(result) {
                        profile = result;
                        done();
                    }).catch(function(err) {
                        done(err);
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

            it("Should reject the promise for an invalid account name", function(done) {
                dao.profiles.get({ AccountName: "Invalid" })
                    .then(function(result) {
                        done("The request should have failed.");
                    })
                    .catch(function() {
                        done();
                    });
            });
        });

        describe("ctx.profiles.get({ LoginName })", function() {
            var email = "andrew@andrewpetersen.onmicrosoft.com";
            var accountName = "i:0#.f|membership|andrew@andrewpetersen.onmicrosoft.com";
            var profile = null;
            before(function(done) {
                dao.profiles.get({ LoginName: accountName })
                    .then(function(result) {
                        profile = result;
                        done();
                    }).catch(function(err) {
                        done(err);
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

            it("Should reject the promise for an invalid account name", function(done) {
                dao.profiles.get({ LoginName: "Invalid" })
                    .then(function(result) {
                        done("The request should have failed.");
                    })
                    .catch(function() {
                        done();
                    });
            });
        });

        describe("ctx.profiles.setProperty(propertyName, propertyValue)", function() {
            it("Should update the About Me profile property of the current user", function(done) {
                var aboutMeValue = "Hi there. I was updated with SPScript 1";
                dao.profiles.setProperty("AboutMe", aboutMeValue)
                    .then(function() {
                        return dao.profiles.current();
                    })
                    .then(function(profile) {
                        profile.should.have.property("AboutMe");
                        profile.AboutMe.should.equal(aboutMeValue);
                        done();
                    })
                    .catch(function(err) {
                        done(err);
                    });
            });
        });

        describe("ctx.profiles.setProperty(propertyName, propertyValue, email)", function() {
            var email = "andrew@andrewpetersen.onmicrosoft.com";
            it("Should update the About Me profile property based on the specified email", function(done) {
                var aboutMeValue = "Hi there. I was updated with SPScript 2";
                dao.profiles.setProperty("AboutMe", aboutMeValue, email)
                    .then(function() {
                        return dao.profiles.get(email);
                    })
                    .then(function(profile) {
                        profile.should.have.property("AboutMe");
                        profile.AboutMe.should.equal(aboutMeValue);
                        done();
                    })
                    .catch(function(err) {
                        done(err);
                    });
            });
        });

        describe("ctx.profiles.setProperty(propertyName, propertyValue, { AccountName|LoginName })", function() {
            var accountName = "i:0#.f|membership|andrew@andrewpetersen.onmicrosoft.com";
            var email = "andrew@andrewpetersen.onmicrosoft.com";
            it("Should update the About Me profile property of the passed in User object", function(done) {
                var aboutMeValue = "Hi there. I was updated with SPScript 3";
                dao.profiles.setProperty("AboutMe", aboutMeValue, { AccountName: accountName })
                    .then(function() {
                        return dao.profiles.get({ AccountName: accountName });
                    })
                    .then(function(profile) {
                        profile.should.have.property("AboutMe");
                        profile.AboutMe.should.equal(aboutMeValue);
                        done();
                    })
                    .catch(function(err) {
                        done(err);
                    });
            });
        });
    });

};