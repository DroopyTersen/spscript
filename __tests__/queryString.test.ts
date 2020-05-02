import { fromObj, toObj } from "../src/utils/queryString";

describe("Query String Utils", () => {
  describe("fromObj(obj)", () => {
    it("Should turn a basic object into a querystring", () => {
      let obj = {
        foo: "one",
        bar: 2,
      };
      let qs = fromObj(obj);
      expect(qs).toBe("foo=one&bar=2");
    });
    it("Should automatically run encodeURIComponent", () => {
      let obj = {
        foo: "thing one",
        bar: 2,
      };

      let qs = fromObj(obj);
      expect(qs).toBe("foo=thing%20one&bar=2");
    });
  });

  describe("toObj", () => {
    it("Should handle a basic object", () => {
      let str = "foo=one&bar=2";
      let obj = toObj(str);
      expect(obj).toHaveProperty("foo");
      expect(obj).toHaveProperty("bar");
      expect(obj.foo).toBe("one");
      expect(obj.bar).toBe("2");
    });
    it("Should handle decoding the values", () => {
      let str = "foo=thing%20one&bar=2";
      let obj = toObj(str);
      expect(obj).toHaveProperty("foo");
      expect(obj).toHaveProperty("bar");
      expect(obj.foo).toBe("thing one");
      expect(obj.bar).toBe("2");
    });
    it("Should handle a ? at the beginning of the string", () => {
      let str = "?foo=thing%20one&bar=2";
      let obj = toObj(str);
      expect(obj).toHaveProperty("foo");
      expect(obj).toHaveProperty("bar");
      expect(obj.foo).toBe("thing one");
      expect(obj.bar).toBe("2");
    });
  });
});
