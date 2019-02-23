import * as SPScript from "../src/index";
require("dotenv").config();

describe("SPScript Namespace", () => {
  test("Should have a 'SPScript.createContext()' method", function() {
    expect(SPScript).toHaveProperty("createContext");
    expect(typeof SPScript.createContext).toBe("function");
  });
  test("Should have a 'SPScript.utils' namespace", function() {
    expect(SPScript).toHaveProperty("utils");
  });
});
