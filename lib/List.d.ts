import Context from "./context/Context";
export default class List {
    listName: string;
    private baseUrl;
    private _dao;
    constructor(name: string, ctx: Context);
    getItems(odata?: string): Promise<any>;
    getItemById(id: number, odata?: string): Promise<() => any>;
    findItems(key: string, value: any, odata?: string): Promise<any>;
    findItem(key: string, value: any, odata: any): Promise<any>;
    getInfo(): Promise<any>;
    addItem(item: any, digest?: string): Promise<any>;
    updateItem(itemId: number, updates: any, digest?: string): Promise<() => any>;
    deleteItem(itemId: number, digest?: string): Promise<() => any>;
}
