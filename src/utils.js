var getRequestDigest = exports.getRequestDigest = function() {
	return document.querySelector("#__REQUESTDIGEST").value
};
var acceptHeader = exports.acceptHeader = "application/json;odata=verbose";

var validateODataV2 = exports.validateODataV2= function(data) {
		if (typeof data === "string") {
			data = JSON.parse(data);
		}	
		var results = data;
		if (data.d && data.d.results && data.d.results.length != null) {
			results = data.d.results;
		} else if (data.d) {
			results = data.d;
		}
		return results;	
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
	return new Promise(function(deferred){
		var missing = namespaces.filter(namespace => !validateNamespace(namespace));

		if (missing.length === 0) {
			if (cb) cb();
			deferred.resolve();
		}
		else setTimeout(() => waitForLibraries(namespaces, cb), 25);
	});
};

var waitForLibrary = exports.waitForLibrary = (namespace, cb) => waitForLibraries([namespace], cb)

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

var getScript = exports.getScript = function(url, namespace) {
	var scriptTag = window.document.createElement("script");
	scriptTag.type ='text/javascript';
	scriptTag.src = url;
	window.document.querySelector("head").appendChild(scriptTag);

	if (namespace) {
		return waitForLibrary(namespace)
	}
}