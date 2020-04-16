# Managed Metadata

A helper for bringing back MMS terms. Dependency free and done in a single call. Wraps the `Client.svc` service because there is currently no Rest endpoing for MMS (it's supposedly coming...).

## getTermset

Returns a flat list of the terms in the specified termset. Pass in the term group and the termset name.

```javascript
let terms = ctx.mms.getTermset("Events Registration", "Event Types");
```

## getTermsetTree

Returns a tree data structure representing the specified termset. Useful when conveying nested relationships with terms.

```javascript
let termTree = ctx.mms.getTermTree("Inventory Tracking", "Locations");
let term1 = termTree.getTermByName("Store 123");
let term2 = termTree.getTermByPath("Stores/Midwest/Store 123");
let term3 = termTree.getTermById("<GUID>");
```

**MMSTerm**

```javascript
export interface MMSTerm {
  id: string;
  sortOrder: number;
  description: string;
  name: string;
  path: string;
  termSetName: string;
  properties: {
    [key: string]: string,
  };
  children: MMSTerm[];
}
```
