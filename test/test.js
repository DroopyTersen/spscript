mocha.setup('bdd');
chai.should();

describe("SPScript.RestDao", function () {
	it("Should be able to get Web Info with a GET request");

	describe("SPScript.RestDao.lists()", function(){
		it("Should return a promise that resolves to an array of lists");
		it("Should bring back list info like Title, ItemCount, and ListItemEntityTypeFullName");
	});

	describe("SPScript.RestDao.lists(listname)", function(){
		describe("SPScript.RestDao.lists(listname).info()", function(){
			it("Should return a promise that resolves to list info");
			it("Should bring back list info like Title, ItemCount, and ListItemEntityTypeFullName");
		});
		describe("SPScript.RestDao.lists(listname).getById(id)", function(){
			it("Should return a promise that resolves to a single item");
			it("Should resolve an item with a matching ID");
		});
		describe("SPScript.RestDao.lists(listname).items()", function(){
			it("Should return a promise that resolves to an array of items");
			it("Should return all the items in the list");
		});
		describe("SPScript.RestDao.lists(listname).items(odata) - OData support", function(){
			it("Should return a promise that resolves to an array of items");
			it("Should return only items that match the OData params");
		});
		describe("SPScript.RestDao.lists(listname).addItem()", function(){
			it("Should return a promise that resolves with the new list item");
		});
		describe("SPScript.RestDao.lists(listname).updateItem()", function(){
			it("Should return a promise");
			it("Should update only the properties that were passed");
		});
		describe("SPScript.RestDao.lists(listname).find(key, value)", function(){
			it("Should return a promise that resolves to an array of list items");
			it("Should only bring back items the match the key value query");
		});
		describe("SPScript.RestDao.lists(listname).findOne(key, value)", function(){
			it("Should resolve to one list item");
			it("Should only bring back an item if it matches the key value query");
		});
	});
});

describe("SPScript.Search", function(){
	describe("SPScript.Search.query(queryText)", function(){
		it("Should return promise that resolves to an array of SearchResults");
	});
	describe("SPScript.Search.query(queryText, queryOptions)", function(){
		it("Should return promise that resolves to an array of SearchResults");
		it("Should obey the extra query options that were passed");
	});
});

describe("SPScript.queryString", function(){
	var qs = "key1=value1&key2=value2&key3=value3";
	describe("SPScript.queryString.contains(key)", function(){
		it("Should return the true for a valid key", function(){
			var contains = SPScript.queryString.contains('key1', qs);
			contains.should.be.true;
		});
		it("Should return false for an invalid key", function(){
			var contains = SPScript.queryString.contains('invalidKey', qs);
			contains.should.be.false;
		});
	});
	describe("SPScript.queryString.getValue(key)", function(){
		it("Should return the value of a valid key", function(){
			var val = SPScript.queryString.getValue("key1", qs);
			val.should.equal("value1");
		});
		it("Should return an empty string for an invalid key", function(){
			var val = SPScript.queryString.getValue("invalidKey", qs);
			val.should.equal("");
		});
	});
	describe("SPScript.queryString.getAll()", function(){
		it("Should return an object with querystring keys as properties", function(){
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
mocha.run();