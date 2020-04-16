import { getContext } from "./testUtils";

const termGroup = "_Skyline";
const termset = "Departments";
describe("MMS", () => {
  let ctx = null;
  describe("getTermset()", () => {
    let terms = null;
    beforeAll(async () => {
      ctx = await getContext();
      terms = await ctx.mms.getTermset(termGroup, termset);
    });
    it("Should return an array of (flat) MMS terms", () => {
      expect(terms).toHaveProperty("length");
      expect(terms.length).toBeGreaterThan(0);
      expect(terms[0]).toHaveProperty("path");
      expect(terms[0]).toHaveProperty("name");
      expect(terms[0]).toHaveProperty("id");
      expect(terms[0]).toHaveProperty("termSetName");
      expect(terms[0]).toHaveProperty("description");
    });
    it("Should return Term sorted by path", () => {
      expect(terms).toHaveProperty("length");
      expect(terms.length).toBeGreaterThan(1);
      expect(terms[0].path < terms[1].path).toBe(true);
    });
  });

  describe("getTermTree()", () => {
    let termTree = null;
    beforeAll(async () => {
      ctx = await getContext();
      termTree = await ctx.mms.getTermTree(termGroup, termset);
    });
    it("Should with the flattened MMS terms", () => {
      expect(termTree).toHaveProperty("flatTerms");
      expect(termTree.flatTerms.length).toBeGreaterThan(2);
      expect(termTree.flatTerms[0]).toHaveProperty("path");
      expect(termTree.flatTerms[0]).toHaveProperty("name");
      expect(termTree.flatTerms[0].path < termTree.flatTerms[1].path).toBe(true);
    });

    describe("termTree.getTermByName(name)", () => {
      it("Should return the correct term", () => {
        let target = termTree.flatTerms[termTree.flatTerms.length - 1];
        console.log("target", target);
        expect(target).toHaveProperty("name");
        expect(target).toHaveProperty("id");
        let result = termTree.getTermByName(target.name);
        expect(result).toHaveProperty("id");
        expect(result.id).toBe(target.id);
      });
      it("Should return null for an invalid term", () => {
        let result = termTree.getTermByName("BOOGA BOOGA");
        expect(result).toBe(null);
      });
    });

    describe("termTree.getTermById(termGuid)", () => {
      it("Should return the correct term", () => {
        let target = termTree.flatTerms[termTree.flatTerms.length - 1];
        expect(target).toHaveProperty("id");
        let result = termTree.getTermById(target.id);
        expect(result).toHaveProperty("id");
        expect(result.id).toBe(target.id);
      });
      it("Should return null for an invalid term", () => {
        let result = termTree.getTermById("BOOGA BOOGA");
        expect(result).toBe(null);
      });
    });

    describe("termTree.getTermByPath(path)", () => {
      it("Should return the correct term", () => {
        let target = termTree.flatTerms[termTree.flatTerms.length - 1];
        expect(target).toHaveProperty("path");
        let result = termTree.getTermByPath(target.path);
        expect(result).toHaveProperty("id");
        expect(result.id).toBe(target.id);
      });
      it("Should return null for an invalid term", () => {
        let result = termTree.getTermByPath("BOOGA BOOGA");
        expect(result).toBe(null);
      });
    });
  });
});
