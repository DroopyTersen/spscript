"use strict";

/* 
 * ==========
 * ChromeControl
 * Dependencies: ["$"]
 * ==========
 */
(function (sp) {
	var ChromeControl = function ChromeControl(hostUrl, placeholderId, options) {
		this.scriptReady = new $.Deferred();
		spCssReady = new $.Deferred();

		this.placeholder = placeholderId;
		if (SP == null || SP.UI == null || SP.UI.Controls == null || SP.UI.Controls.Navigation == null) {
			this.scriptReady = $.getScript(hostUrl + "/_layouts/15/SP.UI.Controls.js");
		} else {
			this.scriptReady.resolve();
		}

		this.options = {
			siteTitle: null,
			siteUrl: hostUrl,
			clientTag: null,
			appWebUrl: null,
			assetId: null,
			appStartPage: null,
			rightToLeft: null,
			appTitle: null,
			appIconUrl: null,
			appTitleIconUrl: null,
			appHelpPageUrl: null,
			appHelpPageOnClick: null,
			settingsLinks: null,
			language: null,
			bottomHeaderVisible: null,
			topHeaderVisible: null
		};
		$.extend(this.options, options);
	};

	ChromeControl.SettingLink = function (url, display) {
		this.linkUrl = url;
		this.displayName = display;
	};

	ChromeControl.prototype.render = function () {
		var self = this;
		//the onCssLoaded only takes a string. So I abstracted it out with a deferred
		this.options.onCssLoaded = "spCssReady.resolve();";
		this.scriptReady.done(function () {
			self.spChromeControl = new SP.UI.Controls.Navigation(self.placeholder, self.options);
			self.spChromeControl.setVisible(true);
		});
		return spCssReady.promise();
	};

	sp.ChromeControl = ChromeControl;
})(SPScript);
//# sourceMappingURL=chromeControl.js.map