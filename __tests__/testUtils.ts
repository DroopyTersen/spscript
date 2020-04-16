import * as SPScript from "../src/index";
import "isomorphic-fetch";
require("dotenv").config();
import * as spauth from "node-sp-auth";

let authHeaders = null;
let siteUrl = process.env.SITE_URL;

export const getAuthHeaders = async () => {
  if (authHeaders) return authHeaders;
  let auth = await spauth.getAuth(siteUrl, {
    username: process.env.SP_USER,
    password: process.env.PASSWORD,
  });
  authHeaders = auth.headers;
  process.env.AUTH_HEADERS = JSON.stringify(authHeaders);
  console.log("getAuthHeaders -> authHeaders", process.env.AUTH_HEADERS);
  return authHeaders;
};

export const getContext = async () => {
  if (!process.env.AUTH_HEADERS) {
    await getAuthHeaders();
  }
  return SPScript.createContext(siteUrl, { headers: JSON.parse(process.env.AUTH_HEADERS) });
};
