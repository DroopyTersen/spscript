'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var qs = require('querystring');
var url = require('url');

function fromObj(obj, quoteValues) {
  var writeParam = function writeParam(key) {
    var value = (obj[key] + "").trim(); // if there is a space, wrap in single quotes

    if (value.indexOf(" ") > -1 || quoteValues) value = "'" + value + "'";
    return key + "=" + value;
  };

  var str = Object.keys(obj).map(writeParam).join("&");
  return str;
}
function toObj(str) {
  //if no string is passed use window.location.search
  if (str === undefined && window && window.location && window.location.search) {
    str = window.location.search;
  }

  if (!str) return {}; //trim off the leading '?' if its there

  if (str[0] === "?") str = str.substr(1);
  return qs.parse(str);
}

const jsonMimeType = "application/json;odata=verbose";

function getStandardHeaders(digest) {
  var headers = {
    "Accept": jsonMimeType,
    "Content-Type": jsonMimeType
  };
  if (digest) headers["X-RequestDigest"] = digest;
  return headers;
}

var getAddHeaders = getStandardHeaders;

var getFilestreamHeaders = function getFilestreamHeaders(digest) {
  return {
    'Accept': jsonMimeType,
    'X-RequestDigest': digest,
    'Content-Type': "application/octet-stream",
    'binaryStringRequestBody': "true"
  };
};

var getActionHeaders = function getActionHeaders(verb, digest) {
  return Object.assign({}, getStandardHeaders(digest), {
    "X-HTTP-Method": verb
  });
};

var decorateETag = function decorateETag(headers, etag) {
  if (etag) headers["If-Match"] = etag;
  return headers;
};

var getUpdateHeaders = (digest, etag) => decorateETag(getActionHeaders("MERGE", digest), etag);

var getDeleteHeaders = (digest, etag) => decorateETag(getActionHeaders("DELETE", digest), etag);

var headerUtils = {
  getStandardHeaders,
  getAddHeaders,
  getFilestreamHeaders,
  getUpdateHeaders,
  getDeleteHeaders,
  getActionHeaders
};

var loadCSS = function loadCSS(url) {
  var link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute("href", url);
  document.querySelector("head").appendChild(link);
};
var loadScript = function loadScript(url) {
  return new Promise((resolve, reject) => {
    var scriptTag = window.document.createElement("script");
    var firstScriptTag = document.getElementsByTagName('script')[0];
    scriptTag.async = true;
    firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);

    scriptTag.onload = scriptTag.onreadystatechange = function (arg, isAbort) {
      // if its been aborted, readyState is gone, or readyState is in a 'done' status
      if (isAbort || !scriptTag.readyState || /loaded|complete/.test(scriptTag.readyState)) {
        //clean up
        scriptTag.onload = scriptTag.onreadystatechange = null;
        scriptTag = undefined; // resolve/reject the promise

        if (!isAbort) resolve();
      }
    };

    scriptTag.src = url;
  });
};
var loadScripts = function loadScripts(urls) {
  return Promise.all(urls.map(loadScript));
};

var validateNamespace = function validateNamespace(namespace) {
  var scope = window;
  var sections = namespace.split(".");
  var sectionsLength = sections.length;

  for (var i = 0; i < sectionsLength; i++) {
    var prop = sections[i];

    if (prop in scope) {
      scope = scope[prop];
    } else {
      return false;
    }
  }

  return true;
};

var _waitForLibraries = function _waitForLibraries(namespaces, resolve) {
  var missing = namespaces.filter(namespace => !validateNamespace(namespace));
  if (missing.length === 0) resolve();else setTimeout(() => _waitForLibraries(namespaces, resolve), 25);
};

var waitForLibraries = function waitForLibraries(namespaces) {
  return new Promise((resolve, reject) => _waitForLibraries(namespaces, resolve));
};
var waitForLibrary = function waitForLibrary(namespace) {
  return waitForLibraries([namespace]);
};
var waitForElement = function waitForElement(selector, timeout = 5000) {
  var counter = 0;
  const INTERVAL = 25; //milliseconds

  const MAX_ATTEMPTS = timeout / INTERVAL; // eventually give up

  return new Promise((resolve, reject) => {
    var _waitForElement = function _waitForElement() {
      if (counter > MAX_ATTEMPTS) reject("Unable to find element: " + selector);
      var elem = document.querySelector(selector);

      if (!elem) {
        counter++;
        setTimeout(_waitForElement, INTERVAL);
      } else resolve(elem);
    };

    _waitForElement();
  });
};

function isBrowser() {
  return !(typeof window === "undefined");
}

function parseJSON(data) {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      return null;
    }
  }

  return data;
}

var getArrayBuffer = function getArrayBuffer(file) {
  if (file && file instanceof File) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();

      reader.onload = function (e) {
        resolve(e.target.result);
      };

      reader.readAsArrayBuffer(file);
    });
  } else {
    throw "SPScript.utils.getArrayBuffer: Cant get ArrayBuffer if you don't pass in a file";
  }
};

function validateODataV2(data) {
  data = parseJSON(data);
  var results = null;

  if (data.d && data.d.results && data.d.results.length != null) {
    results = data.d.results;
  } else if (data.d) {
    results = data.d;
  }

  return results || data;
}

function openModal(url, modalOptions) {
  ensureModalLibrary().then(() => {
    var defaults = {
      title: " "
    };
    var options = Object.assign({}, defaults, modalOptions, {
      url
    });
    return SP.UI.ModalDialog.showModalDialog(options);
  });
}

var ensureModalLibrary = function ensureModalLibrary() {
  if (!validateNamespace("SP.UI.ModalDialog")) {
    return loadScript("/_layouts/15/1033/sp.res.js").then(() => loadScript("/_layouts/15/sp.ui.dialog.js"));
  }

  return Promise.resolve(true);
};

var utils = {
  isBrowser,
  headers: headerUtils,
  parseJSON,
  validateODataV2,
  qs: {
    toObj,
    fromObj
  },
  loadScript,
  loadScripts,
  loadCSS,
  getArrayBuffer,
  waitForLibraries,
  waitForLibrary,
  validateNamespace,
  waitForElement,
  openModal
};

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var defaults = {
  method: "GET",
  credentials: "include",
  redirect: "follow"
};

var request = function request(url, options) {
  var opts = Object.assign({}, defaults, options);
  return fetch(url, opts).then(resp => {
    var succeeded = resp.ok;

    if (!resp.ok) {
      return resp.text().then(err => {
        throw new Error(err);
      });
    }

    return resp.text().then(text => {
      return utils.parseJSON(text) || text;
    });
  });
};

var basePermissions = [{
  "name": "emptyMask",
  "low": 0,
  "high": 0
}, {
  "name": "viewListItems",
  "low": 1,
  "high": 0
}, {
  "name": "addListItems",
  "low": 2,
  "high": 0
}, {
  "name": "editListItems",
  "low": 4,
  "high": 0
}, {
  "name": "deleteListItems",
  "low": 8,
  "high": 0
}, {
  "name": "approveItems",
  "low": 16,
  "high": 0
}, {
  "name": "openItems",
  "low": 32,
  "high": 0
}, {
  "name": "viewVersions",
  "low": 64,
  "high": 0
}, {
  "name": "deleteVersions",
  "low": 128,
  "high": 0
}, {
  "name": "cancelCheckout",
  "low": 256,
  "high": 0
}, {
  "name": "managePersonalViews",
  "low": 512,
  "high": 0
}, {
  "name": "manageLists",
  "low": 2048,
  "high": 0
}, {
  "name": "viewFormPages",
  "low": 4096,
  "high": 0
}, {
  "name": "anonymousSearchAccessList",
  "low": 8192,
  "high": 0
}, {
  "name": "open",
  "low": 65536,
  "high": 0
}, {
  "name": "viewPages",
  "low": 131072,
  "high": 0
}, {
  "name": "addAndCustomizePages",
  "low": 262144,
  "high": 0
}, {
  "name": "applyThemeAndBorder",
  "low": 524288,
  "high": 0
}, {
  "name": "applyStyleSheets",
  "low": 1048576,
  "high": 0
}, {
  "name": "viewUsageData",
  "low": 2097152,
  "high": 0
}, {
  "name": "createSSCSite",
  "low": 4194304,
  "high": 0
}, {
  "name": "manageSubwebs",
  "low": 8388608,
  "high": 0
}, {
  "name": "createGroups",
  "low": 16777216,
  "high": 0
}, {
  "name": "managePermissions",
  "low": 33554432,
  "high": 0
}, {
  "name": "browseDirectories",
  "low": 67108864,
  "high": 0
}, {
  "name": "browseUserInfo",
  "low": 134217728,
  "high": 0
}, {
  "name": "addDelPrivateWebParts",
  "low": 268435456,
  "high": 0
}, {
  "name": "updatePersonalWebParts",
  "low": 536870912,
  "high": 0
}, {
  "name": "manageWeb",
  "low": 1073741824,
  "high": 0
}, {
  "name": "anonymousSearchAccessWebLists",
  "low": -2147483648,
  "high": 0
}, {
  "name": "useClientIntegration",
  "low": 0,
  "high": 16
}, {
  "name": "useRemoteAPIs",
  "low": 0,
  "high": 32
}, {
  "name": "manageAlerts",
  "low": 0,
  "high": 64
}, {
  "name": "createAlerts",
  "low": 0,
  "high": 128
}, {
  "name": "editMyUserInfo",
  "low": 0,
  "high": 256
}, {
  "name": "enumeratePermissions",
  "low": 0,
  "high": 1073741824
}];

/** Allows you to check the permissions of a securable (list or site) */

class Securable {
  constructor(baseUrl, ctx) {
    this.baseUrl = baseUrl;
    this._dao = ctx;
  }
  /** Gets all the role assignments on that securable  */


  getRoleAssignments() {
    var url = this.baseUrl + "/RoleAssignments?$expand=Member,RoleDefinitionBindings";
    return this._dao.get(url).then(utils.validateODataV2).then(results => results.map(transformRoleAssignment));
  }

  checkPrivs(user) {
    var login = encodeURIComponent(user.LoginName);
    var url = this.baseUrl + "/getusereffectivepermissions(@v)?@v='" + login + "'";
    return this._dao.get(url).then(utils.validateODataV2);
  }
  /** Gets all the role assignments on that securable. If you don't pass an email, it will use the current user. */


  check(email) {
    if (!email && !utils.isBrowser()) {
      return Promise.reject("Can't check permissions. No email passed and no current user");
    } // If no email is passed, then get current user, else get user by email


    var req = !email ? this._dao.get('/web/getuserbyid(' + _spPageContextInfo.userId + ')').then(data => data.d) : this._dao.web.getUser(email);
    return req.then(user => this.checkPrivs(user)).then(privs => permissionMaskToStrings(privs.GetUserEffectivePermissions.Low, privs.GetUserEffectivePermissions.High));
  }

}

var transformRoleAssignment = function transformRoleAssignment(raw) {
  var member = {
    login: raw.Member.LoginName,
    name: raw.Member.Title,
    id: raw.Member.Id
  };
  var roles = raw.RoleDefinitionBindings.results.map(roleDef => {
    return {
      name: roleDef.Name,
      description: roleDef.Description,
      basePermissions: permissionMaskToStrings(roleDef.BasePermissions.Low, roleDef.BasePermissions.High)
    };
  });
  return {
    member,
    roles
  };
};

var permissionMaskToStrings = function permissionMaskToStrings(lowMask, highMask) {
  var permissions = [];
  basePermissions.forEach(function (basePermission) {
    if ((basePermission.low & lowMask) > 0 || (basePermission.high & highMask) > 0) {
      permissions.push(basePermission.name);
    }
  });
  return permissions;
};

class List {
  /** The title of the list */
  constructor(name, ctx) {
    this.listName = name;
    this.baseUrl = `/web/lists/getbytitle('${this.listName}')`;
    this._dao = ctx;
    this.permissions = new Securable(this.baseUrl, ctx);
  }
  /** Get items from the list. Will return all items if no OData is passed. */


  getItems(odata) {
    return this._dao.get(this.baseUrl + "/items" + appendOData(odata)).then(utils.validateODataV2);
  }
  /** Get a specific item by SharePoint ID */


  getItemById(id, odata) {
    var url = this.baseUrl + "/items(" + id + ")" + appendOData(odata);
    return this._dao.get(url).then(utils.validateODataV2);
  }
  /** Gets the items returned by the specified View name */


  getItemsByView(viewName) {
    var viewUrl = this.baseUrl + "/Views/getByTitle('" + viewName + "')/ViewQuery"; // 1. Get the targeted view on the targeted list so we can pull out the ViewXml

    return this._dao.get(viewUrl).then(utils.validateODataV2).then(view => {
      // Now that we found the view, craft a POST request the the /GetItems endpoint
      var queryUrl = this.baseUrl + "/GetItems";
      var postBody = {
        query: {
          "__metadata": {
            type: "SP.CamlQuery"
          },
          ViewXml: view.ViewQuery
        }
      };
      return this._dao.authorizedPost(queryUrl, postBody);
    }).then(utils.validateODataV2);
  }
  /** Gets you all items whose field(key) matches the value. Currently only text and number columns are supported. */


  findItems(key, value, odata) {
    var filterValue = typeof value === "string" ? "'" + value + "'" : value;
    odata = "$filter=" + key + " eq " + filterValue + appendOData(odata, "&");
    return this.getItems(odata);
  }
  /** Get the item whose field(key) matches the value. If multiple matches are found, the first is returned. Currently only text and number columns are supported. */


  findItem(key, value, odata) {
    return this.findItems(key, value, odata).then(items => {
      if (items && items.length && items.length > 0) return items[0];
      return null;
    });
  }
  /** Get all the properties of the List */


  getInfo() {
    return this._dao.get(this.baseUrl).then(utils.validateODataV2);
  }
  /** Insert a List Item */


  addItem(item, digest) {
    return this._dao.auth.ensureRequestDigest(digest).then(digest => {
      return this._dao.get(this.baseUrl).then(data => {
        //decorate the item with the 'type' metadata
        item = Object.assign({}, {
          "__metadata": {
            "type": data["d"].ListItemEntityTypeFullName
          }
        }, item);
        var customOptions = {
          headers: utils.headers.getAddHeaders(digest)
        };
        return this._dao.post(this.baseUrl + "/items", item, customOptions);
      }).then(utils.validateODataV2);
    });
  }
  /** Takes a SharePoint Id, and updates that item ONLY with properties that are found in the passed in updates object. */


  updateItem(itemId, updates, digest) {
    return this._dao.auth.ensureRequestDigest(digest).then(digest => {
      return this.getItemById(itemId).then(item => {
        //decorate the item with the 'type' metadata
        updates = Object.assign({}, {
          "__metadata": {
            "type": item["__metadata"].type
          }
        }, updates);
        var customOptions = {
          headers: utils.headers.getUpdateHeaders(digest, item["__metadata"].etag)
        };
        return this._dao.post(item["__metadata"].uri, updates, customOptions);
      });
    });
  }
  /** deletes the item with the specified SharePoint Id */


  deleteItem(itemId, digest) {
    return this._dao.auth.ensureRequestDigest(digest).then(digest => {
      return this.getItemById(itemId).then(item => {
        var customOptions = {
          headers: utils.headers.getDeleteHeaders(digest, item["__metadata"].etag)
        };
        return this._dao.post(item["__metadata"].uri, "", customOptions);
      });
    });
  } //TODO: getFields
  //TODO: getField
  //TODO: updateField


}

var appendOData = function appendOData(odata, prefix) {
  prefix = prefix || "?";
  if (odata) return prefix + odata;
  return "";
};

class Web {
  constructor(ctx) {
    this.baseUrl = `/web`;
    this._dao = ctx;
    this.permissions = new Securable(this.baseUrl, ctx);
  }
  /** Retrieves basic information about the site */


  getInfo() {
    return this._dao.get(this.baseUrl).then(utils.validateODataV2);
  }
  /** Retrieves all of the subsites */


  getSubsites() {
    return this._dao.get(this.baseUrl + "/webinfos").then(utils.validateODataV2);
  }
  /** Retrieves the current user */


  getUser(email) {
    var url = email ? this.baseUrl + "/SiteUsers/GetByEmail('" + email + "')" : this.baseUrl + "/CurrentUser";
    return this._dao.get(url).then(utils.validateODataV2);
  }

  ensureUser(login) {
    return this._dao.post(`/web/ensureUser('${login}')`).then(utils.validateODataV2);
  }
  /** Retrieves a file by server relative url */


  getFile(url) {
    var url = `/web/getfilebyserverrelativeurl('${url}')`;
    return this._dao.get(url).then(utils.validateODataV2);
  }

  _copyFile(sourceUrl, destinationUrl, digest) {
    var url = `/web/getfilebyserverrelativeurl('${sourceUrl}')/CopyTo`; //(strnewurl='${destinationUrl}',boverwrite=true)`

    var options = {
      headers: utils.headers.getAddHeaders(digest)
    };
    var body = {
      strNewUrl: destinationUrl,
      bOverWrite: true
    };
    return this._dao.post(url, body, options);
  } // TODO: getFolder
  // TODO: uploadFile
  // TODO: fileAction
  // TODO: deleteFile

  /** Copies a file from one server relative url to another */


  copyFile(sourceUrl, destinationUrl, digest) {
    return this._dao.auth.ensureRequestDigest(digest).then(digest => this._copyFile(sourceUrl, destinationUrl, digest));
  }

}

var mapResponse = function mapResponse(rawResponse) {
  return {
    elapsedTime: rawResponse.ElapsedTime,
    suggestion: rawResponse.SpellingSuggestion,
    resultsCount: rawResponse.PrimaryQueryResult.RelevantResults.RowCount,
    totalResults: rawResponse.PrimaryQueryResult.RelevantResults.TotalRows,
    totalResultsIncludingDuplicates: rawResponse.PrimaryQueryResult.RelevantResults.TotalRowsIncludingDuplicates,
    items: mapItems(rawResponse.PrimaryQueryResult.RelevantResults.Table.Rows.results),
    refiners: mapRefiners(rawResponse.PrimaryQueryResult.RefinementResults)
  };
};
var mapRefiners = function mapRefiners(refinementResults) {
  var refiners = [];

  if (refinementResults && refinementResults.Refiners && refinementResults.Refiners.results) {
    refiners = refinementResults.Refiners.results.map(r => {
      return {
        RefinerName: r.Name,
        RefinerOptions: r.Entries.results
      };
    });
  }

  return refiners;
};
var mapItems = function mapItems(itemRows) {
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

class Search {
  constructor(ctx) {
    this._dao = ctx;
  }
  /** get default/empty QueryOptions */


  get defaultQueryOptions() {
    return {
      sourceid: null,
      startrow: null,
      rowlimit: 100,
      selectedproperties: null,
      refiners: null,
      refinementfilters: null,
      hiddencontstraints: null,
      sortlist: null
    };
  }
  /** Query the SP Search Service */


  query(queryText, queryOptions = {}) {
    var optionsQueryString = utils.qs.fromObj(queryOptions, true);
    var url = `/search/query?querytext='${queryText}'&${optionsQueryString}`;
    return this._dao.get(url).then(utils.validateODataV2).then(resp => {
      if (resp.query) return mapResponse(resp.query);
      throw new Error("Invalid response back from search service");
    });
  }
  /** Query for only People results */


  people(queryText, queryOptions = {}) {
    queryOptions.sourceid = 'b09a7990-05ea-4af9-81ef-edfab16c4e31';
    return this.query(queryText, queryOptions);
  }
  /** Query for only sites (STS_Web). Optionally pass in a url scope. */


  sites(queryText = "", urlScope = "", queryOptions = {}) {
    urlScope = urlScope ? `Path:${urlScope}*` : "";
    var query = `${queryText} contentclass:STS_Web ${urlScope}`.trim();
    queryOptions.rowlimit = queryOptions.rowlimit || 499;
    return this.query(query, queryOptions);
  }

}

var metadata = {
  __metadata: {
    "type": "SP.UserCustomAction"
  }
};
var scopes = {
  "Web": {
    id: 3,
    name: "Web",
    url: "/web/usercustomactions"
  },
  "Site": {
    id: 2,
    name: "Site",
    url: "/site/usercustomactions"
  }
};

class CustomActions {
  constructor(ctx) {
    this._dao = ctx;
  }

  getScope(scopeId) {
    if (scopeId === 3) return scopes.Web;
    if (scopeId === 2) return scopes.Site;
    throw new Error("Invalid Custom Action Scope");
  }
  /** Returns both Site and Web custom actions. */


  get(name) {
    // first get the site scoped ones, then the web scoped ones
    return this._dao.get(scopes.Site.url).then(utils.validateODataV2).then(siteCustomActions => {
      return this._dao.get(scopes.Web.url).then(utils.validateODataV2) //combine site scoped and web scoped into single array
      .then(webCustomActions => siteCustomActions.concat(webCustomActions));
    }).then(customActions => {
      // if a name was passed filter it otherwise return everything
      if (name) {
        var matches = customActions.filter(a => a.Name === name);

        if (matches.length) {
          return matches[0];
        }

        throw new Error("Unable to find Custom Action with name: " + name);
      } else return customActions;
    });
  }
  /** Gets the API url of a specific Custom Action */


  _getUrl(name) {
    return this.get(name).then(a => `${this.getScope(a.Scope).url}('${a.Id}')`);
  }

  _getUrlAndDigest(name) {
    var prep = {};
    return this._getUrl(name).then(url => {
      prep.url = url;
      return this._dao.auth.getRequestDigest();
    }).then(digest => {
      prep.digest = digest;
      return prep;
    });
  }
  /** Update an existing Custom Action. You must pass a custom action with a 'Name' property */


  update(updates) {
    if (!updates || !updates.Name) throw new Error("You must at least pass a Custom Action 'Name'");
    return this._getUrlAndDigest(updates.Name).then(prep => {
      updates = Object.assign({}, metadata, updates);
      var opts = {
        headers: utils.headers.getUpdateHeaders(prep.digest)
      };
      return this._dao.post(prep.url, updates, opts);
    });
  }
  /** Remove an existing Custom Action. Searches both Site and Web scoped */


  remove(name) {
    if (!name) throw new Error("You must at least pass an existing Custom Action name");
    return this._getUrlAndDigest(name).then(prep => {
      var opts = {
        headers: utils.headers.getDeleteHeaders(prep.digest)
      };
      return this._dao.post(prep.url, {}, opts);
    });
  }
  /** Adds a new custom action. If the custom action name already exists, it will be deleted first */


  add(customAction) {
    if (!customAction || !customAction.Name) throw new Error("You must at least pass a Custom Action 'Name'");
    var defaults = {
      Name: customAction.Name,
      Title: customAction.Name,
      Description: customAction.Name,
      // Group: customAction.Name,
      Sequence: 100,
      Scope: "Site",
      Location: "ScriptLink"
    };
    customAction = Object.assign({}, defaults, customAction); // if it exists already, delete it

    return this.get().then(existingCustomActions => {
      if (existingCustomActions.filter(ca => ca.Name === customAction.Name).length) {
        return this.remove(customAction.Name);
      }

      return true;
    }).then(() => this._dao.auth.getRequestDigest()).then(digest => {
      customAction = Object.assign({}, metadata, customAction);
      var scope = scopes[customAction.Scope];
      customAction.Scope = scope.id;
      var opts = {
        headers: utils.headers.getAddHeaders(digest)
      };
      return this._dao.post(scope.url, customAction, opts);
    });
  }

  addScriptBlock(name, block, opts = {}) {
    var customAction = {
      Name: name,
      ScriptBlock: block,
      Group: name
    };
    customAction = Object.assign({}, customAction, opts);
    return this.add(customAction);
  }
  /** Injects a CSS file onto your site. Defaults to Site scoped */


  addCSSLink(name, url, opts = {}) {
    var scriptBlockStr = `
		(function() {
			var head = document.querySelector("head");
			var styleTag = document.createElement("style");
			styleTag.appendChild(document.createTextNode("body { opacity: 0 }"));
			
			var linkTag = document.createElement("link");
			linkTag.rel = "stylesheet";	linkTag.href = "${url}"; linkTag.type = "text/css";
			linkTag.addEventListener("load", function() {
				head.removeChild(styleTag);
			});

			head.appendChild(styleTag);
			head.appendChild(linkTag);
		})();`;
    return this.addScriptBlock(name, scriptBlockStr, opts);
  }

  addScriptLink(name, url, opts = {}) {
    var scriptBlockStr = `
		(function() {
			var head = document.querySelector("head");
			var scriptTag = document.createElement("script");
            scriptTag.src = "${url}";
            scriptTag.type = "text/javascript";
			head.appendChild(scriptTag);
		})();`;
    return this.addScriptBlock(name, scriptBlockStr, opts);
  }

}

class Profiles {
  constructor(ctx) {
    this._dao = ctx;
    this.baseUrl = "/SP.UserProfiles.PeopleManager";
  }
  /** Gets the profile of the current user.  */


  current() {
    var url = this.baseUrl + "/GetMyProperties";
    return this._dao.get(url).then(utils.validateODataV2).then(transformPersonProperties);
  }
  /** Gets the current user's profile */


  get(user) {
    if (!user) return this.current();
    return this.getUserObj(user).then(user => {
      var login = encodeURIComponent(user.LoginName || user.AccountName);
      var url = this.baseUrl + "/GetPropertiesFor(accountName=@v)?@v='" + login + "'";
      return this._dao.get(url).then(utils.validateODataV2).then(transformPersonProperties);
    });
  }

  getUserObj(user) {
    if (!user || typeof user === "string") {
      return this._dao.web.getUser(user);
    } else if (user.AccountName || user.LoginName) {
      return Promise.resolve(user);
    } else throw new Error("profiles.setProperty Error: Invalid user parameter");
  }
  /** Sets a profile property on the current user */


  setProperty(key, value, user) {
    return this.getUserObj(user).then(user => {
      var args = {
        propertyName: key,
        propertyValue: value,
        accountName: user.LoginName || user.AccountName
      };
      var url = this.baseUrl + "/SetSingleValueProfileProperty";
      return this._dao.authorizedPost(url, args);
    });
  }

}

var transformPersonProperties = function transformPersonProperties(profile) {
  profile.UserProfileProperties.results.forEach(keyvalue => {
    profile[keyvalue.Key] = keyvalue.Value;
  });
  return profile;
};

var getAppOnlyToken = function getAppOnlyToken(url$1, clientId, clientSecret) {
  var urlParts = url.parse(url$1);
  return getRealm(url$1).then(authParams => {
    var tokenUrl = `https://accounts.accesscontrol.windows.net/${authParams.realm}/tokens/OAuth/2`;
    var client_id = `${clientId}@${authParams.realm}`;
    var resource = `${authParams.client_id}/${urlParts.host}@${authParams.realm}`;
    var postBody = {
      grant_type: "client_credentials",
      client_id,
      client_secret: clientSecret,
      resource: resource,
      scope: resource
    };
    var bodyStr = qs.stringify(postBody);
    var opts = {
      method: "POST",
      body: bodyStr,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": bodyStr.length
      }
    };
    return request(tokenUrl, opts).then(data => {
      return data.access_token;
    });
  });
};

var getRealm = function getRealm(url) {
  var endpointUrl = `${url}/_api/web`;
  var opts = {
    method: "GET",
    headers: {
      Authorization: "Bearer ",
      Accept: "application/json;odata=verbose",
      response_type: "code"
    }
  };
  return new Promise((resolve, reject) => {
    fetch(endpointUrl, opts).then(res => {
      if (!res.ok) {
        var realm = parseRealm(getWWWAuthenticate(res.headers));
        resolve(realm);
      } //this should fail


      reject("Get Realm succeeded somehow?!");
    });
  });
};

var getWWWAuthenticate = function getWWWAuthenticate(headers) {
  var key = "www-authenticate";
  if (typeof headers[key] === "string") return headers[key];

  if (headers._headers && Array.isArray(headers._headers[key])) {
    return headers._headers[key][0];
  }

  if (headers.map && Array.isArray(headers.map[key])) {
    return headers.map[key][0];
  }
};

var parseRealm = function parseRealm(raw) {

  if (raw && raw.startsWith("Bearer")) {
    raw = raw.substr(7);
    var params = raw.split(",").filter(p => p.indexOf("=") > -1).reduce((params, piece) => {
      var parts = piece.split("=");

      if (parts.length === 2) {
        params[parts[0].trim()] = parts[1].trim().replace(/\"/g, "");
      }

      return params;
    }, {});
    return params;
  }

  return null;
};

class Auth {
  constructor(ctx) {
    this.ctx = ctx;
  }

  ensureRequestDigest(digest) {
    return digest ? Promise.resolve(digest) : this.getRequestDigest();
  }
  /** Get a Request Digest token to authorize a request */


  getRequestDigest() {
    return this.ctx.post("/contextInfo", {}).then(data => data["d"].GetContextWebInformation.FormDigestValue);
  }

  getGraphToken() {
    let endpoint = "/SP.OAuth.Token/Acquire";
    return this.ctx.authorizedPost(endpoint, {
      resource: "https://graph.microsoft.com"
    }).then(utils.validateODataV2);
  }

}

class Context {
  /** The url of the SPScript data context */

  /** Methods to hit the SP Search Service */

  /** Methods against the SP Web object */

  /** Methods to get the SP Profile Service */

  /** Work with Site/Web scoped Custom Actions */

  /** Request Digest and Access token helpers */
  constructor(url, options = {}) {
    this.webUrl = url;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.accessToken = options.token; // TODO serverside: replace with tokenHelper.getAppOnlyToken(this.webUrl, this.clientKey, this.clientSecret).then(token => this.accessToken = token);

    this.ensureToken = options.clientSecret ? getAppOnlyToken(url, options.clientId, options.clientSecret).then(token => this.accessToken = token) : Promise.resolve(this.accessToken || true);
    this.search = new Search(this);
    this.customActions = new CustomActions(this);
    this.web = new Web(this);
    this.profiles = new Profiles(this);
    this.auth = new Auth(this);
  }

  executeRequest(url, opts) {
    var _this = this;

    return _asyncToGenerator(function* () {
      yield _this.ensureToken;
      var fullUrl = /^http/i.test(url) ? url : _this.webUrl + "/_api" + url;
      var defaultOptions = {
        method: "GET",
        headers: {
          Accept: "application/json; odata=verbose",
          "Content-Type": "application/json; odata=verbose"
        }
      };
      var requestOptions = Object.assign({}, defaultOptions, opts);

      if (_this.accessToken) {
        requestOptions.headers["Authorization"] = "Bearer " + _this.accessToken;
      }

      return request(fullUrl, requestOptions);
    })();
  }
  /** Make a 'GET' request to the '<site>/_api' relative url. */


  get(url, opts) {
    let options = Object.assign({}, {
      method: "GET"
    }, opts);
    return this.executeRequest(url, options).then(utils.parseJSON);
  }
  /** Make a 'POST' request to the '<site>/_api' relative url. */


  post(url, body, opts) {
    body = this._packagePostBody(body, opts);
    var options = {
      method: "POST",
      body
    };
    options = Object.assign({}, options, opts);
    return this.executeRequest(url, options).then(utils.parseJSON);
  }
  /** Make a 'POST' request to the '<site>/_api' relative url. SPScript will handle authorizing the request for you.*/


  authorizedPost(url, body, verb) {
    return this.auth.getRequestDigest().then(digest => utils.headers.getActionHeaders(verb, digest)).then(headers => this.post(url, body, {
      headers
    }));
  }
  /** Get an SPScript List instance */


  lists(name) {
    return new List(name, this);
  }

  _packagePostBody(body, opts) {
    // if its already a string just return
    if (typeof body === "string") return body; // if it has an explicit content-type, asssume the body is already that type

    if (opts && opts.headers && opts.headers["Content-Type"] && opts.headers["Content-Type"].indexOf("json") === -1) {
      return body;
    } //others stringify


    return JSON.stringify(body);
  }

}

var registerField = function registerField(field, renderer, opts = {}) {
  if (!utils.validateNamespace("SPClientTemplates.TemplateManager")) {
    throw new Error("Unable to register CSR template.  SPClientTemplates.TemplateManager does not exist");
  }

  var renderers = {}; //View, DisplayForm, EditForm, NewForm

  field.locations.forEach(l => renderers[l] = renderer);
  var defaults = {
    Templates: {
      Fields: {}
    }
  };
  var templateOverride = Object.assign({}, defaults, opts);
  templateOverride.Templates.Fields[field.name] = renderers;
  SPClientTemplates.TemplateManager.RegisterTemplateOverrides(templateOverride);
  return field;
};

var registerDisplayField = function registerDisplayField(fieldComponent, opts = {}) {
  var renderer = createDisplayFieldRenderer(fieldComponent);
  fieldComponent.locations = fieldComponent.locations || ["View", "DisplayForm"];
  return registerField(fieldComponent, renderer, opts);
};

var registerFormField = function registerFormField(fieldComponent, opts = {}) {
  var renderer = createFormFieldRenderer(fieldComponent);
  fieldComponent.locations = fieldComponent.locations || ["NewForm", "EditForm"];
  return registerField(fieldComponent, renderer, opts);
};

function createFormFieldRenderer(field) {
  return function (ctx) {
    var formCtx = ctx.FormContext; // need to clone ctx, it is getting overwritten so we lost CurrentItem

    var clonedCtx = Object.assign({}, ctx);

    if (field.onReady) {
      if (formCtx) {
        formCtx.registerInitCallback(field.name, field.onReady.bind(null, clonedCtx));
      } else {
        setTimeout(field.onReady.bind(null, clonedCtx), 100);
      }
    }

    if (field.getValue && formCtx) {
      formCtx.registerGetValueCallback(field.name, field.getValue.bind(null, clonedCtx));
    } // tack on 'setValue' function


    if (formCtx && formCtx.updateControlValue) {
      field.setValue = function (value) {
        formCtx.updateControlValue(field.name, value);
      };
    }

    return field.render(ctx);
  };
}

function createDisplayFieldRenderer(field) {
  return function (ctx) {
    var formCtx = ctx.FormContext;

    if (formCtx && formCtx.registerInitCallback && field.onReady) {
      formCtx.registerInitCallback(field.name, field.onReady);
    }

    return field.render(ctx);
  };
}

var CSR = {
  registerDisplayField,
  registerFormField
};

var spscript = {
  utils,
  CSR,

  createContext(url, options) {
    try {
      // TODO: use get Site url util
      if (!url && global._spPageContextInfo) {
        url = global._spPageContextInfo.webAbsoluteUrl;
      }

      return new Context(url, options);
    } catch (ex) {
      throw new Error("Unable to create SPScript Context: " + ex.message);
    }
  }

};

exports.default = spscript;
