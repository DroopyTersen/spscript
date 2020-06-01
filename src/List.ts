import Context from "./Context";
import Securable from "./Securable";
import { parseOData } from "./utils";

export default class List {
  /** The title of the list */
  listName: string;
  private baseUrl: string;
  private _dao: Context;
  permissions: Securable;
  constructor(name: string, ctx: Context) {
    this.listName = name;
    this.baseUrl = `/web/lists/getbytitle('${this.listName}')`;
    this._dao = ctx;
    this.permissions = new Securable(this.baseUrl, ctx);
  }
  /** Get items from the list. Will return all items if no OData is passed. */
  getItems(odata = "$top=5000"): Promise<any> {
    return this._dao.get(this.baseUrl + "/items" + appendOData(odata)).then(parseOData);
  }

  /** Get a specific item by SharePoint ID */
  getItemById(id: number, odata?: string) {
    var url = this.baseUrl + "/items(" + id + ")" + appendOData(odata);
    return this._dao.get(url).then(parseOData);
  }

  /** Gets the items returned by the specified CAML query. CAML should be something like <View><Query><Where>...</Where></Query></View>*/
  getItemsByCaml(caml: string, odata = "$top=4999") {
    var queryUrl = this.baseUrl + "/GetItems?" + odata;
    var postBody = {
      query: {
        ViewXml: caml,
      },
    };
    return this._dao.post(queryUrl, postBody).then(parseOData);
  }

  /** Gets the items returned by the specified View name */
  async getItemsByView(viewName: string) {
    var viewUrl = this.baseUrl + "/Views/getByTitle('" + viewName + "')/ViewQuery";
    let view = await this._dao.get(viewUrl).then(parseOData);
    let caml = `<View><Query>${view}</Query></View>`;
    return this.getItemsByCaml(caml);
  }

  /** Gets you all items whose field(key) matches the value. Currently only text and number columns are supported. */
  findItems(key: string, value: any, odata = "$top=5000") {
    var filterValue = typeof value === "string" ? "'" + value + "'" : value;
    odata = "$filter=" + key + " eq " + filterValue + appendOData(odata, "&");
    return this.getItems(odata);
  }

  /** Get the item whose field(key) matches the value. If multiple matches are found, the first is returned. Currently only text and number columns are supported. */
  findItem(key: string, value: any, odata: string = "") {
    // Add a top=1 if there wasn't a specified top
    if (odata.indexOf("$top") === -1) {
      odata += odata ? "&$top=1" : "$top=1";
    }
    return this.findItems(key, value, odata).then((items) => {
      if (items && items.length && items.length > 0) return items[0];
      return null;
    });
  }

  /** Get all the properties of the List */
  getInfo(): Promise<any> {
    return this._dao.get(this.baseUrl).then(parseOData);
  }

  /** Check whether the list exists */
  async checkExists(): Promise<boolean> {
    try {
      await this.getInfo();
      return true;
    } catch (err) {
      return false;
    }
  }

  /** Insert a List Item */
  addItem(item: any, digest?: string): Promise<any> {
    return this._dao.post(this.baseUrl + "/items", item).then(parseOData);
  }

  /** Takes a SharePoint Id, and updates that item ONLY with properties that are found in the passed in updates object. */
  async updateItem(itemId: number, updates: any, digest?: string) {
    let url = this.baseUrl + `/items(${itemId})`;
    return this._dao.post(url, updates, "MERGE");
  }

  /** deletes the item with the specified SharePoint Id */
  async deleteItem(itemId: number, digest?: string) {
    let url = this.baseUrl + `/items(${itemId})`;

    // digest = await this._dao.auth.ensureRequestDigest(digest);

    // let options = {
    //   headers: utils.headers.getDeleteHeaders(digest, "*"),
    // };
    return this._dao.post(url, "", "DELETE");
  }

  //TODO: getFields
  //TODO: getField
  //TODO: updateField
}

var appendOData = function (odata = "", prefix?: string) {
  prefix = prefix || "?";
  if (odata) return prefix + odata;
  return "";
};
