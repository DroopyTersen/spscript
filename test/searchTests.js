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