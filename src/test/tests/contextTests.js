var should = require("chai").should();

exports.run = function(SPScript) {
	describe("var ctx = SPScript.createContext()", function() {
        var ctx = SPScript.createContext();
        describe("Members", function() {
            it("Should create the primary object you use to interact with the site", function() {
                if (!ctx) throw new Error("Context is null");
                ctx.should.have.property("webUrl");
                ctx.should.have.property("executeRequest");
                ctx.should.have.property("get");
                ctx.should.have.property("post");
                ctx.should.have.property("authorizedPost");
                // ctx.should.have.property("web");
                // ctx.should.have.property("lists");
                // ctx.should.have.property("search");
                // ctx.should.have.property("profiles");
            })
        })

        describe("ctx.get(url, opts)", function() {
            var promise;
            before(function() {
                promise = ctx.get("/lists?$select=Title");
            })
            it("Should return a Promise", function() {
                if (!promise) throw new Error("Promise is null");
                promise.should.have.property("then");
            });
            it("Should resolve to a JS object, not a JSON string", function(done) {
                promise.then(function(data) {
                    data.should.have.property("d");
                    done();
                })
                .catch(err => done(err))
                
            });
            it("Should return valid API results: ctx.get('/lists')", function(done) {
                promise
                    .then(data => {
                        data.should.have.property("d");
                        data.d.should.have.property("results");
                        data.d.results.should.be.an("array");
                        done();
                    })
                    .catch(err => done(err))
            })
        });

        describe("ctx.getRequestDigest()", function() {
            it("Should resolve to a string request digest", function(done) {
                ctx.getRequestDigest().then(function(digest) {
                    digest.should.be.a("string");
                    digest.should.not.be.empty;
                    done();
                })
            })
        })
	});
}