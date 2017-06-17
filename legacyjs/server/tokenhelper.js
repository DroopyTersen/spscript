var request = require("./httpRequest");
var urlUtils = require("url");

//resource format
// 00000003-0000-0ff1-ce00-000000000000/andrewpetersen.sharepoint.com@0c66a066-1285-4600-a410-d54328bf255b
//clientId format
//562bca48-a47d-45ee-8479-79b65c0e9c33@0c66a066-1285-4600-a410-d54328bf255b
//auth endpoint urls
//https://accounts.accesscontrol.windows.net/metadata/json/1?realm=0c66a066-1285-4600-a410-d54328bf255b
//token url
//https://accounts.accesscontrol.windows.net/0c66a066-1285-4600-a410-d54328bf255b/tokens/OAuth/2
var getAppOnlyToken = exports.getAppOnlyToken = function (spSiteUrl, clientKey, clientSecret) {
    var urlParts = urlUtils.parse(spSiteUrl);
    return getRealm(spSiteUrl).then(authParams => {
        var tokenUrl = `https://accounts.accesscontrol.windows.net/${authParams.realm}/tokens/OAuth/2`;
        var clientId = `${clientKey}@${authParams.realm}`;
        var resource = `${authParams.client_id}/${urlParts.host}@${authParams.realm}`
        var postBody = {
            "grant_type": "client_credentials",
            "client_id": clientId,
            "client_secret": clientSecret,
            "resource": resource,
            "scope": resource
        };
        return request.post(tokenUrl, postBody).then(resp => {
            if (resp && resp.body) {
                var result = JSON.parse(resp.body);
                return result.access_token;
            }
        })
    })
};

var parseRealm = function (raw) {
    var bearer = "Bearer realm=";
    if (raw && raw.startsWith("Bearer")) {
        raw = raw.substr(7);
        var params = raw.split(",")
                .filter(p => p.indexOf("=") > -1)
                .reduce((params, piece) => {
                    var parts = piece.split("=");
                    if (parts.length === 2) {
                        params[parts[0].trim()] = parts[1].trim().replace(/\"/g, "");
                    }
                    return params
                }, {});
        return params;
    }
    return null;
}


var getRealm = function (spSiteUrl) {
    return new Promise(function (resolve, reject) {
        var url = `${spSiteUrl}/_vti_bin/client.svc`;
        var headers = {
            "Authorization": "Bearer ",
            "Accept": "application/json;odata=verbose",
            "response_type": "code"
        };

        request.get(url, headers).then(res => {
            //this should fail
            console.log("Get Realm succeeded");
        }).catch((res, arg1) => {
            var realm = parseRealm(res.headers["www-authenticate"])
            if (realm) {
                resolve(realm);
            } else {
                reject(err, res);
            }
        })
    });
}
