import * as SPScript from "../src/index";
import "isomorphic-fetch";
require("dotenv").config();
import * as spauth from "node-sp-auth";
let authHeaders = null;
let siteUrl = process.env.SITE_URL;

describe("SPScript.createContext(url, { headers: { FedAuthCookie }} )", () => {
	beforeAll(async () => {
		authHeaders = await _getAuthHeaders();
	});

	test("There is a FedAuth token", () => {
		expect(authHeaders).toBeTruthy();
	});

	test("The FedAuth token can be used to authenticate requests", async () => {
		let ctx = SPScript.createContext(siteUrl, { headers: authHeaders });
		let webInfo = await ctx.web.getInfo();
		expect(webInfo).toBeTruthy();
		expect(webInfo).toHaveProperty("Title");
	});
});

describe("Context Namespaces", function() {
	let ctx = null;
	beforeEach(() => {
		ctx = SPScript.createContext("blah blah");
	});

	it("Should create the primary object you use to interact with the site", function() {
		if (!ctx) throw new Error("Context is null");
		expect(ctx).toHaveProperty("webUrl");
		expect(ctx).toHaveProperty("executeRequest");
		expect(ctx).toHaveProperty("get");
		expect(ctx).toHaveProperty("post");
		expect(ctx).toHaveProperty("authorizedPost");
		expect(ctx).toHaveProperty("lists");
		expect(ctx).toHaveProperty("auth");
	});
	it("Should allow a url to be passed in", function() {
		var url = "http://blah.sharepoint.com";
		var context = SPScript.createContext(url);
		expect(context.webUrl).toBe(url);
	});

	describe("ctx.web", function() {
		test("Should have an SPScript Web object with site methods (getUser, getSubsites etc...)", function() {
			expect(ctx).toHaveProperty("web");
			expect(ctx.web).toHaveProperty("getUser");
			expect(ctx.web).toHaveProperty("getSubsites");
		});
	});

	describe("ctx.search", function() {
		it("Should have an SPScript Search object with search methods (query, people, sites etc...)", function() {
			expect(ctx).toHaveProperty("search");
			expect(ctx.search).toHaveProperty("query");
			expect(ctx.search).toHaveProperty("people");
			expect(ctx.search).toHaveProperty("sites");
		});
	});

	describe("ctx.profiles", function() {
		it("Should have an SPScript Profiles object with methods to hit the Profile Service (current, setProperty etc...)", function() {
			expect(ctx).toHaveProperty("profiles");
			expect(ctx.profiles).toHaveProperty("get");
			expect(ctx.profiles).toHaveProperty("setProperty");
		});
	});

	describe("ctx.auth", () => {
		it("Should have methods to get Request digest as well as get Graph Token", () => {
			expect(ctx).toHaveProperty("auth");
			expect(ctx.auth).toHaveProperty("getRequestDigest");
			expect(ctx.auth).toHaveProperty("ensureRequestDigest");
			expect(ctx.auth).toHaveProperty("getGraphToken");
		});
	});

	describe("ctx.lists", () => {
		it("Should be a method you can use to get an SPScript List object back by passing a list name", () => {
			expect(ctx).toHaveProperty("lists");
			expect(typeof ctx.lists).toBe("function");
		});
	});
});

describe("Context Methods", () => {
	let ctx = null;
	beforeAll(async () => {
		authHeaders = await _getAuthHeaders();
		ctx = SPScript.createContext(siteUrl, { headers: authHeaders });
	});

	describe("ctx.lists(name)", function() {
		it("Should return an SPScript List instance", function() {
			var list = ctx.lists("My List");
			expect(list).toHaveProperty("listName");
			expect(list).toHaveProperty("getInfo");
		});
	});

	describe("ctx.get(url, [opts])", function() {
		var promise;
		beforeAll(function() {
			promise = ctx.get("/lists?$select=Title");
		});
		it("Should return a Promise", function() {
			if (!promise) throw new Error("Promise is null");
			expect(promise).toHaveProperty("then");
		});
		it("Should resolve to a JS object, not a JSON string", async function() {
			let data = await promise;
			expect(data).toHaveProperty("d");
		});
		it("Should return valid API results: ctx.get('/lists')", async () => {
			let data = await promise;
			expect(data).toHaveProperty("d");
			expect(data.d).toHaveProperty("results");
			expect(data.d.results).toBeInstanceOf(Array);
		});
	});

	// TODO: look into JEST mocking of executeRequest
	describe("ctx.post(url, [body], [opts]", function() {
		// it("Should return a Promise");
		// it("Should resolve to a JS object, not a JSON string");
	});

	describe("ctx.authorizedPost(url, [body], [opts]", function() {
		// it("Should include a request digest in the headers");
		// it("Should return a Promise");
		// it("Should resolve to a JS object, not a JSON string");
	});
});

const _getAuthHeaders = async () => {
	if (authHeaders) return authHeaders;
	let auth = await spauth.getAuth(process.env.SITE_URL, {
		online: true,
		username: process.env.SP_USER,
		password: process.env.PASSWORD,
	});
	authHeaders = auth.headers;
	return authHeaders;
};
