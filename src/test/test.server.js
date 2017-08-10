var config = require("../../app.config");
var SPScript = require("../../lib/entry.server");
var chai = require("chai");
chai.should();
var SPScript = require("../../lib/SPScript").default;

var ctx = SPScript.createContext(config.SP_SITE_URL, {
	clientId: config.CLIENT_KEY,
	clientSecret: config.CLIENT_SECRET
});

require("./tests").run(SPScript, ctx);
