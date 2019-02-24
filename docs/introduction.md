# SPScript

SPScript is a JavaScript library meant to simplify working with the SharePoint REST API.

- Easy querying of list items
- Add and Update list items with a single line of code
- No more pulling out hair with working with SharePoint Search endpoints
- Profile service helpers
- Generic `GET` and `POST` helpers to simplify calling arbitrary endpoints
- Full intellisense in VSCode
- Works server-side in Node.js

For example, lets say you wanted to get all of the "Active" items in the "Tasks" list and set them to "Canceled"

```javascript
// Create an SPScript Context targeting your site
let ctx = SPScript.createContext("https://TENANT.shareoint.com/sites/YOURSITE");
// Find all items in the "Tasks" list with a "Status" of "Active"
let activeTasks = await ctx.lists("Tasks").findItems("Status", "Active");
// Loop through each task and update its Status
for (task of activeTasks) {
  await ctx.lists("Tasks").updateItem(task.Id, { Status: "Canceled" });
}
// All done, no more "Active" tasks.
```

**PnPJS Comparison**

> _"Wait, isn't this what [PnPJS](https://pnp.github.io/pnpjs/) does too?"_

Pretty much. But, PnPJS comes with an almost 200kB hit to your bundle size. SPScript is less than 30kB. That being said, PnPJS does WAAAY more than SPScript.

- If you are just trying to query some List Items or use the Search Service, then SPScript could be a way to improve performance.
- If you are trying to develop an advanced client-side provisioning application, go with [PnPJS](https://pnp.github.io/pnpjs/).
