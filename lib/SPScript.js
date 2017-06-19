"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const Context_1 = require("./context/Context");
const headers_1 = require("./context/headers");
var spscript = {
    utils: utils_1.default,
    headers: headers_1.default,
    createContext(url, clientId, clientSecret) {
        try {
            if (!url && global._spPageContextInfo) {
                url = global._spPageContextInfo.webAbsoluteUrl;
            }
            return new Context_1.default(url);
        }
        catch (ex) {
            throw new Error("Unable to create SPScript Context: " + ex.message);
        }
    }
};
exports.default = spscript;
//# sourceMappingURL=SPScript.js.map