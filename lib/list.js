"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const headers_1 = require("./context/headers");
class List {
    // TODO permissions. Inherit securable?
    constructor(name, ctx) {
        this.listName = name;
        this.baseUrl = `/web/lists/getbytitle('${this.listName}')`;
        this._dao = ctx;
    }
    getItems(odata) {
        return this._dao
            .get(this.baseUrl + "/items" + appendOData(odata))
            .then(utils_1.default.validateODataV2);
    }
    getItemById(id, odata) {
        var url = this.baseUrl + "/items(" + id + ")" + appendOData(odata);
        return this._dao.get(url).then(utils_1.default.validateODataV2);
    }
    ;
    findItems(key, value, odata) {
        var filterValue = typeof value === "string" ? "'" + value + "'" : value;
        odata = "$filter=" + key + " eq " + filterValue + appendOData(odata, "&");
        return this.getItems(odata);
    }
    findItem(key, value, odata) {
        return this.findItems(key, value, odata)
            .then(items => {
            if (items && items.length && items.length > 0)
                return items[0];
            return null;
        });
    }
    getInfo() {
        return this._dao.get(this.baseUrl).then(utils_1.default.validateODataV2);
    }
    addItem(item, digest) {
        return this._dao.ensureRequestDigest(digest).then(digest => {
            return this._dao.get(this.baseUrl).then(data => {
                //decorate the item with the 'type' metadata
                item = Object.assign({}, {
                    "__metadata": {
                        "type": data["d"].ListItemEntityTypeFullName
                    }
                }, item);
                var customOptions = {
                    headers: headers_1.default.getAddHeaders(digest)
                };
                return this._dao.post(this.baseUrl + "/items", item, customOptions);
            })
                .then(utils_1.default.validateODataV2);
        });
    }
    updateItem(itemId, updates, digest) {
        return this._dao.ensureRequestDigest(digest).then(digest => {
            return this.getItemById(itemId).then(item => {
                //decorate the item with the 'type' metadata
                updates = Object.assign({}, {
                    "__metadata": {
                        "type": item["__metadata"].type
                    }
                }, updates);
                var customOptions = {
                    headers: headers_1.default.getUpdateHeaders(digest, item["__metadata"].etag)
                };
                return this._dao.post(item["__metadata"].uri, updates, customOptions);
            });
        });
    }
    deleteItem(itemId, digest) {
        return this._dao.ensureRequestDigest(digest).then(digest => {
            return this.getItemById(itemId).then(item => {
                var customOptions = {
                    headers: headers_1.default.getDeleteHeaders(digest, item["__metadata"].etag)
                };
                return this._dao.post(item["__metadata"].uri, "", customOptions);
            });
        });
    }
}
exports.default = List;
var appendOData = function (odata, prefix) {
    prefix = prefix || "?";
    if (odata)
        return prefix + odata;
    return "";
};
//# sourceMappingURL=List.js.map