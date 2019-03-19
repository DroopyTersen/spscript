# Querying the SP Search Service

## Introduction

The SharePoint Search REST API responses are notoriously difficult to work with. To get the items you'd have to say `data.PrimaryQueryResult.RelevantResults.Table.Rows`. But you're not done yet! Each Row is a `{}` with a `Cells` array which contains key value pairs of the item's managed properties and values. It's a huge mess...

_This is about the shortest way you could parse the Search Rest API response._

```javascript
let items = data.PrimaryQueryResult.RelevantResults.Table.Rows.map(row => {
	return row.Cells.reduce((obj, cell) => {
		obj[cell.Key] = cell.Value;
	}, {});
});
```

With SPScript you can query the Search Service with 1 line of code (and get clean objects back).

```javascript
let searchResult = await ctx.search.query("SPScript");
// searchResult.items will be an array of JS objects, one for each search result
console.log(searchResult.items);
```

## Search Methods

- `ctx.search.query(text)` - query the Search Service, async resolves to a `SearchResultResponse` (see below)
- `ctx.search.query(text, queryOptions)` - query the Search Service and specify `QueryOptions`
- `ctx.search.people(text)` - limits the search to just people
- `ctx.search.people(text, queryOptions)` - limits the search to just people with specified `QueryOptions`
- `ctx.search.sites(text)` - limits the search to just sites (STS_Web)
- `ctx.search.sites(text, urlScope)`- limits the search to just sites (STS_Web) that are underneath the specified `scopeUrl`
- `ctx.search.sites(text, urlScope, queryOptions)` - limits the search to just sites (STS_Web) that are underneath the specified `scopeUrl` with the specified `QueryOptions`

The previous search methods all take query text as the first parameter. This text can be:

- An arbitrary string - `"spscript is awesome"`
- A Keyword Query (KQL) - `"Title:SPScript OR Path:https://andrew.sharepoint.com/sites/spscript"`
- Both `"Author:Petersen come find me"`

## Search Response

Each call to `ctx.search.query(searchText)` is `async` and will resolve to a `SearchResultResponse`.

```typescript
interface SearchResultResponse {
	elapsedTime: string;
	suggestion: any;
	resultsCount: number;
	totalResults: number;
	totalResultsIncludingDuplicates: number;
	/** The actual search results that you care about */
	items: any[];
	refiners?: Refiner[];
}
```

## Query Options

You can also pass an optional second parameter to specify query options

_Use QueryOptions to only bring back 5 results_

```javascript
 let searchResult = await ctx.search.query("SPScript", { rowlimit: 5 );
 console.log(searchResult.items);

```

Interface

```typescript
interface QueryOptions {
	sourceid?: string;
	startrow?: number;
	rowlimit?: number;
	selectedproperties?: string[];
	refiners?: string[];
	refinementfilters?: string[];
	hiddencontstraints?: any;
	sortlist?: any;
}
```

Default Query Options

```javascript
{
    sourceid:null,
    startrow:null,
    rowlimit:100,
    selectedproperties:null,
    refiners:null,
    refinementfilters:null,
    hiddencontstraints:null,
    sortlist:null
}
```
