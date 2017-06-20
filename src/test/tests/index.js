exports.run = function(SPScript, mode) {
    console.log("SPScript Env: " + SPScript._env);
    var should = require("chai").should();

    describe("Global Namespaces", function() {
        it("Should have a 'SPScript.createContext()' method", function() {
            SPScript.should.have.property("createContext");
            SPScript.createContext.should.be.a("function");
        })
        it("Should have a 'SPScript.utils' namespace", function() {
            SPScript.should.not.be.null;
            SPScript.should.have.property("utils");
        })
    })
    require("./contextTests").run(SPScript);
    var ctx = SPScript.createContext();
    require("./webTests").run(ctx);
    require("./listTests").run(ctx);
    require("./searchTests").run(ctx);
    require("./customActionTests").run(ctx);
    require("./utilsTests").run(SPScript.utils);

};

