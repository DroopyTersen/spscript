SPScript
=========

SPScript is a collection of javascript helpers for the SharePoint 2013 Rest API.  Some features include...

  - Easy querying of list data with helpers for making either same-origin or cross-origin requests.
  - Add and Update list items in 1 line of code.
  - Easily utilize SharePoint search
  - Integrated templating engine
  - Chrome control helper to make your app look more like the host SharePoint site.

Including SPScript in your project
--------------
First make sure you have jQuery included on your page. Next, head over to the `/dist` folder.  Here you will find many different builds. If you aren't sure which one you need, just use [SPScript.Full.js](https://raw.githubusercontent.com/DroopyTersen/spscript/master/dist/SPScript.Full.js).  
*See the __Builds__ section below for more details*

Usage Examples
--------------
###Initialization
All you need is the url of the SharePoint site you are targeting.
```javascript
var siteUrl = "http://urltomysharepointsite.com";
var dataService = new SPScript.RestDao(siteUrl);
```
###Query List Items
Get all **"Tasks"** with a status of **"Approved"**
```javascript
var taskList = dataService.lists("Tasks")

// BEST: Option 1 - 'Find' syntax sugar
taskList.find("Status", "Approved").then(logApprovedTasks);

// BETTER: Option 2 - OData support in the '.items()'
taskList.items("$filter=Status eq 'Approved'").then(logApprovedTasks);

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

###Update List Item
Update item in the **"Tasks"** list.  Set item 29's status to **"Completed"**
```javascript
var updates = { Status: "Completed", RemainingHours: 0 };
dataService.lists("Tasks").updateItem(29, updates);

```

###Find One
Get the one item whose **"RequestId"** is **"abc123"**
```javascript
dataService.lists("IT Requests")
    .findOne("RequestId", "abc123")
    .then(function(request){
        console.log(request.RequestId + ": " + request.Title);
    });

```
###Get Every List Item
Get all items in the **"Tasks"** list and log the 'Title'
```javascript
dataService.lists("Tasks").items().then(function(tasks){
    tasks.forEach(function(task){
        console.log(task.Title);
    });
});

```

###GET Request
Both the RestDao and CrossDomainDao implement a `.get()` method that allows you to type in the api call's relative url.  For example, you could rewrite the code above as:
```javascript
dataService.get("/web/lists/getByTitle('Tasks')/items").done(function(data){
    var tasks = data.d.results;
    tasks.forEach(function(task){
        console.log(task.Title);
    });
});
```

###Search
Search for **"petersen"** and get the url of each search result
```javascript
var searchService = new SPScript.SearchService(siteUrl);
searchService.query('petersen').done(function(searchResults){
    searchResults.items.forEach(function(item){
        console.log(item.FileRef);
    });
});
```

###Templating
Display document name and category on the page
1. Create the html container
```html
<div id='docs-webpart'><!-- Template html will be injected here --></div>
```
2. Create a template using a script tag with a custom type
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

3. Use the RestDao to get the documents, and the templating to render them on the page.
```javascript
//select our template
var template = $("#doc-template").html();

//Get our documents
dataService.lists("Documents").items().done(function(docs){
    var html = "";

    //foreach document, create the html based on our template

    docs.forEach(function(doc){
        html += SPScript.templating.renderTemplate(template, doc);
    });

    //Output all the html to the page inside of our container
    $("#docs-webpart").html(html);
});
```

Builds
--------------

Everything has been modularized so that you only need to include what is necessary for your app.  Currently I have Gulp tasks for the following custom builds. You can find them in the `/dist` folder.  There are also minified versions of each file.

* **SPScript.RestDao.js** - The minimum amount of code you'll need use the helpers on SharePoint site in the same domain.
* **SPScript.CrossDomain.js** - Same as the RestDao, except that it allows you to make cross-origin requests by utilizing SharePoint's sp.requestExecutor.  You'll still need to register as a SharePoint app in order for SharePoint to allow you through though.
* **SPScript.Search.js** - The minimum amount of code you'll need to utilize the Search helper. Currently there is only a same domain build for this but it would be possible to do this cross domain as well.
* **SPScript.Full.js** - Everything there is. 
