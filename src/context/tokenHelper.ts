import { parse as parseUrl } from "url";
import request from "./request";

export var getAppOnlyToken = function(
	url: string,
	clientId: string,
	clientSecret: string
) {
	var urlParts = parseUrl(url);
	return getRealm(url).then(authParams => {
		var tokenUrl = `https://accounts.accesscontrol.windows.net/${authParams.realm}/tokens/OAuth/2`;
		var clientId = `${clientId}@${authParams.realm}`;
		var resource = `${authParams.client_id}/${urlParts.host}@${authParams.realm}`;
		var postBody = {
			grant_type: "client_credentials",
			client_id: clientId,
			client_secret: clientSecret,
			resource: resource,
			scope: resource
		};
		var opts: RequestInit = {
			method: "POST",
			body: JSON.stringify(postBody),
			headers: {
				"Content-Type": "application/json"
			}
		};
		return request(tokenUrl, opts).then(data => data.access_token);
	});
};

var getRealm = function(url: string): Promise<any> {
	var reqOpts = {
		url: `${url}/_vti_bin/client.svc`,
		method: "GET",
		headers: {
			Authorization: "Bearer ",
			Accept: "application/json;odata=verbose",
			response_type: "code"
		}
	};
	return new Promise((resolve, reject) => {
		request(reqOpts)
			.then(res => {
				//this should fail
				reject("Get Realm succeeded somehow?!");
			})
			.catch(res => {
				var realm = parseRealm(res.headers["www-authenticate"]);
				if (realm) {
					resolve(realm);
				} else {
					reject(
						"Unable to find Realm:\n" +
							JSON.stringify(res, null, "  ")
					);
				}
			});
	});
};

var parseRealm = function(raw): any {
	var bearer = "Bearer realm=";
	if (raw && raw.startsWith("Bearer")) {
		raw = raw.substr(7);
		var params = raw
			.split(",")
			.filter(p => p.indexOf("=") > -1)
			.reduce((params, piece) => {
				var parts = piece.split("=");
				if (parts.length === 2) {
					params[parts[0].trim()] = parts[1]
						.trim()
						.replace(/\"/g, "");
				}
				return params;
			}, {});
		return params;
	}
	return null;
};
