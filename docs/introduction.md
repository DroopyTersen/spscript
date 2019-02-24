# Introduction

SPScript is a JavaScript library meant to simplify working with the SharePoint REST API.

- Easy querying of list items
- Add and Update list items with a single line of code
- No more pulling out hair with working with Search endpoints
- Profile service helpers
- Generic `GET` and `POST` helpers to simplify calling arbitrary endpoints
- Works server-side in Node.js

For example, lets say I wanted to get all of the "Active" items in the "Tasks" list of the current site.

```javascript
// Create an SPScript Context targeting your site
let ctx = SPScript.createContext("https://TENANT.shareoint.com/sites/YOURSITE");
// Find all items in the "Tasks" list with a "Status" of "Active"
let activeTasks = await ctx.lists("Tasks").findItems("Status", "Active");
```

**PnPJS Comparison**

> _"Wait, isn't this what [PnPJS](https://pnp.github.io/pnpjs/) does too?"_

Pretty much. But, PnPJS comes with an almost 200kB hit to your bundle size. SPScript is less than 30kB. That being said, PnPJS does WAAAY more than SPScript.

- If you are just trying to query some List Items or use the Search Service, then SPScript could be a way to improve performance.
- If you are trying to develop an advanced client-side provisioning application, go with [PnPJS](https://pnp.github.io/pnpjs/).
