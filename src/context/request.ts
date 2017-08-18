// require("isomorphic-fetch");

var defaults: RequestInit = {
	method: "GET",
	credentials: "include",
	redirect: "follow"
};

var request: any = function(url, options: RequestInit) {
	var opts = Object.assign({}, defaults, options);
	return fetch(url, opts).then(resp => {
		var succeeded = resp.ok;
		if (!resp.ok) {
			return resp.text().then(err => {
				throw new Error(err);
			});
		}
		return resp.json();
	});
};

export default request;
