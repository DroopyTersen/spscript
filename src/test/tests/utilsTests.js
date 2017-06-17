var should = require("chai").should();

exports.run = function(utils) {
	describe("var utils = SPScript.utils", function() {
        describe("utils.parseJSON(data)", function() {
            it("Should exist on the utils object", function() {
                utils.should.have.property("parseJSON");
                utils.parseJSON.should.be.a("function");
            })
            it("Should take a string or an object and return an object", function() {
                var obj = { one: "value of one", two: "value of two" };
                var jsonStr = JSON.stringify(obj);

                var res1 = utils.parseJSON(obj);
                res1.should.not.be.null;
                res1.should.have.property("one");
                res1.one.should.equal(obj.one);

                var res2 = utils.parseJSON(jsonStr);
                res2.should.not.be.null;
                res2.should.have.property("one");
                res2.one.should.equal(obj.one);
            })
        })
	})
}