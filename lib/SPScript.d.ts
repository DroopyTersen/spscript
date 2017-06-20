import { Utils } from "./utils";
import Context from "./context/Context";
import { HeaderUtils } from "./context/headers";
export interface SPScript {
    /** Utility functions*/
    utils: Utils;
    /** Creates an SPScript data context. If no url is passed, it uses current web. */
    createContext(url?: string): Context;
    /** Helper functions for creating REST Api HTTP headers. */
    headers: HeaderUtils;
}
declare var spscript: SPScript;
export default spscript;
