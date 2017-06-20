export interface Utils {
    /** Wraps JSON.parse in a try/catch */
    parseJSON(jsonStr: any): any;
    /** Helps parse raw ODATA response to remove data.d/data.d.results namespace. */
    validateODataV2(data: any): any;
    /** Query String helpers */
    qs: {
        /** Turns a string in form of "key1=value1&key2=value2..." into an Object */
        toObj(string?): any;
        /** Turns a an Object into a string in form of "key1=value1&key2=value2..." */
        fromObj(obj: any, quoteValues?: boolean): string;
    };
}
declare var utils: Utils;
export default utils;
