import utils from "./utils/index.js";
import Context from "./context/Context.js";
import CSR from "./csr/index.js";
var spscript = {
  utils,
  CSR,

  createContext(url, options) {
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

};
export default spscript;