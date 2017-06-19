"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queryString_1 = require("./queryString");
function parseJSON(data) {
    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        }
        catch (e) {
            return null;
        }
    }
    return data;
}
function validateODataV2(data) {
    data = parseJSON(data);
    var results = null;
    if (data.d && data.d.results && data.d.results.length != null) {
        results = data.d.results;
    }
    else if (data.d) {
        results = data.d;
    }
    return results || data;
}
var utils = { parseJSON, validateODataV2, qs: { toObj: queryString_1.toObj, fromObj: queryString_1.fromObj } };
exports.default = utils;
//# sourceMappingURL=index.js.map