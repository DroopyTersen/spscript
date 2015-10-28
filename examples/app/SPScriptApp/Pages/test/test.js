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
    
    var fileTests = require("./fileTests");
    fileTests.run(dao);
});

var queryStringTests = require("./queryStringTests");
queryStringTests.run();

mocha.run();
},{"./fileTests":2,"./listTests":3,"./profileTests":4,"./queryStringTests":5,"./searchTests":6,"./webTests":7}],2:[function(require,module,exports){
exports.run = function(dao) {
	var folderPath = "/Lists/TestLibrary";
	describe("SPScript.RestDao.getFolder(serverRelativeUrl)", function () {
        var folder = null;
        before(function (done) {
            dao.getFolder(folderPath).then(function (result) {
				folder = result;
                console.log(folder);
                done();
            });
        });
        it("Should return a promise that resolves to a folder with files and folders", function () {
            folder.should.be.an("object");
            folder.should.have.property("name");
            folder.should.have.property("serverRelativeUrl");
            folder.should.have.property("files");
            folder.files.should.be.an("array");
            folder.should.have.property("folders");
            folder.folders.should.be.an("array");
        });
    });
};
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6XFxnaXR3aXBcXFNQU2NyaXB0XFxub2RlX21vZHVsZXNcXGd1bHAtYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJjOi9naXR3aXAvU1BTY3JpcHQvdGVzdC9mYWtlXzNiMTY3NThhLmpzIiwiYzovZ2l0d2lwL1NQU2NyaXB0L3Rlc3QvZmlsZVRlc3RzLmpzIiwiYzovZ2l0d2lwL1NQU2NyaXB0L3Rlc3QvbGlzdFRlc3RzLmpzIiwiYzovZ2l0d2lwL1NQU2NyaXB0L3Rlc3QvcHJvZmlsZVRlc3RzLmpzIiwiYzovZ2l0d2lwL1NQU2NyaXB0L3Rlc3QvcXVlcnlTdHJpbmdUZXN0cy5qcyIsImM6L2dpdHdpcC9TUFNjcmlwdC90ZXN0L3NlYXJjaFRlc3RzLmpzIiwiYzovZ2l0d2lwL1NQU2NyaXB0L3Rlc3Qvd2ViVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vY2hhLnNldHVwKCdiZGQnKTtcclxuY2hhaS5zaG91bGQoKTtcclxuXHJcbmRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhb1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnRpbWVvdXQoMTAwMDApO1xyXG4gICAgdmFyIHVybCA9IF9zcFBhZ2VDb250ZXh0SW5mby53ZWJBYnNvbHV0ZVVybDtcclxuICAgIHZhciBkYW8gPSBuZXcgU1BTY3JpcHQuUmVzdERhbyh1cmwpO1xyXG5cclxuICAgIHZhciB3ZWJUZXN0cyA9IHJlcXVpcmUoXCIuL3dlYlRlc3RzXCIpO1xyXG4gICAgd2ViVGVzdHMucnVuKGRhbyk7XHJcbiAgICBcclxuICAgIHZhciBsaXN0VGVzdHMgPSByZXF1aXJlKFwiLi9saXN0VGVzdHNcIik7XHJcbiAgICBsaXN0VGVzdHMucnVuKGRhbyk7XHJcblxyXG4gICAgdmFyIHNlYXJjaFRlc3RzID0gcmVxdWlyZShcIi4vc2VhcmNoVGVzdHNcIik7XHJcbiAgICBzZWFyY2hUZXN0cy5ydW4oZGFvKTtcclxuXHJcbiAgICB2YXIgcHJvZmlsZVRlc3RzID0gcmVxdWlyZShcIi4vcHJvZmlsZVRlc3RzXCIpO1xyXG4gICAgcHJvZmlsZVRlc3RzLnJ1bihkYW8pO1xyXG4gICAgXHJcbiAgICB2YXIgZmlsZVRlc3RzID0gcmVxdWlyZShcIi4vZmlsZVRlc3RzXCIpO1xyXG4gICAgZmlsZVRlc3RzLnJ1bihkYW8pO1xyXG59KTtcclxuXHJcbnZhciBxdWVyeVN0cmluZ1Rlc3RzID0gcmVxdWlyZShcIi4vcXVlcnlTdHJpbmdUZXN0c1wiKTtcclxucXVlcnlTdHJpbmdUZXN0cy5ydW4oKTtcclxuXHJcbm1vY2hhLnJ1bigpOyIsImV4cG9ydHMucnVuID0gZnVuY3Rpb24oZGFvKSB7XHJcblx0dmFyIGZvbGRlclBhdGggPSBcIi9MaXN0cy9UZXN0TGlicmFyeVwiO1xyXG5cdGRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhby5nZXRGb2xkZXIoc2VydmVyUmVsYXRpdmVVcmwpXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZm9sZGVyID0gbnVsbDtcclxuICAgICAgICBiZWZvcmUoZnVuY3Rpb24gKGRvbmUpIHtcclxuICAgICAgICAgICAgZGFvLmdldEZvbGRlcihmb2xkZXJQYXRoKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuXHRcdFx0XHRmb2xkZXIgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhmb2xkZXIpO1xyXG4gICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdChcIlNob3VsZCByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSBmb2xkZXIgd2l0aCBmaWxlcyBhbmQgZm9sZGVyc1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZvbGRlci5zaG91bGQuYmUuYW4oXCJvYmplY3RcIik7XHJcbiAgICAgICAgICAgIGZvbGRlci5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIm5hbWVcIik7XHJcbiAgICAgICAgICAgIGZvbGRlci5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcInNlcnZlclJlbGF0aXZlVXJsXCIpO1xyXG4gICAgICAgICAgICBmb2xkZXIuc2hvdWxkLmhhdmUucHJvcGVydHkoXCJmaWxlc1wiKTtcclxuICAgICAgICAgICAgZm9sZGVyLmZpbGVzLnNob3VsZC5iZS5hbihcImFycmF5XCIpO1xyXG4gICAgICAgICAgICBmb2xkZXIuc2hvdWxkLmhhdmUucHJvcGVydHkoXCJmb2xkZXJzXCIpO1xyXG4gICAgICAgICAgICBmb2xkZXIuZm9sZGVycy5zaG91bGQuYmUuYW4oXCJhcnJheVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59OyIsImV4cG9ydHMucnVuID0gZnVuY3Rpb24gKGRhbykge1xyXG5cdGRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhby5saXN0cygpXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmVzdWx0cyA9IG51bGw7XHJcbiAgICAgICAgYmVmb3JlKGZ1bmN0aW9uKGRvbmUpe1xyXG4gICAgICAgICAgICBkYW8ubGlzdHMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0cyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICBkb25lKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBhcnJheSBvZiBsaXN0c1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdHMuc2hvdWxkLmJlLmFuKFwiYXJyYXlcIik7XHJcbiAgICAgICAgICAgIHJlc3VsdHMuc2hvdWxkLm5vdC5iZS5lbXB0eTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdChcIlNob3VsZCBicmluZyBiYWNrIGxpc3QgaW5mbyBsaWtlIFRpdGxlLCBJdGVtQ291bnQsIGFuZCBMaXN0SXRlbUVudGl0eVR5cGVGdWxsTmFtZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBmaXJzdEl0ZW0gPSByZXN1bHRzWzBdO1xyXG4gICAgICAgICAgICBmaXJzdEl0ZW0uc2hvdWxkLmhhdmUucHJvcGVydHkoXCJUaXRsZVwiKTtcclxuICAgICAgICAgICAgZmlyc3RJdGVtLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiSXRlbUNvdW50XCIpO1xyXG4gICAgICAgICAgICBmaXJzdEl0ZW0uc2hvdWxkLmhhdmUucHJvcGVydHkoXCJMaXN0SXRlbUVudGl0eVR5cGVGdWxsTmFtZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhby5saXN0cyhsaXN0bmFtZSlcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBsaXN0ID0gZGFvLmxpc3RzKFwiVGVzdExpc3RcIik7XHJcbiAgICAgICAgZGVzY3JpYmUoXCJTUFNjcmlwdC5SZXN0RGFvLmxpc3RzKGxpc3RuYW1lKS5pbmZvKClcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbGlzdEluZm8gPSBudWxsO1xyXG4gICAgICAgICAgICBiZWZvcmUoZnVuY3Rpb24gKGRvbmUpIHtcclxuICAgICAgICAgICAgICAgIGxpc3QuaW5mbygpLnRoZW4oZnVuY3Rpb24gKGluZm8pIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0SW5mbyA9IGluZm87XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpdChcIlNob3VsZCByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gbGlzdCBpbmZvXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGxpc3RJbmZvLnNob3VsZC5iZS5hbihcIm9iamVjdFwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIGJyaW5nIGJhY2sgbGlzdCBpbmZvIGxpa2UgVGl0bGUsIEl0ZW1Db3VudCwgYW5kIExpc3RJdGVtRW50aXR5VHlwZUZ1bGxOYW1lXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGxpc3RJbmZvLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiVGl0bGVcIik7XHJcbiAgICAgICAgICAgICAgICBsaXN0SW5mby5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIkl0ZW1Db3VudFwiKTtcclxuICAgICAgICAgICAgICAgIGxpc3RJbmZvLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiTGlzdEl0ZW1FbnRpdHlUeXBlRnVsbE5hbWVcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZShcIlNQU2NyaXB0LlJlc3REYW8ubGlzdHMobGlzdG5hbWUpLmdldEl0ZW1zKClcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgaXRlbXMgPSBudWxsO1xyXG4gICAgICAgICAgICBiZWZvcmUoZnVuY3Rpb24gKGRvbmUpIHtcclxuICAgICAgICAgICAgICAgIGxpc3QuZ2V0SXRlbXMoKS50aGVuKGZ1bmN0aW9uIChyZXN1bHRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSByZXN1bHRzO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBhcnJheSBvZiBpdGVtc1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtcy5zaG91bGQuYmUuYW4oXCJhcnJheVwiKTtcclxuICAgICAgICAgICAgICAgIGl0ZW1zLnNob3VsZC5ub3QuYmUuZW1wdHk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpdChcIlNob3VsZCByZXR1cm4gYWxsIHRoZSBpdGVtcyBpbiB0aGUgbGlzdFwiLCBmdW5jdGlvbiAoZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdC5pbmZvKCkudGhlbihmdW5jdGlvbiAobGlzdEluZm8pIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtcy5sZW5ndGguc2hvdWxkLmVxdWFsKGxpc3RJbmZvLkl0ZW1Db3VudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZShcIlNQU2NyaXB0LlJlc3REYW8ubGlzdHMobGlzdG5hbWUpLmdldEl0ZW1CeUlkKGlkKVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gbnVsbDtcclxuICAgICAgICAgICAgdmFyIHZhbGlkSWQgPSAtMTtcclxuICAgICAgICAgICAgYmVmb3JlKGZ1bmN0aW9uIChkb25lKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0LmdldEl0ZW1zKClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoYWxsSXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRJZCA9IGFsbEl0ZW1zWzBdLklkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsaWRJZDtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdC5nZXRJdGVtQnlJZChpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0gPSByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIHNpbmdsZSBpdGVtXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uc2hvdWxkLmJlLmFuKFwib2JqZWN0XCIpO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIlRpdGxlXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmVzb2x2ZSBhbiBpdGVtIHdpdGggYSBtYXRjaGluZyBJRFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiSWRcIik7XHJcbiAgICAgICAgICAgICAgICBpdGVtLklkLnNob3VsZC5lcXVhbCh2YWxpZElkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhby5saXN0cyhsaXN0bmFtZSkuZ2V0SXRlbXMob2RhdGEpIC0gT0RhdGEgc3VwcG9ydFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vR2V0IGl0ZW1zIHdoZXJlIEJvb2xDb2x1bW4gPT0gVFJVRVxyXG4gICAgICAgICAgICB2YXIgb2RhdGEgPSBcIiRmaWx0ZXI9Qm9vbENvbHVtbiBlcSAxXCI7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IG51bGw7XHJcbiAgICAgICAgICAgIGJlZm9yZShmdW5jdGlvbiAoZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdC5nZXRJdGVtcyhvZGF0YSkudGhlbihmdW5jdGlvbiAocmVzdWx0cykge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gcmVzdWx0cztcclxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBhcnJheSBvZiBpdGVtc1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtcy5zaG91bGQuYmUuYW4oXCJhcnJheVwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBvbmx5IGl0ZW1zIHRoYXQgbWF0Y2ggdGhlIE9EYXRhIHBhcmFtc1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIkJvb2xDb2x1bW5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5Cb29sQ29sdW1uLnNob3VsZC5iZS50cnVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZShcIlNQU2NyaXB0LlJlc3REYW8ubGlzdHMobGlzdG5hbWUpLmZpbmRJdGVtcyhrZXksIHZhbHVlKVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXRjaGVzID0gbnVsbDtcclxuICAgICAgICAgICAgYmVmb3JlKGZ1bmN0aW9uIChkb25lKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0LmZpbmRJdGVtcyhcIkJvb2xDb2x1bW5cIiwgMSkudGhlbihmdW5jdGlvbiAocmVzdWx0cykge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZXMgPSByZXN1bHRzO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIGFycmF5IG9mIGxpc3QgaXRlbXNcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hlcy5zaG91bGQuYmUuYW4oXCJhcnJheVwiKTtcclxuICAgICAgICAgICAgICAgIG1hdGNoZXMuc2hvdWxkLm5vdC5iZS5lbXB0eTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIG9ubHkgYnJpbmcgYmFjayBpdGVtcyB0aGUgbWF0Y2ggdGhlIGtleSB2YWx1ZSBxdWVyeVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBtYXRjaGVzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiQm9vbENvbHVtblwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLkJvb2xDb2x1bW4uc2hvdWxkLmJlLnRydWU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHN1cHBvcnQgc3RyaW5nIGZpbHRlcnNcIiwgZnVuY3Rpb24gKGRvbmUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdHJpbmdWYWx1ZSA9IFwiUmVxdWlyZWQgZGF0YVwiO1xyXG4gICAgICAgICAgICAgICAgbGlzdC5maW5kSXRlbXMoXCJSZXF1aXJlZENvbHVtblwiLCBzdHJpbmdWYWx1ZSkudGhlbihmdW5jdGlvbiAoaXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtcy5zaG91bGQuYmUuYW4oXCJhcnJheVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtcy5zaG91bGQubm90LmJlLmVtcHR5O1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIlJlcXVpcmVkQ29sdW1uXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLlJlcXVpcmVkQ29sdW1uLnNob3VsZC5lcXVhbChzdHJpbmdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgc3VwcG9ydCBudW1iZXIgKGFuZCBib29sKSBmaWx0ZXJzXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vZmlyc3QgMiB0ZXN0cyB0ZXN0IHRoaXNcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkZXNjcmliZShcIlNQU2NyaXB0LlJlc3REYW8ubGlzdHMobGlzdG5hbWUpLmZpbmRJdGVtKGtleSwgdmFsdWUpXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG1hdGNoID0gbnVsbDtcclxuICAgICAgICAgICAgYmVmb3JlKGZ1bmN0aW9uIChkb25lKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0LmZpbmRJdGVtKFwiQm9vbENvbHVtblwiLCAxKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHJlc29sdmUgdG8gb25lIGxpc3QgaXRlbVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBtYXRjaC5zaG91bGQuYmUuYW4oXCJvYmplY3RcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpdChcIlNob3VsZCBvbmx5IGJyaW5nIGJhY2sgYW4gaXRlbSBpZiBpdCBtYXRjaGVzIHRoZSBrZXkgdmFsdWUgcXVlcnlcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgbWF0Y2guc2hvdWxkLmhhdmUucHJvcGVydHkoXCJCb29sQ29sdW1uXCIpO1xyXG4gICAgICAgICAgICAgICAgbWF0Y2guQm9vbENvbHVtbi5zaG91bGQuYmUudHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhby5saXN0cyhsaXN0bmFtZSkuYWRkSXRlbSgpXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBcdHZhciBuZXdJdGVtID0ge1xyXG4gICAgICAgIFx0XHRUaXRsZTogXCJUZXN0IENyZWF0ZWQgSXRlbVwiLFxyXG4gICAgICAgIFx0XHRNeUNvbHVtbjogXCJJbnNlcnRlZCBmcm9tIE1vY2hhIHRlc3RcIixcclxuICAgICAgICBcdFx0UmVxdWlyZWRDb2x1bW46IFwiVGhpcyBmaWVsZCBpcyByZXF1aXJlZFwiLFxyXG4gICAgICAgIFx0XHRCb29sQ29sdW1uOiBcIlRydWVcIlxyXG4gICAgICAgIFx0fTtcclxuICAgICAgICBcdHZhciBpbnNlcnRlZEl0ZW0gPSBudWxsO1xyXG4gICAgICAgIFx0YmVmb3JlKGZ1bmN0aW9uKGRvbmUpe1xyXG4gICAgICAgIFx0XHRsaXN0LmFkZEl0ZW0obmV3SXRlbSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xyXG4gICAgICAgIFx0XHRcdGluc2VydGVkSXRlbSA9IHJlc3VsdDtcclxuICAgICAgICBcdFx0XHRkb25lKCk7XHJcbiAgICAgICAgXHRcdH0pLmZhaWwoZnVuY3Rpb24oZXJyb3Ipe1xyXG4gICAgICAgIFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICBcdFx0XHRkb25lKCk7XHJcbiAgICAgICAgXHRcdH0pO1xyXG4gICAgICAgIFx0fSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBuZXcgbGlzdCBpdGVtXCIsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIFx0aW5zZXJ0ZWRJdGVtLnNob3VsZC5ub3QuYmUubnVsbDtcclxuICAgICAgICAgICAgXHRpbnNlcnRlZEl0ZW0uc2hvdWxkLmJlLmFuKFwib2JqZWN0XCIpO1xyXG4gICAgICAgICAgICBcdGluc2VydGVkSXRlbS5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIklkXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgc2F2ZSB0aGUgaXRlbSByaWdodCBhd2F5IHNvIGl0IGNhbiBiZSBxdWVyaWVkLlwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgXHRsaXN0LmdldEl0ZW1CeUlkKGluc2VydGVkSXRlbS5JZCkudGhlbihmdW5jdGlvbihmb3VuZEl0ZW0pe1xyXG4gICAgICAgICAgICBcdFx0Zm91bmRJdGVtLnNob3VsZC5ub3QuYmUubnVsbDtcclxuICAgICAgICAgICAgXHRcdGZvdW5kSXRlbS5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIlRpdGxlXCIpO1xyXG4gICAgICAgICAgICBcdFx0Zm91bmRJdGVtLlRpdGxlLnNob3VsZC5lcXVhbChuZXdJdGVtLlRpdGxlKTtcclxuICAgICAgICAgICAgXHR9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiBcdFx0XHRpdChcIlNob3VsZCB0aHJvdyBhbiBlcnJvciBpZiBhIGludmFsaWQgZmllbGQgaXMgc2V0XCIsIGZ1bmN0aW9uKGRvbmUpIHtcclxuICAgICAgICAgICAgXHRuZXdJdGVtLkludmFsaWRDb2x1bW4gPSBcInRlc3RcIjtcclxuICAgICAgICAgICAgXHRsaXN0LmFkZEl0ZW0obmV3SXRlbSlcclxuICAgICAgICAgICAgXHQudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBcdFx0Ly9zdXBwb3NlZCB0byBmYWlsXHJcbiAgICAgICAgICAgIFx0XHQoXCJvbmVcIikuc2hvdWxkLmVxdWFsKFwidHdvXCIpO1xyXG4gICAgICAgICAgICBcdH0pXHJcbiAgICAgICAgICAgIFx0LmZhaWwoZnVuY3Rpb24oeGhyLCBzdGF0dXMsIG1zZyl7XHJcbiAgICAgICAgICAgIFx0XHRjb25zb2xlLmxvZyhtc2cpO1xyXG4gICAgICAgICAgICBcdFx0Y29uc29sZS5sb2coeGhyLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgIFx0XHR4aHIucmVzcG9uc2VUZXh0LnNob3VsZC5iZS5hKFwic3RyaW5nXCIpO1xyXG4gICAgICAgICAgICBcdFx0ZG9uZSgpO1xyXG4gICAgICAgICAgICBcdH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoXCJTUFNjcmlwdC5SZXN0RGFvLmxpc3RzKGxpc3RuYW1lKS5kZWxldGVJdGVtKGlkKVwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBcdHZhciBpdGVtVG9EZWxldGUgPSBudWxsO1xyXG4gICAgICAgIFx0YmVmb3JlKGZ1bmN0aW9uKGRvbmUpe1xyXG4gICAgICAgIFx0XHRsaXN0LmdldEl0ZW1zKFwiJG9yZGVyYnk9SWRcIikudGhlbihmdW5jdGlvbihpdGVtcyl7XHJcbiAgICAgICAgXHRcdFx0aXRlbVRvRGVsZXRlID0gaXRlbXNbaXRlbXMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgXHRcdFx0cmV0dXJuIGxpc3QuZGVsZXRlSXRlbShpdGVtVG9EZWxldGUuSWQpO1xyXG4gICAgICAgIFx0XHR9KS50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHRcdFx0ZG9uZSgpO1xyXG4gICAgICAgIFx0XHR9KTtcclxuICAgICAgICBcdH0pO1xyXG4gICAgICAgIFx0aXQoXCJTaG91bGQgZGVsZXRlIHRoYXQgaXRlbVwiLCBmdW5jdGlvbihkb25lKSB7XHJcbiAgICAgICAgXHRcdGxpc3QuZ2V0SXRlbUJ5SWQoaXRlbVRvRGVsZXRlLklkKVxyXG4gICAgICAgIFx0XHRcdC50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHRcdFx0XHR0aHJvdyBcIlNob3VsZCBoYXZlIGZhaWxlZCBiZWNhdXNlIGl0ZW0gaGFzIGJlZW4gZGVsZXRlZFwiO1xyXG4gICAgICAgIFx0XHRcdH0pXHJcbiAgICAgICAgXHRcdFx0LmZhaWwoZnVuY3Rpb24oKXtcclxuICAgICAgICBcdFx0XHRcdGRvbmUoKTtcclxuICAgICAgICBcdFx0XHR9KTtcclxuICAgICAgICBcdH0pO1xyXG4gICAgICAgIFx0aXQoXCJTaG91bGQgcmVqZWN0IHRoZSBwcm9taXNlIGlmIHRoZSBpdGVtIGlkIGNhbiBub3QgYmUgZm91bmRcIiwgZnVuY3Rpb24oZG9uZSl7XHJcbiAgICAgICAgXHRcdGxpc3QuZGVsZXRlSXRlbSg5OTk5OTk5OSkudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgIFx0XHRcdHRocm93IFwiU2hvdWxkIGhhdmUgZmFpbGVkIGJlY2F1c2UgaWQgZG9lc250IGV4aXN0XCI7XHJcbiAgICAgICAgXHRcdH0pXHJcbiAgICAgICAgXHRcdC5mYWlsKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHRcdFx0ZG9uZSgpO1xyXG4gICAgICAgIFx0XHR9KVxyXG4gICAgICAgIFx0fSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhby5saXN0cyhsaXN0bmFtZSkudXBkYXRlSXRlbSgpXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBcdHZhciBpdGVtVG9VcGRhdGUgPSBudWxsO1xyXG4gICAgICAgIFx0dmFyIHVwZGF0ZXMgPSB7IFRpdGxlOiBcIlVwZGF0ZWQgVGl0bGVcIiB9O1xyXG4gICAgICAgIFx0YmVmb3JlKGZ1bmN0aW9uKGRvbmUpe1xyXG4gICAgICAgIFx0XHRsaXN0LmdldEl0ZW1zKFwiJG9yZGVyYnk9SWQgZGVzY1wiKS50aGVuKGZ1bmN0aW9uKGl0ZW1zKXtcclxuICAgICAgICBcdFx0XHRpdGVtVG9VcGRhdGUgPSBpdGVtc1tpdGVtcy5sZW5ndGggLSAxXTtcclxuICAgICAgICBcdFx0XHRkb25lKCk7XHJcbiAgICAgICAgXHRcdH0pO1xyXG4gICAgICAgIFx0fSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBhIHByb21pc2VcIiwgZnVuY3Rpb24oZG9uZSkge1xyXG4gICAgICAgICAgICBcdGxpc3QudXBkYXRlSXRlbShpdGVtVG9VcGRhdGUuSWQsIHVwZGF0ZXMpLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgXHRcdGRvbmUoKTtcclxuICAgICAgICAgICAgXHR9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHVwZGF0ZSBvbmx5IHRoZSBwcm9wZXJ0aWVzIHRoYXQgd2VyZSBwYXNzZWRcIiwgZnVuY3Rpb24oZG9uZSl7XHJcbiAgICAgICAgICAgIFx0bGlzdC5nZXRJdGVtQnlJZChpdGVtVG9VcGRhdGUuSWQpLnRoZW4oZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgXHRcdFx0aXRlbS5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIlRpdGxlXCIpO1xyXG4gICAgICAgIFx0XHRcdGl0ZW0uVGl0bGUuc2hvdWxkLmVxdWFsKHVwZGF0ZXMuVGl0bGUpO1xyXG4gICAgICAgIFx0XHRcdGl0ZW0uc2hvdWxkLmhhdmUucHJvcGVydHkoXCJSZXF1aXJlZENvbHVtblwiKTtcclxuICAgICAgICBcdFx0XHRpdGVtLlJlcXVpcmVkQ29sdW1uLnNob3VsZC5lcXVhbChpdGVtVG9VcGRhdGUuUmVxdWlyZWRDb2x1bW4pO1xyXG4gICAgICAgICAgICBcdFx0ZG9uZSgpO1xyXG4gICAgICAgICAgICBcdH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIGRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhby5saXN0cyhsaXN0bmFtZSkucGVybWlzc2lvbnMoKVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwZXJtaXNzaW9ucyA9IG51bGw7XHJcbiAgICAgICAgICAgIGJlZm9yZShmdW5jdGlvbiAoZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdC5wZXJtaXNzaW9ucygpLnRoZW4oZnVuY3Rpb24gKHByaXZzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBwcml2cztcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBlcm1pc3Npb246XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByaXZzKTtcclxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBhcnJheSBvZiBvYmplY3RzXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zLnNob3VsZC5iZS5hbihcImFycmF5XCIpO1xyXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMuc2hvdWxkLm5vdC5iZS5lbXB0eTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBvYmplY3RzIHRoYXQgZWFjaCBoYXZlIGEgbWVtYmVyIGFuZCBhIHJvbGVzIGFycmF5XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zLmZvckVhY2goZnVuY3Rpb24gKHBlcm1pc3Npb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBwZXJtaXNzaW9uLnNob3VsZC5oYXZlLnByb3BlcnR5KFwibWVtYmVyXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb24uc2hvdWxkLmhhdmUucHJvcGVydHkoXCJyb2xlc1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBwZXJtaXNzaW9uLnJvbGVzLnNob3VsZC5iZS5hbihcImFycmF5XCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpdChcIlNob3VsZCByZXR1cm4gcGVybWlzc2lvbiBvYmplY3RzIHRoYXQgY29udGFpbiBtZW1iZXIubmFtZSwgbWVtYmVyLmxvZ2luLCBhbmQgbWVtYmVyLmlkXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zLmZvckVhY2goZnVuY3Rpb24gKHBlcm1pc3Npb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBwZXJtaXNzaW9uLm1lbWJlci5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIm5hbWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbi5tZW1iZXIuc2hvdWxkLmhhdmUucHJvcGVydHkoXCJsb2dpblwiKTtcclxuICAgICAgICAgICAgICAgICAgICBwZXJtaXNzaW9uLm1lbWJlci5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcImlkXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpdChcIlNob3VsZCByZXR1cm4gcGVybWlzc2lvbiBvYmplY3RzLCBlYWNoIHdpdGggYSByb2xlcyBhcnJheSB0aGF0IGhhcyBhIG5hbWUgYW5kIGRlc2NyaXB0aW9uXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zLmZvckVhY2goZnVuY3Rpb24gKHBlcm1pc3Npb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBwZXJtaXNzaW9uLnJvbGVzLmZvckVhY2goZnVuY3Rpb24gKHJvbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZS5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIm5hbWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGUuc2hvdWxkLmhhdmUucHJvcGVydHkoXCJkZXNjcmlwdGlvblwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxufTsiLCJleHBvcnRzLnJ1biA9IGZ1bmN0aW9uKGRhbykge1xyXG4gICAgdmFyIGVtYWlsID0gXCJhbmRyZXdAYW5kcmV3cGV0ZXJzZW4ub25taWNyb3NvZnQuY29tXCI7XHJcblx0ZGVzY3JpYmUoXCJTUFNjcmlwdC5SZXN0RGFvLnByb2ZpbGVzLmN1cnJlbnQoKVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHByb2ZpbGUgPSBudWxsO1xyXG4gICAgICAgIGJlZm9yZShmdW5jdGlvbiAoZG9uZSkge1xyXG4gICAgICAgICAgICBkYW8ucHJvZmlsZXMuY3VycmVudCgpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgcHJvZmlsZSA9IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgcHJvZmlsZSBwcm9wZXJ0aWVzIG9iamVjdFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHByb2ZpbGUuc2hvdWxkLmJlLmFuKFwib2JqZWN0XCIpO1xyXG4gICAgICAgICAgICBwcm9maWxlLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiQWNjb3VudE5hbWVcIik7XHJcbiAgICAgICAgICAgIHByb2ZpbGUuc2hvdWxkLmhhdmUucHJvcGVydHkoXCJFbWFpbFwiKTtcclxuICAgICAgICAgICAgcHJvZmlsZS5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIlByZWZlcnJlZE5hbWVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgIGRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhby5wcm9maWxlcy5nZXRCeUVtYWlsKGVtYWlsKVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHByb2ZpbGUgPSBudWxsO1xyXG4gICAgICAgIGJlZm9yZShmdW5jdGlvbiAoZG9uZSkge1xyXG4gICAgICAgICAgICBkYW8ucHJvZmlsZXMuZ2V0QnlFbWFpbChlbWFpbCkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBwcm9maWxlID0gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdChcIlNob3VsZCByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSBwcm9maWxlIHByb3BlcnRpZXMgb2JqZWN0XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcHJvZmlsZS5zaG91bGQuYmUuYW4oXCJvYmplY3RcIik7XHJcbiAgICAgICAgICAgIHByb2ZpbGUuc2hvdWxkLmhhdmUucHJvcGVydHkoXCJBY2NvdW50TmFtZVwiKTtcclxuICAgICAgICAgICAgcHJvZmlsZS5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIkVtYWlsXCIpO1xyXG4gICAgICAgICAgICBwcm9maWxlLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiUHJlZmVycmVkTmFtZVwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJTaG91bGQgZ2l2ZSB5b3UgdGhlIG1hdGNoaW5nIHBlcnNvblwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHByb2ZpbGUuc2hvdWxkLmhhdmUucHJvcGVydHkoXCJFbWFpbFwiKTtcclxuICAgICAgICAgICAgcHJvZmlsZS5FbWFpbC5zaG91bGQuZXF1YWwoZW1haWwpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdChcIlNob3VsZCByZWplY3QgdGhlIHByb21pc2UgZm9yIGFuIGludmFsaWQgZW1haWxcIiwgZnVuY3Rpb24gKGRvbmUpIHtcclxuICAgICAgICAgICAgZGFvLnByb2ZpbGVzLmdldEJ5RW1haWwoXCJpbnZhbGlkQGludmFsaWQxMjMuY29tXCIpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIChcIm9uZVwiKS5zaG91bGQuZXF1YWwoXCJ0d29cIik7XHJcbiAgICAgICAgICAgICAgICBkb25lKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKHhociwgc3RhdHVzLCBtc2cpIHtcclxuICAgICAgICAgICAgXHRjb25zb2xlLmxvZyh4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgXHR4aHIucmVzcG9uc2VUZXh0LnNob3VsZC5iZS5hKFwic3RyaW5nXCIpO1xyXG4gICAgICAgICAgICBcdGRvbmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgZGVzY3JpYmUoXCJTUFNjcmlwdC5SZXN0RGFvLnByb2ZpbGUuc2V0UHJvcGVydHkoYWNjb3VudE5hbWUsIHByb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZSlcIiwgZnVuY3Rpb24oKXtcclxuICAgICAgIGl0IChcIlNob3VsZCB1cGRhdGUgdGhlIEFib3V0IE1lIHByb2ZpbGUgcHJvcGVydHlcIiwgZnVuY3Rpb24oZG9uZSl7XHJcbiAgICAgICAgICB2YXIgYWJvdXRNZVZhbHVlID0gXCJIaSB0aGVyZS4gSSB3YXMgdXBkYXRlIHdpdGggU1BTY3JpcHRcIjtcclxuICAgICAgICAgIGRhby5wcm9maWxlcy5zZXRQcm9wZXJ0eShlbWFpbCwgXCJBYm91dE1lXCIsIGFib3V0TWVWYWx1ZSlcclxuICAgICAgICAgICAgLnRoZW4oZGFvLnByb2ZpbGVzLmN1cnJlbnQuYmluZChkYW8ucHJvZmlsZXMpKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihwcm9maWxlKXtcclxuICAgICAgICAgICAgICAgIHByb2ZpbGUuc2hvdWxkLmhhdmUucHJvcGVydHkoXCJBYm91dE1lXCIpO1xyXG4gICAgICAgICAgICAgICAgcHJvZmlsZS5BYm91dE1lLnNob3VsZC5lcXVhbChhYm91dE1lVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZhaWxlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpOyBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHZhciBsYW5ndWFnZUtleSA9IFwiU1BTLU1VSUxhbmd1YWdlc1wiO1xyXG4gICAgICAgICAgdmFyIGxhbmd1YWdlVmFsdWUgPSBcImVzLVVTLGVuLVVTXCI7XHJcbiAgICAgICAgICBkYW8ucHJvZmlsZXMuc2V0UHJvcGVydHkoZW1haWwsIGxhbmd1YWdlS2V5LCBsYW5ndWFnZVZhbHVlKTtcclxuICAgICAgIH0pOyBcclxuICAgIH0pO1xyXG59OyIsImV4cG9ydHMucnVuID0gZnVuY3Rpb24oKSB7XHJcblx0ZGVzY3JpYmUoXCJTUFNjcmlwdC5xdWVyeVN0cmluZ1wiLCBmdW5jdGlvbiAoKSB7XHJcblx0ICAgIHRoaXMudGltZW91dCg1MDAwKTtcclxuXHQgICAgdmFyIHFzID0gXCJrZXkxPXZhbHVlMSZrZXkyPXZhbHVlMiZrZXkzPXZhbHVlM1wiO1xyXG5cdCAgICBkZXNjcmliZShcIlNQU2NyaXB0LnF1ZXJ5U3RyaW5nLmNvbnRhaW5zKGtleSlcIiwgZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIHRoZSB0cnVlIGZvciBhIHZhbGlkIGtleVwiLCBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICAgICAgdmFyIGNvbnRhaW5zID0gU1BTY3JpcHQucXVlcnlTdHJpbmcuY29udGFpbnMoJ2tleTEnLCBxcyk7XHJcblx0ICAgICAgICAgICAgY29udGFpbnMuc2hvdWxkLmJlLnRydWU7XHJcblx0ICAgICAgICB9KTtcclxuXHQgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBmYWxzZSBmb3IgYW4gaW52YWxpZCBrZXlcIiwgZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgICAgIHZhciBjb250YWlucyA9IFNQU2NyaXB0LnF1ZXJ5U3RyaW5nLmNvbnRhaW5zKCdpbnZhbGlkS2V5JywgcXMpO1xyXG5cdCAgICAgICAgICAgIGNvbnRhaW5zLnNob3VsZC5iZS5mYWxzZTtcclxuXHQgICAgICAgIH0pO1xyXG5cdCAgICB9KTtcclxuXHQgICAgZGVzY3JpYmUoXCJTUFNjcmlwdC5xdWVyeVN0cmluZy5nZXRWYWx1ZShrZXkpXCIsIGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiB0aGUgdmFsdWUgb2YgYSB2YWxpZCBrZXlcIiwgZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgICAgIHZhciB2YWwgPSBTUFNjcmlwdC5xdWVyeVN0cmluZy5nZXRWYWx1ZShcImtleTFcIiwgcXMpO1xyXG5cdCAgICAgICAgICAgIHZhbC5zaG91bGQuZXF1YWwoXCJ2YWx1ZTFcIik7XHJcblx0ICAgICAgICB9KTtcclxuXHQgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBhbiBlbXB0eSBzdHJpbmcgZm9yIGFuIGludmFsaWQga2V5XCIsIGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgICAgICB2YXIgdmFsID0gU1BTY3JpcHQucXVlcnlTdHJpbmcuZ2V0VmFsdWUoXCJpbnZhbGlkS2V5XCIsIHFzKTtcclxuXHQgICAgICAgICAgICB2YWwuc2hvdWxkLmVxdWFsKFwiXCIpO1xyXG5cdCAgICAgICAgfSk7XHJcblx0ICAgIH0pO1xyXG5cdCAgICBkZXNjcmliZShcIlNQU2NyaXB0LnF1ZXJ5U3RyaW5nLmdldEFsbCgpXCIsIGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBhbiBvYmplY3Qgd2l0aCBxdWVyeXN0cmluZyBrZXlzIGFzIHByb3BlcnRpZXNcIiwgZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgICAgIHZhciB2YWx1ZXMgPSBTUFNjcmlwdC5xdWVyeVN0cmluZy5nZXRBbGwocXMpO1xyXG5cdCAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbHVlcyk7XHJcblx0ICAgICAgICAgICAgdmFsdWVzLnNob3VsZC5oYXZlLnByb3BlcnR5KCdrZXkxJyk7XHJcblx0ICAgICAgICAgICAgdmFsdWVzLmtleTEuc2hvdWxkLmVxdWFsKCd2YWx1ZTEnKTtcclxuXHQgICAgICAgICAgICB2YWx1ZXMuc2hvdWxkLmhhdmUucHJvcGVydHkoJ2tleTInKTtcclxuXHQgICAgICAgICAgICB2YWx1ZXMua2V5Mi5zaG91bGQuZXF1YWwoJ3ZhbHVlMicpO1xyXG5cdCAgICAgICAgICAgIHZhbHVlcy5zaG91bGQuaGF2ZS5wcm9wZXJ0eSgna2V5MycpO1xyXG5cdCAgICAgICAgICAgIHZhbHVlcy5rZXkzLnNob3VsZC5lcXVhbCgndmFsdWUzJyk7XHJcblx0ICAgICAgICB9KTtcclxuXHQgICAgfSk7XHJcblx0fSk7XHJcbn07IiwiZXhwb3J0cy5ydW4gPSBmdW5jdGlvbihkYW8pIHtcclxuXHRkZXNjcmliZShcIlNQU2NyaXB0LlJlc3REYW8uc2VhcmNoLnF1ZXJ5KHF1ZXJ5VGV4dClcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSBTZWFyY2hSZXN1bHRzIG9iamVjdFwiLCBmdW5jdGlvbiAoZG9uZSkge1xyXG4gICAgICAgICAgICB2YXIgcXVlcnlUZXh0ID0gXCJzZWVkXCI7XHJcbiAgICAgICAgICAgIGRhby5zZWFyY2gucXVlcnkocXVlcnlUZXh0KS50aGVuKGZ1bmN0aW9uIChzZWFyY2hSZXN1bHRzKSB7XHJcbiAgICAgICAgICAgICAgICBzZWFyY2hSZXN1bHRzLnNob3VsZC5iZS5hbihcIm9iamVjdFwiKTtcclxuICAgICAgICAgICAgICAgIHNlYXJjaFJlc3VsdHMuc2hvdWxkLmhhdmUucHJvcGVydHkoXCJyZXN1bHRzQ291bnRcIik7XHJcbiAgICAgICAgICAgICAgICBzZWFyY2hSZXN1bHRzLnNob3VsZC5oYXZlLnByb3BlcnR5KFwidG90YWxSZXN1bHRzXCIpO1xyXG4gICAgICAgICAgICAgICAgc2VhcmNoUmVzdWx0cy5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIml0ZW1zXCIpO1xyXG4gICAgICAgICAgICAgICAgc2VhcmNoUmVzdWx0cy5pdGVtcy5zaG91bGQuYmUuYW4oXCJhcnJheVwiKTtcclxuICAgICAgICAgICAgICAgIHNlYXJjaFJlc3VsdHMuaXRlbXMuc2hvdWxkLm5vdC5iZS5lbXB0eTtcclxuICAgICAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhby5zZWFyY2gucXVlcnkocXVlcnlUZXh0LCBxdWVyeU9wdGlvbnMpXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpdChcIlNob3VsZCByZXR1cm4gcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIGFycmF5IG9mIFNlYXJjaFJlc3VsdHNcIik7XHJcbiAgICAgICAgaXQoXCJTaG91bGQgb2JleSB0aGUgZXh0cmEgcXVlcnkgb3B0aW9ucyB0aGF0IHdlcmUgcGFzc2VkXCIpO1xyXG4gICAgfSk7XHJcbn07IiwiZXhwb3J0cy5ydW4gPSBmdW5jdGlvbihkYW8pIHtcclxuICAgIGRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhby53ZWJcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGRlc2NyaWJlKFwiU1BTY3JpcHQuUmVzdERhby53ZWIuaW5mbygpXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHdlYiBpbmZvXCIsIGZ1bmN0aW9uIChkb25lKSB7XHJcbiAgICAgICAgICAgICAgICBkYW8ud2ViLmluZm8oKS50aGVuKGZ1bmN0aW9uICh3ZWJJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2ViSW5mby5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcIlVybFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB3ZWJJbmZvLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiVGl0bGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZShcIlNQU2NyaXB0LlJlc3REYW8ud2ViLnN1YnNpdGVzKClcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpdChcIlNob3VsZCByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gYXJyYXkgb2Ygc3Vic2l0ZSB3ZWIgaW5mb3MuXCIsIGZ1bmN0aW9uIChkb25lKSB7XHJcbiAgICAgICAgICAgICAgICBkYW8ud2ViLnN1YnNpdGVzKCkudGhlbihmdW5jdGlvbiAoc3Vic2l0ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzaXRlcy5zaG91bGQuYmUuYW4oXCJhcnJheVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3Vic2l0ZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNpdGVzWzBdLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiVGl0bGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNpdGVzWzBdLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiU2VydmVyUmVsYXRpdmVVcmxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoXCJTUFNjcmlwdC5SZXN0RGFvLndlYi5wZXJtaXNzaW9ucygpXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHBlcm1pc3Npb25zID0gbnVsbDtcclxuICAgICAgICAgICAgYmVmb3JlKGZ1bmN0aW9uIChkb25lKSB7XHJcbiAgICAgICAgICAgICAgICBkYW8ud2ViLnBlcm1pc3Npb25zKCkudGhlbihmdW5jdGlvbiAocHJpdnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IHByaXZzO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGVybWlzc2lvbjpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJpdnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIGFycmF5IG9mIG9iamVjdHNcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMuc2hvdWxkLmJlLmFuKFwiYXJyYXlcIik7XHJcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5zaG91bGQubm90LmJlLmVtcHR5O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIG9iamVjdHMgdGhhdCBlYWNoIGhhdmUgYSBtZW1iZXIgYW5kIGEgcm9sZXMgYXJyYXlcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMuZm9yRWFjaChmdW5jdGlvbiAocGVybWlzc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb24uc2hvdWxkLmhhdmUucHJvcGVydHkoXCJtZW1iZXJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbi5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcInJvbGVzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb24ucm9sZXMuc2hvdWxkLmJlLmFuKFwiYXJyYXlcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBwZXJtaXNzaW9uIG9iamVjdHMgdGhhdCBjb250YWluIG1lbWJlci5uYW1lLCBtZW1iZXIubG9naW4sIGFuZCBtZW1iZXIuaWRcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMuZm9yRWFjaChmdW5jdGlvbiAocGVybWlzc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb24ubWVtYmVyLnNob3VsZC5oYXZlLnByb3BlcnR5KFwibmFtZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBwZXJtaXNzaW9uLm1lbWJlci5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcImxvZ2luXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb24ubWVtYmVyLnNob3VsZC5oYXZlLnByb3BlcnR5KFwiaWRcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KFwiU2hvdWxkIHJldHVybiBwZXJtaXNzaW9uIG9iamVjdHMsIGVhY2ggd2l0aCBhIHJvbGVzIGFycmF5IHRoYXQgaGFzIGEgbmFtZSBhbmQgZGVzY3JpcHRpb25cIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMuZm9yRWFjaChmdW5jdGlvbiAocGVybWlzc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb24ucm9sZXMuZm9yRWFjaChmdW5jdGlvbiAocm9sZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlLnNob3VsZC5oYXZlLnByb3BlcnR5KFwibmFtZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZS5zaG91bGQuaGF2ZS5wcm9wZXJ0eShcImRlc2NyaXB0aW9uXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZShcIlNQU2NyaXB0LlJlc3REYW8ud2ViLnBlcm1pc3Npb25zKGVtYWlsKVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwZXJtaXNzaW9ucyA9IG51bGw7XHJcbiAgICAgICAgICAgIHZhciBlbWFpbCA9IFwiYW5kcmV3QGFuZHJld3BldGVyc2VuLm9ubWljcm9zb2Z0LmNvbVwiXHJcbiAgICAgICAgICAgIGJlZm9yZShmdW5jdGlvbiAoZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgZGFvLndlYi5wZXJtaXNzaW9ucyhlbWFpbCkudGhlbihmdW5jdGlvbiAocHJpdnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IHByaXZzO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoXCJTaG91bGQgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIGFycmF5IG9mIGJhc2UgcGVybWlzc2lvbiBzdHJpbmdzXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zLnNob3VsZC5iZS5hbihcImFycmF5XCIpO1xyXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMuc2hvdWxkLm5vdC5iZS5lbXB0eTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdChcIlNob3VsZCByZWplY3QgdGhlIHByb21pc2UgZm9yIGFuIGludmFsaWQgZW1haWxcIiwgZnVuY3Rpb24gKGRvbmUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBkYW8ud2ViLnBlcm1pc3Npb25zKFwiaW52YWxpZEBpbnZhbGlkMTIzLmNvbVwiKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHByaXZzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKFwib25lXCIpLnNob3VsZC5lcXVhbChcInR3b1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XHJcbiAgICAgICAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnJvcil7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHhoci5yZXNwb25zZVRleHQpXHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcbiAgICBcclxuIl19
