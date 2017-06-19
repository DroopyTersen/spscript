import { Utils } from "./utils";
import Context from "./context/Context";
import { HeaderUtils } from "./context/headers";
export interface SPScript {
    utils: Utils;
    createContext(url?: string): Context;
    headers: HeaderUtils;
}
declare var spscript: SPScript;
export default spscript;
