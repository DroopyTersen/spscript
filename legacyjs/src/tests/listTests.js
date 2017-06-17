var permissionsTests = require("./permissionsTests.js");
var utils = require("../../lib/utils");

exports.run = function(dao) {
    describe("dao.lists()", function() {
        this.timeout(10000);
        var results = null;
        before(function(done) {
            dao.lists().then(function(data) {
                results = data;
                done();
            });
        });
        it("Should return a promise that resolves to an array of lists", function() {
            results.should.be.an("array");
            results.should.not.be.empty;
        });
        it("Should bring back list info like Title, ItemCount, and ListItemEntityTypeFullName", function() {
            var firstItem = results[0];
            firstItem.should.have.property("Title");
            firstItem.should.have.property("ItemCount");
            firstItem.should.have.property("ListItemEntityTypeFullName");
        });
    });

    describe("var list = SPScript.RestDao.lists(listname)", function() {
        this.timeout(10000);
        var list = dao.lists("TestList");
        describe("list.info()", function() {
            var listInfo = null;
            before(function(done) {
                list.info().then(function(info) {
                    listInfo = info;
                    done();
                });
            });
            it("Should return a promise that resolves to list info", function() {
                listInfo.should.be.an("object");
            });
            it("Should bring back list info like Title, ItemCount, and ListItemEntityTypeFullName", function() {
                listInfo.should.have.property("Title");
                listInfo.should.have.property("ItemCount");
                listInfo.should.have.property("ListItemEntityTypeFullName");
            });
        });

        describe("list.getItems()", function() {
            var items = null;
            before(function(done) {
                list.getItems().then(function(results) {
                    items = results;
                    done();
                });
            });

            it("Should return a promise that resolves to an array of items", function() {
                items.should.be.an("array");
            });

            it("Should return all the items in the list", function(done) {
                list.info().then(function(listInfo) {
                    items.length.should.equal(listInfo.ItemCount);
                    done();
                });
            });
        });

        describe("list.getItems(odata)", function() {
            //Get items where BoolColumn == TRUE
            var odata = "$filter=MyStatus eq 'Green'";
            var items = null;
            before(function(done) {
                list.getItems(odata).then(function(results) {
                    items = results;
                    done();
                });
            });
            it("Should return a promise that resolves to an array of items", function() {
                items.should.be.an("array");
            });
            it("Should return only items that match the OData params", function() {
                items.forEach(function(item) {
                    item.should.have.property("MyStatus");
                    item.MyStatus.should.equal("Green");
                });
            });
        });

        describe("list.getItemById(id)", function() {
            var item = null;
            var validId = -1;
            before(function(done) {
                list.getItems()
                    .then(function(allItems) {
                        validId = allItems[0].Id;
                        return validId;
                    })
                    .then(function(id) {
                        return list.getItemById(id);
                    })
                    .then(function(result) {
                        item = result;
                        done();
                    });
            });
            it("Should return a promise that resolves to a single item", function() {
                item.should.be.an("object");
                item.should.have.property("Title");
            });
            it("Should resolve an item with a matching ID", function() {
                item.should.have.property("Id");
                item.Id.should.equal(validId);
            });
            it("Should be able to return attachments using the optional odata query", function(done) {
                list.getItemById(validId, "$expand=AttachmentFiles").then(function(item) {
                    item.should.have.property("AttachmentFiles");
                    item.AttachmentFiles.should.have.property("results");
                    item.AttachmentFiles.results.should.be.an("Array");
                    done();
                })
            })
        });

        describe("list.findItems(key, value)", function() {
            var matches = null;
            before(function(done) {
                list.findItems("MyStatus", "Green").then(function(results) {
                    matches = results;
                    done();
                });
            });
            it("Should return a promise that resolves to an array of list items", function() {
                matches.should.be.an("array");
                matches.should.not.be.empty;
            });
            it("Should only bring back items the match the key value query", function() {
                matches.forEach(function(item) {
                    item.should.have.property("MyStatus");
                    item.MyStatus.should.equal("Green");
                });
            });
        });
        describe("list.findItem(key, value)", function() {
            var match = null;
            before(function(done) {
                list.findItem("MyStatus", "Green").then(function(result) {
                    match = result;
                    done();
                });
            });
            it("Should resolve to one list item", function() {
                match.should.be.an("object");
            });
            it("Should only bring back an item if it matches the key value query", function() {
                match.should.have.property("MyStatus");
                match.MyStatus.should.equal("Green");
            });
        });

        describe("list.addItem()", function() {
            var newItem = {
                Title: "Test Created Item",
                MyStatus: "Red"
            };
            var insertedItem = null;
            before(function(done) {
                list.addItem(newItem).then(function(result) {
                    insertedItem = result;
                    done();
                }).catch(function(error) {
                    console.log(error);
                    done();
                });
            });
            it("Should return a promise that resolves with the new list item", function() {
                insertedItem.should.not.be.null;
                insertedItem.should.be.an("object");
                insertedItem.should.have.property("Id");
            });
            it("Should save the item right away so it can be queried.", function() {
                list.getItemById(insertedItem.Id).then(function(foundItem) {
                    foundItem.should.not.be.null;
                    foundItem.should.have.property("Title");
                    foundItem.Title.should.equal(newItem.Title);
                });
            });
            it("Should throw an error if a invalid field is set", function(done) {
                newItem.InvalidColumn = "test";
                list.addItem(newItem)
                    .then(function() {
                        //supposed to fail
                        ("one").should.equal("two");
                    })
                    .catch(function(xhr, status, msg) {
                        done();
                    });
            });
        });

        var itemIdWithAttachment = null;
        var attachmentFilename = "testAttachment.txt";
        var attachmentContent = "test content";

        describe("list.addAttachment(id, filename, content)", function() {

            before(function(done) {
                list.getItems("$orderby=Id").then(function(items) {
                    itemIdWithAttachment = items[items.length - 1].Id;
                    return list.addAttachment(itemIdWithAttachment, attachmentFilename, attachmentContent);
                }).then(function() {
                    done();
                });
            });
            it("Should add an attachment file to the list item", function(done) {
                list.getItemById(itemIdWithAttachment, "$expand=AttachmentFiles").then(function(item){
                    item.should.have.property('AttachmentFiles');
                    item.AttachmentFiles.should.have.property('results');
                    item.AttachmentFiles.results.should.be.an('Array');
                    item.AttachmentFiles.results.should.not.be.empty;
                    done();
                });
            })
        });

        describe("list.deleteAttachment(id, filename)", function() {
            var getAttachment = function(id, filename) {
                return list.getItemById(itemIdWithAttachment, "$expand=AttachmentFiles").then(function(item){
                    var attachments = item.AttachmentFiles.results;
                    return attachments.find(function(a) { return a.FileName === attachmentFilename});
                });
            };
            before(function(done) {
                getAttachment(itemIdWithAttachment, attachmentFilename).then(function(attachment) {
                    if (attachment) {
                        return list.deleteAttachment(itemIdWithAttachment, attachmentFilename);
                    }
                    return false;
                }).then(function(){
                    done();
                }).catch(function(res) { 
                    done();
                    console.log("REQUEST ERROR")
                });
            });
            it("Should delete the attachment", function(done) {
                getAttachment(itemIdWithAttachment, attachmentFilename).then(function(attachment) {
                    if (attachment) ("attachment").should.equal("null");
                    done();
                });
            })
        });

        describe("list.deleteItem(id)", function() {
            var itemToDelete = null;
            before(function(done) {
                list.getItems("$orderby=Id").then(function(items) {
                    itemToDelete = items[items.length - 1];
                    return list.deleteItem(itemToDelete.Id);
                }).then(function() {
                    done();
                });
            });
            it("Should delete that item", function(done) {
                list.getItemById(itemToDelete.Id)
                    .then(function() {
                        throw "Should have failed because item has been deleted";
                    })
                    .catch(function() {
                        done();
                    });
            });
            it("Should reject the promise if the item id can not be found", function(done) {
                list.deleteItem(99999999).then(function() {
                        throw "Should have failed because id doesnt exist";
                    })
                    .catch(function() {
                        done();
                    })
            });
        });

        describe("list.updateItem()", function() {
            var itemToUpdate = null;
            var updates = {
                Title: "Updated Title"
            };
            before(function(done) {
                list.getItems("$orderby=Id desc").then(function(items) {
                    itemToUpdate = items[items.length - 1];
                    done();
                });
            });
            it("Should return a promise", function(done) {
                list.updateItem(itemToUpdate.Id, updates).then(function() {
                    done();
                });
            });
            it("Should update only the properties that were passed", function(done) {
                list.getItemById(itemToUpdate.Id).then(function(item) {
                    item.should.have.property("Title");
                    item.Title.should.equal(updates.Title);
                    done();
                });
            });
        });

        describe("list.permissions.getRoleAssignments()", permissionsTests.create(list));

        if (utils.isBrowser()) {
            describe("list.permissions.check()", permissionsTests.create(list, "check"));
        }

        describe("list.permissions.check(email)", permissionsTests.create(list, "check", "andrew@andrewpetersen.onmicrosoft.com"))

    });
};