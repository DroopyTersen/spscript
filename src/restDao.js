var SPScript = require("./spscript");
SPScript.BaseDao = require("./baseDao");
SPScript.Search = require("./search");

(function(sp, $) {
	var RestDao = function(url) {
		var self = this;
		sp.BaseDao.call(this);
		this.webUrl = url;
	};

	RestDao.prototype = new sp.BaseDao();

	RestDao.prototype.executeRequest = function(url, options) {
		var self = this,
			fullUrl = (/^http/i).test(url) ? url : this.webUrl + "/_api" + url,
			executeOptions = {
				url: fullUrl,
				type: "GET",
				headers: {
					"Accept": "application/json; odata=verbose"
				}
			};

		$.extend(executeOptions, options);
		return $.ajax(executeOptions);
	};

	sp.RestDao = RestDao;
})(SPScript, jQuery);

module.exports = SPScript.RestDao;