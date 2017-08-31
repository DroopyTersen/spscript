require('isomorphic-fetch');
var config = require("../../app.config");
var SPScript = require("../../dist/v3/spscript");
var chai = require("chai");
chai.should();

var ctx = SPScript.createContext(config.SP_SITE_URL, {
	clientId: config.CLIENT_KEY,
	clientSecret: config.CLIENT_SECRET
});

require("./tests").run(SPScript, ctx);
