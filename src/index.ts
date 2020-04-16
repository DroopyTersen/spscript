export * as utils from "./utils";

import utils, { isBrowser } from "./utils";
import Context, { ContextOptions } from "./context/Context";

declare global {
  interface Window {
    _spPageContextInfo: any;
  }
}

export function createContext(url?: string, options?: ContextOptions) {
  try {
    if (isBrowser())
      if (!url && window._spPageContextInfo) {
        // TODO: use get Site url util
        url = window._spPageContextInfo.webAbsoluteUrl;
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

export default spscript;
