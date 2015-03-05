SPScript
=========
----------

SPScript is a collection of javascript helpers for the SharePoint 2013 Rest API.  Some features include...

  - Easy querying of list data with helpers for making either same-origin or cross-origin requests.
  - Add and Update list items in 1 line of code.
  - Easily utilize SharePoint search
  - Integrated templating engine
  - Chrome control helper to make your app look more like the host SharePoint site.


Methods
--------------

### Web
- `web.info()` - Gets you the [SPWeb properties](https://msdn.microsoft.com/en-us/library/office/jj245288.aspx#properties) of your site
- `web.subsites()` - Gets you all the sub sites and their [SPWeb properties](https://msdn.microsoft.com/en-us/library/office/jj245288.aspx#properties)
- `web.permissions()` - Gets you an an array of permissions that have been setup for that site. Each permission object has a `member` (the user or group) and a `roles` array (the permissions that user or group has). 
- `web.permissions(email)` - Looks up a user by their email address, then gets you a list of permissions that user has for your site.  Similiar to "Check Permissions". 

### Lists
- `lists()` - gets you all the lists and libraries on your site and their [SPList properties](https://msdn.microsoft.com/en-us/library/office/jj245826.aspx#properties)
- `lists(listname)` - gets you a list object for a specific list.  See the '__List__' methods for what you can do with this object

### List
- `list.info()` - gets you that list's [SPList properties](https://msdn.microsoft.com/en-us/library/office/jj245826.aspx#properties)
- `list.getItems()` - gets you all the items in that list
- `list.getItems(odata)` - gets all the items in that list based on the [OData](http://www.odata.org/documentation/odata-version-2-0/uri-conventions/) you pass in.  This allows you to trim selection, filter, sort etc..
- `list.getItemById(id)` - gets you a specific item based on the SharePoint Id
- `list.findItems(key, value)` - gets you all items whose field(key) matches the value. Currently only text and number columns are supported.
- `list.findItem(key, value)` - get you an item whose field(key) matches the value. If multiple matches are found, the first is returned.  Currently only text and number columns are supported.
- `list.addItem(item)` - takes a javascript object and creates a list item.
- `list.updateItem(id, updates)` - takes a SharePoint Id, and updates that item ONLY with properties that are found in the passed in `updates` object.
- `list.permissions()` - Gets you an an array of permissions that have been setup for that list. Each permission object has a `member` (the user or group) and a `roles` array (the permissions that user or group has). 
- `list.permissions(email)` - Looks up a user by their email address, then gets the permissions that user has for that list.  Similiar to "Check Permissions". 


=======
###Search
- `search.query(queryText)` - performs a SharePoint search and returns a `SearchResults`  object which contains elapsedTime, suggestion, resultsCount, totalResults, totalResultsIncludingDuplicates, items. The `items` property is what contains the actual "results" array.
- `search.query(queryText, queryOptions)` - same as `query(queryText)` but with the ability to override default search options.
- `search.people(queryText)` limits the search to just people

### Profiles
- `profiles.current()` - gets you all the profile properties for the current user
- `profiles.getByEmail(email)` - looks up a user based on their email and returns their profile properties

### Query String Helpers
- `queryString.contains(key)` - returns true or false
- `queryString.getValue(key)` - returns the value and "" if the key is not found
- `queryString.getAll()` - returns a javascript object. Each query string key is a property on the object.

### Templating
SPScript contains a lightweigt templating engine.  This allows you start with html with ``{{property}}` placeholders and then fill in the values and display on the page after you have finished getting all your REST data.
- `templating.renderTemplate(template, item)` - returns an html string. `template` is an html string with `{{property}}` placeholders. `item` is a javascript object whose properties will be used to fill in your html placeholders.


### GET & POST
If you don't see an SPScript helper method for what you need, don't worry,  You can call __ANY__ SharePoint 2013 endpoint using the core `get` or `post` methods. 
- `dataService.get(url)` - for example, passing __"/web/SiteUsers"__ as your `url` would get you all the users on your site.
- `dataService.post(url, body, ajaxOptions)` - `url` is the 'siteUrl/_api' relative url. `body` is a javascript object, and `ajaxOtions` allow you to set things like custom headers. 

***

Including SPScript in your project
--------------
SPScript depends on jQuery (or [Zepto, a lightweight version of jQuery](http://zeptojs.com/)). 

If you are already using jQuery in your project:

 - __Dev__ - Add the following script tag to your page
     - `<script type="text/javascript" src='https://cdn.rawgit.com/DroopyTersen/spscript/v1/dist/v1/spscript.js'></script>`
 - __Prod__ - Save the following file into your project
-      https://raw.githubusercontent.com/DroopyTersen/spscript/v1/dist/v1/spscript.min.js

If you aren't already using jQuery, grab a version of SPScript that comes packaged with zepto.
 - __Dev__ - Add the following script tag to your page
     - `<script type="text/javascript" src='https://cdn.rawgit.com/DroopyTersen/spscript/v1/dist/v1/spscript.zepto.min.js'></script>`
 - __Prod__ - Save the following file into your project
-      https://raw.githubusercontent.com/DroopyTersen/spscript/v1/dist/v1/spscript.zepto.min.js

***
Initialization
--------------
All you need is the url of the SharePoint site you are targeting.
```javascript
var siteUrl = "http://urltomysharepointsite.com";
var dataService = new SPScript.RestDao(siteUrl);
```

***
Usage Examples
--------------

### Query List Items
Get all **"Tasks"** with a status of **"Approved"**
```javascript
var taskList = dataService.lists("Tasks")

// BEST: Option 1 - 'Find' syntax sugar
taskList.findItems("Status", "Approved").then(logApprovedTasks);

// BETTER: Option 2 - OData support in the '.items()'
taskList.getItems("$filter=Status eq 'Approved'").then(logApprovedTasks);

// GOOD: Options 3 - Manual 'GET'
dataService.get("/web/lists/getByTitle('Tasks')?$filter=Status eq 'Approved'").then(function(data){
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
dataService.lists("Tasks").getItemById(29).then(displayTask);
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
dataService.lists("Tasks").addItem(newItem);

```

### Update List Item
Update item in the **"Tasks"** list.  Set item 29's status to **"Completed"**
```javascript
var updates = { Status: "Completed", RemainingHours: 0 };
dataService.lists("Tasks").updateItem(29, updates);

```

### Find One
Get the one item whose **"RequestId"** is **"abc123"**
```javascript
dataService.lists("IT Requests")
    .findItem("RequestId", "abc123")
    .then(function(request){
        console.log(request.RequestId + ": " + request.Title);
    });

```
If there is more than one match, it will return the first result.  If there are zero matches, it will return `null`

### Get Every List Item
Get all items in the **"Tasks"** list and log the 'Title'
```javascript
dataService.lists("Tasks")
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
dataService.get("/web/lists/getByTitle('Tasks')/items").done(function(data){
    var tasks = data.d.results;
    tasks.forEach(function(task){
        console.log(task.Title);
    });
});
```
### Profiles
Get the current user's profile properties
```javascript
dataService.profiles.current().then(function(profile){
    console.log(JSON.stringify(profile));
});
```
### Search
Search for **"petersen"** and get the url of each search result
```javascript
dataService.search.query('petersen').then(function(searchResults){
    searchResults.items.forEach(function(item){
        console.log(item.FileRef);
    });
});
```

Search for People named **"andrew"**
```javascript
dataService.search.people('petersen').then(function(searchResults){
    console.log("There are " + searchResults.totalResults + " people named 'andrew'");
});
```
### Working with Promises
All SPScript api requests are asynchronous and return promises.  The common approach to handle this in the past has been by passing a callback function.  A better way is by utilizing "promises".  

The code below, retrieves photos, then retrieves all comments, then groups the comment based on which photo it is associated with.  This code could become very unruly with callbacks, but with promises, it is fairly readable.
```javascript
var getPhotosWithComments = function() {
    var photoOdata = "$expand=File, File/Author&$orderby=Title";
    var photos = [];
    return dataService.lists("Photos")
        .getItems(photoOdata)
        .then(function(allPhotos) {
            photos = allPhotos;
            return dataService.lists("Comments").getItems();
        })
        .then(function(comments) {
            return groupComments(photos, comments);
        });
};
```
###Templating
Display document name and category on the page

Step 1: Create the html container

```html
<div id='docs-webpart'><!-- Template html will be injected here --></div>
```
Step 2: Create a template using a script tag with a custom type

```html
<script type='custom/template' id='doc-template'>
    <div class='document'>
        <a href='{{FileRef}}'>
            <h3>{{FileRef}}</h3>
            <h4>{{Category}}</h4>
        </a>
    </div>
</script>
```

Step 3: Use the RestDao to get the documents, and the templating to render them on the page.

```javascript
//select our template
var template = $("#doc-template").html();

//Get our documents
dataService.lists("Documents").getItems().done(function(docs){
    var html = "";

    //foreach document, create the html based on our template

    docs.forEach(function(doc){
        html += SPScript.templating.renderTemplate(template, doc);
    });

    //Output all the html to the page inside of our container
    $("#docs-webpart").html(html);
});
```


