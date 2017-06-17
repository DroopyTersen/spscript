var promisePolyfill = require("promise-polyfill");
if (!global.Promise) {
    global.Promise = promisePolyfill;
}

mocha.setup('bdd');
chai.should();
require("./tests").run(SPScript);

mocha.run();