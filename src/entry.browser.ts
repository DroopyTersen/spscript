import promisePolyfill from "promise-polyfill";
import SPScript from "./SPScript";

declare var global;
if (!global.Promise) {
	global.Promise = promisePolyfill;
}
// global.SPScript = SPScript;

export = SPScript;