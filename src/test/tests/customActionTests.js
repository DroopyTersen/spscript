exports.run = function(dao) {
    describe("dao.customActions", function() {
        this.timeout(10000);


        var customAction = {
            Name: "spscript-test",
            Location: "ScriptLink",
            ScriptBlock: "console.log('deployed from spscript-mocha test');"
        };
        describe("dao.customActions.add(customAction)", function() {
            var beforeCount = 0;
            before(function(done){
                dao.customActions.get().then(function(all) {
                    beforeCount = all.length;
                    done();
                })
            });


            it("Should add a Custom Action with the given name", function(done) {
                dao.customActions.add(customAction).then(function() {
                    dao.customActions.get().then(function(all) {
                        all.length.should.equal(beforeCount + 1);
                        done();
                    })
                })
            });
        });

        describe("dao.customActions.get()", function() {
            var results = null;
            before(function(done) {
                dao.customActions.get().then(function(data) {
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
        
        describe("dao.customActions.get(name)", function() {
            var result = null;
            before(function(done) {
                dao.customActions.get()
                .then(function(allCustomActions) {
                    dao.customActions.get(allCustomActions[0].Name).then(function(res) {
                        result = res;
                        done();
                    });
                });
            });

            it("Should return one object w/ properties like Name, Location, Url, Id", function() {
                result.should.not.be.null;
                result.should.have.property("Name");
                result.should.have.property("Location");
                result.should.have.property("Id");
            })

            it("Should reject the promise with a decent error if the Custom Action name is not found", function(done) {
                dao.customActions.get("INVALID-NAME")
                    .then(function(){
                        "one".should.equal("two");
                        done();
                    }).catch(function(err) {
                        console.log(err)
                        done();
                    })
            })
        });
        
        describe("dao.customActions.update(updates)", function() {
            var result = null;
            before(function(done) {
                dao.customActions.get(customAction.Name).then(function(ca) {
                    result = ca;
                    done();
                });
            });
            var newTitle = "updated title - " + Date.now();
            it("Should update the property", function(done) {
                dao.customActions.update({ Name: result.Name, Title: newTitle})
                .then(function() {
                    dao.customActions.get(result.Name).then(function(i) {
                        i.Title.should.equal(newTitle);
                        done();
                    })
                }); 
            })
        });

        describe("dao.customActions.remove(name)", function() {
            var beforeCount = 0;
            before(function(done){
                dao.customActions.get()
                    .then(function(all) {
                        beforeCount = all.filter(function(a){ return a.Name === customAction.Name}).length;
                        done();
                    })
                    .catch(err => {
                        console.log(err);
                        done();
                    })
            });

            it("Should remove all custom actions with that name", function(done){
                dao.customActions.remove(customAction.Name).then(function() {
                    dao.customActions.get().then(function(all) {
                        var matches = all.filter(function(a) { return a.Name === customAction.Name});
                        matches.should.be.empty();
                        done();
                    })
                })
            })
        }) 

        describe("dao.customActions.addScriptLink(name, url)", function(){
            var jsUrl = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js";
            var caName = "SPScriptJSTest-Web";

            before(function(done){
                dao.customActions.addScriptLink(caName, jsUrl).then(function() {
                    done();
                })
            });

            it("Should add a custom action with that name and ScriptBlock with specified URL", function(done){
                dao.customActions.get(caName).then(function(ca) {
                    ca.should.have.property("Name");
                    ca.Name.should.equal(caName);
                    ca.should.have.property("ScriptBlock");                    
                    ca.ScriptBlock.should.contain(jsUrl);
                    done();
                });
            });

            after(function(done) {
                dao.customActions.remove(caName).then(function() {
                    done();
                });
            });
        });

        describe("dao.customActions.addScriptLink(name, url, opts)", function(){
            var jsUrl = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js";
            var caName = "SPScriptJSTest-Site";
            var opts = {Sequence: 25, Group: "Custom Group"};

            before(function(done){
                dao.customActions.addScriptLink(caName, jsUrl, opts).then(function() {
                    done();
                })
            });

            it("Should add a custom action with that name and ScriptBlock with specified URL", function(done){
                dao.customActions.get(caName).then(function(ca) {
                    ca.should.have.property("Name");
                    ca.Name.should.equal(caName);
                    ca.should.have.property("ScriptBlock");                    
                    ca.ScriptBlock.should.contain(jsUrl);
                    ca.should.have.property("Group");                    
                    ca.Group.should.equal(opts.Group);
                    ca.should.have.property("Sequence");                    
                    ca.Sequence.should.equal(25);
                    done();
                });
            });

            after(function(done) {
                dao.customActions.remove(caName).then(function() {
                    done();
                });
            }); 
        });

        describe("dao.customActions.addCSSLink(name, url)", function(){
            var cssUrl = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
            var caName = "SPScriptCSSTest-Web";

            before(function(done){
                dao.customActions.addCSSLink(caName, cssUrl).then(function() {
                    done();
                })
            });

            it("Should add a custom action with that name and ScriptBlock containing specified URL", function(done){
                dao.customActions.get(caName).then(function(ca) {
                    ca.should.have.property("Name");
                    ca.Name.should.equal(caName);
                    ca.should.have.property("ScriptBlock");                    
                    ca.ScriptBlock.should.contain(cssUrl);
                    done();
                });
            });

            after(function(done) {
                dao.customActions.remove(caName).then(function() {
                    done();
                });
            });
        });

        describe("dao.customActions.addCSSLink(name, url, opts)", function(){
            var cssUrl = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
            var caName = "SPScriptCSSTest-Site";
            var opts = {Sequence: 50, Group: "Custom Group"};

            before(function(done){
                dao.customActions.addCSSLink(caName, cssUrl, opts).then(function() {
                    done();
                })
            });

            it("Should add a custom action with that name and ScriptBlock containing specified URL with Site scope", function(done){
                dao.customActions.get(caName).then(function(ca) {
                    ca.should.have.property("Name");
                    ca.Name.should.equal(caName);
                    ca.should.have.property("ScriptBlock");                    
                    ca.ScriptBlock.should.contain(cssUrl);
                    ca.should.have.property("Group");                    
                    ca.Group.should.equal(opts.Group);
                    ca.should.have.property("Sequence");                    
                    ca.Sequence.should.equal(50);
                    done();
                });
            });

            after(function(done) {
                dao.customActions.remove(caName).then(function() {
                    done();
                });
            }); 
        });                        
    })
};