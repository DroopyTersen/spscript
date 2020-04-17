import { getContext } from "./testUtils";
import Context from "../src/Context";

describe("Search", () => {
  let ctx: Context = null;
  beforeAll(async () => {
    ctx = await getContext();
  });
  describe("search.query(searchText)", () => {
    it("Should return a Promise that resolves to a SearchResults object", async () => {
      let result = await ctx.search.query("Andrew");
      expect(result).toBeTruthy();
      expect(result).toHaveProperty("resultsCount");
      expect(result).toHaveProperty("totalResults");
      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("refiners");
      expect(result.items).toHaveProperty("length");
    });
  });

  describe("ctx.search.query(queryText, queryOptions)", function () {
    it("Should obey the extra query options that were passed", async function () {
      var queryText = "andrew";
      var options = {
        rowlimit: 1,
      };
      let result = await ctx.search.query(queryText, options);
      expect(result).toBeTruthy();
      expect(result).toHaveProperty("resultsCount");
      expect(result).toHaveProperty("totalResults");
      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("refiners");
      expect(result.items).toHaveProperty("length");
      expect(result.items.length).toBe(1);
    });
  });

  describe("ctx.search.query(queryText, queryOptions) - w/ Refiners", function () {
    it("Should return SearchResults that include a refiners Array", async () => {
      var refinerName = "FileType";
      var queryText = "andrew";
      var options = {
        refiners: `${refinerName}`,
      };
      let result = await ctx.search.query(queryText, options);
      expect(result).toBeTruthy();
      expect(result).toHaveProperty("resultsCount");
      expect(result).toHaveProperty("totalResults");
      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("refiners");
      expect(result.items).toHaveProperty("length");
      expect(result.refiners).toHaveProperty("length");
      expect(result.refiners.length).toBeGreaterThan(0);
      var firstRefiner = result.refiners[0];
      expect(firstRefiner).toHaveProperty("RefinerName");
      expect(firstRefiner).toHaveProperty("RefinerOptions");
      expect(firstRefiner.RefinerName).toBe(refinerName);
    });
  });

  describe("ctx.search.people(queryText)", function () {
    it("Should only return search results that are people", async () => {
      let result = await ctx.search.people("Andrew");
      expect(result).toHaveProperty("items");
      expect(result.items).toHaveProperty("length");
      expect(result.items.length).toBeGreaterThan(0);
      result.items.forEach((item) => {
        expect(item).toHaveProperty("AccountName");
        expect(item).toHaveProperty("PreferredName");
        expect(item).toHaveProperty("AboutMe");
        expect(item).toHaveProperty("WorkEmail");
        expect(item).toHaveProperty("PictureURL");
      });
    });
  });

  describe("ctx.search.sites(queryText, scope)", function () {
    it("Should only return search results that are sites", async () => {
      let result = await ctx.search.sites("");
      expect(result).toHaveProperty("items");
      expect(result.items).toHaveProperty("length");
      expect(result.items.length).toBeGreaterThan(0);
      result.items.forEach((item) => {
        expect(item).toHaveProperty("Path");
        expect(item).toHaveProperty("contentclass");
        expect(item.contentclass).toBe("STS_Web");
      });
    });
  });
});
