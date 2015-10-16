(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
mocha.setup('bdd');
chai.should();

describe("SPScript.RestDao", function () {
    this.timeout(10000);
    var url = _spPageContextInfo.webAbsoluteUrl;
    var dao = new SPScript.RestDao(url);

    var webTests = require("./webTests");
    webTests.run(dao);
    
    var listTests = require("./listTests");
    listTests.run(dao);

    var searchTests = require("./searchTests");
    searchTests.run(dao);

    var profileTests = require("./profileTests");
    profileTests.run(dao);
});

var queryStringTests = require("./queryStringTests");
queryStringTests.run();

mocha.run();
},{"./listTests":2,"./profileTests":3,"./queryStringTests":4,"./searchTests":5,"./webTests":6}],2:[function(require,module,exports){
exports.run = function (dao) {
	describe("SPScript.RestDao.lists()", function () {
        var results = null;
        before(function(done){
            dao.lists().then(function(data){
                results = data;
                done();
            });
        });
        it("Should return a promise that resolves to an array of lists", function () {
            results.should.be.an("array");
            results.should.not.be.empty;
        });
        it("Should bring back list info like Title, ItemCount, and ListItemEntityTypeFullName", function () {
            var firstItem = results[0];
            firstItem.should.have.property("Title");
            firstItem.should.have.property("ItemCount");
            firstItem.should.have.property("ListItemEntityTypeFullName");
        });
    });

    describe("SPScript.RestDao.lists(listname)", function () {
        var list = dao.lists("TestList");
        describe("SPScript.RestDao.lists(listname).info()", function () {
            var listInfo = null;
            before(function (done) {
                list.info().then(function (info) {
                    listInfo = info;
                    done();
                });
            });
            it("Should return a promise that resolves to list info", function () {
                listInfo.should.be.an("object");
            });
            it("Should bring back list info like Title, ItemCount, and ListItemEntityTypeFullName", function () {
                listInfo.should.have.property("Title");
                listInfo.should.have.property("ItemCount");
                listInfo.should.have.property("ListItemEntityTypeFullName");
            });
        });

        describe("SPScript.RestDao.lists(listname).getItems()", function () {
            var items = null;
            before(function (done) {
                list.getItems().then(function (results) {
                    items = results;
                    done();
                });
            });

            it("Should return a promise that resolves to an array of items", function () {
                items.should.be.an("array");
                items.should.not.be.empty;
            });
            it("Should return all the items in the list", function (done) {
                list.info().then(function (listInfo) {
                    items.length.should.equal(listInfo.ItemCount);
                    done();
                });
            });
        });

        describe("SPScript.RestDao.lists(listname).getItemById(id)", function () {
            var item = null;
            var validId = -1;
            before(function (done) {
                list.getItems()
                    .then(function (allItems) {
                        validId = allItems[0].Id;
                        return validId;
                    })
                    .then(function (id) {
                        return list.getItemById(id);
                    })
                    .then(function (result) {
                        item = result;
                        done();
                    });
            });
            it("Should return a promise that resolves to a single item", function () {
                item.should.be.an("object");
                item.should.have.property("Title");
            });
            it("Should resolve an item with a matching ID", function () {
                item.should.have.property("Id");
                item.Id.should.equal(validId);
            });
        });

        describe("SPScript.RestDao.lists(listname).getItems(odata) - OData support", function () {
            //Get items where BoolColumn == TRUE
            var odata = "$filter=BoolColumn eq 1";
            var items = null;
            before(function (done) {
                list.getItems(odata).then(function (results) {
                    items = results;
                    done();
                });
            });
            it("Should return a promise that resolves to an array of items", function () {
                items.should.be.an("array");
            });
            it("Should return only items that match the OData params", function () {
                items.forEach(function (item) {
                    item.should.have.property("BoolColumn");
                    item.BoolColumn.should.be.true;
                });
            });
        });

        describe("SPScript.RestDao.lists(listname).findItems(key, value)", function () {
            var matches = null;
            before(function (done) {
                list.findItems("BoolColumn", 1).then(function (results) {
                    matches = results;
                    done();
                });
            });
            it("Should return a promise that resolves to an array of list items", function () {
                matches.should.be.an("array");
                matches.should.not.be.empty;
            });
            it("Should only bring back items the match the key value query", function () {
                matches.forEach(function (item) {
                    item.should.have.property("BoolColumn");
                    item.BoolColumn.should.be.true;
                });
            });
            it("Should support string filters", function (done) {
                var stringValue = "Required data";
                list.findItems("RequiredColumn", stringValue).then(function (items) {
                    items.should.be.an("array");
                    items.should.not.be.empty;
                    items.forEach(function (item) {
                        item.should.have.property("RequiredColumn");
                        item.RequiredColumn.should.equal(stringValue);
                    });
                    done();
                });
            });

            it("Should support number (and bool) filters", function () {
                //first 2 tests test this
                return true;
            });
        });
        describe("SPScript.RestDao.lists(listname).findItem(key, value)", function () {
            var match = null;
            before(function (done) {
                list.findItem("BoolColumn", 1).then(function (result) {
                    match = result;
                    done();
                });
            });
            it("Should resolve to one list item", function () {
                match.should.be.an("object");
            });
            it("Should only bring back an item if it matches the key value query", function () {
                match.should.have.property("BoolColumn");
                match.BoolColumn.should.be.true;
            });
        });

        describe("SPScript.RestDao.lists(listname).addItem()", function () {
        	var newItem = {
        		Title: "Test Created Item",
        		MyColumn: "Inserted from Mocha test",
        		RequiredColumn: "This field is required",
        		BoolColumn: "True"
        	};
        	var insertedItem = null;
        	before(function(done){
        		list.addItem(newItem).then(function(result){
        			insertedItem = result;
        			done();
        		}).fail(function(error){
        			console.log(error);
        			done();
        		});
        	});
            it("Should return a promise that resolves with the new list item", function(){
            	insertedItem.should.not.be.null;
            	insertedItem.should.be.an("object");
            	insertedItem.should.have.property("Id");
            });
            it("Should save the item right away so it can be queried.", function() {
            	list.getItemById(insertedItem.Id).then(function(foundItem){
            		foundItem.should.not.be.null;
            		foundItem.should.have.property("Title");
            		foundItem.Title.should.equal(newItem.Title);
            	});
            });
 			it("Should throw an error if a invalid field is set", function(done) {
            	newItem.InvalidColumn = "test";
            	list.addItem(newItem)
            	.then(function(){
            		//supposed to fail
            		("one").should.equal("two");
            	})
            	.fail(function(xhr, status, msg){
            		console.log(msg);
            		console.log(xhr.responseText);
            		xhr.responseText.should.be.a("string");
            		done();
            	});
            });
        });

        describe("SPScript.RestDao.lists(listname).deleteItem(id)", function() {
        	var itemToDelete = null;
        	before(function(done){
        		list.getItems("$orderby=Id").then(function(items){
        			itemToDelete = items[items.length - 1];
        			return list.deleteItem(itemToDelete.Id);
        		}).then(function(){
        			done();
        		});
        	});
        	it("Should delete that item", function(done) {
        		list.getItemById(itemToDelete.Id)
        			.then(function(){
        				throw "Should have failed because item has been deleted";
        			})
        			.fail(function(){
        				done();
        			});
        	});
        	it("Should reject the promise if the item id can not be found", function(done){
        		list.deleteItem(99999999).then(function(){
        			throw "Should have failed because id doesnt exist";
        		})
        		.fail(function(){
        			done();
        		})
        	});
        });

        describe("SPScript.RestDao.lists(listname).updateItem()", function () {
        	var itemToUpdate = null;
        	var updates = { Title: "Updated Title" };
        	before(function(done){
        		list.getItems("$orderby=Id desc").then(function(items){
        			itemToUpdate = items[items.length - 1];
        			done();
        		});
        	});
            it("Should return a promise", function(done) {
            	list.updateItem(itemToUpdate.Id, updates).then(function(){
            		done();
            	});
            });
            it("Should update only the properties that were passed", function(done){
            	list.getItemById(itemToUpdate.Id).then(function(item){
        			item.should.have.property("Title");
        			item.Title.should.equal(updates.Title);
        			item.should.have.property("RequiredColumn");
        			item.RequiredColumn.should.equal(itemToUpdate.RequiredColumn);
            		done();
            	});
            });
        });


        describe("SPScript.RestDao.lists(listname).permissions()", function () {
            var permissions = null;
            before(function (done) {
                list.permissions().then(function (privs) {
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

    });
};
},{}],3:[function(require,module,exports){
exports.run = function(dao) {
    var email = "andrew@andrewpetersen.onmicrosoft.com";
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
    
    describe("SPScript.RestDao.profile.setProperty(accountName, propertyName, propertyValue)", function(){
       it ("Should update the About Me profile property", function(done){
          var aboutMeValue = "Hi there. I was update with SPScript";
          dao.profiles.setProperty(email, "AboutMe", aboutMeValue)
            .then(dao.profiles.current.bind(dao.profiles))
            .then(function(profile){
                profile.should.have.property("AboutMe");
                profile.AboutMe.should.equal(aboutMeValue);
                done();
            })
            .fail(function() {
                    console.log("Failed");
                    console.log(arguments); 
            });
          
          var languageKey = "SPS-MUILanguages";
          var languageValue = "es-US,en-US";
          dao.profiles.setProperty(email, languageKey, languageValue);
       }); 
    });
};
},{}],4:[function(require,module,exports){
exports.run = function() {
	describe("SPScript.queryString", function () {
	    this.timeout(5000);
	    var qs = "key1=value1&key2=value2&key3=value3";
	    describe("SPScript.queryString.contains(key)", function () {
	        it("Should return the true for a valid key", function () {
	            var contains = SPScript.queryString.contains('key1', qs);
	            contains.should.be.true;
	        });
	        it("Should return false for an invalid key", function () {
	            var contains = SPScript.queryString.contains('invalidKey', qs);
	            contains.should.be.false;
	        });
	    });
	    describe("SPScript.queryString.getValue(key)", function () {
	        it("Should return the value of a valid key", function () {
	            var val = SPScript.queryString.getValue("key1", qs);
	            val.should.equal("value1");
	        });
	        it("Should return an empty string for an invalid key", function () {
	            var val = SPScript.queryString.getValue("invalidKey", qs);
	            val.should.equal("");
	        });
	    });
	    describe("SPScript.queryString.getAll()", function () {
	        it("Should return an object with querystring keys as properties", function () {
	            var values = SPScript.queryString.getAll(qs);
	            console.log(values);
	            values.should.have.property('key1');
	            values.key1.should.equal('value1');
	            values.should.have.property('key2');
	            values.key2.should.equal('value2');
	            values.should.have.property('key3');
	            values.key3.should.equal('value3');
	        });
	    });
	});
};
},{}],5:[function(require,module,exports){
exports.run = function(dao) {
	describe("SPScript.RestDao.search.query(queryText)", function () {
        it("Should return promise that resolves to a SearchResults object", function (done) {
            var queryText = "seed";
            dao.search.query(queryText).then(function (searchResults) {
                searchResults.should.be.an("object");
                searchResults.should.have.property("resultsCount");
                searchResults.should.have.property("totalResults");
                searchResults.should.have.property("items");
                searchResults.items.should.be.an("array");
                searchResults.items.should.not.be.empty;
                done();
            });
        });
    });
    describe("SPScript.RestDao.search.query(queryText, queryOptions)", function () {
        it("Should return promise that resolves to an array of SearchResults");
        it("Should obey the extra query options that were passed");
    });
};
},{}],6:[function(require,module,exports){
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
    

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxnaXR3aXBcXFNQU2NyaXB0XFxub2RlX21vZHVsZXNcXGd1bHAtYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvdGVzdC9mYWtlX2I1OWMyMjUwLmpzIiwiQzovZ2l0d2lwL1NQU2NyaXB0L3Rlc3QvbGlzdFRlc3RzLmpzIiwiQzovZ2l0d2lwL1NQU2NyaXB0L3Rlc3QvcHJvZmlsZVRlc3RzLmpzIiwiQzovZ2l0d2lwL1NQU2NyaXB0L3Rlc3QvcXVlcnlTdHJpbmdUZXN0cy5qcyIsIkM6L2dpdHdpcC9TUFNjcmlwdC90ZXN0L3NlYXJjaFRlc3RzLmpzIiwiQzovZ2l0d2lwL1NQU2NyaXB0L3Rlc3Qvd2ViVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9jaGEuc2V0dXAoJ2JkZCcpO1xyXG5jaGFpLnNob3VsZCgpO1xyXG5cclxuZGVzY3JpYmUoXCJTUFNjcmlwdC5SZXN0RGFvXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMudGltZW91dCgxMDAwMCk7XHJcbiAgICB2YXIgdXJsID0gX3NwUGFnZUNvbnRleHRJbmZvLndlYkFic29sdXRlVXJsO1xyXG4gICAgdmFyIGRhbyA9IG5ldyBTUFNjcmlwdC5SZXN0RGFvKHVybCk7XHJcblxyXG4gICAgdmFyIHdlYlRlc3RzID0gcmVxdWlyZShcIi4vd2ViVGVzdHNcIik7XHJcbiAgICB3ZWJUZXN0cy5ydW4oZGFvKTtcclxuICAgIFxyXG4gICAgdmFyIGxpc3RUZXN0cyA9IHJlcXVpcmUoXCIuL2xpc3RUZXN0c1wiKTtcclxuICAgIGxpc3RUZXN0cy5ydW4oZGFvKTtcclxuXHJcbiAgICB2YXIgc2VhcmNoVGVzdHMgPSByZXF1aXJlKFwiLi9zZWFyY2hUZXN0c1wiKTtcclxuICAgIHNlYXJjaFRlc3RzLnJ1bihkYW8pO1xyXG5cclxuICAgIHZhciBwcm9maWxlVGVzdHMgPSByZXF1aXJlKFwiLi9wcm9maWxlVGVzdHNcIik7XHJcbiAgICBwcm9maWxlVGVzdHMucnVuKGRhbyk7XHJcbn0pO1xyXG5cclxudmFyIHF1ZXJ5U3RyaW5nVGVzdHMgPSByZXF1aXJlKFwiLi9xdWVyeVN0cmluZ1Rlc3RzXCIpO1xyXG5xdWVyeVN0cmluZ1Rlc3RzLnJ1bigpO1xyXG5cclxubW9jaGEucnVuKCk7IiwiZXhwb3J0cy5ydW4gPSBmdW5jdGlvbiAoZGFvKSB7XHJcblx0ZGVzY3JpYmUoXCJTUFNjcmlwdC5SZXN0RGFvLmxpc3RzKClcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciByZXN1bHRzID0gbnVsbDtcclxuICAgICAgICBiZWZvcmUoZnVuY3Rpb24oZG9uZSl7XHJcbiAgICAgICAgICAgIGRhby5saXN0cygpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIGFycmF5IG9mIGxpc3RzXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmVzdWx0cy5zaG91bGQuYmUuYW4oXCJhcnJheVwiKTtcclxuICAgICAgICAgICAgcmVzdWx0cy5zaG91bGQubm90LmJlLmVtcHR5O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KFwiU2hvdWxkIGJyaW5nIGJhY2sgbGlzdCBpbmZvIGxpa2UgVGl0bGUsIEl0ZW1Db3VudCwgYW5kIExpc3RJdGVtRW50aXR5VHlwZUZ1bGxOYW1lXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGZpcnN0SXRlbSA9IHJlc3VsdHNbMF07XHJcbiAgICAgICAgICAgIGZpcnN0SXRlbS5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIlRpdGxlXCIpO1xyXG4gICAgICAgICAgICBmaXJzdEl0ZW0uc2hvdWxkLmhhdmUucHJvcGVydHkoXCJJdGVtQ291bnRcIik7XHJcbiAgICAgICAgICAgIGZpcnN0SXRlbS5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIkxpc3RJdGVtRW50aXR5VHlwZUZ1bGxOYW1lXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoXCJTUFNjcmlwdC5SZXN0RGFvLmxpc3RzKGxpc3RuYW1lKVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGxpc3QgPSBkYW8ubGlzdHMoXCJUZXN0TGlzdFwiKTtcclxuICAgICAgICBkZXNjcmliZShcIlNQU2NyaXB0LlJlc3REYW8ubGlzdHMobGlzdG5hbWUpLmluZm8oKVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBsaXN0SW5mbyA9IG51bGw7XHJcbiAgICAgICAgICAgIGJlZm9yZShmdW5jdGlvbiAoZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdC5pbmZvKCkudGhlbihmdW5jdGlvbiAoaW5mbykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RJbmZvID0gaW5mbztcclxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBsaXN0IGluZm9cIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgbGlzdEluZm8uc2hvdWxkLmJlLmFuKFwib2JqZWN0XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgYnJpbmcgYmFjayBsaXN0IGluZm8gbGlrZSBUaXRsZSwgSXRlbUNvdW50LCBhbmQgTGlzdEl0ZW1FbnRpdHlUeXBlRnVsbE5hbWVcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgbGlzdEluZm8uc2hvdWxkLmhhdmUucHJvcGVydHkoXCJUaXRsZVwiKTtcclxuICAgICAgICAgICAgICAgIGxpc3RJbmZvLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiSXRlbUNvdW50XCIpO1xyXG4gICAgICAgICAgICAgICAgbGlzdEluZm8uc2hvdWxkLmhhdmUucHJvcGVydHkoXCJMaXN0SXRlbUVudGl0eVR5cGVGdWxsTmFtZVwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhby5saXN0cyhsaXN0bmFtZSkuZ2V0SXRlbXMoKVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IG51bGw7XHJcbiAgICAgICAgICAgIGJlZm9yZShmdW5jdGlvbiAoZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdC5nZXRJdGVtcygpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtcyA9IHJlc3VsdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIGFycmF5IG9mIGl0ZW1zXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW1zLnNob3VsZC5iZS5hbihcImFycmF5XCIpO1xyXG4gICAgICAgICAgICAgICAgaXRlbXMuc2hvdWxkLm5vdC5iZS5lbXB0eTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBhbGwgdGhlIGl0ZW1zIGluIHRoZSBsaXN0XCIsIGZ1bmN0aW9uIChkb25lKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0LmluZm8oKS50aGVuKGZ1bmN0aW9uIChsaXN0SW5mbykge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLmxlbmd0aC5zaG91bGQuZXF1YWwobGlzdEluZm8uSXRlbUNvdW50KTtcclxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhby5saXN0cyhsaXN0bmFtZSkuZ2V0SXRlbUJ5SWQoaWQpXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIgdmFsaWRJZCA9IC0xO1xyXG4gICAgICAgICAgICBiZWZvcmUoZnVuY3Rpb24gKGRvbmUpIHtcclxuICAgICAgICAgICAgICAgIGxpc3QuZ2V0SXRlbXMoKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChhbGxJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZElkID0gYWxsSXRlbXNbMF0uSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWxpZElkO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0LmdldEl0ZW1CeUlkKGlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSA9IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgc2luZ2xlIGl0ZW1cIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zaG91bGQuYmUuYW4oXCJvYmplY3RcIik7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiVGl0bGVcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpdChcIlNob3VsZCByZXNvbHZlIGFuIGl0ZW0gd2l0aCBhIG1hdGNoaW5nIElEXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uc2hvdWxkLmhhdmUucHJvcGVydHkoXCJJZFwiKTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uSWQuc2hvdWxkLmVxdWFsKHZhbGlkSWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoXCJTUFNjcmlwdC5SZXN0RGFvLmxpc3RzKGxpc3RuYW1lKS5nZXRJdGVtcyhvZGF0YSkgLSBPRGF0YSBzdXBwb3J0XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy9HZXQgaXRlbXMgd2hlcmUgQm9vbENvbHVtbiA9PSBUUlVFXHJcbiAgICAgICAgICAgIHZhciBvZGF0YSA9IFwiJGZpbHRlcj1Cb29sQ29sdW1uIGVxIDFcIjtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zID0gbnVsbDtcclxuICAgICAgICAgICAgYmVmb3JlKGZ1bmN0aW9uIChkb25lKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0LmdldEl0ZW1zKG9kYXRhKS50aGVuKGZ1bmN0aW9uIChyZXN1bHRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSByZXN1bHRzO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIGFycmF5IG9mIGl0ZW1zXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW1zLnNob3VsZC5iZS5hbihcImFycmF5XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIG9ubHkgaXRlbXMgdGhhdCBtYXRjaCB0aGUgT0RhdGEgcGFyYW1zXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiQm9vbENvbHVtblwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLkJvb2xDb2x1bW4uc2hvdWxkLmJlLnRydWU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhby5saXN0cyhsaXN0bmFtZSkuZmluZEl0ZW1zKGtleSwgdmFsdWUpXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG1hdGNoZXMgPSBudWxsO1xyXG4gICAgICAgICAgICBiZWZvcmUoZnVuY3Rpb24gKGRvbmUpIHtcclxuICAgICAgICAgICAgICAgIGxpc3QuZmluZEl0ZW1zKFwiQm9vbENvbHVtblwiLCAxKS50aGVuKGZ1bmN0aW9uIChyZXN1bHRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcyA9IHJlc3VsdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpdChcIlNob3VsZCByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gYXJyYXkgb2YgbGlzdCBpdGVtc1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBtYXRjaGVzLnNob3VsZC5iZS5hbihcImFycmF5XCIpO1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hlcy5zaG91bGQubm90LmJlLmVtcHR5O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgb25seSBicmluZyBiYWNrIGl0ZW1zIHRoZSBtYXRjaCB0aGUga2V5IHZhbHVlIHF1ZXJ5XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIG1hdGNoZXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc2hvdWxkLmhhdmUucHJvcGVydHkoXCJCb29sQ29sdW1uXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uQm9vbENvbHVtbi5zaG91bGQuYmUudHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgc3VwcG9ydCBzdHJpbmcgZmlsdGVyc1wiLCBmdW5jdGlvbiAoZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0cmluZ1ZhbHVlID0gXCJSZXF1aXJlZCBkYXRhXCI7XHJcbiAgICAgICAgICAgICAgICBsaXN0LmZpbmRJdGVtcyhcIlJlcXVpcmVkQ29sdW1uXCIsIHN0cmluZ1ZhbHVlKS50aGVuKGZ1bmN0aW9uIChpdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLnNob3VsZC5iZS5hbihcImFycmF5XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLnNob3VsZC5ub3QuYmUuZW1wdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiUmVxdWlyZWRDb2x1bW5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uUmVxdWlyZWRDb2x1bW4uc2hvdWxkLmVxdWFsKHN0cmluZ1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdChcIlNob3VsZCBzdXBwb3J0IG51bWJlciAoYW5kIGJvb2wpIGZpbHRlcnNcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy9maXJzdCAyIHRlc3RzIHRlc3QgdGhpc1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhby5saXN0cyhsaXN0bmFtZSkuZmluZEl0ZW0oa2V5LCB2YWx1ZSlcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBudWxsO1xyXG4gICAgICAgICAgICBiZWZvcmUoZnVuY3Rpb24gKGRvbmUpIHtcclxuICAgICAgICAgICAgICAgIGxpc3QuZmluZEl0ZW0oXCJCb29sQ29sdW1uXCIsIDEpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoID0gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmVzb2x2ZSB0byBvbmUgbGlzdCBpdGVtXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIG1hdGNoLnNob3VsZC5iZS5hbihcIm9iamVjdFwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIG9ubHkgYnJpbmcgYmFjayBhbiBpdGVtIGlmIGl0IG1hdGNoZXMgdGhlIGtleSB2YWx1ZSBxdWVyeVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBtYXRjaC5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIkJvb2xDb2x1bW5cIik7XHJcbiAgICAgICAgICAgICAgICBtYXRjaC5Cb29sQ29sdW1uLnNob3VsZC5iZS50cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoXCJTUFNjcmlwdC5SZXN0RGFvLmxpc3RzKGxpc3RuYW1lKS5hZGRJdGVtKClcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIFx0dmFyIG5ld0l0ZW0gPSB7XHJcbiAgICAgICAgXHRcdFRpdGxlOiBcIlRlc3QgQ3JlYXRlZCBJdGVtXCIsXHJcbiAgICAgICAgXHRcdE15Q29sdW1uOiBcIkluc2VydGVkIGZyb20gTW9jaGEgdGVzdFwiLFxyXG4gICAgICAgIFx0XHRSZXF1aXJlZENvbHVtbjogXCJUaGlzIGZpZWxkIGlzIHJlcXVpcmVkXCIsXHJcbiAgICAgICAgXHRcdEJvb2xDb2x1bW46IFwiVHJ1ZVwiXHJcbiAgICAgICAgXHR9O1xyXG4gICAgICAgIFx0dmFyIGluc2VydGVkSXRlbSA9IG51bGw7XHJcbiAgICAgICAgXHRiZWZvcmUoZnVuY3Rpb24oZG9uZSl7XHJcbiAgICAgICAgXHRcdGxpc3QuYWRkSXRlbShuZXdJdGVtKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XHJcbiAgICAgICAgXHRcdFx0aW5zZXJ0ZWRJdGVtID0gcmVzdWx0O1xyXG4gICAgICAgIFx0XHRcdGRvbmUoKTtcclxuICAgICAgICBcdFx0fSkuZmFpbChmdW5jdGlvbihlcnJvcil7XHJcbiAgICAgICAgXHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgIFx0XHRcdGRvbmUoKTtcclxuICAgICAgICBcdFx0fSk7XHJcbiAgICAgICAgXHR9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIG5ldyBsaXN0IGl0ZW1cIiwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgXHRpbnNlcnRlZEl0ZW0uc2hvdWxkLm5vdC5iZS5udWxsO1xyXG4gICAgICAgICAgICBcdGluc2VydGVkSXRlbS5zaG91bGQuYmUuYW4oXCJvYmplY3RcIik7XHJcbiAgICAgICAgICAgIFx0aW5zZXJ0ZWRJdGVtLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiSWRcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpdChcIlNob3VsZCBzYXZlIHRoZSBpdGVtIHJpZ2h0IGF3YXkgc28gaXQgY2FuIGJlIHF1ZXJpZWQuXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcdGxpc3QuZ2V0SXRlbUJ5SWQoaW5zZXJ0ZWRJdGVtLklkKS50aGVuKGZ1bmN0aW9uKGZvdW5kSXRlbSl7XHJcbiAgICAgICAgICAgIFx0XHRmb3VuZEl0ZW0uc2hvdWxkLm5vdC5iZS5udWxsO1xyXG4gICAgICAgICAgICBcdFx0Zm91bmRJdGVtLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiVGl0bGVcIik7XHJcbiAgICAgICAgICAgIFx0XHRmb3VuZEl0ZW0uVGl0bGUuc2hvdWxkLmVxdWFsKG5ld0l0ZW0uVGl0bGUpO1xyXG4gICAgICAgICAgICBcdH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuIFx0XHRcdGl0KFwiU2hvdWxkIHRocm93IGFuIGVycm9yIGlmIGEgaW52YWxpZCBmaWVsZCBpcyBzZXRcIiwgZnVuY3Rpb24oZG9uZSkge1xyXG4gICAgICAgICAgICBcdG5ld0l0ZW0uSW52YWxpZENvbHVtbiA9IFwidGVzdFwiO1xyXG4gICAgICAgICAgICBcdGxpc3QuYWRkSXRlbShuZXdJdGVtKVxyXG4gICAgICAgICAgICBcdC50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIFx0XHQvL3N1cHBvc2VkIHRvIGZhaWxcclxuICAgICAgICAgICAgXHRcdChcIm9uZVwiKS5zaG91bGQuZXF1YWwoXCJ0d29cIik7XHJcbiAgICAgICAgICAgIFx0fSlcclxuICAgICAgICAgICAgXHQuZmFpbChmdW5jdGlvbih4aHIsIHN0YXR1cywgbXNnKXtcclxuICAgICAgICAgICAgXHRcdGNvbnNvbGUubG9nKG1zZyk7XHJcbiAgICAgICAgICAgIFx0XHRjb25zb2xlLmxvZyh4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgXHRcdHhoci5yZXNwb25zZVRleHQuc2hvdWxkLmJlLmEoXCJzdHJpbmdcIik7XHJcbiAgICAgICAgICAgIFx0XHRkb25lKCk7XHJcbiAgICAgICAgICAgIFx0fSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZShcIlNQU2NyaXB0LlJlc3REYW8ubGlzdHMobGlzdG5hbWUpLmRlbGV0ZUl0ZW0oaWQpXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFx0dmFyIGl0ZW1Ub0RlbGV0ZSA9IG51bGw7XHJcbiAgICAgICAgXHRiZWZvcmUoZnVuY3Rpb24oZG9uZSl7XHJcbiAgICAgICAgXHRcdGxpc3QuZ2V0SXRlbXMoXCIkb3JkZXJieT1JZFwiKS50aGVuKGZ1bmN0aW9uKGl0ZW1zKXtcclxuICAgICAgICBcdFx0XHRpdGVtVG9EZWxldGUgPSBpdGVtc1tpdGVtcy5sZW5ndGggLSAxXTtcclxuICAgICAgICBcdFx0XHRyZXR1cm4gbGlzdC5kZWxldGVJdGVtKGl0ZW1Ub0RlbGV0ZS5JZCk7XHJcbiAgICAgICAgXHRcdH0pLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICBcdFx0XHRkb25lKCk7XHJcbiAgICAgICAgXHRcdH0pO1xyXG4gICAgICAgIFx0fSk7XHJcbiAgICAgICAgXHRpdChcIlNob3VsZCBkZWxldGUgdGhhdCBpdGVtXCIsIGZ1bmN0aW9uKGRvbmUpIHtcclxuICAgICAgICBcdFx0bGlzdC5nZXRJdGVtQnlJZChpdGVtVG9EZWxldGUuSWQpXHJcbiAgICAgICAgXHRcdFx0LnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICBcdFx0XHRcdHRocm93IFwiU2hvdWxkIGhhdmUgZmFpbGVkIGJlY2F1c2UgaXRlbSBoYXMgYmVlbiBkZWxldGVkXCI7XHJcbiAgICAgICAgXHRcdFx0fSlcclxuICAgICAgICBcdFx0XHQuZmFpbChmdW5jdGlvbigpe1xyXG4gICAgICAgIFx0XHRcdFx0ZG9uZSgpO1xyXG4gICAgICAgIFx0XHRcdH0pO1xyXG4gICAgICAgIFx0fSk7XHJcbiAgICAgICAgXHRpdChcIlNob3VsZCByZWplY3QgdGhlIHByb21pc2UgaWYgdGhlIGl0ZW0gaWQgY2FuIG5vdCBiZSBmb3VuZFwiLCBmdW5jdGlvbihkb25lKXtcclxuICAgICAgICBcdFx0bGlzdC5kZWxldGVJdGVtKDk5OTk5OTk5KS50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHRcdFx0dGhyb3cgXCJTaG91bGQgaGF2ZSBmYWlsZWQgYmVjYXVzZSBpZCBkb2VzbnQgZXhpc3RcIjtcclxuICAgICAgICBcdFx0fSlcclxuICAgICAgICBcdFx0LmZhaWwoZnVuY3Rpb24oKXtcclxuICAgICAgICBcdFx0XHRkb25lKCk7XHJcbiAgICAgICAgXHRcdH0pXHJcbiAgICAgICAgXHR9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoXCJTUFNjcmlwdC5SZXN0RGFvLmxpc3RzKGxpc3RuYW1lKS51cGRhdGVJdGVtKClcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIFx0dmFyIGl0ZW1Ub1VwZGF0ZSA9IG51bGw7XHJcbiAgICAgICAgXHR2YXIgdXBkYXRlcyA9IHsgVGl0bGU6IFwiVXBkYXRlZCBUaXRsZVwiIH07XHJcbiAgICAgICAgXHRiZWZvcmUoZnVuY3Rpb24oZG9uZSl7XHJcbiAgICAgICAgXHRcdGxpc3QuZ2V0SXRlbXMoXCIkb3JkZXJieT1JZCBkZXNjXCIpLnRoZW4oZnVuY3Rpb24oaXRlbXMpe1xyXG4gICAgICAgIFx0XHRcdGl0ZW1Ub1VwZGF0ZSA9IGl0ZW1zW2l0ZW1zLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIFx0XHRcdGRvbmUoKTtcclxuICAgICAgICBcdFx0fSk7XHJcbiAgICAgICAgXHR9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIGEgcHJvbWlzZVwiLCBmdW5jdGlvbihkb25lKSB7XHJcbiAgICAgICAgICAgIFx0bGlzdC51cGRhdGVJdGVtKGl0ZW1Ub1VwZGF0ZS5JZCwgdXBkYXRlcykudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBcdFx0ZG9uZSgpO1xyXG4gICAgICAgICAgICBcdH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgdXBkYXRlIG9ubHkgdGhlIHByb3BlcnRpZXMgdGhhdCB3ZXJlIHBhc3NlZFwiLCBmdW5jdGlvbihkb25lKXtcclxuICAgICAgICAgICAgXHRsaXN0LmdldEl0ZW1CeUlkKGl0ZW1Ub1VwZGF0ZS5JZCkudGhlbihmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICBcdFx0XHRpdGVtLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiVGl0bGVcIik7XHJcbiAgICAgICAgXHRcdFx0aXRlbS5UaXRsZS5zaG91bGQuZXF1YWwodXBkYXRlcy5UaXRsZSk7XHJcbiAgICAgICAgXHRcdFx0aXRlbS5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIlJlcXVpcmVkQ29sdW1uXCIpO1xyXG4gICAgICAgIFx0XHRcdGl0ZW0uUmVxdWlyZWRDb2x1bW4uc2hvdWxkLmVxdWFsKGl0ZW1Ub1VwZGF0ZS5SZXF1aXJlZENvbHVtbik7XHJcbiAgICAgICAgICAgIFx0XHRkb25lKCk7XHJcbiAgICAgICAgICAgIFx0fSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgZGVzY3JpYmUoXCJTUFNjcmlwdC5SZXN0RGFvLmxpc3RzKGxpc3RuYW1lKS5wZXJtaXNzaW9ucygpXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHBlcm1pc3Npb25zID0gbnVsbDtcclxuICAgICAgICAgICAgYmVmb3JlKGZ1bmN0aW9uIChkb25lKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0LnBlcm1pc3Npb25zKCkudGhlbihmdW5jdGlvbiAocHJpdnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IHByaXZzO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGVybWlzc2lvbjpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJpdnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIGFycmF5IG9mIG9iamVjdHNcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMuc2hvdWxkLmJlLmFuKFwiYXJyYXlcIik7XHJcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5zaG91bGQubm90LmJlLmVtcHR5O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIG9iamVjdHMgdGhhdCBlYWNoIGhhdmUgYSBtZW1iZXIgYW5kIGEgcm9sZXMgYXJyYXlcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMuZm9yRWFjaChmdW5jdGlvbiAocGVybWlzc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb24uc2hvdWxkLmhhdmUucHJvcGVydHkoXCJtZW1iZXJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbi5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcInJvbGVzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb24ucm9sZXMuc2hvdWxkLmJlLmFuKFwiYXJyYXlcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBwZXJtaXNzaW9uIG9iamVjdHMgdGhhdCBjb250YWluIG1lbWJlci5uYW1lLCBtZW1iZXIubG9naW4sIGFuZCBtZW1iZXIuaWRcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMuZm9yRWFjaChmdW5jdGlvbiAocGVybWlzc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb24ubWVtYmVyLnNob3VsZC5oYXZlLnByb3BlcnR5KFwibmFtZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBwZXJtaXNzaW9uLm1lbWJlci5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcImxvZ2luXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb24ubWVtYmVyLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiaWRcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBwZXJtaXNzaW9uIG9iamVjdHMsIGVhY2ggd2l0aCBhIHJvbGVzIGFycmF5IHRoYXQgaGFzIGEgbmFtZSBhbmQgZGVzY3JpcHRpb25cIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMuZm9yRWFjaChmdW5jdGlvbiAocGVybWlzc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb24ucm9sZXMuZm9yRWFjaChmdW5jdGlvbiAocm9sZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlLnNob3VsZC5oYXZlLnByb3BlcnR5KFwibmFtZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZS5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcImRlc2NyaXB0aW9uXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59OyIsImV4cG9ydHMucnVuID0gZnVuY3Rpb24oZGFvKSB7XHJcbiAgICB2YXIgZW1haWwgPSBcImFuZHJld0BhbmRyZXdwZXRlcnNlbi5vbm1pY3Jvc29mdC5jb21cIjtcclxuXHRkZXNjcmliZShcIlNQU2NyaXB0LlJlc3REYW8ucHJvZmlsZXMuY3VycmVudCgpXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcHJvZmlsZSA9IG51bGw7XHJcbiAgICAgICAgYmVmb3JlKGZ1bmN0aW9uIChkb25lKSB7XHJcbiAgICAgICAgICAgIGRhby5wcm9maWxlcy5jdXJyZW50KCkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBwcm9maWxlID0gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdChcIlNob3VsZCByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSBwcm9maWxlIHByb3BlcnRpZXMgb2JqZWN0XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcHJvZmlsZS5zaG91bGQuYmUuYW4oXCJvYmplY3RcIik7XHJcbiAgICAgICAgICAgIHByb2ZpbGUuc2hvdWxkLmhhdmUucHJvcGVydHkoXCJBY2NvdW50TmFtZVwiKTtcclxuICAgICAgICAgICAgcHJvZmlsZS5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIkVtYWlsXCIpO1xyXG4gICAgICAgICAgICBwcm9maWxlLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiUHJlZmVycmVkTmFtZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgZGVzY3JpYmUoXCJTUFNjcmlwdC5SZXN0RGFvLnByb2ZpbGVzLmdldEJ5RW1haWwoZW1haWwpXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcHJvZmlsZSA9IG51bGw7XHJcbiAgICAgICAgYmVmb3JlKGZ1bmN0aW9uIChkb25lKSB7XHJcbiAgICAgICAgICAgIGRhby5wcm9maWxlcy5nZXRCeUVtYWlsKGVtYWlsKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHByb2ZpbGUgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICBkb25lKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIHByb2ZpbGUgcHJvcGVydGllcyBvYmplY3RcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBwcm9maWxlLnNob3VsZC5iZS5hbihcIm9iamVjdFwiKTtcclxuICAgICAgICAgICAgcHJvZmlsZS5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIkFjY291bnROYW1lXCIpO1xyXG4gICAgICAgICAgICBwcm9maWxlLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiRW1haWxcIik7XHJcbiAgICAgICAgICAgIHByb2ZpbGUuc2hvdWxkLmhhdmUucHJvcGVydHkoXCJQcmVmZXJyZWROYW1lXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdChcIlNob3VsZCBnaXZlIHlvdSB0aGUgbWF0Y2hpbmcgcGVyc29uXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcHJvZmlsZS5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIkVtYWlsXCIpO1xyXG4gICAgICAgICAgICBwcm9maWxlLkVtYWlsLnNob3VsZC5lcXVhbChlbWFpbCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KFwiU2hvdWxkIHJlamVjdCB0aGUgcHJvbWlzZSBmb3IgYW4gaW52YWxpZCBlbWFpbFwiLCBmdW5jdGlvbiAoZG9uZSkge1xyXG4gICAgICAgICAgICBkYW8ucHJvZmlsZXMuZ2V0QnlFbWFpbChcImludmFsaWRAaW52YWxpZDEyMy5jb21cIilcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgKFwib25lXCIpLnNob3VsZC5lcXVhbChcInR3b1wiKTtcclxuICAgICAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oeGhyLCBzdGF0dXMsIG1zZykge1xyXG4gICAgICAgICAgICBcdGNvbnNvbGUubG9nKHhoci5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICBcdHhoci5yZXNwb25zZVRleHQuc2hvdWxkLmJlLmEoXCJzdHJpbmdcIik7XHJcbiAgICAgICAgICAgIFx0ZG9uZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICBkZXNjcmliZShcIlNQU2NyaXB0LlJlc3REYW8ucHJvZmlsZS5zZXRQcm9wZXJ0eShhY2NvdW50TmFtZSwgcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlKVwiLCBmdW5jdGlvbigpe1xyXG4gICAgICAgaXQgKFwiU2hvdWxkIHVwZGF0ZSB0aGUgQWJvdXQgTWUgcHJvZmlsZSBwcm9wZXJ0eVwiLCBmdW5jdGlvbihkb25lKXtcclxuICAgICAgICAgIHZhciBhYm91dE1lVmFsdWUgPSBcIkhpIHRoZXJlLiBJIHdhcyB1cGRhdGUgd2l0aCBTUFNjcmlwdFwiO1xyXG4gICAgICAgICAgZGFvLnByb2ZpbGVzLnNldFByb3BlcnR5KGVtYWlsLCBcIkFib3V0TWVcIiwgYWJvdXRNZVZhbHVlKVxyXG4gICAgICAgICAgICAudGhlbihkYW8ucHJvZmlsZXMuY3VycmVudC5iaW5kKGRhby5wcm9maWxlcykpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHByb2ZpbGUpe1xyXG4gICAgICAgICAgICAgICAgcHJvZmlsZS5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIkFib3V0TWVcIik7XHJcbiAgICAgICAgICAgICAgICBwcm9maWxlLkFib3V0TWUuc2hvdWxkLmVxdWFsKGFib3V0TWVWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBkb25lKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmFpbGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFyZ3VtZW50cyk7IFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgdmFyIGxhbmd1YWdlS2V5ID0gXCJTUFMtTVVJTGFuZ3VhZ2VzXCI7XHJcbiAgICAgICAgICB2YXIgbGFuZ3VhZ2VWYWx1ZSA9IFwiZXMtVVMsZW4tVVNcIjtcclxuICAgICAgICAgIGRhby5wcm9maWxlcy5zZXRQcm9wZXJ0eShlbWFpbCwgbGFuZ3VhZ2VLZXksIGxhbmd1YWdlVmFsdWUpO1xyXG4gICAgICAgfSk7IFxyXG4gICAgfSk7XHJcbn07IiwiZXhwb3J0cy5ydW4gPSBmdW5jdGlvbigpIHtcclxuXHRkZXNjcmliZShcIlNQU2NyaXB0LnF1ZXJ5U3RyaW5nXCIsIGZ1bmN0aW9uICgpIHtcclxuXHQgICAgdGhpcy50aW1lb3V0KDUwMDApO1xyXG5cdCAgICB2YXIgcXMgPSBcImtleTE9dmFsdWUxJmtleTI9dmFsdWUyJmtleTM9dmFsdWUzXCI7XHJcblx0ICAgIGRlc2NyaWJlKFwiU1BTY3JpcHQucXVlcnlTdHJpbmcuY29udGFpbnMoa2V5KVwiLCBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICBpdChcIlNob3VsZCByZXR1cm4gdGhlIHRydWUgZm9yIGEgdmFsaWQga2V5XCIsIGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgICAgICB2YXIgY29udGFpbnMgPSBTUFNjcmlwdC5xdWVyeVN0cmluZy5jb250YWlucygna2V5MScsIHFzKTtcclxuXHQgICAgICAgICAgICBjb250YWlucy5zaG91bGQuYmUudHJ1ZTtcclxuXHQgICAgICAgIH0pO1xyXG5cdCAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIGZhbHNlIGZvciBhbiBpbnZhbGlkIGtleVwiLCBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICAgICAgdmFyIGNvbnRhaW5zID0gU1BTY3JpcHQucXVlcnlTdHJpbmcuY29udGFpbnMoJ2ludmFsaWRLZXknLCBxcyk7XHJcblx0ICAgICAgICAgICAgY29udGFpbnMuc2hvdWxkLmJlLmZhbHNlO1xyXG5cdCAgICAgICAgfSk7XHJcblx0ICAgIH0pO1xyXG5cdCAgICBkZXNjcmliZShcIlNQU2NyaXB0LnF1ZXJ5U3RyaW5nLmdldFZhbHVlKGtleSlcIiwgZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIHRoZSB2YWx1ZSBvZiBhIHZhbGlkIGtleVwiLCBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICAgICAgdmFyIHZhbCA9IFNQU2NyaXB0LnF1ZXJ5U3RyaW5nLmdldFZhbHVlKFwia2V5MVwiLCBxcyk7XHJcblx0ICAgICAgICAgICAgdmFsLnNob3VsZC5lcXVhbChcInZhbHVlMVwiKTtcclxuXHQgICAgICAgIH0pO1xyXG5cdCAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIGFuIGVtcHR5IHN0cmluZyBmb3IgYW4gaW52YWxpZCBrZXlcIiwgZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgICAgIHZhciB2YWwgPSBTUFNjcmlwdC5xdWVyeVN0cmluZy5nZXRWYWx1ZShcImludmFsaWRLZXlcIiwgcXMpO1xyXG5cdCAgICAgICAgICAgIHZhbC5zaG91bGQuZXF1YWwoXCJcIik7XHJcblx0ICAgICAgICB9KTtcclxuXHQgICAgfSk7XHJcblx0ICAgIGRlc2NyaWJlKFwiU1BTY3JpcHQucXVlcnlTdHJpbmcuZ2V0QWxsKClcIiwgZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIGFuIG9iamVjdCB3aXRoIHF1ZXJ5c3RyaW5nIGtleXMgYXMgcHJvcGVydGllc1wiLCBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICAgICAgdmFyIHZhbHVlcyA9IFNQU2NyaXB0LnF1ZXJ5U3RyaW5nLmdldEFsbChxcyk7XHJcblx0ICAgICAgICAgICAgY29uc29sZS5sb2codmFsdWVzKTtcclxuXHQgICAgICAgICAgICB2YWx1ZXMuc2hvdWxkLmhhdmUucHJvcGVydHkoJ2tleTEnKTtcclxuXHQgICAgICAgICAgICB2YWx1ZXMua2V5MS5zaG91bGQuZXF1YWwoJ3ZhbHVlMScpO1xyXG5cdCAgICAgICAgICAgIHZhbHVlcy5zaG91bGQuaGF2ZS5wcm9wZXJ0eSgna2V5MicpO1xyXG5cdCAgICAgICAgICAgIHZhbHVlcy5rZXkyLnNob3VsZC5lcXVhbCgndmFsdWUyJyk7XHJcblx0ICAgICAgICAgICAgdmFsdWVzLnNob3VsZC5oYXZlLnByb3BlcnR5KCdrZXkzJyk7XHJcblx0ICAgICAgICAgICAgdmFsdWVzLmtleTMuc2hvdWxkLmVxdWFsKCd2YWx1ZTMnKTtcclxuXHQgICAgICAgIH0pO1xyXG5cdCAgICB9KTtcclxuXHR9KTtcclxufTsiLCJleHBvcnRzLnJ1biA9IGZ1bmN0aW9uKGRhbykge1xyXG5cdGRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhby5zZWFyY2gucXVlcnkocXVlcnlUZXh0KVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIFNlYXJjaFJlc3VsdHMgb2JqZWN0XCIsIGZ1bmN0aW9uIChkb25lKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVyeVRleHQgPSBcInNlZWRcIjtcclxuICAgICAgICAgICAgZGFvLnNlYXJjaC5xdWVyeShxdWVyeVRleHQpLnRoZW4oZnVuY3Rpb24gKHNlYXJjaFJlc3VsdHMpIHtcclxuICAgICAgICAgICAgICAgIHNlYXJjaFJlc3VsdHMuc2hvdWxkLmJlLmFuKFwib2JqZWN0XCIpO1xyXG4gICAgICAgICAgICAgICAgc2VhcmNoUmVzdWx0cy5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcInJlc3VsdHNDb3VudFwiKTtcclxuICAgICAgICAgICAgICAgIHNlYXJjaFJlc3VsdHMuc2hvdWxkLmhhdmUucHJvcGVydHkoXCJ0b3RhbFJlc3VsdHNcIik7XHJcbiAgICAgICAgICAgICAgICBzZWFyY2hSZXN1bHRzLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiaXRlbXNcIik7XHJcbiAgICAgICAgICAgICAgICBzZWFyY2hSZXN1bHRzLml0ZW1zLnNob3VsZC5iZS5hbihcImFycmF5XCIpO1xyXG4gICAgICAgICAgICAgICAgc2VhcmNoUmVzdWx0cy5pdGVtcy5zaG91bGQubm90LmJlLmVtcHR5O1xyXG4gICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoXCJTUFNjcmlwdC5SZXN0RGFvLnNlYXJjaC5xdWVyeShxdWVyeVRleHQsIHF1ZXJ5T3B0aW9ucylcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gYXJyYXkgb2YgU2VhcmNoUmVzdWx0c1wiKTtcclxuICAgICAgICBpdChcIlNob3VsZCBvYmV5IHRoZSBleHRyYSBxdWVyeSBvcHRpb25zIHRoYXQgd2VyZSBwYXNzZWRcIik7XHJcbiAgICB9KTtcclxufTsiLCJleHBvcnRzLnJ1biA9IGZ1bmN0aW9uKGRhbykge1xyXG4gICAgZGVzY3JpYmUoXCJTUFNjcmlwdC5SZXN0RGFvLndlYlwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZGVzY3JpYmUoXCJTUFNjcmlwdC5SZXN0RGFvLndlYi5pbmZvKClcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpdChcIlNob3VsZCByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gd2ViIGluZm9cIiwgZnVuY3Rpb24gKGRvbmUpIHtcclxuICAgICAgICAgICAgICAgIGRhby53ZWIuaW5mbygpLnRoZW4oZnVuY3Rpb24gKHdlYkluZm8pIHtcclxuICAgICAgICAgICAgICAgICAgICB3ZWJJbmZvLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiVXJsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdlYkluZm8uc2hvdWxkLmhhdmUucHJvcGVydHkoXCJUaXRsZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhby53ZWIuc3Vic2l0ZXMoKVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBhcnJheSBvZiBzdWJzaXRlIHdlYiBpbmZvcy5cIiwgZnVuY3Rpb24gKGRvbmUpIHtcclxuICAgICAgICAgICAgICAgIGRhby53ZWIuc3Vic2l0ZXMoKS50aGVuKGZ1bmN0aW9uIChzdWJzaXRlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNpdGVzLnNob3VsZC5iZS5hbihcImFycmF5XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdWJzaXRlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2l0ZXNbMF0uc2hvdWxkLmhhdmUucHJvcGVydHkoXCJUaXRsZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2l0ZXNbMF0uc2hvdWxkLmhhdmUucHJvcGVydHkoXCJTZXJ2ZXJSZWxhdGl2ZVVybFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZShcIlNQU2NyaXB0LlJlc3REYW8ud2ViLnBlcm1pc3Npb25zKClcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcGVybWlzc2lvbnMgPSBudWxsO1xyXG4gICAgICAgICAgICBiZWZvcmUoZnVuY3Rpb24gKGRvbmUpIHtcclxuICAgICAgICAgICAgICAgIGRhby53ZWIucGVybWlzc2lvbnMoKS50aGVuKGZ1bmN0aW9uIChwcml2cykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gcHJpdnM7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQZXJtaXNzaW9uOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwcml2cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpdChcIlNob3VsZCByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gYXJyYXkgb2Ygb2JqZWN0c1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5zaG91bGQuYmUuYW4oXCJhcnJheVwiKTtcclxuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zLnNob3VsZC5ub3QuYmUuZW1wdHk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpdChcIlNob3VsZCByZXR1cm4gb2JqZWN0cyB0aGF0IGVhY2ggaGF2ZSBhIG1lbWJlciBhbmQgYSByb2xlcyBhcnJheVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChwZXJtaXNzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbi5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIm1lbWJlclwiKTtcclxuICAgICAgICAgICAgICAgICAgICBwZXJtaXNzaW9uLnNob3VsZC5oYXZlLnByb3BlcnR5KFwicm9sZXNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbi5yb2xlcy5zaG91bGQuYmUuYW4oXCJhcnJheVwiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIHBlcm1pc3Npb24gb2JqZWN0cyB0aGF0IGNvbnRhaW4gbWVtYmVyLm5hbWUsIG1lbWJlci5sb2dpbiwgYW5kIG1lbWJlci5pZFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChwZXJtaXNzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbi5tZW1iZXIuc2hvdWxkLmhhdmUucHJvcGVydHkoXCJuYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb24ubWVtYmVyLnNob3VsZC5oYXZlLnByb3BlcnR5KFwibG9naW5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbi5tZW1iZXIuc2hvdWxkLmhhdmUucHJvcGVydHkoXCJpZFwiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIHBlcm1pc3Npb24gb2JqZWN0cywgZWFjaCB3aXRoIGEgcm9sZXMgYXJyYXkgdGhhdCBoYXMgYSBuYW1lIGFuZCBkZXNjcmlwdGlvblwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChwZXJtaXNzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbi5yb2xlcy5mb3JFYWNoKGZ1bmN0aW9uIChyb2xlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGUuc2hvdWxkLmhhdmUucHJvcGVydHkoXCJuYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiZGVzY3JpcHRpb25cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhby53ZWIucGVybWlzc2lvbnMoZW1haWwpXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHBlcm1pc3Npb25zID0gbnVsbDtcclxuICAgICAgICAgICAgdmFyIGVtYWlsID0gXCJhbmRyZXdAYW5kcmV3cGV0ZXJzZW4ub25taWNyb3NvZnQuY29tXCJcclxuICAgICAgICAgICAgYmVmb3JlKGZ1bmN0aW9uIChkb25lKSB7XHJcbiAgICAgICAgICAgICAgICBkYW8ud2ViLnBlcm1pc3Npb25zKGVtYWlsKS50aGVuKGZ1bmN0aW9uIChwcml2cykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gcHJpdnM7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpdChcIlNob3VsZCByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gYXJyYXkgb2YgYmFzZSBwZXJtaXNzaW9uIHN0cmluZ3NcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMuc2hvdWxkLmJlLmFuKFwiYXJyYXlcIik7XHJcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5zaG91bGQubm90LmJlLmVtcHR5O1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHJlamVjdCB0aGUgcHJvbWlzZSBmb3IgYW4gaW52YWxpZCBlbWFpbFwiLCBmdW5jdGlvbiAoZG9uZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGRhby53ZWIucGVybWlzc2lvbnMoXCJpbnZhbGlkQGludmFsaWQxMjMuY29tXCIpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocHJpdnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAoXCJvbmVcIikuc2hvdWxkLmVxdWFsKFwidHdvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICAgICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycm9yKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coeGhyLnJlc3BvbnNlVGV4dClcclxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuICAgIFxyXG4iXX0=
