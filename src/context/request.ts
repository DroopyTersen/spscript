declare var global:any;
import xhr from "./xhr";
export interface RequestOptions {
    url?: string;
    method?: string;
    headers?: any;
    data?: string;
    async?: boolean;
}

var request = function(options:RequestOptions): Promise<any> {
    // if node, use request-promise-native
    // if fetch is available, use that
    // else use xhr
    if (typeof window === "undefined") {
        throw new Error("No Node.js HTTP request module available yet.")
    }
    return xhr(options);
}

export default request;