var should = require("chai").should();

exports.run = function (utils) {
  describe("var utils = SPScript.utils", function () {
    describe("utils.parseJSON(data)", function () {
      it("Should exist on the utils object", function () {
        utils.should.have.property("parseJSON");
        utils.parseJSON.should.be.a("function");
      });
      it("Should take a string or an object and return an object", function () {
        var obj = {
          one: "value of one",
          two: "value of two"
        };
        var jsonStr = JSON.stringify(obj);
        var res1 = utils.parseJSON(obj);
        res1.should.not.be.null;
        res1.should.have.property("one");
        res1.one.should.equal(obj.one);
        var res2 = utils.parseJSON(jsonStr);
        res2.should.not.be.null;
        res2.should.have.property("one");
        res2.one.should.equal(obj.one);
      });
    });
    describe("Query String", function () {
      describe("utils.qs.toObj(str)", function () {
        it("Should take in a string in the form of key=value&key2=value and return an Object", function () {
          var str1 = "key1=value1";
          var str2 = "key1=value1&key2=value2";
          var obj1 = utils.qs.toObj(str1);
          obj1.should.have.property("key1");
          obj1.key1.should.equal("value1");
          var obj2 = utils.qs.toObj(str2);
          obj2.should.have.property("key1");
          obj2.should.have.property("key2");
          obj2.key2.should.equal("value2");
        });
        it("Should support an optional leading '?' ", function () {
          var str1 = "?key1=value1";
          var obj1 = utils.qs.toObj(str1);
          obj1.should.have.property("key1");
          obj1.key1.should.equal("value1");
        });
        it("Should default to 'window.location.search' if no value is passed");
      });
      describe("utils.qs.fromObj(obj, quoteValues?)", function () {
        it("Should turn { key1: 'value1', key2: 'value2' } into 'key1=value1&key2=value2'", function () {
          var obj = {
            key1: "value1",
            key2: "value2"
          };
          var str = utils.qs.fromObj(obj);
          str.should.equal("key1=value1&key2=value2");
        });
        it("Should put single quotes around words with spaces", function () {
          var obj = {
            key1: "my value"
          };
          var str = utils.qs.fromObj(obj);
          str.should.equal("key1='my value'");
        });
        it("Should put single quotes around every value is an optional 'quoteValues' param is set to true", function () {
          var obj = {
            key1: "value1",
            key2: "value2"
          };
          var str = utils.qs.fromObj(obj, true);
          str.should.equal("key1='value1'&key2='value2'");
        });
      });
    });
    describe("Headers", function () {
      describe("utils.headers.getStandardHeaders(digest?)", function () {
        var jsonMimeType = "application/json;odata=verbose";
        it("Should set the Accept header", function () {
          var headers = utils.headers.getStandardHeaders();
          headers.should.have.property("Accept");
          headers.Accept.should.equal(jsonMimeType);
        });
        it("Should set the Request Digest if a digest is passed", function () {
          var digest = "123Fake";
          var headers = utils.headers.getStandardHeaders(digest);
          headers.should.have.property("Accept");
          headers.Accept.should.equal(jsonMimeType);
          headers.should.have.property("X-RequestDigest");
          headers["X-RequestDigest"].should.equal(digest);
        });
      });
      describe("utils.headers.getAddHeaders(digest)", function () {
        var jsonMimeType = "application/json;odata=verbose";
        it("Should set the Request Digest if a digest is passed", function () {
          var digest = "123Fake";
          var headers = utils.headers.getAddHeaders(digest);
          headers.should.have.property("Accept");
          headers.Accept.should.equal(jsonMimeType);
          headers.should.have.property("X-RequestDigest");
          headers["X-RequestDigest"].should.equal(digest);
        });
      });
      describe("utils.headers.getUpdateHeaders(digest)", function () {
        var jsonMimeType = "application/json;odata=verbose";
        it("Should set X-HTTP-Method to MERGE and include X-RequestDigest", function () {
          var digest = "123Fake";
          var headers = utils.headers.getUpdateHeaders(digest);
          headers.should.have.property("Accept");
          headers.Accept.should.equal(jsonMimeType);
          headers.should.have.property("X-RequestDigest");
          headers["X-RequestDigest"].should.equal(digest);
          headers.should.have.property("X-HTTP-Method");
          headers["X-HTTP-Method"].should.equal("MERGE");
        });
      });
      describe("utils.headers.getDeleteHeaders(digest)", function () {
        var jsonMimeType = "application/json;odata=verbose";
        it("Should set X-HTTP-Method to DELETE and include X-RequestDigest", function () {
          var digest = "123Fake";
          var headers = utils.headers.getDeleteHeaders(digest);
          headers.should.have.property("Accept");
          headers.Accept.should.equal(jsonMimeType);
          headers.should.have.property("X-RequestDigest");
          headers["X-RequestDigest"].should.equal(digest);
          headers.should.have.property("X-HTTP-Method");
          headers["X-HTTP-Method"].should.equal("DELETE");
        });
      });
    });
    describe("Dependency Management", function () {
      describe("utils.validateNamespace(namespace)", function () {
        it("Should return false if that namespace is not on global window");
        it("Should return true if that namespace is on global window");
      });
      describe("utils.waitForLibrary(namespace)", function () {
        it("Should return a promise that resolves when that namespace is on the global");
      });
      describe("utils.waitForLibraries(namespaces)", function () {
        it("Should return a promise that resolves when all the namespacea are on the global");
      });
      describe("utils.waitForElement(selector)", function () {
        it("Should return a promise that resolves an element that matches the selector is on the page");
        it("Should eventually time out");
      });
    });
  });
};