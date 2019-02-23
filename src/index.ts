import utilsImport from "./utils";
import { Utils } from "./utils/IUtils";
import Context from "./context/Context";
import { ContextOptions } from "./context/interfaces";
declare var global: any;

export const utils = utilsImport;
export function createContext(url?: string, options?: ContextOptions) {
  try {
    // TODO: use get Site url util
    if (!url && global._spPageContextInfo) {
      url = global._spPageContextInfo.webAbsoluteUrl;
    }
    return new Context(url, options);
  } catch (ex) {
    throw new Error("Unable to create SPScript Context: " + ex.message);
  }
}
