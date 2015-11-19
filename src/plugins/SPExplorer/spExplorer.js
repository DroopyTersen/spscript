(function (sp) {
    var SPExplorer = function ($container, webUrl, options) {
        var self = this;
        this.webUrl = webUrl;
        this.parentWebUrl = null;
        this.parentWeb = null;
        this.rootSite = null;
        this.serverUrl = window.location.protocol + "//" + window.location.host;
        this.$container = $container;
        options = options || {};
        this.listOData = options.listOData || "";
        this.webOData = options.webOData || "";
        this.postFilter = options.postFilter;

        //$("head").append('<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet"><style>.list-group .panel {margin-bottom: 0; border-radius: 0}	.list-group .panel-heading { border-radius: 0; border-color: #2473B8;}</style>');
        this.events = {
            siteClick: function (event) {
                event.preventDefault();

                $element = $(this).parent();
                var url = $element.data("url");
                SPExplorerSite.fromUrl(url)
				.then(function (site) {
				    return site.populate(self.listOData, self.webOData, self.postFilter);
				})
				.then(function (site) {
				    var html = sp.templating.renderTemplate(SPExplorerSite.template, site, true);
				    $element.replaceWith(html);
				});
                self.$container.trigger("siteClick", $(this));
            },
            panelClick: function (event) {
                event.preventDefault();

                var $this = $(this);
                var action = $this.data("action");
                if (action === "collapse") {
                    $this.closest(".panel").find("> .panel-body").slideUp();
                    $this.data("action", "expand").find("span").removeClass("glyphicon-minus").addClass("glyphicon-plus");
                } else if (action === "expand") {
                    $this.closest(".panel").find("> .panel-body").slideDown();
                    $this.data("action", "collapse").find("span").removeClass("glyphicon-plus").addClass("glyphicon-minus");
                }

                self.$container.trigger("panelClick", $(this));
            },
            listClick: function (event) {
                event.preventDefault();
                var $this = $(this);
                var listData = {
                    title: $this.text(),
                    id: $this.data("id"),
					listServerRelativeUrl: $this.data("listserverrelativeurl"),
                    webUrl: $this.closest(".panel").data("url")
                };
                self.$container.trigger("listClick", [$this, listData]);
            }
        };

        var init = function () {
            self.$container.on("click", ".list-group-item > button", self.events.siteClick);
            self.$container.on("click", ".panel-title > button", self.events.panelClick);
            self.$container.on("click", ".lists > .list-group-item", self.events.listClick);
            self.setRootWeb()
				.then(function () {
				    return self.rootSite.populate(self.listOData, self.webOData, self.postFilter);
				})
				.then(function () {
				    var html = sp.templating.renderTemplate(SPExplorerSite.template, self.rootSite, true);
				    self.$container.append(html);
				});
        };

        init();
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
        return self.getParentWeb(url)
			.then(function (parentWeb) {
			    if (parentWeb !== null) {
			        self.parentWeb = parentWeb;
			        return self._recursiveSetParent(self.serverUrl + parentWeb.ServerRelativeUrl);
			    } else {
			        return;
			    }
			});
    };

    SPExplorer.prototype.setRootWeb = function () {
        var self = this;
        var deferred = new $.Deferred();

        self._recursiveSetParent(this.webUrl)
			.then(function () {
			    if (!self.parentWeb) {
			        //No parent site was found so use current web
			        return SPExplorerSite.fromUrl(self.webUrl)
						.then(function (explorerSite) {
						    self.parentWeb = explorerSite._spWeb;
						    return explorerSite;
						});
			    } else {
			        //a parent site was found
			        return SPExplorerSite.fromSPWeb(self.parentWeb);
			    }
			})
			.then(function (explorerSite) {
			    self.rootSite = explorerSite;
			    deferred.resolve();
			})
			.fail(function () {
			    deferred.reject(arguments);
			});

        return deferred.promise();
    };


    var SPExplorerSite = function (spWeb) {
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

    SPExplorerSite.fromUrl = function (url) {
        var self = this;
        var dao = new sp.RestDao(url);
        return dao.get("/web")
			.then(function (data) {
			    return data.d;
			})
			.then(SPExplorerSite.fromSPWeb);
    };

    SPExplorerSite.prototype.populate = function (listOdata, webOdata, postFilterFunc) {
        var self = this;
        var dao = new sp.RestDao(self.url);
        listOdata = "?$expand=RootFolder&$select=RootFolder/ServerRelativeUrl" + (listOdata ? "&" + listOdata : ""); //listOdata || "";
        //Make sure that we select the properties we need to map the spWeb to an SPExplorerSite
        webOdata = "?$select=Title,Description,ServerRelativeUrl" + (webOdata ? "&" + webOdata : "");
        return dao.get("/web/lists" + listOdata)
			.then(function (data) {
			    self.lists = data.d.results;
			})
			.then(function () {
			    return dao.get("/web/webs" + webOdata);
			})
			.then(function (data) {
			    var spWebs = data.d.results;
			    self.sites = $.map(spWebs, SPExplorerSite.fromSPWeb);
			})
			.then(function () {
			    if (postFilterFunc && typeof (postFilterFunc) === "function") {
			        return postFilterFunc(self);
			    } else {
			        return self;
			    }
			});
    };

    SPExplorerSite.template = '' +
	'<div class="panel panel-primary" data-url="{{url}}">' +
		'<div class="panel-heading">' +
			'<h3 class="panel-title">' +
				'<button type="button" class="btn btn-primary btn-sm" data-action="collapse">' +
					'<span class="glyphicon glyphicon-minus"></span>' +
				'</button> {{title}}</h3>' +
		'</div>' +
		'<div class="panel-body">' +
			'<h4>Lists</h4>' +
			'<div class="list-group lists" data-each="lists">' +
				'<a href="#" data-id="{[Id]}" data-listserverrelativeurl="{[RootFolder.ServerRelativeUrl]}" class="list-group-item">{[Title]}</a>' +
			'</div>' +
			'<hr/>' +
			'<div class="list-group" data-each="sites">' +
				'<a href="#" class="list-group-item" data-url="{[url]}">' +
					'<button type="button" class="btn btn-primary btn-sm" data-action="expand"><span class="glyphicon glyphicon-plus"></span></button> <strong> {[title]}</strong>' +
				'</a>' +
			'</div>' +
		'</div>' +
	'</div>';

    SPExplorer.SPExplorerSite = SPExplorerSite;
    sp.SPExplorer = SPExplorer;