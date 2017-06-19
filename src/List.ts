import utils from "./utils";
import headerUtils from "./context/headers";
import Context from "./context/Context";

export default class List {
    listName: string;
    private baseUrl: string;
    private _dao: Context;

    // TODO permissions. Inherit securable?
    constructor(name: string, ctx: Context) {
        this.listName = name;
        this.baseUrl = `/web/lists/getbytitle('${this.listName}')`;
        this._dao = ctx;
    }

    getItems(odata?: string): Promise<any> {
        return this._dao
            .get(this.baseUrl + "/items" + appendOData(odata))
            .then(utils.validateODataV2);
    }

    getItemById(id: number, odata?: string) {
        var url = this.baseUrl + "/items(" + id + ")" + appendOData(odata);
        return this._dao.get(url).then(utils.validateODataV2);
    };

    findItems(key: string, value: any, odata?: string) {
        var filterValue = typeof value === "string" ? "'" + value + "'" : value;
        odata = "$filter=" + key + " eq " + filterValue + appendOData(odata, "&");
        return this.getItems(odata);
    }

    findItem(key: string, value: any, odata) {
        return this.findItems(key, value, odata)
            .then(items => {
                if (items && items.length && items.length > 0) return items[0]
                return null;
            })
    }

    getInfo(): Promise<any> {
        return this._dao.get(this.baseUrl).then(utils.validateODataV2);
    }

    addItem(item: any, digest?: string): Promise<any> {
        return this._dao.ensureRequestDigest(digest).then(digest => {
            return this._dao.get(this.baseUrl).then(data => {
                //decorate the item with the 'type' metadata
                item = Object.assign({}, {
                    "__metadata": {
                        "type": data["d"].ListItemEntityTypeFullName
                    }
                }, item);

                var customOptions = {
                    headers: headerUtils.getAddHeaders(digest)
                };
                return this._dao.post(this.baseUrl + "/items", item, customOptions)
            })
                .then(utils.validateODataV2);
        })
    }

    updateItem(itemId: number, updates: any, digest?: string) {
        return this._dao.ensureRequestDigest(digest).then(digest => {
            return this.getItemById(itemId).then(item => {
                //decorate the item with the 'type' metadata
                updates = Object.assign({}, {
                    "__metadata": {
                        "type": item["__metadata"].type
                    }
                }, updates);

                var customOptions = {
                    headers: headerUtils.getUpdateHeaders(digest, item["__metadata"].etag)
                };

                return this._dao.post(item["__metadata"].uri, updates, customOptions);
            });
        })
    }

    deleteItem(itemId: number, digest?: string) {
        return this._dao.ensureRequestDigest(digest).then(digest => {
            return this.getItemById(itemId).then(item => {
                var customOptions = {
                    headers: headerUtils.getDeleteHeaders(digest, item["__metadata"].etag)
                };
                return this._dao.post(item["__metadata"].uri, "", customOptions);
            });
        });
    }

    //TODO: getFields
    //TODO: getField
    //TODO: updateField

}

var appendOData = function (odata?: string, prefix?: string) {
    prefix = prefix || "?";
    if (odata) return prefix + odata;
    return "";
};