var should = require("chai").should();

exports.run = function(dao) {
    describe("var search = dao.search;", function() {
        this.timeout(5000);
        describe("search.query(queryText)", function() {
            it("Should return promise that resolves to a SearchResults object", function(done) {
                var queryText = "andrew";
                dao.search.query(queryText).then(function(searchResults) {
                    searchResults.should.be.an("object");
                    searchResults.should.have.property("resultsCount");
                    searchResults.should.have.property("totalResults");
                    searchResults.should.have.property("items");
                    searchResults.should.have.property("refiners");
                    searchResults.items.should.be.an("array");
                    searchResults.items.should.not.be.empty;
                    done();
                });
            });
        });

        describe("search.query(queryText, queryOptions)", function() {
            it("Should obey the extra query options that were passed", function(done) {
                var queryText = "andrew";
                var options = {
                    rowLimit: 1
                };
                dao.search.query(queryText, options).then(function(searchResults) {
                    searchResults.should.be.an("object");
                    searchResults.should.have.property("resultsCount");
                    searchResults.should.have.property("totalResults");
                    searchResults.should.have.property("items");
                    searchResults.should.have.property("refiners");
                    searchResults.items.should.be.an("array");
                    searchResults.items.should.not.be.empty;
                    searchResults.items.length.should.equal(1);
                    done();
                });
            });
        });

        describe("search.query(queryText, { refiners: ['Author'] }) - w/ Refiners", function() {
            it("Should return SearchResults that include a refiners array", function(done) {
                var refinerName = "InternalWriter";
                var queryText = "andrew";
                var options = {
                    refiners: refinerName
                };
                debugger;
                dao.search.query(queryText, options).then(function(searchResults) {
                    searchResults.should.be.an("object");
                    searchResults.should.have.property("refiners");
                    searchResults.refiners.should.not.be.empty;
                    var firstRefiner = searchResults.refiners[0];
                    firstRefiner.should.have.property("RefinerName");
                    firstRefiner.should.have.property("RefinerOptions");
                    firstRefiner.RefinerName.should.equal(refinerName);
                    firstRefiner.RefinerOptions.should.be.an("array");
                    done();
                });
            });
        });
        describe("search.people(queryText)", function() {
            it("Should only return search results that are people", function(done) {
                var queryText = "andrew";
                dao.search.people(queryText).then(function(searchResults) {
                    searchResults.should.be.an("object");
                    searchResults.should.have.property("items");
                    searchResults.items.should.be.an("array");
                    searchResults.items.should.not.be.empty;

                    var person = searchResults.items[0];
                    person.should.have.property("AccountName")
                    person.should.have.property("PreferredName")
                    person.should.have.property("AboutMe")
                    person.should.have.property("WorkEmail")
                    person.should.have.property("PictureURL")
                    done();
                })
            });
        });
    })

};