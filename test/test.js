var RestDao = require("../src/restDao");


mocha.setup('bdd');
chai.should();

var url = _spPageContextInfo.webAbsoluteUrl;
var dao = new RestDao(url);

describe("var dao = new SPScript.RestDao(_spPageContextInfo.webAbsoluteUrl)", function() {
    it("Should create the primary Data Access Objec (DAO) you use to interact with the site", function(){
        dao.should.not.be.null;
        dao.should.have.property("web");
        dao.should.have.property("lists");
    })
});

var webTests = require("./webTests");
webTests.run(dao);

var listTests = require("./listTests");
listTests.run(dao);

    // var searchTests = require("./searchTests");
    // searchTests.run(dao);

    // var profileTests = require("./profileTests");
    // profileTests.run(dao);

// var queryStringTests = require("./queryStringTests");
// queryStringTests.run();

mocha.run();