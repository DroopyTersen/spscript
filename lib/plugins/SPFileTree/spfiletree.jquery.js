"use strict";

(function ($, sp) {
	var pluginName = "spFileTree";

	var Folder = function Folder(spItem) {
		this.url = spItem.Folder.ServerRelativeUrl;
		this.parentUrl = spItem.Folder.ParentFolder.ServerRelativeUrl;
		this.name = spItem.Folder.Name;
		this._spItem = spItem;
		this.folders = [];
		this.files = [];
	};

	Folder.prototype.toHtml = function () {
		var html = "<li class='folder'>" + this.name;
		html += "<ul>";
		this.folders.forEach(function (folder) {
			html += folder.toHtml();
		});
		this.files.forEach(function (file) {
			html += file.toHtml();
		});
		html += "</ul></li>";

		return html;
	};

	var File = function File(spItem) {
		this.url = spItem.File.ServerRelativeUrl;
		this.parentUrl = spItem.File.ServerRelativeUrl.replace("/" + spItem.File.Name, "");
		this.name = spItem.File.Name;
		//this._spItem = spItem;
	};

	File.prototype.toHtml = function () {
		return "<li class='file'><a href='" + this.url + "'>" + this.name + "</a></li>";
	};

	var SPFileTree = function SPFileTree(element, options) {
		this._defaults = {
			webUrl: _spPageContextInfo.webAbsoluteUrl
		};
		this._name = pluginName;
		this.options = $.extend(this._defaults, options);
		var select = "&$select=File/ServerRelativeUrl, Folder/ServerRelativeUrl, Folder/ParentFolder/ServerRelativeUrl, Folder/Name, File/Name";
		this.options.odata = "$expand=Folder,File,Folder/ParentFolder&$top=2000" + select;
		this.library = {
			name: options.library
		};
		this.rootFolderUrl = "/sites/FoodServices/Style Library";
		this.$elem = $(element);
		this._dao = null;
		this.init();
	};

	var _sortByUrl = function _sortByUrl(a, b) {
		if (a.url < b.url) {
			return -1;
		} else if (a.url > b.url) {
			return 1;
		}
		return 0;
	};

	var _sortByParentUrl = function _sortByParentUrl(a, b) {
		if (a.parentUrl < b.parentUrl) {
			return -1;
		} else if (a.parentUrl > b.parentUrl) {
			return 1;
		}
		return 0;
	};

	SPFileTree.prototype.getFiles = function (folderUrl, j) {
		var files = [];
		while (j < this.allFiles.length && this.allFiles[j].parentUrl === folderUrl) {
			files.push(this.allFiles[j]);
			j++;
		}
		return { files: files, fileIndex: j };
	};

	SPFileTree.prototype._recursivePopulateChildFolders = function (parentFolder, i, j) {
		var self = this;
		var recursiveResult;
		var getFilesResult;
		while (i < self.allFolders.length) {
			// 1. next folder is a child folder

			if (self.allFolders[i].parentUrl === parentFolder.url) {
				getFilesResult = self.getFiles(self.allFolders[i].url, j);
				j = getFilesResult.fileIndex;

				recursiveResult = self._recursivePopulateChildFolders(self.allFolders[i], i + 1, j);
				recursiveResult.folder.files = getFilesResult.files;
				parentFolder.folders.push(recursiveResult.folder);
				i = recursiveResult.index;
				j = recursiveResult.fileIndex;
			}
			// 2. next folder is a sibling
			else if (self.allFolders[i].parentUrl === parentFolder.parentUrl) {
					// Return the parent folder (sibling A) to be pushed on the parent's folder array,
					// Don't increment the index so sibling B will get processed as a child folder once it pops up the recursive chain
					return { folder: parentFolder, index: i, fileIndex: j };
				}
				// 3. next folder pops back up the tree
				else if (self.allFolders[i].url.length < parentFolder.url.length) {
						return { folder: parentFolder, index: i, fileIndex: j };
					} else {
						i++;
					}
		}
		return { folder: parentFolder, index: i, fileIndex: j };
	};

	SPFileTree.prototype.unflatten = function (items) {
		//sort them?
		var self = this;
		var allFolders = [];
		var allFiles = [];
		items.forEach(function (item) {
			if (item.Folder && item.Folder.ServerRelativeUrl) {
				allFolders.push(new Folder(item));
				// allFolders[item.Folder.ServerRelativeUrl] = { item: item };
			} else if (item.File && item.File.ServerRelativeUrl) {
					allFiles.push(new File(item));
				}
		});

		allFolders.sort(_sortByUrl);
		allFiles.sort(_sortByParentUrl);
		self.allFolders = allFolders;
		self.allFiles = allFiles;
		var rootFolder = {
			name: self.library.name,
			url: "/sites/FoodServices/Style Library",
			parentUrl: self.library.parentUrl,
			folders: [],
			files: []
		};
		var recursiveResult = self._recursivePopulateChildFolders(rootFolder, 0, 0);
		console.log(recursiveResult);
		return recursiveResult.folder;
	};

	SPFileTree.prototype.getListInfo = function () {
		var self = this;
		return this._dao.lists(this.library.name).info().then(function (info) {
			self.library.parentUrl = info.ParentWebUrl;
			console.log(info);
		});
	};

	SPFileTree.prototype.getItems = function () {
		return this._dao.lists(this.library.name).getItems(this.options.odata);
	};
	SPFileTree.prototype.init = function () {
		var self = this;
		this._dao = new sp.RestDao(this.options.webUrl);
		this.getListInfo().then(self.getItems.bind(self)).then(self.unflatten.bind(self)).then(function (libraryFolder) {
			var html = "<ul class='treedata' style='display:none'>";
			html += Folder.prototype.toHtml.call(libraryFolder) + "</ul>";
			self.$elem.html(html).fancytree();
		});
	};

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			return new SPFileTree(this, options);
		});
	};
})(jQuery, SPScript);
//# sourceMappingURL=spfiletree.jquery.js.map