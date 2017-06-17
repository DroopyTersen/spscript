"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xhr_1 = require("./xhr");
var request = function (options) {
    // if node, use request-promise-native
    // if fetch is available, use that
    // else use xhr
    if (typeof window === "undefined") {
        throw new Error("No Node.js HTTP request module available yet.");
    }
    return xhr_1.default(options);
};
exports.default = request;
//# sourceMappingURL=request.js.map