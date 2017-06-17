"use strict";
const promise_polyfill_1 = require("promise-polyfill");
const SPScript_1 = require("./SPScript");
if (!global.Promise) {
    global.Promise = promise_polyfill_1.default;
}
module.exports = SPScript_1.default;
//# sourceMappingURL=entry.browser.js.map