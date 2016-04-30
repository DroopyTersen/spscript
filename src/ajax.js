var defaults = {
	method: "GET",
	async: true,
	type: "json", //XMLHttpRequest.responseType
	data: undefined
};

var validMethods = [
	"GET",
	"POST",
	"PUT",
	"HEAD",
	"DELETE",
	"PATCH"
];

var errorHandlers = [];

var validateOptions = function(options) {
	if (!options || !options.url || validMethods.indexOf(options.method) < 0)
		return false
	else return true
};

var setHeaders = function(xhr, headersObj) {
	if (headersObj) {
		Object.keys(headersObj).forEach(key => {
			xhr.setRequestHeader(key, headersObj[key]);
		})
	}
};

var ajax = function(options) {
	var opts = Object.assign({}, defaults, options);
	if (!validateOptions(options))
		return Promise.reject(new Error("Invalid options passed into ajax call."));

	var xhr = new XMLHttpRequest();
	if (xhr == null) 
		return Promise.reject(new Error("Your browser doesn't support XMLHttpRequest (ajax)."));


	xhr.open(opts.method, opts.url, opts.async);
	setHeaders(xhr, opts.headers);
	xhr.responseType = opts.type;

	return new Promise((resolve, reject) => {
		xhr.onreadystatechange = function() {
			//completed
			if (xhr.readyState === 4) {
				// SUCCESS
				if (xhr.status < 400 && xhr.status >= 100) {
					resolve(xhr.response);
				} else {
					var error = new Error("AJAX Request Error: Response Code = " + xhr.status);
					error.code = xhr.status;
					errorHandlers.forEach(fn => fn(error, xhr));
					reject(error);
				}
			}
		};

		xhr.send(opts.data);
	})
}

ajax.addErrorHandler = (fn) => errorHandlers.push(fn);
ajax.setDefaults = (options) => Object.assign(defaults, options);

module.exports = ajax;