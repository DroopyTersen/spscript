SPScript = window.SPScript || {};
/* 
 * ==========
 * Helpers
 * Dependencies: ["$"]
 * ==========
 */
(function (sp) {
    var helpers = {};
    helpers.validateODataV2 = function (data, deferred) {
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

    helpers.validateCrossDomainODataV2 = function (response, deferred) {
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

SPScript = window.SPScript || {};

(function (sp) {
    var transforms = {
        roleAssignment: function (raw) {
            var priv = {
                member: {
                    login: raw.Member.LoginName,
                    name: raw.Member.Title,
                    id: raw.Member.Id
                }
            };
            priv.roles = raw.RoleDefinitionBindings.results.map(function (roleDef) {
                var basePermissions = [];
                spBasePermissions.forEach(function (basePermission) {
                    if ((basePermission.low & roleDef.BasePermissions.Low) > 0 || (basePermission.high & roleDef.BasePermissions.High) > 0) {
                        basePermissions.push(basePermission.name);
                    }
                });
                return {
                    name: roleDef.Name,
                    description: roleDef.Description,
                    basePermissions: basePermissions
                };
            });
            return priv;
        }
    };
    var permissions = function (baseUrl, dao, username) {
        if (!username) {
            var url = baseUrl + "/RoleAssignments?$expand=Member,RoleDefinitionBindings";
            return dao.get(url)
				.then(sp.helpers.validateODataV2)
				.then(function (results) {
				    return results.map(transforms.roleAssignment);
				});
        }
        //check privs with username

    };
    var spBasePermissions = [
   {
       "name": "emptyMask",
       "low": 0,
       "high": 0
   },
   {
       "name": "viewListItems",
       "low": 1,
       "high": 0
   },
   {
       "name": "addListItems",
       "low": 2,
       "high": 0
   },
   {
       "name": "editListItems",
       "low": 4,
       "high": 0
   },
   {
       "name": "deleteListItems",
       "low": 8,
       "high": 0
   },
   {
       "name": "approveItems",
       "low": 16,
       "high": 0
   },
   {
       "name": "openItems",
       "low": 32,
       "high": 0
   },
   {
       "name": "viewVersions",
       "low": 64,
       "high": 0
   },
   {
       "name": "deleteVersions",
       "low": 128,
       "high": 0
   },
   {
       "name": "cancelCheckout",
       "low": 256,
       "high": 0
   },
   {
       "name": "managePersonalViews",
       "low": 512,
       "high": 0
   },
   {
       "name": "manageLists",
       "low": 2048,
       "high": 0
   },
   {
       "name": "viewFormPages",
       "low": 4096,
       "high": 0
   },
   {
       "name": "anonymousSearchAccessList",
       "low": 8192,
       "high": 0
   },
   {
       "name": "open",
       "low": 65536,
       "high": 0
   },
   {
       "name": "viewPages",
       "low": 131072,
       "high": 0
   },
   {
       "name": "addAndCustomizePages",
       "low": 262144,
       "high": 0
   },
   {
       "name": "applyThemeAndBorder",
       "low": 524288,
       "high": 0
   },
   {
       "name": "applyStyleSheets",
       "low": 1048576,
       "high": 0
   },
   {
       "name": "viewUsageData",
       "low": 2097152,
       "high": 0
   },
   {
       "name": "createSSCSite",
       "low": 4194304,
       "high": 0
   },
   {
       "name": "manageSubwebs",
       "low": 8388608,
       "high": 0
   },
   {
       "name": "createGroups",
       "low": 16777216,
       "high": 0
   },
   {
       "name": "managePermissions",
       "low": 33554432,
       "high": 0
   },
   {
       "name": "browseDirectories",
       "low": 67108864,
       "high": 0
   },
   {
       "name": "browseUserInfo",
       "low": 134217728,
       "high": 0
   },
   {
       "name": "addDelPrivateWebParts",
       "low": 268435456,
       "high": 0
   },
   {
       "name": "updatePersonalWebParts",
       "low": 536870912,
       "high": 0
   },
   {
       "name": "manageWeb",
       "low": 1073741824,
       "high": 0
   },
   {
       "name": "anonymousSearchAccessWebLists",
       "low": -2147483648,
       "high": 0
   },
   {
       "name": "useClientIntegration",
       "low": 0,
       "high": 16
   },
   {
       "name": "useRemoteAPIs",
       "low": 0,
       "high": 32
   },
   {
       "name": "manageAlerts",
       "low": 0,
       "high": 64
   },
   {
       "name": "createAlerts",
       "low": 0,
       "high": 128
   },
   {
       "name": "editMyUserInfo",
       "low": 0,
       "high": 256
   },
   {
       "name": "enumeratePermissions",
       "low": 0,
       "high": 1073741824
   }
    ]


    sp.permissions = permissions;
})(SPScript);
SPScript = window.SPScript || {};

(function (sp) {
    var baseUrl = "/web";
    var Web = function (dao) {
        this._dao = dao;
    };

    Web.prototype.info = function () {
        return this._dao
			.get(baseUrl)
			.then(sp.helpers.validateODataV2);
    };

    Web.prototype.subsites = function () {
        return this._dao
			.get(baseUrl + "/webinfos")
			.then(sp.helpers.validateODataV2);
    };

    Web.prototype.permissions = function () {
        return sp.permissions(baseUrl, this._dao);
    };
    sp.Web = Web;
})(SPScript);
SPScript = window.SPScript || {};

(function (sp) {
    var baseUrl = null;
    var List = function (listname, dao) {
        this.listname = listname;
        baseUrl = "/web/lists/getbytitle('" + listname + "')";
        this._dao = dao;
    };

    List.prototype.getItems = function (odataQuery) {
        var query = (odataQuery != null) ? "?" + odataQuery : "";
        return this._dao
			.get(baseUrl + "/items" + query)
			.then(sp.helpers.validateODataV2);
    };

    List.prototype.getItemById = function (id) {
        var url = baseUrl + "/items(" + id + ")";
        return this._dao.get(url).then(sp.helpers.validateODataV2);
    };

    List.prototype.info = function () {
        return this._dao.get(baseUrl).then(sp.helpers.validateODataV2);
    };

    List.prototype.addItem = function (item) {
        var self = this;
        return self._dao.get(baseUrl).then(function (data) {
            item = $.extend({
                "__metadata": {
                    "type": data.d.ListItemEntityTypeFullName
                }
            }, item);

            var customOptions = {
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                }
            };

            return self._dao.post(baseUrl + "/items", item, customOptions);
        });
    };

    List.prototype.updateItem = function (itemId, updates) {
        var self = this;
        return self.getItemById(itemId).then(function (item) {
            updates = $.extend({
                "__metadata": {
                    "type": item.__metadata.type
                }
            }, updates);

            var customOptions = {
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    "X-HTTP-Method": "MERGE",
                    "If-Match": item.__metadata.etag
                }
            };

            return self._dao.post(url, updates, customOptions);
        });
    };

    List.prototype.findItems = function (key, value) {
        //if its a string, wrap in single quotes
        var filterValue = typeof value === "string" ? "'" + value + "'" : value;
        var odata = "$filter=" + key + " eq " + filterValue;
        return this.getItems(odata);
    };

    List.prototype.findItem = function (key, value) {
        return this.findItems(key, value).then(function (items) {
            if (items && items.length && items.length > 0) {
                return items[0];
            }
            return null;
        });
    };

    List.prototype.permissions = function () {
        return sp.permissions(baseUrl, this._dao);
    };

    sp.List = List;
})(SPScript);

SPScript = window.SPScript || {};
/* 
 * ==========
 * BaseDao - 'Abstract', use either RestDao or CrossDomainDao which inherit
 * Dependencies: ["$", "Web"]
 * ==========
 */
(function (sp) {
    var BaseDao = function () {
        var self = this;

        self.web = new sp.Web(self);
    };

    BaseDao.prototype.executeRequest = function () {
        throw "Not implemented exception";
    };

    BaseDao.prototype.get = function (relativeQueryUrl, extendedOptions, raw) {
        var options = {
            method: "GET"
        };

        if (extendedOptions) {
            $.extend(options, extendedOptions);
        }
        return this.executeRequest(relativeQueryUrl, options);
    };

    //lists()
    //lists(listname).info()
    //lists(listname).getItemById(id)
    //lists(listname).addItem(item)
    //lists(listname).updateItem(id, item)
    //lists(listname).getItems()
    //lists(listname).getItems(odata)
    //lists(listname).findItems(key, value)
    //lists(listname).findItem(key, value)
    BaseDao.prototype.lists = function (listname) {
        if (!listname) {
            return this.get("/web/lists").then(sp.helpers.validateODataV2);
        }
        return new sp.List(listname, this);
    };

    BaseDao.prototype.post = function (relativePostUrl, body, extendedOptions) {
        var strBody = JSON.stringify(body);
        var options = {
            method: "POST",
            data: strBody,
            contentType: "application/json;odata=verbose"
        };
        $.extend(options, extendedOptions);
        return this.executeRequest(relativePostUrl, options);
    };

    BaseDao.prototype.uploadFile = function (folderUrl, name, base64Binary) {
        var uploadUrl = "/web/GetFolderByServerRelativeUrl('" + folderUrl + "')/Files/Add(url='" + name + "',overwrite=true)",
			options = {
			    binaryStringRequestBody: true,
			    state: "Update"
			};
        return this.post(uploadUrl, base64Binary, options);
    };

    sp.BaseDao = BaseDao;
})(SPScript);
SPScript = window.SPScript || {};
/* 
 * ==========
 * RestDao
 * Dependencies: ["$", "baseDao.js"]
 * ==========
 */
(function (sp) {
    var RestDao = function (url) {
        var self = this;
        sp.BaseDao.call(this);
        this.webUrl = url;
    };

    RestDao.prototype = new SPScript.BaseDao();

    RestDao.prototype.executeRequest = function (relativeUrl, options) {
        var self = this,
			deferred = new $.Deferred(),

			//If a callback was given execute it, passing response then the deferred
			//otherwise just resolve the deferred.
			successCallback = function (response) {
			    if (options.success) {
			        options.success(response, deferred);
			    } else {
			        deferred.resolve(response);
			    }
			},
			errorCallback = function (data, errorCode, errorMessage) {
			    if (options.error) {
			        options.error(data, errorCode, errorMessage, deferred);
			    } else {
			        deferred.reject(errorMessage);
			    }
			},
			fullUrl = this.webUrl + "/_api" + relativeUrl,
			executeOptions = {
			    url: fullUrl,
			    method: "GET",
			    headers: {
			        "Accept": "application/json; odata=verbose"
			    },
			    success: successCallback,
			    error: errorCallback
			};

        $.extend(executeOptions, options);
        $.ajax(executeOptions);

        return deferred.promise();
    };

    sp.RestDao = RestDao;
})(SPScript);
SPScript = window.SPScript || {};
/* 
 * ==========
 * queryString
 * Dependencies: []
 * ==========
 */
(function (sp) {
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
        _processQueryString: function (text) {
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
        contains: function (key, text) {
            if (!this._processed) {
                this._processQueryString(text);
            }
            return this._queryString.hasOwnProperty(key);
        },

        getValue: function (key, text) {
            if (!this._processed) {
                this._processQueryString(text);
            }
            return this.contains(key) ? this._queryString[key] : "";
        },

        getAll: function (text) {
            if (!this._processed) {
                this._processQueryString(text);
            }
            return this._queryString;
        },

        objectToQueryString: function (obj, quoteValues) {
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
SPScript = window.SPScript || {};
/* 
 * ==========
 * Search
 * Dependencies: ["$", "restDao.js", "queryString.js" ]
 * ==========
 */
(function (sp) {
    var Search = function (url) {
        this.dao = new SPScript.RestDao(url);
        this.webUrl = url;
    };

    Search.QueryOptions = function () {
        this.sourceid = null;
        this.startrow = null;
        this.rowlimit = 30;
        this.selectedproperties = null;
        this.refiners = null;
        this.refinementfilters = null;
        this.hiddenconstraints = null;
        this.sortlist = null;
    };

    var convertRowsToObjects = function (itemRows) {
        var items = [];

        for (var i = 0; i < itemRows.length; i++) {
            var row = itemRows[i],
				item = {};
            for (var j = 0; j < row.Cells.results.length; j++) {
                item[row.Cells.results[j].Key] = row.Cells.results[j].Value;
            }

            items.push(item);
        }

        return items;
    };

    //sealed class used to format results
    var SearchResults = function (queryResponse) {
        this.elapsedTime = queryResponse.ElapsedTime;
        this.suggestion = queryResponse.SpellingSuggestion;
        this.resultsCount = queryResponse.PrimaryQueryResult.RelevantResults.RowCount;
        this.totalResults = queryResponse.PrimaryQueryResult.RelevantResults.TotalRows;
        this.totalResultsIncludingDuplicates = queryResponse.PrimaryQueryResult.RelevantResults.TotalRowsIncludingDuplicates;
        this.items = convertRowsToObjects(queryResponse.PrimaryQueryResult.RelevantResults.Table.Rows.results);
    };

    Search.prototype.query = function (queryText, queryOptions) {
        var self = this,
			optionsQueryString = queryOptions != null ? "&" + SPScript.queryString.objectToQueryString(queryOptions, true) : "",
			asyncRequest = new $.Deferred();

        var url = "/search/query?querytext='" + queryText + "'" + optionsQueryString;
        var getRequest = self.dao.get(url);

        getRequest.done(function (data) {
            if (data.d && data.d.query) {
                var results = new SearchResults(data.d.query);
                asyncRequest.resolve(results);
            } else {
                asyncRequest.reject(data);
            }
        });

        return asyncRequest.promise();
    };

    sp.Search = Search;
})(SPScript);
SPScript = window.SPScript || {};
/* 
 * ==========
 * templating
 * ==========
 */
(function (sp) {
    sp.templating = {

        Placeholder: function (raw) {
            this.raw = raw;
            this.fullProperty = raw.slice(2, raw.length - 2);
        },

        getPlaceHolders: function (template, regexp) {
            var regExpPattern = regexp || /\{\{[^\}]+\}\}?/g;
            return template.match(regExpPattern);
        },

        getObjectValue: function (obj, fullProperty) {
            var value = obj,
				propertyChain = fullProperty.split('.');

            for (var i = 0; i < propertyChain.length; i++) {
                var property = propertyChain[i];
                value = value[property] != null ? value[property] : "Not Found: " + fullProperty;
            }

            if (fullProperty === "_") {
                value = obj;
            }

            if ((typeof value === "string") && value.indexOf("/Date(") !== -1) {
                var dateValue = value.UTCJsonToDate();
                value = dateValue.toLocaleDateString();
            }

            return value;
        },

        populateTemplate: function (template, item, regexp) {
            var placeholders = this.getPlaceHolders(template, regexp) || [],
				itemHtml = template;

            for (var i = 0; i < placeholders.length; i++) {
                var placeholder = new this.Placeholder(placeholders[i]);
                placeholder.val = this.getObjectValue(item, placeholder.fullProperty);
                var pattern = placeholder.raw.replace("[", "\\[").replace("]", "\\]");
                var modifier = "g";
                itemHtml = itemHtml.replace(new RegExp(pattern, modifier), placeholder.val);
            }
            return itemHtml;
        }
    };

    sp.templating.Each = {

        regExp: /\{\[[^\]]+\]\}?/g,

        populateEachTemplates: function (itemHtml, item) {
            var $itemHtml = $(itemHtml),
				eachTemplates = $itemHtml.find("[data-each]");

            eachTemplates.each(function () {
                var arrayHtml = "",
					itemTemplate = $(this).html(),
					arrayProp = $(this).data("each"),
					array = sp.templating.getObjectValue(item, arrayProp);

                if (array != null && $.isArray(array)) {
                    for (var i = 0; i < array.length; i++) {
                        arrayHtml += sp.templating.populateTemplate(itemTemplate, array[i], sp.templating.Each.regExp);
                    }
                }

                $itemHtml.find($(this)).html(arrayHtml);
            });

            var temp = $itemHtml.clone().wrap("<div>");
            return temp.parent().html();
        }
    };

    sp.templating.renderTemplate = function (template, item, renderEachTemplate) {
        var itemHtml = sp.templating.populateTemplate(template, item);
        if (renderEachTemplate) {
            itemHtml = sp.templating.Each.populateEachTemplates(itemHtml, item);
        }
        return itemHtml;
    };
})(SPScript);

String.prototype.UTCJsonToDate = function () {
    var utcStr = this.substring(this.indexOf("(") + 1);
    utcStr = utcStr.substring(0, utcStr.indexOf(")"));

    var returnDate = new Date(parseInt(utcStr, 10));
    var hourOffset = returnDate.getTimezoneOffset() / 60;
    returnDate.setHours(returnDate.getHours() + hourOffset);

    return returnDate;
};