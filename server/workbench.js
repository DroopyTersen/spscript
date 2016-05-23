var ServerDao = require("./serverDao");
var config = require("../app.config");

var dao = new ServerDao(config.spSiteUrl, config.clientKey, config.clientSecret);

dao.web.uploadFile("/spscript/Shared Documents", "C:\\Users\\apetersen\\Documents\\Room listing.pdf");
