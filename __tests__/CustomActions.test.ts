import { getContext } from "./testUtils";
import Context from "../src/Context";

describe("Custom Actions", () => {
  //   var scriptBlock = {
  //     Name: "spscript-test",
  //     Location: "ScriptLink",
  //     ScriptBlock: "console.log('deployed from spscript tests');",
  //   };

  let topNav = {
    title: "TopNav",
    componentId: "f4d63423-0e94-4a77-bf11-c668b09e3e63",
    properties: { menuSiteUrl: "https://skylinespark.com/sites/devshowcase" },
  };

  describe("customActions.activateExtension()", () => {
    let ctx: Context = null;
    beforeAll(async () => {
      ctx = await getContext();
    });

    it("Should add a Custom Action with the given name", async () => {
      await ctx.customActions.activateExtension(
        topNav.title,
        topNav.componentId,
        topNav.properties
      );
      let addedAction = await ctx.customActions.get(topNav.title);
      expect(addedAction).toBeTruthy;
      expect(addedAction).toHaveProperty("Name");
      expect(addedAction.Name).toBe(topNav.title);
    });

    it("Should not duplicate the CustomAction if added multiple times", async () => {
      await ctx.customActions.activateExtension(
        topNav.title,
        topNav.componentId,
        topNav.properties
      );
      await ctx.customActions.activateExtension(
        topNav.title,
        topNav.componentId,
        topNav.properties
      );
      let all = await ctx.customActions.get();
      expect(all.filter((ca) => ca.Name === topNav.title).length).toBe(1);
    });

    it("Should support extra CustomAction properties", async () => {
      let overrides = { Sequence: 0, Description: "Custom Global Navigation" };
      await ctx.customActions.activateExtension(
        topNav.title,
        topNav.componentId,
        topNav.properties,
        overrides
      );

      let addedAction = await ctx.customActions.get(topNav.title);
      expect(addedAction.Sequence).toBe(overrides.Sequence);
      expect(addedAction.Description).toBe(overrides.Description);
    });
  });
});
