var parseJSON = exports.parseJSON = function(data) {
		if (typeof data === "string") {
			data = JSON.parse(data);
		}
		return data;	
};
var validateODataV2 = exports.validateODataV2= function(data) {
		var results = parseJSON(data);
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

var _waitForLibraries = function(namespaces, resolve) {
	var missing = namespaces.filter(namespace => !validateNamespace(namespace));
		
	if (missing.length === 0) resolve();
	else setTimeout(() => _waitForLibraries(namespaces, resolve), 25);
};

var waitForLibraries = exports.waitForLibraries = function(namespaces) {
	return new Promise((resolve, reject) => _waitForLibraries(namespaces, resolve));
};

var waitForLibrary = exports.waitForLibrary = (namespace) => waitForLibraries([namespace])

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

var getScripts = exports.getScripts = function(urls) {
	return Promise.all(urls.map(getScript));
};

var getScript = exports.getScript = function(url) {
	return new Promise((resolve, reject) => {
		var scriptTag = window.document.createElement("script");
		var firstScriptTag = document.getElementsByTagName('script')[0];
		scriptTag.async = 1;
		firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);

		scriptTag.onload = scriptTag.onreadystatechange = function(arg, isAbort) {
			// if its been aborted, readyState is gone, or readyState is in a 'done' status
			if(isAbort || !scriptTag.readyState || /loaded|complete/.test(script.readyState)) {
				//clean up
				scriptTag.onload = scriptTag.onreadystatechange = null;
				scriptTag = undefined;

				// resolve/reject the promise
				if (!isAbort) resolve();
				else reject;
			}
		}
		scriptTag.src = url;
	});
};