# Utility Functions

```javascript
import { utils } from "spscript";
```

## getSiteUrl

Returns the server relative url of the site at the provided url. It can do things like pull out the Site Url out of full document or page url. If you don't pass a url it will use the current page's url.

It only really works for SharePoint Online because it assumes a managed path of `/sites` or `/teams`.

```javascript
import { utils } from "spscript";
let currentSiteUrl = utils.getSiteUrl();
let documentSiteUrl = utils.getSiteUrl(documentUrl);
```

## getTenant

Returns the tenant of the provided url. If not url is provided, it uses the current page's url.

```javascript
import { utils } from "spscript";

let tenant = utils.getTenant();
```

## getDelveLink

Take an email address and returns the url to that user's Delve profile

```javascript
import { utils } from "spscript";

let delveProfileUrl = utils.getDelveLink("apetersen@droopy.onmicrosoft.com");
```

## getProfilePhoto

Take an email address and returns the url that user's SharePoint profile photo

```
let photoUrl = utils.getProfilePhoto("apetersen@droopy.onmicrosoft.com");
```

## HTTP Headers

SPScript comes with some utilty functions to set some special SharePoint headers.

```javascript
utils.getStandardHeaders((digest = ""));
```

- Sets `Accept`, `Content-Type` to `application/json`
- Sets `X-RequestDigest` if a digest was provided

```javascript
utils.getUpdateHeaders(digest?:string)
```

- Sets `Accept`, `Content-Type` to `application/json`
- Sets `X-RequestDigest` if a digest was provided
- Sets `X-HTTP-Method` to `MERGE`
- Sets `If-Match` to `*`

```javascript
utils.getDeleteHeaders(digest?:string)
```

- Sets `Accept`, `Content-Type` to `application/json`
- Sets `X-RequestDigest` if a digest was provided
- Sets `X-HTTP-Method` to `DELETE`
- Sets `If-Match` to `*`

## parseOData

Helps parse the odata response to give you back what you actually want instead of something like `{ d: { results: [ ] }}`

Checks for the following and automatically bubbles up what it finds as the return value.

- `data.d.results`
- `data.d`
- `data.value`

_Example Usage_

```javascript
let currentUserGroups = await ctx.get("/web/currentuser/groups").then(utils.parseOData);
```

## parseJSON

Wraps `JSON.parse` in a try/catch and returns `null` if the parse fails.

```javascript
utils.parseJSON(jsonStr);
```

## Query String

Helper functions to convert between a JS object, `{ active: 'BigDate', count: 4 }` to a a query string, `active=BigDate&count=4`, and back.

- utils.qs.`toObj(string) => Object`
- utils.qs.`fromObj(object, wrapInSingleQuotes = false) => string`

_Example Usage_

```javascript
let odata = {
  $top: 100,
  $select: "Title, Id",
  $orderBy: "Created desc",
};
let items = await ctx.lists("Site Pages").getItems(SPScript.utils.qs.fromObj(odata));
```

## waitForElement

Function to handle waiting for DOM elements to available on a page.

```javascript
let feedbackBtn = await utils.waitForElement("#feedback_btn");
feedbackBtn.style.display = "none";
```

## Loaders

Helpers to load external JavaScript and CSS files.

```javascript
await utils.loadScript("https://domain.com/javascript.js");
```

```javascript
await utils.loadCSS("https://domain.com/styles.css");
```
