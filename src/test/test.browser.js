require("babel-polyfill");
mocha.setup("bdd");
chai.should();
var SPScript = require("../../dist/v3/spscript");
require("./tests").run(SPScript);

mocha.run();
