"use strict";

(function (sp) {
	var SPExplorer = function SPExplorer(webUrl) {
		this.webUrl = webUrl;
		this.parentWebUrl = null;
		this.parentWeb = null;
		this.rootSite = null;
		this.serverUrl = window.location.protocol + "//" + window.location.host;
	};

	SPExplorer.prototype.getParentWeb = function (currentWebUrl) {
		var dao = new sp.RestDao(currentWebUrl);
		var relativeUrl = "/Web/ParentWeb";

		return dao.get(relativeUrl).then(function (data) {

			if (data && data.d && data.d.ParentWeb !== null) {
				return data.d;
			}
			return null;
		}, function () {
			return null;
		});
	};

	SPExplorer.prototype._recursiveSetParent = function (url) {
		var self = this;
		return self.getParentWeb(url).then(function (parentWeb) {

			if (parentWeb !== null) {
				self.parentWeb = parentWeb;
				return self._recursiveSetParent(self.serverUrl + parentWeb.ServerRelativeUrl);
			}
		});
	};

	SPExplorer.prototype.setRootWeb = function () {
		var self = this;
		return self._recursiveSetParent(this.webUrl).then(function () {
			self.rootSite = new SPExplorerSite(self.parentWeb);
			console.log(self.rootSite);
		});
	};

	var SPExplorerSite = function SPExplorerSite(spWeb) {
		this._spWeb = spWeb;
		this.title = spWeb.Title;
		this.description = spWeb.Description;
		this.url = window.location.protocol + "//" + window.location.host + spWeb.ServerRelativeUrl;
		this.lists = [];
		this.sites = [];
	};

	SPExplorerSite.fromSPWeb = function (spWeb) {
		return new SPExplorerSite(spWeb);
	};

	SPExplorerSite.prototype.populate = function () {
		var self = this;
		var dao = new sp.RestDao(self.url);
		return dao.get("/web/lists").then(function (data) {
			self.lists = data.d.results;
		}).then(function () {
			return dao.get("/web/webinfos");
		}).then(function (data) {
			var spWebs = data.d.results;
			self.sites = $.map(spWebs, SPExplorerSite.fromSPWeb);
		});
	};

	sp.SPExplorer = SPExplorer;
})(SPScript);
//# sourceMappingURL=spExplorer.js.map