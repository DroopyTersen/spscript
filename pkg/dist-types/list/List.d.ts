import Context from "../context/Context";
import Securable from "../permissions/Securable";
export default class List {
    /** The title of the list */
    listName: string;
    private baseUrl;
    private _dao;
    permissions: Securable;
    constructor(name: string, ctx: Context);
    /** Get items from the list. Will return all items if no OData is passed. */
    getItems(odata?: string): Promise<any>;
    /** Get a specific item by SharePoint ID */
    getItemById(id: number, odata?: string): Promise<any>;
    /** Gets the items returned by the specified View name */
    getItemsByView(viewName: string): Promise<any>;
    /** Gets you all items whose field(key) matches the value. Currently only text and number columns are supported. */
    findItems(key: string, value: any, odata?: string): Promise<any>;
    /** Get the item whose field(key) matches the value. If multiple matches are found, the first is returned. Currently only text and number columns are supported. */
    findItem(key: string, value: any, odata: any): Promise<any>;
    /** Get all the properties of the List */
    getInfo(): Promise<any>;
    /** Insert a List Item */
    addItem(item: any, digest?: string): Promise<any>;
    /** Takes a SharePoint Id, and updates that item ONLY with properties that are found in the passed in updates object. */
    updateItem(itemId: number, updates: any, digest?: string): Promise<any>;
    /** deletes the item with the specified SharePoint Id */
    deleteItem(itemId: number, digest?: string): Promise<any>;
}
