// var promisePolyfill = require("promise-polyfill");
// if (!global.Promise) {
// 	global.Promise = promisePolyfill;
// }

mocha.setup("bdd");
chai.should();
var SPScript = require("../../dist/v3/spscript");
require("./tests").run(SPScript);

mocha.run();
