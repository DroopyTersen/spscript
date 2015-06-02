var RestDao = require("../../restDao");
var init = function(field, list) {
	
	var head = document.getElementsByTagName("head")[0];
	if (!window.jQuery) {
		var script = document.createElement("script");
		script.setAttribute("src", "//code.jquery.com/jquery-2.1.4.min.js");
		script.setAttribute("type", "text/javascript");
		head.appendChild(script);
	}

	//add select 2 css
	var link = document.createElement("link");
	link.setAttribute("rel", "stylesheet");
	link.setAttribute("type", "text/css");
	link.setAttribute("href", "//cdnjs.cloudflare.com/ajax/libs/select2/4.0.0/css/select2.min.css");
	head.appendChild(link);

	var registerDropdownTemplate = function(field) {
		var overrides = {};
		overrides.Templates = { Fields: {} };
		overrides.Templates.Fields[field] = { 
			'EditForm': convertToSelect2,
			'NewForm': convertToSelect2
		};

		// Register the rendering template
		SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrides);
	};

	var convertToSelect2 = function(ctx) {
		var fieldCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
		var url = fieldCtx.webAttributes.WebUrl;
		var dao = new RestDao(url);
		var dropdownHtml = "<select id='" + fieldCtx.fieldName + "' type='text' class='ms-long' name='" + fieldCtx.fieldName + "'><option value=''></option></select>";
		var selector = "[name='" + fieldCtx.fieldName + "']";

		fieldCtx.registerGetValueCallback(fieldCtx.fieldName, function() {
			return $(selector).val();
		});



		$(document).ready(function(){
			$.getScript("//cdnjs.cloudflare.com/ajax/libs/select2/4.0.0/js/select2.min.js").then(function(){
				$(selector).select2({
					minimumInputLength: 1,
					placeholder: "Begin typing...",
					ajax: {
						delay: 150,
						url: "",
						data: function(params) {
							return {
								q: params.term
							};
						},
						processResults: function(items) {
							var results = items.map(function(item){
								return {
									id: item.Id,
									text: item.Title
								};
							});
							return { results: results };
						},
						cache: true,
						transport: function(params, success, failure) {
							console.log(params);
							var search = params.data.q || "";
							var odata = "$top=10&$select=Title, Id&$filter=substringof('" + search + "', Title)";
							dao.lists(list).getItems(odata).then(function(items){
								success(items);
							}, failure);
						}
					},
				});
			});
		});
		return dropdownHtml;
	};
	
	registerDropdownTemplate(field);
};
   
exports.init = init;