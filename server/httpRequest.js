var https = require("https");
var urlUtils = require("url");
var querystring = require("querystring");

var request = function(url, method, headers, body) {
    var urlParts = urlUtils.parse(url);
    var options = {
        host: urlParts.hostname,
        port: urlParts.port || 443,
        path: urlParts.path,
        method: method,
        headers: headers,
        agent: false,
        secureOptions: require('constants').SSL_OP_NO_TLSv1_2
    };
    if (body && !headers["Content-Length"]) {
        headers["Content-Length"] = body.length;
    }

    return new Promise(function(resolve, reject) {
        var req = https.request(options, res => {
            var respBody = "";
            res.setEncoding('utf8');
            res.on('data', data => respBody += data);

            res.on('end', () => {
                res.body = respBody;

                if (res.statusCode < 400) resolve(res);
                else {
                    reject(res)
                };
            });

            res.on("error", (e) => {
                reject(e, res);
            })
        });
        if (body) req.write(body);
        req.end();
    });
}

exports.get = function(url, headers) {
    return request(url, "GET", headers);
};

exports.getJSON = function(url, headers) {
    headers = Object.assign({}, headers, {
        "Accept": "application/json;odata=verbose"
    });
    return request(url, "GET", headers).then(res => JSON.parse(res));
};

exports.post = function(url, body, headers) {
    var bodyStr = querystring.stringify(body);
    headers = Object.assign({}, headers, {
        'Content-Type': 'application/x-www-form-urlencoded',
        "Content-Length": bodyStr.length
    });

    return request(url, "POST", headers, bodyStr);
};

exports.request = function(options) {
    return request(options.url, options.method, options.headers, options.data)
}