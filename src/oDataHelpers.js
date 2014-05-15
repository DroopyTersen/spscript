SPScript = window.SPScript || {};
/* 
 * ==========
 * Helpers
 * Dependencies: ["$"]
 * ==========
 */
(function(sp) {
	var helpers = {};
	helpers.validateODataV2 = function(data, deferred) {
		if (data.d && data.d.results && data.d.results.length != null) {
			deferred.resolve(data.d.results);
		} else if (data.d) {
			deferred.resolve(data.d);
		} else {
			deferred.resolve(data);
		}
	};

	helpers.validateCrossDomainODataV2 = function(response, deferred) {
		var data = $.parseJSON(response.body);
		SPScript.helpers.validateODataV2(data, deferred);
	};

	sp.helpers = helpers;
})(SPScript);
