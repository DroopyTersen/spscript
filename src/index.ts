export * as utils from "./utils";
import * as utils from "./utils";

import { isBrowser, getSiteUrl } from "./utils";
import Context, { ContextOptions } from "./Context";

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
    if (!url) url = getSiteUrl();
    if (!url) throw new Error("Unable to find url to create SPScript Context");
    return new Context(url, options);
  } catch (ex) {
    throw new Error("Unable to create SPScript Context: " + ex.message);
  }
}

export default {
  createContext,
  utils,
};
