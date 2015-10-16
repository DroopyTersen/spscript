(function ($, sp) {
	//create a global function for other webparts to use to get language code
	window.getSPLanguage = function() {
		var languageCode = window.spLanguagePickerValue || window.localStorage.getItem("spLanguagePickerValue");
		return languageCode || "en-US";
	};
	
	var pluginName = "spLanguagePicker";
	var SPLanguagePicker = function (element, options) {
		this._defaults = {
			webUrl: _spPageContextInfo.webAbsoluteUrl
		};
		this._name = pluginName;
		this.options = $.extend(this._defaults, options);
		this.$elem = $(element);
		this._dao = null;
		this.init();
	};
	
	SPLanguagePicker.prototype.bindEvents = function() {
		this.$elem.on("change", this.changeLanguage.bind(this));
		return true;
	};
	
	SPLanguagePicker.prototype.changeLanguage = function() {
		var self = this;
		self.setUserLanguage().then(function(){
			self.$elem.trigger("language-change");
		}).fail(function() {
			self.$elem.trigger("language-change");
		});;
	};
	
	SPLanguagePicker.prototype.setUserLanguage = function() {
		// 1. Get language to set
		var value = this.$elem.val();
		var index = $.inArray(value, this.rawUserLanguages);
		window.spLanguagePickerValue = value;
		window.localStorage.setItem('spLanguagePickerValue', value);
		
		// 2. If it is already in the list of user languages remove it
		if (index > -1 ) {
			this.rawUserLanguages.splice(index, 1);
		}
		// 3. Insert the chosen language as #1
		this.rawUserLanguages.unshift(value);
		
		this.userLanguages = getMappedLanguagesByCode(this.rawUserLanguages);
		// 4. set profile property
		return this._dao.profiles.setProperty(this.profile,  "SPS-MUILanguages", this.rawUserLanguages.join(","));
	};

	SPLanguagePicker.prototype.getUserLanguages = function() {
		var self = this;
		return self._dao.profiles.current().then(function(profile){
			var langStr = profile["SPS-MUILanguages"];
			self.profile = profile;
			console.log(profile);
			self.rawUserLanguages = langStr.split(",").map(function(lang){ return lang.trim(); });
			self.userLanguages = getMappedLanguagesByCode(self.rawUserLanguages);
		});
	};
	
	SPLanguagePicker.prototype.setToUsersLanguage = function() {
		if (this.userLanguages.length) {
			this.setDropdownValue(this.userLanguages[0]);
			window.spLanguagePickerValue = this.userLanguages[0].code;
			window.localStorage.setItem('spLanguagePickerValue', this.userLanguages[0].code);
		}
	};
	
	SPLanguagePicker.prototype.setDropdownValue = function(lang) {
		this.$elem.val(lang.code);
	};
	
	var getMappedLanguagesByLcid = function(ids) {
		ids = ids.map(function(lcid) { return lcid + ""; });
		return allLanguages.filter(function(lang){
			var index = $.inArray(lang.id, ids);
			return (index > -1);
		});
	};
	
	var getMappedLanguagesByCode = function(codes) {
		var matches = [];
		codes.forEach(function(code){
			for (var i = 0; i < allLanguages.length; i++) {
				//check for if language starts with
				var regEx = new RegExp("^" + code.split("-")[0], "i");
				if (allLanguages[i].code.search(regEx) > -1) {
					matches.push(allLanguages[i]);
				}
			}
		});
		return matches;
	};
	
	SPLanguagePicker.prototype.getLanguageOptions = function () {
		return this._dao.get("/web/supportedUILanguageIds")
			.then(sp.helpers.validateODataV2)
			.then(function (data) {
				var localeIds = data.SupportedUILanguageIds.results;
				console.log(localeIds);
				var options = getMappedLanguagesByLcid(localeIds);
				return options;
			});
	};

	SPLanguagePicker.prototype.renderOptions = function(languages) {
		var html = "";
		languages.forEach(function(lang){
			html += "<option data-id='" + lang.id + "' value='" + lang.code + "'>" + lang.display + "</option>";
		})
		this.$elem.html(html);
		return languages;
	};
	
	SPLanguagePicker.prototype.init = function () {
		var self = this;
		self._dao = new sp.RestDao(self.options.webUrl);
		self.getLanguageOptions()
			.then(self.renderOptions.bind(self))
			.then(self.getUserLanguages.bind(self))
			.then(self.setToUsersLanguage.bind(self))
			.then(self.bindEvents.bind(self))
			.fail(function() {
				console.log("ERROR setting up SPLanguagePicker");
				console.log(arguments);
			});
	};

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			return new SPLanguagePicker(this, options);
		});
	};

	var allLanguages = [
		{
			"id": "1033",
			"display": "English",
			"code": "en-US"
		},
		{
			"id": "1025",
			"display": "Arabic",
			"code": "ar-SA"
		},
		{
			"id": "1026",
			"display": "Bulgarian",
			"code": "bg-BG"
		},
		{
			"id": "1027",
			"display": "Catalan",
			"code": "ca-ES"
		},
		{
			"id": "1028",
			"display": "Chinese (Traditional)",
			"code": "zh-TW"
		},
		{
			"id": "1029",
			"display": "Czech",
			"code": "cs-CZ"
		},
		{
			"id": "1030",
			"display": "Danish",
			"code": "da-DK"
		},
		{
			"id": "1031",
			"display": "German",
			"code": "de-DE"
		},
		{
			"id": "1032",
			"display": "Greek",
			"code": "el-GR"
		},
		{
			"id": "1035",
			"display": "Finnish",
			"code": "fi-FI"
		},
		{
			"id": "1036",
			"display": "French",
			"code": "fr-FR"
		},
		{
			"id": "1037",
			"display": "Hebrew",
			"code": "he-IL"
		},
		{
			"id": "1038",
			"display": "Hungarian",
			"code": "hu-HU"
		},
		{
			"id": "1040",
			"display": "Italian",
			"code": "it-IT"
		},
		{
			"id": "1041",
			"display": "Japanese",
			"code": "ja-JP"
		},
		{
			"id": "1042",
			"display": "Korean",
			"code": "ko-KR"
		},
		{
			"id": "1043",
			"display": "Dutch",
			"code": "nl-NL"
		},
		{
			"id": "1044",
			"display": "Norwegian (Bokmål)",
			"code": "nb-NO"
		},
		{
			"id": "1045",
			"display": "Polish",
			"code": "pl-PL"
		},
		{
			"id": "1046",
			"display": "Portuguese (Brazil)",
			"code": "pt-BR"
		},
		{
			"id": "1048",
			"display": "Romanian",
			"code": "ro-RO"
		},
		{
			"id": "1049",
			"display": "Russian",
			"code": "ru-RU"
		},
		{
			"id": "1050",
			"display": "Croatian",
			"code": "hr-HR"
		},
		{
			"id": "1051",
			"display": "Slovak",
			"code": "sk-SK"
		},
		{
			"id": "1053",
			"display": "Swedish",
			"code": "sv-SE"
		},
		{
			"id": "1054",
			"display": "Thai",
			"code": "th-TH"
		},
		{
			"id": "1055",
			"display": "Turkish",
			"code": "tr-TR"
		},
		{
			"id": "1057",
			"display": "Indonesian",
			"code": "id-ID"
		},
		{
			"id": "1058",
			"display": "Ukrainian",
			"code": "uk-UA"
		},
		{
			"id": "1060",
			"display": "Slovenian",
			"code": "sl-SI"
		},
		{
			"id": "1061",
			"display": "Estonian",
			"code": "et-EE"
		},
		{
			"id": "1062",
			"display": "Latvian",
			"code": "lv-LV"
		},
		{
			"id": "1063",
			"display": "Lithuanian",
			"code": "lt-LT"
		},
		{
			"id": "1066",
			"display": "Vietnamese",
			"code": "vi-VN"
		},
		{
			"id": "1068",
			"display": "Azerbaijani",
			"code": "az-Latn-AZ"
		},
		{
			"id": "1069",
			"display": "Basque",
			"code": "eu-ES"
		},
		{
			"id": "1071",
			"display": "Macedonian",
			"code": "mk-MK"
		},
		{
			"id": "1081",
			"display": "Hindi",
			"code": "hi-IN"
		},
		{
			"id": "1086",
			"display": "Malay",
			"code": "ms-MY"
		},
		{
			"id": "1087",
			"display": "Kazakh",
			"code": "kk-KZ"
		},
		{
			"id": "1106",
			"display": "Welsh",
			"code": "cy-GB"
		},
		{
			"id": "1110",
			"display": "Galician",
			"code": "gl-ES"
		},
		{
			"id": "1164",
			"display": "Dari",
			"code": "prs-AF"
		},
		{
			"id": "2052",
			"display": "Chinese (Simplified)",
			"code": "zh-CN"
		},
		{
			"id": "2070",
			"display": "Portuguese (Portugal)",
			"code": "pt-PT"
		},
		{
			"id": "2074",
			"display": "Serbian (Latin)",
			"code": "sr-Latn-CS"
		},
		{
			"id": "2108",
			"display": "Irish",
			"code": "ga-IE"
		},
		{
			"id": "3082",
			"display": "Spanish",
			"code": "es-ES"
		},
		{
			"id": "5146",
			"display": "Bosnian (Latin)",
			"code": "bs-Latn-BA"
		},
		{
			"id": "9242",
			"display": "Serbian (Latin, Serbia)",
			"code": "sr-Latn-RS"
		},
		{
			"id": "10266",
			"display": "Serbian (Cyrillic, Serbia)",
			"code": "sr-Cyrl-RS"
		}
	];
})(jQuery, SPScript)