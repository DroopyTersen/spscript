
var Site = function(spWeb) {
	this._spWeb = spWeb;
	this.title = spWeb.Title;
	this.description = spWeb.Description;
	this.url = window.location.protocol + "//" + window.location.host + spWeb.ServerRelativeUrl;
	this.lists = [];
	this.sites = [];
};

Site.fromSPWeb = function(spWeb) {
	return new Site(spWeb);
};

//Load up the child webs and lists
Site.prototype.populate = function() {
	var self = this;
	var dao = new SPScript.RestDao(self.url);
	return dao.get("/web/lists")
		.then(function(data){
			self.lists = data.d.results;
		})
		.then(dao.get("/web/webinfos"))
		.then(function(data){
			var spWebs = data.d.results;
			self.sites = $.map(spWebs, Site.fromSPWeb);
		});
};