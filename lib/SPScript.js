"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const Context_1 = require("./context/Context");
const headers_1 = require("./context/headers");
// export interface ISPScript {
//     _env:string
//     utils:Utils;
//     createContext(url?:string): Context,
//     headers:HeaderUtils,
// }
// var SPScript: ISPScript = {
exports.default = {
    utils: utils_1.default,
    createContext: Context_1.create,
    _env: "browser",
    headers: headers_1.default
};
// export default SPScript; 
//# sourceMappingURL=SPScript.js.map