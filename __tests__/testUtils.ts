import * as SPScript from "../src/index";
import "isomorphic-fetch";
require("dotenv").config();
import * as spauth from "node-sp-auth";

let authHeaders = null;
let siteUrl = process.env.SITE_URL;

export const getAuthHeaders = async () => {
	if (authHeaders) return authHeaders;
	let auth = await spauth.getAuth(siteUrl, {
		online: true,
		username: process.env.SP_USER,
		password: process.env.PASSWORD,
	});
	authHeaders = auth.headers;
	return authHeaders;
};

export const getContext = async () => {
	await getAuthHeaders();
	return SPScript.createContext(siteUrl, { headers: authHeaders });
};
