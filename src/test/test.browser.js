var promisePolyfill = require("promise-polyfill");
if (!global.Promise) {
	global.Promise = promisePolyfill;
}

mocha.setup("bdd");
chai.should();
var SPScript = require("../../lib/SPScript").default;
require("./tests").run(SPScript);

mocha.run();
