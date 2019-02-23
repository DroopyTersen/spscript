import * as SPScript from "../src/index";
import "isomorphic-fetch";
require("dotenv").config();
import * as spauth from "node-sp-auth";
let authHeaders = null;
let siteUrl = process.env.SITE_URL;

describe("node-sp-auth", () => {
	beforeAll(async () => {
		let auth = await spauth.getAuth(process.env.SITE_URL, {
			online: true,
			username: process.env.SP_USER,
			password: process.env.PASSWORD,
		});
		authHeaders = auth.headers;
	});

	test("there is a token", () => {
		expect(authHeaders).toBeTruthy();
	});

	test("createContext(url, { headers })", async () => {
		let ctx = SPScript.createContext(siteUrl, { headers: authHeaders });
		let webInfo = await ctx.web.getInfo();
		expect(webInfo).toBeTruthy();
		expect(webInfo).toHaveProperty("Title");
	});
});
