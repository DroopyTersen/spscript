import utils from "./utils";
import { Utils } from "./utils/IUtils";
import Context from "./context/Context";
import CSR, { CSRUtils } from "./csr";
import { ContextOptions } from "./context/interfaces";
declare var global: any;

export interface SPScript {
	/** Utility functions*/
	utils: Utils;
	/** Creates an SPScript data context. If no url is passed, it uses current web. */
	createContext(url?: string, options?: ContextOptions): Context;
	/** Helper functions for creating REST Api HTTP headers. */
	CSR: CSRUtils;
}

var spscript: SPScript = {
	utils,
	CSR,
	createContext(url?: string, options?: ContextOptions) {
		try {
			if (!url && global._spPageContextInfo) {
				url = global._spPageContextInfo.webAbsoluteUrl;
			}
			return new Context(url, options);
		} catch (ex) {
			throw new Error("Unable to create SPScript Context: " + ex.message);
		}
	}
};

export default spscript;
