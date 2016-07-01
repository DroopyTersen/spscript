var utils = require("../utils");

exports.run = function(dao) {
    describe("dao.web.customActions", function() {
        this.timeout(10000);


        var customAction = {
            Name: "spscript-test",
            Location: "ScriptLink",
            ScriptBlock: "console.log('deployed from spscript-mocha test')"
        };
        describe("dao.web.customActions.add(customAction)", function() {
            var beforeCount = 0;
            before(function(done){
                dao.web.customActions.get().then(all => {
                    beforeCount = all.length;
                    done();
                })
            });


            it("Should add a Custom Action with the given name", function(done) {
                dao.web.customActions.add(customAction).then(function() {
                    dao.web.customActions.get().then(all => {
                        all.length.should.equal(beforeCount + 1);
                        done();
                    })
                })
            });
        });

        describe("dao.web.customActions.get()", function() {
            var results = null;
            before(function(done) {
                dao.web.customActions.get().then(function(data) {
                    results = data;
                    done();
                });
            }); 

            it("Should return a promise that resolves to an array of custom actions", function() {
                results.should.be.an("array");
                results.should.not.be.empty;
            });
            it("Should bring back properties like Name, Url, and Location", function() {
                var firstItem = results[0];
                firstItem.should.have.property("Name");
                firstItem.should.have.property("Url");
                firstItem.should.have.property("Location");
            });
        });    
        
        describe("dao.web.customActions.get(name)", function() {
            var result = null;
            before(function(done) {
                dao.web.customActions.get()
                .then(function(allCustomActions) {
                    dao.web.customActions.get(allCustomActions[0].Name).then(res => {
                        result = res;
                        done();
                    });
                });
            });

            it("Should have properties like Name, Location, Url, Id", function() {
                result.should.not.be.null;
                result.should.have.property("Name");
                result.should.have.property("Location");
                result.should.have.property("Id");
            })
        });
        
        describe("dao.web.customActions.update(updates)", function() {
            var result = null;
            before(function(done) {
                dao.web.customActions.get().then(function(allCustomActions) {
                    result = allCustomActions[0];
                    done();
                });
            });
            var newTitle = "updated title - " + Date.now();
            it("Should update the property", function(done) {
                dao.web.customActions.update({ Name: result.Name, Title: newTitle})
                .then(function() {
                    dao.web.customActions.get(result.Name).then(i => {
                        i.Title.should.equal(newTitle);
                        done();
                    })
                }); 
            })
        });

        describe("dao.web.customActions.remove(name)", function() {
            var beforeCount = 0;
            before(function(done){
                dao.web.customActions.get().then(all => {
                    beforeCount = all.filter(a => a.Name = customAction.Name).length;
                    done();
                })
            });

            it("Should remove all custom actions with that name", function(done){
                dao.web.customActions.remove(customAction.Name).then(function() {
                    dao.web.customActions.get().then(all => {
                        var matches = all.filter(a => a.Name === customAction.Name);
                        matches.should.be.empty;
                        done();
                    })
                })
            })
        })                          
    })
};
