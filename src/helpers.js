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

	//'Borrowed' from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
	helpers.arrayFromBitMask = function (nMask) {
		// nMask must be between -2147483648 and 2147483647
		if (typeof nMask === "string") {
			nMask = parseInt(nMask);
		}
		// if (nMask > 0x7fffffff || nMask < -0x80000000) { 
		// 	throw new TypeError("arrayFromMask - out of range"); 
		// }
		for (var nShifted = nMask, aFromMask = []; nShifted; aFromMask.push(Boolean(nShifted & 1)), nShifted >>>= 1);
		return aFromMask;
	};

	sp.helpers = helpers;
})(SPScript);
