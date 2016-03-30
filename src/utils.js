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

