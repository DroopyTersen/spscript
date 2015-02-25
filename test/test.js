mocha.setup('bdd');
chai.should();

describe("SPScript.RestDao", function () {
    this.timeout(10000);
    var url = _spPageContextInfo.webAbsoluteUrl;
    var dao = new SPScript.RestDao(url);

    describe("SPScript.RestDao.web", function () {
        describe("SPScript.RestDao.info()", function () {
            it("Should return a promise that resolves to web info", function (done) {
                dao.web.info().then(function (webInfo) {
                    webInfo.should.have.property("Url");
                    webInfo.should.have.property("Title");
                    done();
                });
            });
        });

        describe("SPScript.RestDao.subsites()", function () {
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

    });


    //dao.lists()
    //dao.lists(listname).info()
    //dao.lists(listname).items()
    //dao.lists(listname).items(odata)
    //dao.lists(listname).items.getById(id)
    //dao.lists(listname).items.add(item)
    //dao.lists(listname).items.update(id, updates)
    //dao.lists(listname).items.find(key, value)
    //dao.lists(listname).items.findOne(key, value)
    describe("SPScript.RestDao.lists()", function () {
        var results = null;
        before(function(done){
            dao.lists().then(function(data){
                results = data;
                done();
            })
        })
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
            })
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
            })

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
            })
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
            })
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
            })
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
                })
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
            })
            it("Should resolve to one list item", function () {
                match.should.be.an("object");
            });
            it("Should only bring back an item if it matches the key value query", function () {
                match.should.have.property("BoolColumn");
                match.BoolColumn.should.be.true;
            });
        });

        describe("SPScript.RestDao.lists(listname).addItem()", function () {
            it("Should return a promise that resolves with the new list item");
        });
        describe("SPScript.RestDao.lists(listname).updateItem()", function () {
            it("Should return a promise");
            it("Should update only the properties that were passed");
        });
    });
});

describe("SPScript.Search", function () {
    var url = _spPageContextInfo.webAbsoluteUrl;
    var search = new SPScript.Search(url);
    describe("SPScript.Search.query(queryText)", function () {
        it("Should return promise that resolves to a SearchResults object", function (done) {
            var queryText = "seed";
            search.query(queryText).then(function(searchResults) {
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
    describe("SPScript.Search.query(queryText, queryOptions)", function () {
        it("Should return promise that resolves to an array of SearchResults");
        it("Should obey the extra query options that were passed");
    });
});

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
mocha.run();