var should = require("chai").should();

exports.run = function(utils) {
	utils = utils || SPScript.utils;
	
	describe("var utils = SPScript.utils", function() {
		this.timeout(10000);


		describe("utils.getScript(scriptUrl)", function() {
			var underscoreUrl = "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js";
			it("Should return a promise that resolves when script has been loaded.", function(done) {
				utils.getScript(underscoreUrl).then(function(){
					_.should.not.be.null;
					_.map.should.be.a("function");
					done();
				})
			})
		});

		describe("utils.getScripts(scriptUrls[])", function() {

			var reactUrl = "https://cdnjs.cloudflare.com/ajax/libs/react/15.0.1/react.js";
			var jsZipUrl = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.0.0/jszip.js";

			it ("Should return a promise that resolves when all the scripts have been loaded.", function(done) {
				utils.getScripts([reactUrl, jsZipUrl]).then(function() {
					React.should.not.be.null;
					JSZip.should.not.be.null;
					done();
				})
			})
		});

		describe("utils.waitForLibraries(namespaces[])", function() {
			it("Should return a promise that resolves when all the namespaces are valid.", function(done){
				var momentUrl = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.js";
				utils.waitForLibraries(["moment"]).then(function(){
					moment.should.not.be.null;
					moment.should.be.a("function");
					moment().format.should.be.a("function");
					done();
				});

				// delay it a bit on purpose
				setTimeout(function() { utils.getScript(momentUrl) }, 1000);
			})
		});
	})
}