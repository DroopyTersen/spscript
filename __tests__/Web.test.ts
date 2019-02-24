import * as SPScript from "../src/index";
import { getContext } from "./testUtils";

describe("ctx.web", () => {
	let ctx;
	beforeAll(async () => {
		ctx = await getContext();
	});
	describe("ctx.web.getInfo()", function() {
		it("Should return a promise that resolves to web info", async () => {
			let webInfo = await ctx.web.getInfo();
			expect(webInfo).toHaveProperty("Url");
			expect(webInfo).toHaveProperty("Title");
		});
	});

	describe("ctx.web.getSubsites()", function() {
		it("Should return a promise that resolves to an array of subsite web infos.", async () => {
			let subsites = await ctx.web.getSubsites();
			expect(subsites).toBeInstanceOf(Array);
		});
	});

	describe("ctx.web.getUser()", function() {
		it("Should return a promise that resolves to a user", async () => {
			let user = await ctx.web.getUser();
			expect(user).toHaveProperty("Id");
			expect(user).toHaveProperty("LoginName");
			expect(user).toHaveProperty("Email");
		});
		it("Should return the current user if no email is given", async () => {
			let user = await ctx.web.getUser();
			expect(user.Email).toBe(process.env.SP_USER);
		});
	});

	describe("ctx.web.getUser(email)", function() {
		const EMAIL = "wspiering@skylinespark.onmicrosoft.com";
		it("Should return a promise that resolves to a user", async () => {
			let user = await ctx.web.getUser(EMAIL);
			expect(user).toHaveProperty("Id");
			expect(user).toHaveProperty("LoginName");
			expect(user).toHaveProperty("Email");
		});
		it("Should return the current user if no email is given", async () => {
			let user = await ctx.web.getUser(EMAIL);
			expect(user.Email).toBe(EMAIL);
		});
	});

	describe("ctx.web.getFile(serverRelativeFilepath)", () => {
		it("Should return a promise that resolves to a file object", async () => {
			let fileUrl = "/sites/spscript/sitepages/home.aspx";
			let file = await ctx.web.getFile(fileUrl);
			expect(file).toBeTruthy();
			expect(file).toHaveProperty("Name");
			expect(file).toHaveProperty("ETag");
			expect(file).toHaveProperty("UIVersionLabel");
			expect(file).toHaveProperty("Exists");
		});
	});

	describe.only("ctx.web.copyFile(serverRelativeSourceUrl, serverRelativeDestUrl)", function() {
		let sourceUrl = "/sites/spscript/shared documents/testfile.txt";
		let filename = "testfile-" + Date.now() + ".txt";
		let destinationUrl = "/sites/spscript/shared documents/" + filename;
		it("Should return a promise, and once resolved, the new (copied) file should be retrievable.", async () => {
			let sourceFile = await ctx.web.getFile(sourceUrl);
			expect(sourceFile).toBeTruthy();
			await ctx.web.copyFile(sourceUrl, destinationUrl);
			let newFile = await ctx.web.getFile(destinationUrl);
			expect(newFile).toBeTruthy();
			expect(newFile).toHaveProperty("Name");
			expect(newFile.Name).toBe(filename);
		});
	});
});
