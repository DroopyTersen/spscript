export * from "./headers";
import * as qsUtils from "./queryString";
export * from "./loaders";
export * from "./dependencyManagement";

export const qs = qsUtils;

export function isBrowser(): boolean {
  return !(typeof window === "undefined");
}

export function getProfilePhoto(email: string) {
  return `${getSiteUrl()}/_layouts/15/userphoto.aspx?size=L&username=${email}`;
}

export function getDelveLink(email: string) {
  return `https://${getTenant()}-my.sharepoint.com/PersonImmersive.aspx?accountname=i%3A0%23%2Ef%7Cmembership%7C${email}`;
}

export function parseJSON(data: any): any {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      return null;
    }
  }
  return data;
}

export const getArrayBuffer = function (file) {
  if (file && file instanceof File) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (e: any) {
        resolve(e.target.result);
      };
      reader.readAsArrayBuffer(file);
    });
  } else {
    throw "SPScript.utils.getArrayBuffer: Cant get ArrayBuffer if you don't pass in a file";
  }
};

export function parseOData(data: any): any {
  data = parseJSON(data);
  var results = null;
  if (data.d && data.d.results && data.d.results.length != null) {
    results = data.d.results;
  } else if (data.d) {
    results = data.d;
  } else if (data.value) {
    results = data.value;
  }
  return results || data;
}

export function checkIsSharePointLink(url: string) {
  return url && url.search(/\.sharepoint\.com/i) > -1;
}

export function getSiteUrl(url?: string) {
  if (!url && !isBrowser()) throw new Error("No url given and it is not in a browser.");
  url = (url || window.location.href).toLowerCase();
  let managedPathIndex = url.search(/\/sites\/|\/teams\//i);
  if (!checkIsSharePointLink(url) || managedPathIndex < 0) return null;
  let siteUrl = url;
  let trailingCharIndexes = [
    url.indexOf("/", managedPathIndex + 7),
    url.indexOf("?", managedPathIndex + 7),
    url.indexOf("#", managedPathIndex + 7),
  ].filter((i) => i > -1);
  let targetIndex = Math.min(...trailingCharIndexes);
  if (targetIndex > -1) {
    siteUrl = url.substring(0, targetIndex);
  }
  return siteUrl;
}

export function getTenant(url?: string) {
  if (!url && !isBrowser()) throw new Error("No url given and it is not in a browser.");
  if (!url) url = window.location.href;
  url = url.toLowerCase();
  if (!checkIsSharePointLink(url)) return null;

  let sharepointIndex = url.indexOf(".sharepoint");
  // Substring, start after https://, and at the '.sharepoint'
  let subdomain = url.substring(8, sharepointIndex);
  // support stuff like https://mytenant-admin.sharepoint.com and https://mytenant-my.sharepoint.com

  return subdomain.split("-")[0];
}
