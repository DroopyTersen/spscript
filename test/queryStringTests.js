exports.run = function() {
	describe("SPScript.queryString", function () {
	    this.timeout(5000);
	    var qs = "key1=value1&key2=value2&key3=value3";
	    describe("SPScript.queryString.contains(key)", function () {
	        it("Should return the true for a valid key", function () {
	            var contains = SPScript.queryString.contains('key1', qs);
	            contains.should.be.true;
	        });
	        it("Should return false for an invalid key", function () {
	            var contains = SPScript.queryString.contains('invalidKey', qs);
	            contains.should.be.false;
	        });
	    });
	    describe("SPScript.queryString.getValue(key)", function () {
	        it("Should return the value of a valid key", function () {
	            var val = SPScript.queryString.getValue("key1", qs);
	            val.should.equal("value1");
	        });
	        it("Should return an empty string for an invalid key", function () {
	            var val = SPScript.queryString.getValue("invalidKey", qs);
	            val.should.equal("");
	        });
	    });
	    describe("SPScript.queryString.getAll()", function () {
	        it("Should return an object with querystring keys as properties", function () {
	            var values = SPScript.queryString.getAll(qs);
	            console.log(values);
	            values.should.have.property('key1');
	            values.key1.should.equal('value1');
	            values.should.have.property('key2');
	            values.key2.should.equal('value2');
	            values.should.have.property('key3');
	            values.key3.should.equal('value3');
	        });
	    });
	});
};