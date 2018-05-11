var should = require("chai").should();

exports.run = function(ctx) {
	describe("var auth = ctx.auth", function() {
		this.timeout(5000);


		describe("auth.getRequestDigest()", function() {
			it("Should resolve to a string request digest", function(done) {
				ctx.auth.getRequestDigest().then(function(digest) {
					digest.should.be.a("string");
					digest.should.not.be.empty;
					done();
				});
			});
		});

		describe("auth.ensureRequestDigest()", function() {
			it("Should resolve to a string request digest if no digest is given", function(done) {
				var initialDigest = null;
				ctx.auth.ensureRequestDigest(initialDigest).then(function(digest) {
					digest.should.be.a("string");
					digest.should.not.be.empty;
					done();
				});
			});
			it("Should return the same digest string if a digest value is given", function(done) {
				ctx.auth.getRequestDigest().then(function(initialDigest) {
					ctx.auth.ensureRequestDigest(initialDigest).then(function(digest) {
						digest.should.be.a("string");
						digest.should.not.be.empty;
						digest.should.equal(initialDigest);
						done();
					});
				});
			})
		});

		describe("auth.getGraphToken()", function() {
			it("Should resolve to a string that is the access token needed to authorize GRAPH API requests", function(done) {
				ctx.auth.getGraphToken().then(function(token) {
					token.should.not.be.null;
					token.should.have.property("access_token");
					token.should.have.property("expires_on");
					token.should.have.property("resource");
					token.should.have.property("scope");
					token.access_token.should.be.a("string");
					token.access_token.should.not.be.empty;
					console.log(token);
					var url = "https://graph.microsoft.com/v1.0/me/"
					var headers = {
						"authorization": "Bearer " + token.access_token,
						"content-type": "application/json",
						"cache-control": "no-cache",
						"redirect": "follow",
				
					}
					fetch(url, { headers })
						.then(res => res.json())
						.then(profile => {
							profile.should.not.be.null;
							console.log(profile);
							done();
						})
				})
			})
		})
	});
};
