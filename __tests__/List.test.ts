import { getContext } from "./testUtils";

describe("List", () => {
  let list = null;
  beforeAll(async () => {
    let ctx = await getContext();
    list = ctx.lists("TestList");
  });

  // describe("list.addItem()", () => {
  //   it("Should create a list item", async () => {
  //     let newitem = await list.addItem({ Title: "new item", MyStatus: "Green" });
  //     expect(newitem).toHaveProperty("Title");
  //   });
  //   afterAll(async () => {
  //     let items = await list.getItems();
  //     return Promise.all(items.map((item) => list.deleteItem(item.Id)));
  //   });
  // });

  describe("list.info()", function () {
    it("Should return a promise that resolves to list info", async function () {
      let listInfo = await list.getInfo();
      expect(listInfo).toBeTruthy();
      expect(listInfo).toHaveProperty("Title");
      expect(listInfo).toHaveProperty("ItemCount");
      expect(listInfo).toHaveProperty("ListItemEntityTypeFullName");
    });
  });

  describe("list.getItems()", () => {
    var items = null;
    beforeAll(async function () {
      items = await list.getItems();
    });

    it("Should return a promise that resolves to an array of items", function () {
      expect(items).toBeTruthy;
      expect(items).toHaveProperty("length");
    });

    it("Should return all the items in the list", async () => {
      let info = await list.getInfo();
      expect(items.length).toEqual(info.ItemCount);
    });
  });

  describe("list.getItems(odata)", () => {
    var items = null;
    var odata = "$filter=MyStatus eq 'Green'";
    beforeAll(async function () {
      items = await list.getItems(odata);
    });

    it("Should return a promise that resolves to an array of items", function () {
      expect(items).toBeTruthy();
      expect(items).toHaveProperty("length");
    });

    it("Should return only items that match the OData params", function () {
      items.forEach(function (item) {
        expect(item).toHaveProperty("MyStatus");
        expect(item.MyStatus).toBe("Green");
      });
    });
  });

  describe("list.getItemById(id)", function () {
    var item = null;
    var validId = -1;
    beforeAll(function (done) {
      list
        .getItems()
        .then(function (allItems) {
          validId = allItems[0].Id;
          return validId;
        })
        .then(function (id) {
          return list.getItemById(id);
        })
        .then(function (result) {
          item = result;
          done();
        });
    });
    it("Should return a promise that resolves to a single item", function () {
      expect(item).toBeTruthy();
      expect(item).toHaveProperty("Title");
    });
    it("Should resolve an item with a matching ID", function () {
      expect(item).toHaveProperty("Id");
      expect(item.Id).toBe(validId);
    });
    it("Should be able to return attachments using the optional odata query", async () => {
      let item = await list.getItemById(validId, "$expand=AttachmentFiles");
      expect(item).toHaveProperty("AttachmentFiles");
      expect(item.AttachmentFiles).toHaveProperty("length");
    });
  });

  describe("list.findItems(key, value)", function () {
    var matches = null;
    beforeAll(async function () {
      matches = await list.findItems("MyStatus", "Green");
    });

    it("Should return a promise that resolves to an array of list items", function () {
      expect(matches).toHaveProperty("length");
      expect(matches.length).toBeGreaterThan(0);
    });
    it("Should only bring back items the match the key value query", function () {
      matches.forEach(function (item) {
        expect(item).toHaveProperty("MyStatus");
        expect(item.MyStatus).toBe("Green");
      });
    });
  });

  describe("list.findItem(key, value)", function () {
    var match = null;
    beforeAll(async function () {
      match = await list.findItem("MyStatus", "Green");
    });
    it("Should only bring back an item if it matches the key value query", function () {
      expect(match).toBeTruthy();
      expect(match).toHaveProperty("MyStatus");
      expect(match.MyStatus).toBe("Green");
    });
  });

  describe("list.addItem()", function () {
    var newItem = {
      Title: "Test Created Item",
      MyStatus: "Red",
    };
    var insertedItem = null;
    beforeAll(async function () {
      insertedItem = await list.addItem(newItem);
    });
    it("Should return a promise that resolves with the new list item", function () {
      expect(insertedItem).toBeTruthy();
      expect(insertedItem).toHaveProperty("Id");
    });
    it("Should save the item right away so it can be queried.", async function () {
      let foundItem = await list.getItemById(insertedItem.Id);
      expect(foundItem).toHaveProperty("Title");
      expect(foundItem.Title).toBe(newItem.Title);
    });
    // it("Should throw an error if a invalid field is set", async function () {
    //   let invalidItem = {
    //     ...newItem,
    //     InvalidColumn: "test",
    //   };
    //   try {
    //     list.addItem(invalidItem);
    //     expect("This").toBe("should have failed.");
    //   } catch (err) {
    //     return;
    //   }
    // });
  });

  describe("list.deleteItem(id)", function () {
    var itemToDelete = null;
    beforeAll(async function () {
      await list.getItems("$orderby=Id").then(function (items) {
        itemToDelete = items[items.length - 1];
        return list.deleteItem(itemToDelete.Id);
      });
    });
    it("Should delete that item", function (done) {
      list
        .getItemById(itemToDelete.Id)
        .then(function () {
          throw "Should have failed because item has been deleted";
        })
        .catch(function () {
          done();
        });
    });
    it("Should reject the promise if the item id can not be found", function (done) {
      list
        .deleteItem(99999999)
        .then(function () {
          throw "Should have failed because id doesnt exist";
        })
        .catch(function () {
          done();
        });
    });
  });

  describe("list.updateItem()", function () {
    var itemToUpdate = null;
    var updates = {
      Title: "Updated Title",
    };
    beforeAll(async function () {
      let items = await list.getItems("$orderby=Id desc");
      itemToUpdate = items[items.length - 1];
    });
    it("Should update only the properties that were passed", async function () {
      let updateResult = await list.updateItem(itemToUpdate.Id, updates);
      let target = await list.getItemById(itemToUpdate.Id);
      expect(target).toHaveProperty("Title");
      expect(target.Title).toBe(updates.Title);
    });
  });

  describe("list.getItemsByCaml()", () => {
    let items = null;
    const caml = `<View></View>`;
    beforeAll(async () => {
      items = await list.getItemsByCaml(caml);
    });
    it("Should return an array of list items", () => {
      expect(items).toHaveProperty("length");
    });
  });

  describe("list.getItemsByView()", () => {
    let items = null;
    beforeAll(async () => {
      items = await list.getItemsByView("Green Status");
    });
    it("Should return an array of list items that match the View query", () => {
      expect(items).toHaveProperty("length");
      items.forEach((item) => {
        expect(item).toHaveProperty("MyStatus");
        expect(item.MyStatus).toBe("Green");
      });
    });
  });
});
