# Serverside w/ Node.js

## Fetch Polyfill

In order to work in Node.js, you need to import `isomorphic-fetch`.

_Just add this line to the top of your Node.js main file_

```javascript
require("isomorphic-fetch");
```

This is due to some library design decisions I made:

- I don't want to include an isomorphic "Request" library, SPScript is only 28kb, that could double the size.
- I'm done monkeying with `XMLHttpRequest`, `fetch` is sooo much nicer to work with.
- I don't want to assume SPScript's consumers will want me to include a `fetch` polyfill (for IE or Node).
  - If you need one, you'll know, and you'll already be polyfilling, you shouldn't want me to do that for you

## Cookie Auth (username, password)

You can pass a `headers` property to the `ContextOptions` param in `createContext`.

For example you could use [node-sp-auth](https://www.npmjs.com/package/node-sp-auth) to log in with username and password (only do this serverside), then pass the Fed Auth cookie you receive to SPScript:

```javascript
// Use node-sp-auth to get a Fed Auth cookie.
// This cookie can be include in the headers of REST calls to authorize them.
const spauth = require("node-sp-auth");

let auth = await spauth.getAuth(process.env.SITE_URL, {
  username: process.env.SP_USER,
  password: process.env.PASSWORD,
});
// Pass the auth headers to SPScript via the optional ContextOptions param
let ctx = SPScript.createContext(siteUrl, { headers: auth.headers });
let webInfo = await ctx.web.getInfo();
console.log(webInfo);
```

## App Context (OAuth)

You can also use the SharePoint App Registration process to login via "AppContext")

1. Register a SharePoint app using "\_layouts/15/appregnew.aspx ". **Make note of your `clientId` and `clientSecret`**
2. Grant your new app permissions using "\_layouts/15/appinv.aspx". You can use the xml snippet below to grant site collection admin access. **The key part is you set `AllowAppOnlyPolicy` to true\*\***.

> The key part is you set `AllowAppOnlyPolicy` to true

_Site Collection Admin Permissions for you App Context_

```xml
  <AppPermissionRequests AllowAppOnlyPolicy="true" >
    <AppPermissionRequest Scope="http://sharepoint/content/sitecollection" Right="FullControl" />
  </AppPermissionRequests>
```

3. Pass the Client Id and Secret to `createContext`. All actions will be performed as the App.

```javascript
const spauth = require("node-sp-auth");

let auth = await spauth.getAuth(process.env.SITE_URL, {
  clientId: process.env.CLIENT_KEY,
  clientSecret: process.env.CLIENT_SECRET,
});
// Pass the auth headers to SPScript via the optional ContextOptions param
let ctx = SPScript.createContext(siteUrl, { headers: auth.headers });
let webInfo = await ctx.web.getInfo();
console.log(webInfo);
```
