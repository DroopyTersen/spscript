export interface RequestOptions {
	url?: string;
	method?: string;
	headers?: any;
	data?: string;
	async?: boolean;
}

var defaults: RequestOptions = {
	method: "GET",
	async: true,
	data: undefined
};

var validMethods = ["GET", "POST", "PUT", "HEAD", "DELETE", "PATCH"];

var errorHandlers = [];

var validateOptions = function(options) {
	if (!options || !options.url || validMethods.indexOf(options.method) < 0)
		return false;
	else return true;
};

var setHeaders = function(xhr, headersObj) {
	if (headersObj) {
		Object.keys(headersObj).forEach(key => {
			xhr.setRequestHeader(key, headersObj[key]);
		});
	}
};

var xhr: any = function(options: RequestOptions) {
	var opts = Object.assign({}, defaults, options);
	if (!validateOptions(options))
		return Promise.reject(
			new Error("Invalid options passed into ajax call.")
		);

	var xhr = new XMLHttpRequest();
	if (xhr == null)
		return Promise.reject(
			new Error("Your browser doesn't support XMLHttpRequest (ajax).")
		);

	xhr.open(opts.method, opts.url, opts.async);
	setHeaders(xhr, opts.headers);
	xhr.responseType = "json";

	return new Promise((resolve, reject) => {
		xhr.onreadystatechange = function() {
			//completed
			if (xhr.readyState === 4) {
				// SUCCESS
				if (xhr.status < 400 && xhr.status >= 100) {
					if (
						xhr.status >= 200 &&
						xhr.status < 300 &&
						xhr.status !== 204
					) {
						resolve(xhr.response || xhr.status + "");
					} else resolve(xhr.response);
				} else {
					var err = new Error("SPScript HTTP Error: " + xhr.status);
					if (xhr.response && typeof xhr.response === "object") {
						err.message +=
							"\n" + JSON.stringify(xhr.response, null, "  ");
					}
					reject(err);
				}
			}
		};

		xhr.send(opts.data);
	});
};

export default xhr;
