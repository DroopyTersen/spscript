# Arbitrary API Requests

If SPScript doesn't have a method that specifically solves your needs, you can always use the base request helpers, `ctx.get` and `ctx.authorizedPost`. These methods expect you to pass an endpoint path relative to `<SITE_URL>/_api`.

> **IMPORTANT!** These methods expect you to pass an endpoint path relative to `<SITE_URL>/_api`.

For example, given the API url, `https://TENANT.sharepoint.com/sites/YOURSITE/_api/web/lists/getByTitle('Site%20Pages')/items`, you'd pass `/web/lists/getByTitle('Site%20Pages')/items`.

## get

Takes an API path and perform the REST API `GET` request.

- `ctx.get(apiPath)`
- `ctx.get(apiPath, reqOpts)`

_Get all Company Themes_

```javascript
let data = await ctx.get("/thememanager/GetTenantThemingOptions");
let themes = data.d.GetTenantThemingOptions.themePreviews.results;
```

## authorizedPost

- `ctx.authorizedPost(apiPath, payload)`
- `ctx.authorizedPost(apiPath, payload, reqOpts)`

Takes an API path and a payload, and performs a `POST` request that includes the necessary headers and RequestDigest.

```javascript
let endpoint = "/Microsoft.Sharepoint.Utilities.WebTemplateExtensions.SiteScriptUtility.ApplySiteDesign";
let payload = { siteDesignId: siteDesign.Id, webUrl: siteUrl };
await ctx.authorizedPost(endpoint, payload);
```

**post**

- `ctx.post(apiPath, payload)`

There is also a`ctx.post`which does the same thing as`authorizedPost`except that it doesn't handle ensuring the RequestDigest is included in the headers. It is rare that you want to make a`POST`without the`digest`, so I'm thinking of making`post`be just an alias for`authorizedPost`.

## More Examples

_Applying a Site Design by name_

```javascript
async function getSiteDesign(siteUrl, siteDesignName) {
	const ctx = SPScript.createContext(siteUrl);
	// GetSiteDesigns actually requires a POST
	let data = await ctx.authorizedPost(
		"/Microsoft.Sharepoint.Utilities.WebTemplateExtensions.SiteScriptUtility.GetSiteDesigns"
	);
	let siteDesigns = data.d.GetSiteDesigns.results;
	return siteDesigns.find(sd => sd.Title === siteDesignName);
}

async function applySiteDesign(siteUrl, siteDesignName) {
	// Take the name and try to find a Site Design with that Title
	let siteDesign = await getSiteDesign(siteUrl, siteDesignName);
	if (!siteDesign) throw new Error("Couldn't find a site design with the name, " + siteDesignName);
	let ctx = SPScript.createContext(siteUrl);

	let endpoint = "/Microsoft.Sharepoint.Utilities.WebTemplateExtensions.SiteScriptUtility.ApplySiteDesign";
	let payload = { siteDesignId: siteDesign.Id, webUrl: siteUrl };
	await ctx.authorizedPost(endpoint, payload);
}
```

## Source Code

Github Source: [/src/context/Context.ts](https://github.com/DroopyTersen/spscript/blob/master/src/context/Context.ts#L71)
