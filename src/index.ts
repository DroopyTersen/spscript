export * as utils from "./utils";

import utils from "./utils";
import Context, { ContextOptions } from "./context/Context";
declare var global: any;

export function createContext(url?: string, options?: ContextOptions) {
  try {
    // TODO: use get Site url util
    if (!url && global._spPageContextInfo) {
      url = global._spPageContextInfo.webAbsoluteUrl;
    }
    if (!url) url = utils.getSiteUrl();
    if (!url) throw new Error("Unable to find url to create SPScript Context");
    return new Context(url, options);
  } catch (ex) {
    throw new Error("Unable to create SPScript Context: " + ex.message);
  }
}

let spscript = {
  utils,
  createContext,
};

(global as any).SPScript = spscript;

export default spscript;
