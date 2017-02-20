var promisePolyfill = require("es6-promise");
if (!global.Promise) {
    global.Promise = promisePolyfill;
}

mocha.setup('bdd');
chai.should();

var url = _spPageContextInfo.webAbsoluteUrl;
var dao = new SPScript.RestDao(url);

describe("var dao = new SPScript.RestDao(_spPageContextInfo.webAbsoluteUrl)", function() {
    it("Should create the primary Data Access Objec (DAO) you use to interact with the site", function() {
        dao.should.not.be.null;
        dao.should.have.property("web");
        dao.should.have.property("lists");
        dao.should.have.property("search");
        dao.should.have.property("profiles");
    })
});

var webTests = require("./webTests");
webTests.run(dao);

// var customActionTests = require("./customActionTests");
// customActionTests.run(dao);

// var listTests = require("./listTests");
// listTests.run(dao);

// var searchTests = require("./searchTests");
// searchTests.run(dao);

// var profileTests = require("./profileTests");
// profileTests.run(dao);

// var utilsTests = require("./utilsTests");
// utilsTests.run();

mocha.run();