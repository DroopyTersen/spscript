exports.run = function(SPScript, mode) {
    console.log("SPScript Env: " + SPScript._env);
    var should = require("chai").should();

    describe("Global Namespaces", function() {
        it("Should have an _env property", function() {
            SPScript.should.have.property("_env");
            SPScript._env.should.be.a("string");
        })
        it("Should have a utils namespace", function() {
            SPScript.should.not.be.null;
            SPScript.should.have.property("utils");
        })

        it("Should have a createContext method", function() {
            SPScript.should.have.property("createContext");
            SPScript.createContext.should.be.a("function");
        })
    })
    require("./utilsTests").run(SPScript.utils);
    require("./contextTests").run(SPScript);
    var ctx = SPScript.createContext();
    require("./listTests").run(ctx);

};

