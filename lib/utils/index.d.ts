export interface Utils {
    parseJSON(jsonStr: any): any;
    validateODataV2(data: any): any;
    qs: {
        toObj(string?): any;
        fromObj(obj: any, quoteValues?: boolean): string;
    };
}
declare var utils: Utils;
export default utils;
