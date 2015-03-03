SPScript = require("./spscript");
/* 
 * ==========
 * queryString
 * Dependencies: []
 * ==========
 */
(function(sp) {
	sp.queryString = {
		/*  === getValue ===
		
			Summary: Pass a string value in as the key to get the string value
			Note: Returns empty string("") if key is not found
			Usage: var id = QueryString.getValue("id");
		*/

		/*  === getAll ===
		
			Summary: returns a hash table of query string arguments
			Usage:
				var args = QueryString.getAll();
				for (var i = 0; i < args.length; i++) {
					var key = args[i];
					var value = args[key];
					alert(key + " : " + value);
				}
		*/

		/*  === contains ===
			
			Summary: Pass in a string value as the key to see whether it exists
					in the query string arguments.  Returns boolean.
			Usage:
					if (QueryString.contains("redirectUrl")){
						window.location.href = QueryString.GetValue("redirectUrl");
					}	
		*/

		//private variables
		_queryString: {},
		_processed: false,

		//private method (only run on the first 'GetValue' request)
		_processQueryString: function(text) {
			var qs = text || window.location.search.substring(1),
				keyValue,
				keyValues = qs.split('&');

			for (var i = 0; i < keyValues.length; i++) {
				keyValue = keyValues[i].split('=');
				//this._queryString.push(keyValue[0]);
				this._queryString[keyValue[0]] = decodeURIComponent(keyValue[1].replace(/\+/g, " "));
			}

			this._processed = true;
		},

		//Public Methods
		contains: function(key, text) {
			if (!this._processed) {
				this._processQueryString(text);
			}
			return this._queryString.hasOwnProperty(key);
		},

		getValue: function(key, text) {
			if (!this._processed) {
				this._processQueryString(text);
			}
			return this.contains(key) ? this._queryString[key] : "";
		},

		getAll: function(text) {
			if (!this._processed) {
				this._processQueryString(text);
			}
			return this._queryString;
		},

		objectToQueryString: function(obj, quoteValues) {
			var params = [];
			for (var key in obj) {
				value = obj[key];
				if (value !== null) {
					if (quoteValues) {
						params.push(encodeURIComponent(key) + "='" + encodeURIComponent(value) + "'");
					} else {
						params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
					}
				}

			}
			return params.join("&");
		}
	};
})(SPScript);

module.exports = SPScript.queryString;