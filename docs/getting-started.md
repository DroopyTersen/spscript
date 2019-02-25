# Getting Started

## Installation

Add the SPScript `npm` package to your project

_NPM_

```shell
npm install spscript
```

_Yarn_

```shell
yarn add spscript
```

## Importing

You can use SPScript in your Javascript/Typescript files with:

```javascript
import SPScript from "spscript";
```

## SPScript Context

Almost everything in SPScript is based off an SPScript `Context` class. An SPScript `Context` is tied to specific SharePoint site. You get a `Context` by calling `SPScript.createContext(siteUrl)`.

> You get a `Context` by calling `SPScript.createContext(siteUrl)`.

_This line of code is the entry point to almost everything SPScript provides._

```javascript
let ctx = SPScript.createContext(siteUrl);
```

_Example Usage: Get the News Pages of the specified site._

```javascript
import SPScript from "spscript";

const getPublishedNews = async function(siteUrl) {
	let ctx = SPScript.createContext(siteUrl);
	let pages = await ctx.lists("Site Pages").findItems("PromotedState", 2);
	console.log(pages); // This will show an Array of Page List Items
	return pages;
};
```

Throughout the docs you'll see a variable, `ctx`, representing an instance of an SPScript `Context`.

## Troubleshooting

If you are using Typescript, you may have to use the syntax:

```javascript
import * as SPScript from "spscript";
```

If you don't like that, add `"allowSyntheticDefaultImports": true` to your `tsconfig.json`.
