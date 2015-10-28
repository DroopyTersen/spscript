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