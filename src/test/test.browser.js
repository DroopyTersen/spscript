require('es6-promise').polyfill();
require('isomorphic-fetch');

mocha.setup("bdd");
chai.should();
var SPScript = require("../../dist/v3/spscript");
require("./tests").run(SPScript);

mocha.run();
