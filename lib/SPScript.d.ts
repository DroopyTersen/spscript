import { Utils } from "./utils";
import Context from "./context/Context";
import { HeaderUtils } from "./context/headers";
declare const _default: {
    utils: Utils;
    createContext: (url?: string, clientId?: string, clientSecret?: string) => Context;
    _env: string;
    headers: HeaderUtils;
};
export default _default;
