import { Utils } from "./IUtils";
import { toObj, fromObj } from "./queryString";
import headerUtils, { HeaderUtils } from "./headers";
import { loadScript, loadScripts, loadCSS } from "./loaders";
import { validateNamespace, waitForLibraries, waitForLibrary, waitForElement } from "./dependencyManagement";

function isBrowser(): boolean {
    return (!(typeof window === 'undefined'));
}

function parseJSON(data: any): any {
    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        } catch (e) {
            return null;
        }
    }
    return data;
}

var getArrayBuffer = function(file) {
	if (file && file instanceof File) {
		return new Promise(function(resolve, reject) {
			var reader = new FileReader();
			reader.onload = function(e:any) {
				resolve(e.target.result);
			}
			reader.readAsArrayBuffer(file);
		});
	} else {
		throw "SPScript.utils.getArrayBuffer: Cant get ArrayBuffer if you don't pass in a file"
	}
};

function validateODataV2(data: any): any {
    data = parseJSON(data);
    var results = null;
    if (data.d && data.d.results && data.d.results.length != null) {
        results = data.d.results;
    } else if (data.d) {
        results = data.d;
    }
    return results || data;
}
declare var SP:any;
function openModal(url:string, modalOptions?:any) {
    if (!validateNamespace("SP.UI.ModalDialog")) {
        throw new Error("Sorry. Unable to open modal because native SharePoint Modal JavaScript is on loaded on page.")
    }
    var defaults = {
        width: 800,
        title: " "
    }
    var options = Object.assign({}, defaults, modalOptions, { url });
    return SP.UI.ModalDialog.showModalDialog(options);
}
var utils: Utils = { 
    isBrowser, 
    headers: headerUtils, 
    parseJSON, 
    validateODataV2, 
    qs: { toObj, fromObj },
    loadScript,
    loadScripts,
    loadCSS,
    getArrayBuffer,
    waitForLibraries,
    waitForLibrary,
    validateNamespace,
    waitForElement,
    openModal
};
export default utils;