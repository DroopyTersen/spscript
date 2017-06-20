SPScript
=========
----------

[![Join the chat at https://gitter.im/DroopyTersen/spscript](https://badges.gitter.im/DroopyTersen/spscript.svg)](https://gitter.im/DroopyTersen/spscript?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Public Website w/ full documentation: [http://droopytersen.github.io/spscript/](http://droopytersen.github.io/spscript/)

SPScript is a collection of javascript helpers for the SharePoint Rest API.  Some features include...

  - Easy querying of list data.
  - Add and Update list items in 1 line of code.
  - Easily utilize SharePoint search
  - Work with the Profile Service
  - Check permissions on sites and lists
  - Work with CustomActions


## Including SPScript

**Option 1**: NPM Package
``` bash
npm install spscript
```

**Option 2**: Traditional Script Reference

Download the script from [here](https://raw.githubusercontent.com/DroopyTersen/spscript/typescript/dist/v3/spscript.js) and add the following script tag to your page:

 ``` html
<script type="text/javascript" src='PATH_TO_SPSCRIPT/spscript.js'></script>
 ```
You will then have `window.SPScript` available.

## Initialization

Most SPScript methods require an SPScript Context
``` javascript
var ctx = SPScript.createContext();
```

You can also pass an explicit url.  If you don't pass a url, it will use your current web.
```javascript
var siteUrl = "http://urltomysharepointsite.com";
// If you don't pass a site url, it will use your current web
var ctx = SPScript.createContext(siteUrl);

```

## Methods


### HTTP Helpers (Context)
- `ctx.get(url, opts)` - Generic helper to make AJAX GET request. Sets proper headers, promisifies, and parses JSON response. `url` is the API url relative to "/_api". 
- `ctx.post(url, body, opts)` - Generic helper to make AJAX POST request. `url` is the API url relative to "/_api".
- `ctx.authorizedPost(url, body, opts)` - Same as `ctx.post` except that it also takes care of including the proper authorization headers.
- `ctx.getRequestDigest()` - Retrieves a token needed to authorize any updates

<!--### Web-->
<!--- `dao.web.info()` - Gets you the [SPWeb properties](https://msdn.microsoft.com/en-us/library/office/jj245288.aspx#properties) of your site-->
<!--- `dao.web.subsites()` - Gets you all the sub sites and their [SPWeb properties](https://msdn.microsoft.com/en-us/library/office/jj245288.aspx#properties)-->
<!--- `dao.web.getUser(email)` - Gets you a SP.User object based on the specified email-->
<!--- `dao.web.getFile(serverRelativeUrl)` - Gets you an SP.File object-->
<!--- `dao.web.copyFile(sourceUrl, destinationUrl)` - Copies a file (both source and destination urls are server relative)-->
<!--- `dao.web.deleteFile(fileUrl)` - Deletes the file at the specified server relative url-->
<!--- `dao.web.uploadFile(fileContent, folderUrl)` - Allows passing in an file content as text or as an HTML5 File (from File input type).  Uploads file to the specified server relative folder url.-->
<!--- `dao.web.permissions.getRoleAssignments()` - Gets you an an array of permissions that have been setup for that site. Each permission object has a `member` (the user or group) and a `roles` array (the permissions that user or group has). -->
<!--- `dao.web.permissions.check(email)` - Looks up a user by their email address, then gets you a list of permissions that user has for your site.  Similiar to "Check Permissions". -->


### List & List Items
- `ctx.lists(listname).info()` - gets you that list's [SPList properties](https://msdn.microsoft.com/en-us/library/office/jj245826.aspx#properties)
- `ctx.lists(listname).getItems()` - gets you all the items in that list
- `ctx.lists(listname).getItems(odata)` - gets all the items in that list based on the [OData](http://www.odata.org/documentation/odata-version-2-0/uri-conventions/) you pass in.  This allows you to trim selection, filter, sort etc..
- `ctx.lists(listname).getItemById(id)` - gets you a specific item based on the SharePoint Id
- `ctx.lists(listname).findItems(key, value)` - gets you all items whose field(key) matches the value. Currently only text and number columns are supported.
- `ctx.lists(listname).findItems(key, value, extraOdata)` - gets you all items whose field(key) matches the value. Currently only text and number columns are supported.
- `ctx.lists(listname).findItem(key, value)` - get you an item whose field(key) matches the value. If multiple matches are found, the first is returned.  Currently only text and number columns are supported.
- `ctx.lists(listname).addItem(item)` - takes a javascript object and creates a list item.
- `ctx.lists(listname).updateItem(id, updates)` - takes a SharePoint Id, and updates that item ONLY with properties that are found in the passed in `updates` object.
- `ctx.lists(listname).deleteItem(id)` - deletes the item with the specified SharePoint Id
<!--- `ctx.lists(listname).permissions.getRoleAssignments()` - Gets you an an array of permissions that have been setup for that list. Each permission object has a `member` (the user or group) and a `roles` array (the permissions that user or group has). -->
<!--- `ctx.lists(listname).permissions.check(email)` - Looks up a user by their email address, then gets the permissions that user has for that list.  Similiar to "Check Permissions". -->

### Search
- `ctx.search.query(queryText)` - performs a SharePoint search and returns a `SearchResults`  object which contains elapsedTime, suggestion, resultsCount, totalResults, totalResultsIncludingDuplicates, items. The `items` property is what contains the actual "results" array.
- `ctx.search.query(queryText, queryOptions)` - same as `query(queryText)` but with the ability to override default search options.
- `ctx.search.people(queryText)` limits the search to just people

### CustomActions
- `ctx.customActions.get()` - Gets all of the 'Site' and 'Web' scoped UserCustomActions.
- `ctx.customActions.get(name)` - Get a UserCustomAction by name. Searches both 'Site' and 'Web' scoped custom actions.
- `ctx.customActions.update(updates)` - Updates properties on an exisiting custom action. You must set the `Name` property on you `updates` object to identify the targeted custom action.
- `ctx.customActions.remove(name)` - Removes a UserCustomAction with that name
- `ctx.customActions.add(customAction)` - Takes in an object with `SP.UserCustomAction` properties.
- `ctx.customActions.addScriptLink(name, url, opts)` - injects a Javascript file onto your site
- `ctx.customActions.addCssLink(name, url, opts)` - injects a CSS file onto your site

<!--### Profiles-->
<!--- `dao.profiles.current()` - gets you all the profile properties for the current user-->
<!--- `dao.profiles.getByEmail(email)` - looks up a user based on their email and returns their profile properties-->
<!--- `dao.profiles.setProperty(user, key, value)` - sets a profile property (key) for the specified user.  User object should have `AccountName` or `LoginName` property-->
<!--- `dao.profiles.setProperty(email, key, value)` - sets a profile property (key) for the user tied to that email address-->

### Utility Functions
- `SPScript.utils.waitForLibrary(namespace)` - waits for the library to be on the page
- `SPScript.utils.waitForLibraries(namespaces)` - waits for all libraries to be on the page
- `SPScript.utils.getScript(url)` - loads a javascript file onto the page
- `SPScript.utils.getScripts(urls)` - loads multiple javascript files onto the page

### Query String Helpers
- `SPScript.utils.qs.toObj(str)` - returns a javascript object. Each query string key is a property on the object.
- `SPScript.utils.qs.fromObj(str)` - turns a javascript object into a string in format of "key1=value1&key2=value2"

### Request Header Helpers
- `SPScript.utils.headers.getStandardHeaders([digest])` - sets the `Accept` and `Content-Type` headers to the JSON Mime type. If the optional `digest` token is passed, it sets the proper authoorization headers. Returns the headers as an object.  
- `SPScript.utils.headers.getAddHeaders(digest)` - returns the headers object needed in order to create an item.
- `SPScript.utils.headers.getUpdateHaders(digest)` - returns the headers object needed in order to update an item. 
- `SPScript.utils.headers.getDeleteHeaders(digest)` - returns the headers object needed in order to delete an item. 


## Usage Examples

### Query List Items
Get all **"Tasks"** with a status of **"Approved"**
```javascript
var taskList = ctx.lists("Tasks")

// BEST: Option 1 - 'Find' syntax sugar
taskList.findItems("Status", "Approved").then(logApprovedTasks);

// BETTER: Option 2 - OData support in the '.items()'
taskList.getItems("$filter=Status eq 'Approved'").then(logApprovedTasks);

// GOOD: Options 3 - Manual 'GET'
ctx.get("/web/lists/getByTitle('Tasks')?$filter=Status eq 'Approved'").then(function(data){
    if (data && data.d && data.d.results) {
        logApprovedTasks(data.d.results);    
    }
});

var logApprovedTasks = function(tasks) {
    tasks.forEach(function(task){
        console.log(task.Title);
    });
};
```

### Get Item By Id
Get the task with a SharePoint ID of 29
```javascript
ctx.lists("Tasks").getItemById(29).then(displayTask);
var displayTask = function(task) {
    //blah blah blah
}

```
### Add List Item
Add item to the **"Tasks"** list
```javascript
var newItem = { 
    Title: "My New Task", 
    Status: "Not Started", 
    RemainingHours: 12 
};
ctx.lists("Tasks").addItem(newItem);

```

### Update List Item
Update item in the **"Tasks"** list.  Set item 29's status to **"Completed"**
```javascript
var updates = { Status: "Completed", RemainingHours: 0 };
ctx.lists("Tasks").updateItem(29, updates);

```

### Find One
Get the one item whose **"RequestId"** is **"abc123"**
```javascript
ctx.lists("IT Requests")
    .findItem("RequestId", "abc123")
    .then(function(request){
        console.log(request.RequestId + ": " + request.Title);
    });

```
If there is more than one match, it will return the first result.  If there are zero matches, it will return `null`

### Get Every List Item
Get all items in the **"Tasks"** list and log the 'Title'
```javascript
ctx.lists("Tasks")
    .getItems()
    .then(function(tasks){
        tasks.forEach(function(task){
            console.log(task.Title);
        });
    });

```

### GET & POST Requests
Every REST Api call that SharePoint supports can be called using SPService. Both the RestDao and CrossDomainDao implement a `.get()` and `post()` method that allow you to type in the api call's relative url.  For example, you could rewrite the code above as:
```javascript
ctx.get("/web/lists/getByTitle('Tasks')/items").then(function(data){
    var tasks = data.d.results;
    tasks.forEach(function(task){
        console.log(task.Title);
    });
});
```

Here is a more advanced usage that uses ctx.authorizedPost to update the site's logo
```javascript
var setSiteLogo = function(siteLogoUrl, siteUrl) {
    var ctx = SPScript.createContext();
    var body = { __metadata: {"type": "SP.Web"}, SiteLogoUrl: siteLogoUrl };
    ctx.authorizedPost("/web", body)
        .then(function(result){
            console.log("Set Site Logo Success!");
        })
        .catch(function(error){
            console.log("Set Site Logo Error. Message: " + error);
        })

}
```
### Profiles
Get the current user's profile properties
```javascript
ctx.profiles.current().then(function(profile){
    console.log(JSON.stringify(profile));
});
```
### Search
Search for **"petersen"** and get the url of each search result
```javascript
ctx.search.query('petersen').then(function(searchResults){
    searchResults.items.forEach(function(item){
        console.log(item.FileRef);
    });
});
```

Search for People named **"petersen"**
``` javascript
ctx.search.people('petersen').then(function(searchResults){
    console.log("There are " + searchResults.totalResults + " people named 'andrew'");
});
```

### Upload Files
If you have a input element of type 'file' it is very easy to upload files
``` javascript
var inputElement = document.getElementById("file-input");
inputElement.addEventListener("change", handleFiles, false);

function handleFiles() {
	var fileList = this.files;
	var folderUrl = "/spscript/Shared Documents";
	for (var i = 0; i < fileList.length; i++) {
		ctx.web.uploadFile(fileList[i], folderUrl).then(function(result){
			console.log(result);
		});
	}
}
```
