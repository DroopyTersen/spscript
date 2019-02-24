# List Items

## Examples

_Find all Events with a Category of "Birthday"_

<!-- tabs:start -->

#### ** Easiest **

**`findItems(fieldName, value)`**

For when you want items based on a single field value.

You can pass an optional OData string as a third argument to control things like `$orderby`, `$select`, `$expand`, and `$top`.

```javascript
let items = await ctx.lists("Events").findItems("Category", "Birthday");
```

#### ** Easy **

**`getItems(odata)`**

Takes an arbtrary OData string, giving you full control over your `$filter`, `$orderby`, `$select`, `$expand`, and `$top`.

```javascript
let items = await ctx.lists("Events").getItems("$filter=Category eq 'Birthday'");
```

#### ** Long-winded**

**`ctx.get(apiUrl)`**

You can always make a generic `GET` request using SPScript's helper to setup the proper headers.

```javascript
let endpoint = "/web/lists/getByTitle('Events')/items?$filter=Category eq 'Birthday'";
let data = await ctx.get(endpoint);
let items = data.d.results;
```

<!-- tabs:end -->
