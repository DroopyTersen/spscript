import { getContext } from "./testUtils";
import Context from "../src/Context";

describe("Securable (web and List)", () => {
  let ctx: Context;
  beforeAll(async () => {
    ctx = await getContext();
  });

  describe("web.permissions.check()", () => {
    it("Should check the permissions of the current user", async () => {
      let permissions = await ctx.web.permissions.check();
      expect(permissions).toBeTruthy();
      expect(permissions).toHaveProperty("length");
      expect(permissions.length).toBeGreaterThan(0);
      //   console.log("ME: ", permissions);
    });
    it("Should check the permissions of the of the specified user", async () => {
      let permissions = await ctx.web.permissions.check("apetersen@skylinespark.onmicrosoft.com");
      expect(permissions).toBeTruthy();
      expect(permissions).toHaveProperty("length");
      expect(permissions.length).toBeGreaterThan(0);
      //   console.log("Sarah", permissions);
    });
  });

  describe("web.permissions.getRoleAssignments()", () => {
    it("Should return an array of {member, roles} objects", async () => {
      let roleAssignments = await ctx.web.permissions.getRoleAssignments();
      expect(roleAssignments).toHaveProperty("length");
      expect(roleAssignments.length).toBeGreaterThan(0);

      expect(roleAssignments[0]).toHaveProperty("member");
      expect(roleAssignments[0]).toHaveProperty("roles");
      expect(roleAssignments[0].member).toHaveProperty("name");
      expect(roleAssignments[0].member).toHaveProperty("login");
      expect(roleAssignments[0].member).toHaveProperty("id");

      expect(roleAssignments[0].roles).toHaveProperty("length");
      expect(roleAssignments[0].roles.length).toBeGreaterThan(0);

      expect(roleAssignments[0].roles[0]).toHaveProperty("name");
    });
  });

  describe("list.permissions.check()", () => {
    it("Should check the permissions of the current user", async () => {
      let permissions = await ctx.lists("Site Pages").permissions.check();
      expect(permissions).toBeTruthy();
      expect(permissions).toHaveProperty("length");
      expect(permissions.length).toBeGreaterThan(0);
      //   console.log("ME: ", permissions);
    });
    it("Should check the permissions of the of the specified user", async () => {
      let permissions = await ctx.web.permissions.check("apetersen@skylinespark.onmicrosoft.com");
      expect(permissions).toBeTruthy();
      expect(permissions).toHaveProperty("length");
      expect(permissions.length).toBeGreaterThan(0);
      //   console.log("Sarah", permissions);
    });
  });

  describe("list.permissions.getRoleAssignments()", () => {
    it("Should return an array of {member, roles} objects", async () => {
      let roleAssignments = await ctx.lists("Site Pages").permissions.getRoleAssignments();
      expect(roleAssignments).toHaveProperty("length");
      expect(roleAssignments.length).toBeGreaterThan(0);

      expect(roleAssignments[0]).toHaveProperty("member");
      expect(roleAssignments[0]).toHaveProperty("roles");
      expect(roleAssignments[0].member).toHaveProperty("name");
      expect(roleAssignments[0].member).toHaveProperty("login");
      expect(roleAssignments[0].member).toHaveProperty("id");

      expect(roleAssignments[0].roles).toHaveProperty("length");
      expect(roleAssignments[0].roles.length).toBeGreaterThan(0);

      expect(roleAssignments[0].roles[0]).toHaveProperty("name");
    });
  });
});
