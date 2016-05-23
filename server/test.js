var ServerDao = require("./serverDao");
var config = require("../app.config");

describe('ServerDao', function () {
    var dao = new ServerDao(config.spSiteUrl, config.clientKey, config.clientSecret);
    describe('var dao = new ServerDao(url, clientId, clientSecret)', function () {
        it('should return an object with web, search, lists etc...', function () {
            dao.should.have.property("web");
            dao.should.have.property("search");
            dao.should.have.property("web");
            dao.should.have.property("profiles");
            dao.should.have.property("lists");
            dao.lists.should.be.a("function");
            dao.should.have.property("get");
            dao.get.should.be.a("function");
            dao.should.have.property("post");
            dao.post.should.be.a("function");
        });
    });
    
    var webTests = require("../src/tests/webTests");
    webTests.run(dao);

    var listTests = require("../src/tests/listTests");
    listTests.run(dao);
    
    // var profileTests = require("../src/tests/profileTests");
    // profileTests.run(dao);
    
    var searchTests = require("../src/tests/searchTests");
    searchTests.run(dao);
    
});