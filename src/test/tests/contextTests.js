var should = require("chai").should();

exports.run = function(SPScript) {
	describe("SPScript Context", function() {
		var ctx = SPScript.createContext();
		describe("var ctx = SPScript.createContext(url)", function() {
			it("Should create the primary object you use to interact with the site", function() {
				if (!ctx) throw new Error("Context is null");
				ctx.should.have.property("webUrl");
				ctx.should.have.property("executeRequest");
				ctx.should.have.property("get");
				ctx.should.have.property("post");
				ctx.should.have.property("authorizedPost");
				ctx.should.have.property("lists");
			});
			it("Should allow a url to be passed in", function() {
				var url = "http://blah.sharepoint.com";
				var context = SPScript.createContext(url);
				context.webUrl.should.equal(url);
			});
			it("Should default to the current web if no url is passed", function() {
				var context = SPScript.createContext();
				context.webUrl.should.equal(_spPageContextInfo.webAbsoluteUrl);
			});
		});

		describe("Namespaces", function() {
			describe("ctx.web", function() {
				it("Should have an SPScript Web object with site methods (getUser, getSubsites etc...)", function() {
					ctx.should.have.property("web");
					ctx.web.should.have.property("getUser");
					ctx.web.should.have.property("getSubsites");
				});
			});

			describe("ctx.search", function() {
				it("Should have an SPScript Search object with search methods (query, people, sites etc...)", function() {
					ctx.search.should.have.property("query");
					ctx.search.should.have.property("people");
				});
			});

			describe("ctx.profiles", function() {
				it("Should have an SPScript Profiles object with methods to hit the Profile Service (current, setProperty etc...)", function() {
					ctx.should.have.property("profiles");
					ctx.profiles.should.have.property("get");
					ctx.profiles.should.have.property("setProperty");
				});
			});
		});

		describe("Methods", function() {
			describe("ctx.list(name)", function() {
				it("Should return an SPScript List instance", function() {
					var list = ctx.lists("My List");
					list.should.have.property("listName");
					list.should.have.property("getInfo");
				});
			});
			describe("ctx.get(url, [opts])", function() {
				var promise;
				before(function() {
					promise = ctx.get("/lists?$select=Title");
				});
				it("Should return a Promise", function() {
					if (!promise) throw new Error("Promise is null");
					promise.should.have.property("then");
				});
				it("Should resolve to a JS object, not a JSON string", function(
					done
				) {
					promise
						.then(function(data) {
							data.should.have.property("d");
							done();
						})
						.catch(err => done(err));
				});
				it("Should return valid API results: ctx.get('/lists')", function(
					done
				) {
					promise
						.then(data => {
							data.should.have.property("d");
							data.d.should.have.property("results");
							data.d.results.should.be.an("array");
							done();
						})
						.catch(err => done(err));
				});
			});

			describe("ctx.post(url, [body], [opts]", function() {
				it("Should return a Promise");
				it("Should resolve to a JS object, not a JSON string");
			});

			describe("ctx.authorizedPost(url, [body], [opts]", function() {
				it("Should include a request digest in the headers");
				it("Should return a Promise");
				it("Should resolve to a JS object, not a JSON string");
			});


		});
	});
};
