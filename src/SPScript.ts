import utils, { Utils } from "./utils";
import Context from "./context/Context";
declare var global: any;

export interface SPScript {
    /** Utility functions*/
    utils: Utils;
    /** Creates an SPScript data context. If no url is passed, it uses current web. */
    createContext(url?: string): Context,
    /** Helper functions for creating REST Api HTTP headers. */
}

var spscript: SPScript = {
    utils,
    createContext(url?: string, clientId?: string, clientSecret?: string) {
        try {
            if (!url && global._spPageContextInfo) {
                url = global._spPageContextInfo.webAbsoluteUrl;
            }
            return new Context(url);
        } catch (ex) {
            throw new Error("Unable to create SPScript Context: " + ex.message)
        }
    }
};

export default spscript;