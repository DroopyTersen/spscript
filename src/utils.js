var validateODataV2 = exports.validateODataV2= function(data) {
	var results = data;
	if (data.d && data.d.results && data.d.results.length != null) {
		results = data.d.results;
	} else if (data.d) {
		results = data.d;
	}
	return results;
};

var validateCrossDomainODataV2 = exports.validateCrossDomainODataV2 = function(response) {
	var data = $.parseJSON(response.body);
	helpers.validateODataV2(data);
};

//'Borrowed' from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
var arrayFromBitMask = exports.arrayFromBitMask = function(nMask) {
	// nMask must be between -2147483648 and 2147483647
	if (typeof nMask === "string") {
		nMask = parseInt(nMask);
	}
	// if (nMask > 0x7fffffff || nMask < -0x80000000) { 
	// 	throw new TypeError("arrayFromMask - out of range"); 
	// }
	for (var nShifted = nMask, aFromMask = []; nShifted; aFromMask.push(Boolean(nShifted & 1)), nShifted >>>= 1);
	return aFromMask;
};

var waitForLibraries = exports.waitForLibraries = function(namespaces, cb) {
	var missing = namespaces.filter(function(namespace) {
		return !validateNamespace(namespace);
	});

	if (missing.length === 0) {
		cb();
	} else {
		setTimeout(function() {
			waitForLibraries(namespaces, cb);
		}, 25);
	}
};

var waitForLibrary = exports.waitForLibrary = function(namespace, cb) {
	return waitForLibraries([namespace], cb);
};

var validateNamespace = exports.validateNamespace = function(namespace) {
	var scope = window;
	var sections = namespace.split(".");
	var sectionsLength = sections.length;
	for (var i = 0; i < sectionsLength; i++) {
		var prop = sections[i];
		if (prop in scope) {
			scope = scope[prop]
		} else {
			return false;
		}
	}
	return true;
};