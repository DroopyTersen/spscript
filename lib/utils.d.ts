export interface Utils {
    parseJSON(any: any): () => any;
    validateODataV2(any: any): () => any;
}
declare var utils: Utils;
export default utils;
