import utils from "../utils/index.js";
var defaults = {
  method: "GET",
  credentials: "include",
  redirect: "follow"
};

var request = function (url, options) {
  var opts = Object.assign({}, defaults, options);
  return fetch(url, opts).then(resp => {
    var succeeded = resp.ok;

    if (!resp.ok) {
      return resp.text().then(err => {
        throw new Error(err);
      });
    }

    return resp.text().then(text => {
      return utils.parseJSON(text) || text;
    });
  });
};

export default request;