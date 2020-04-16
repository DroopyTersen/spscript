import SPScript from "../src/index";
import { getContext } from "./testUtils";

describe("ctx.profiles", () => {
  describe("ctx.profiles.current()", function () {
    it("Should resolve to the current user's profile", async function () {
      try {
        let ctx = await getContext();
        let profile = await ctx.profiles.current();
        expect(profile).toHaveProperty("AccountName");
        expect(profile).toHaveProperty("Email");
        expect(profile.Email).toBeTruthy();
        expect(profile.Email.toLowerCase()).toBe(process.env.SP_USER.toLowerCase());
        expect(profile).toHaveProperty("PreferredName");
      } catch (err) {
        console.error("ERROR", err);
      }
    });
  });

  describe("ctx.profiles.get()", () => {
    it("Should resolve to the current user's profile if no email address is provided", async function () {
      try {
        let ctx = await getContext();
        let profile = await ctx.profiles.get();
        expect(profile).toHaveProperty("AccountName");
        expect(profile).toHaveProperty("Email");
        expect(profile.Email).toBeTruthy();
        expect(profile.Email.toLowerCase()).toBe(process.env.SP_USER.toLowerCase());
        expect(profile).toHaveProperty("PreferredName");
      } catch (err) {
        console.error("ERROR", err);
      }
    });
  });

  describe("ctx.profiles.get(email)", () => {
    it("Should resolve to the profile of the user tied to the given email address", async () => {
      try {
        const EMAIL = "wspiering@skylinespark.onmicrosoft.com";
        let ctx = await getContext();
        let profile = await ctx.profiles.get(EMAIL);
        expect(profile).toHaveProperty("AccountName");
        expect(profile).toHaveProperty("Email");
        expect(profile.Email).toBeTruthy();
        expect(profile.Email.toLowerCase()).toBe(EMAIL.toLowerCase());
        expect(profile).toHaveProperty("PreferredName");
      } catch (err) {
        console.error("ERROR", err);
      }
    });
    it("Should reject the Promise for an invalid email", async () => {
      try {
        const EMAIL = "INVALIDg@skylinespark.onmicrosoft.com";
        let ctx = await getContext();
        return await expect(ctx.profiles.get(EMAIL)).rejects.toThrowError();
      } catch (err) {
        console.error("ERROR", err);
      }
    });
  });

  describe("ctx.profiles.setProperty(key, value)", () => {
    it("Should update the current user's profile", async () => {
      try {
        const aboutMeValue = "Hi there. I was updated with SPScript v5";
        let ctx = await getContext();
        await ctx.profiles.setProperty("AboutMe", aboutMeValue);
        let profile = await ctx.profiles.current();
        expect(profile).toHaveProperty("AboutMe");
        expect(profile["AboutMe"]).toBe(aboutMeValue);
      } catch (err) {
        console.error("ERROR", err);
      }
    });
  });

  describe.skip("ctx.profiles.setProperty(key, value, email)", () => {
    const EMAIL = "wspiering@skylinespark.onmicrosoft.com";
    it("Should update the targeted user's profile", async () => {
      const aboutMeValue = "Hi there. I was updated with SPScript #2";
      let ctx = await getContext();
      await ctx.profiles.setProperty("AboutMe", aboutMeValue, EMAIL);
      let profile = await ctx.profiles.get(EMAIL);
      expect(profile).toHaveProperty("AboutMe");
      expect(profile["AboutMe"]).toBe(aboutMeValue);
    });
  });
});
