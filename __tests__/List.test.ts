import { getContext } from "./testUtils";

describe("List.addItem()", () => {
  it("Should create a list item", async () => {
    let ctx = await getContext();
    let newitem = await ctx.lists("TestList").addItem({ Title: "new item" });
    expect(newitem).toHaveProperty("Title");
  });
  afterAll(async () => {
    let ctx = await getContext();
    let items = await ctx.lists("TestList").getItems();
    return Promise.all(items.map((item) => ctx.lists("TestList").deleteItem(item.Id)));
  });
});
