(function(global) {
"use strict";

var loadDependencies = function() {
	//add select 2 css
	SPScript.utils.loadCss("//cdnjs.cloudflare.com/ajax/libs/select2/4.0.0/css/select2.min.css");
	var select2Url = "//cdnjs.cloudflare.com/ajax/libs/select2/4.0.0/js/select2.min.js"
	var scripts = []
	// load jQuery if its not on the page
	if (!window.jQuery) {
		scripts.push("//code.jquery.com/jquery-2.2.3.min.js");
	}
	// load select2 if its not on the page
	if (!SPScript.utils.validateNamespace("jQuery.fn.select2")) {
		scripts.push(select2Url);
	}
	return SPScript.utils.getScripts(scripts);
};

var init = function init(field, list, options) {
	var selector = "[name='" + field + "']";

	var getSelect2Value = function(fieldCtx) {
		var value = document.querySelector(selector).value;
		if (fieldCtx.fieldSchema.FieldType === "LookupMulti") {
			value = value.join(";#");
		}
		return value;
	};

	var setupSelect2 = function(dao) {
		var defaults = {
			minimumInputLength: 1,
			placeholder: "Begin typing...",
			ajax: {
				delay: 150,
				processResults: function processResults(items) {
					var results = items.map(function(item) {
						return {
							id: item.Id + ";#" + item.Title,
							text: item.Title
						};
					});
					return { results };
				},
				cache: true,
				transport: function (params, success, failure) {
					var search = params.data.q || "";
					var odata = "$top=10&$select=Title, Id&$filter=substringof('" + search + "', Title)";
					dao.lists(list).getItems(odata).then(success).catch(failure);
				}
			}
		};
		
		options = Object.assign({}, defaults, options);
		$(selector).select2(options);
	};

	var convertToSelect2 = function convertToSelect2(ctx) {
		var fieldCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
		var dao = new SPScript.RestDao(fieldCtx.webAttributes.WebUrl);

		var isMultple = fieldCtx.fieldSchema.FieldType === "LookupMulti" ? "multiple='multple'" : "";

		var dropdownHtml = 
			`<select id='${fieldCtx.fieldName}' ${isMultiple} class='ms-long' name='${fieldCtx.fieldName}'>
				<option value=''></option>
			</select>`; 

		SPScript.utils.waitForLibraries(["jQuery", "jQuery.fn.select2"]).then(() => setupSelect2(dao));

		return dropdownHtml;
	};

	loadDependencies();
	SPScript.jsLink.registerEditField(field, convertToSelect2, getSelect2Value);
};
	global.spSelect2 = { init };
})(window);
