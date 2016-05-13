// var http = require('http');

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end("Hiya");
// }).listen(9615);

var ServerDao = require("./serverDao");
var config = {
    spLanguage: "en-us",
    clientKey: "bb0fade0-5336-40a1-857c-2a9f2946da83",
    clientSecret: "ehmNv5jEnHM5U9FaHEVuWBrRhpZg9ooOC+KELZRMYKU=",
    spSiteUrl: "https://andrewpetersen.sharepoint.com/spscript"
};

// dao.lists("TestList").getItems("$select=Title,Id").then(items => {
//     console.log(items);
// })
// var dao = new ServerDao(config.spSiteUrl, config.clientKey, config.clientSecret);
// var email = "andrew@andrewpetersen.onmicrosoft.com";
// var aboutMeValue = "Hi there. I was updated with SPScript";
// dao.profiles.setProperty(email, "AboutMe", aboutMeValue)
// dao.search.query("andrew").then(function(searchResults) {
//     console.log(searchResults);
// }).catch(res => {
//     console.log(res);
// })
// var should = require('chai').should();

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
    
    var profileTests = require("../src/tests/profileTests");
    profileTests.run(dao);
    
    var searchTests = require("../src/tests/searchTests");
    searchTests.run(dao);
    
});