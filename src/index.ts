import utilsImport from "./utils";
import { Utils } from "./utils/IUtils";
import Context, { ContextOptions } from "./context/Context";
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

export interface SPScript {
  utils: Utils;
  createContext(url?: string, options?: ContextOptions): Context;
}
