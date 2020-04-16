# List Operations

## Setup

Performing list operations you need to:

1. Create an SPScript Context
2. Get a list by Title

These 2 steps are synchronous. They are really just building up the base REST API url for you.

```javascript
// Create a Context and get a list by Title
let ctx = SPScript.createContext("https://TENANT.sharepoint.com/sites/SITE");
let list = ctx.lists("YOUR LIST TITLE");

// This call is async, it actually makes a REST request
let items = await list.getItems();
```

## getInfo

- `getInfo() => ListProperties`

Get the properties of the list. Stuff like `ItemCount`, `Hidden`, etc...

```javascript
let info = await ctx.lists("Featured Links").getInfo();
console.log("List Item Count", info.ItemCount);
```

## checkExists

- `checkExists() => boolean`

Check whether a specific list exists

```javascript
let exists = await ctx.lists("Featured Links").checkExists();
```

## getItems

- `getItems()`
- `getItems(odata)`

_Get all items in the "Shared Documents" Library_

```javascript
let items = await ctx.lists("Shared Documents").getItems();
```

You can also pass an optional OData string, giving you full control over your `$filter`, `$orderby`, `$select`, `$expand`, and `$top`.

_Get the file names of the last 5 modified "Shared Documents"_

```javascript
let items = await ctx
  .lists("Shared Documents")
  .getItems("$select=FileLeafRef&$orderby=Modified desc&$top=5");
let filenames = items.map((item) => item.FileLeafRef);
```

## getItemById

- `getItemById(id)`
- `getItemById(id, odata)`

If you know they ID of the SharePoint list item, you can get it directly with `getItemById`.

```javascript
let item = await ctx.lists("Site Pages").getItemById(4);
```

## findItems

- `findItems(fieldName, value)`
- `findItems(fieldName, value, odata)`

If you want to find all items that match a specified Field value, you can use `findItems`.

_Find all pages with a Category of "New Hire"_

```javascript
let newHireAnnouncements = await ctx.lists("Site Pages").findItems("Category", "New Hire");
```

You can use the optional odata argument for more control (just don't use `$filter` because `findItems` is already taking care of that for you).

_Find the 5 most recent "New Hire" pages_

```javascript
let newHireAnnouncements = await ctx
  .lists("Site Pages")
  .findItems("Category", "New Hire", "$orderby=Modified desc&$top=5");
```

## findItem

- `findItem(fieldName, value)`
- `findItem(fieldName, value, odata)`

The same as `findItems` except that it returns a single item (as an `Object`) instead of an `Array` of items.

_Find the Blog post with a Title of "SPScript is Awesome!"_

```javascript
let item = await ctx.lists("Site Pages").findItem("Title", "SPScript is Awesome!");
```

## getItemsByView

- `getItemsByView(viewName)`

Get items based on an existing List View. This way the user can configure the filtering and sorting.

_Get tasks based on the "Prioritized" view_

```javascript
let tasks = await ctx.lists("Tasks").getItemsByView("Prioritized Tasks");
```

## getItemsByCaml

- `getItemsByCaml(caml)`

Instead of OData, pass a CAML query. The parent node should be a `<View>`. Something like:

```xml
<View>
  <Query>
    <Where>...</Where>
  </Query>
</View>
```

I've only found one scenario where I need this, querying by Calculated Fields. You can't do that via OData.

## Query Examples

_Find all Events with a Category of "Birthday"_

<!-- tabs:start -->

#### ** Easiest **

**`findItems(fieldName, value)`**

For when you want items based on a single field value.

You can pass an optional OData string as a third argument to control things like `$orderby`, `$select`, `$expand`, and `$top`.

```javascript
let ctx = SPScript.createContext("https://MYTENANT.sharepoint.com/sites/MYSITE");
let items = await ctx.lists("Events").findItems("Category", "Birthday");
```

#### ** Easy **

**`getItems(odata)`**

Takes an arbtrary OData string, giving you full control over your `$filter`, `$orderby`, `$select`, `$expand`, and `$top`.

```javascript
let ctx = SPScript.createContext("https://MYTENANT.sharepoint.com/sites/MYSITE");
let items = await ctx.lists("Events").getItems("$filter=Category eq 'Birthday'");
```

#### ** Long-winded**

**`ctx.get(apiUrl)`**

You can always make a generic `GET` request using SPScript's helper to setup the proper headers.

```javascript
let ctx = SPScript.createContext("https://MYTENANT.sharepoint.com/sites/MYSITE");
let endpoint = "/web/lists/getByTitle('Events')/items?$filter=Category eq 'Birthday'";
let data = await ctx.get(endpoint);
let items = data.d.results;
```

<!-- tabs:end -->

## addItem

- `addItem(newItem)`

Allows you to pass a JavaScript object, where each property aligns with a SharePoint Field name on the target list. It is async and will give you back the new List Item which will include new properties like the SharePoint ID.

```javascript
var itemToCreate = {
  Title: "My New Task",
  Status: "Not Started",
  RemainingHours: 12,
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
