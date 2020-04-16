import * as SPScript from "../src/index";
import "isomorphic-fetch";
require("dotenv").config();

let siteUrl = process.env.SITE_URL;

export const getContext = async () => {
  return SPScript.createContext(siteUrl, { headers: JSON.parse(process.env.AUTH_HEADERS) });
};
