import { Utils } from "./utils/IUtils";
import Context from "./context/Context";
import { CSRUtils } from "./csr";
import { ContextOptions } from "./context/interfaces";
export interface SPScript {
    /** Utility functions*/
    utils: Utils;
    /** Creates an SPScript data context. If no url is passed, it uses current web. */
    createContext(url?: string, options?: ContextOptions): Context;
    /** Helper functions for creating REST Api HTTP headers. */
    CSR: CSRUtils;
}
declare var spscript: SPScript;
export default spscript;
