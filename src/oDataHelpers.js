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
		var results = data;
		if (data.d && data.d.results && data.d.results.length != null) {
			results = data.d.results;
		} else if (data.d) {
			results = data.d;
		}

		if (deferred) {
			deferred.resolve(results);
		} else {
			return results;
		}
	};

	helpers.validateCrossDomainODataV2 = function(response, deferred) {
		var data = $.parseJSON(response.body);
		SPScript.helpers.validateODataV2(data, deferred);
	};

	sp.helpers = helpers;
})(SPScript);
