export function fromObj(obj: any, quoteValues: boolean = false): string {
  var writeParam = function (key) {
    var value = (obj[key] + "").trim();
    // if there is a space, wrap in single quotes
    if (value.indexOf(" ") > -1 || quoteValues) value = "'" + value + "'";

    return key + "=" + value;
  };

  var str = Object.keys(obj).map(writeParam).join("&");
  return str;
}

export function toObj(str?: string): any {
  //if no string is passed use window.location.search
  if (str === undefined && window && window.location && window.location.search) {
    str = window.location.search;
  }
  if (!str) return {};
  //trim off the leading '?' if its there
  if (str[0] === "?") str = str.substr(1);

  try {
    return JSON.parse('{"' + str.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (
      key,
      value
    ) {
      return key === "" ? value : decodeURIComponent(value);
    });
  } catch (err) {
    console.log("SPScript Error: Unable to parse querystring");
    return {};
  }
}
