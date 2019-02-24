# Modifying List Items

## Setup

If you need to modify list items, you need to:

1. Create an SPScript Context, `SPScript.createContext(siteUrl)`
2. Get a list by Title, `ctx.lists("LIST TITLE")`

These 2 steps are synchronous,they are really just building up the base REST API url for you.

```javascript
// Create a Context and get a list by Title
let ctx = SPScript.createContext("https://TENANT.sharepoint.com/sites/SITE");
let list = ctx.lists("YOUR LIST TITLE");

// This call is async, it actually makes a REST request
let newItem = await list.addItem({ Title: "New Thing" });
```

## addItem

- `addItem(newItem)`

Allows you to pass a JavaScript object, where each property aligns with a SharePoint Field name on the target list. It is async and will give you back the new List Item which will include new properties like the SharePoint ID.

```javascript
var itemToCreate = {
  Title: "My New Task",
  Status: "Not Started",
  RemainingHours: 12
};
let listItem = await ctx.lists("Tasks").addItem(itemToCreate);
```

If your `newItem` object has a property that **isn't** a Field on the List, the call will fail.

## updateItem

- `updateItem(id, updates)`

Allows you to pass a JavaScript object, where each property aligns with a SharePoint Field name on the target list.

- Does a `MERGE` so you don't have to pass all the field values.
- If your updates object has a property that **isn't** a Field on the List, the call will fail.

```javascript
var updates = { Status: "Completed", RemainingHours: 0 };
await ctx.lists("Tasks").updateItem(29, updates);
```

## deleteItem

- `deleteItem(id)`

Deletes the List Item with the specified Id.

_Delete the Shared Documents item with an ID of 47_

```javascript
await ctx.lists("Shared Documents").deleteItem(47);
```

## Source Code

Github Source: [/src/list/List.ts](https://github.com/DroopyTersen/spscript/blob/master/src/list/List.ts)
