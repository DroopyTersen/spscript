import { toObj, fromObj } from "./queryString";
import headerUtils, { HeaderUtils } from "./headers";

export interface Utils {
    /** Wraps JSON.parse in a try/catch */
    parseJSON(jsonStr:any): any;
    /** Helps parse raw ODATA response to remove data.d/data.d.results namespace. */
    validateODataV2(data:any): any;
    /** Query String helpers */
    qs: {
        /** Turns a string in form of "key1=value1&key2=value2..." into an Object */
        toObj(string?): any;
        /** Turns a an Object into a string in form of "key1=value1&key2=value2..." */
        fromObj(obj:any, quoteValues?:boolean): string
    }
    headers: HeaderUtils
}

function parseJSON(data:any) : any {
    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        } catch (e) {
            return null;
        }
    }
    return data;
}

function validateODataV2(data:any) : any {
    data = parseJSON(data);
    var results = null;
    if (data.d && data.d.results && data.d.results.length != null) {
        results = data.d.results;
    } else if (data.d) {
        results = data.d;
    }
    return results || data;	
}

var utils: Utils = { headers: headerUtils, parseJSON, validateODataV2, qs: { toObj, fromObj } };
export default utils;