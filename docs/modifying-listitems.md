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

## Source Code

Github Source: [/src/list/List.ts](https://github.com/DroopyTersen/spscript/blob/master/src/list/List.ts)
