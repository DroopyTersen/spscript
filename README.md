SPScript
=========

SPScript is a collection of javascript helpers for the SharePoint 2013 Rest API.  Some features include...

  - Easy querying of list data with helpers for making either same-origin or cross-origin requests.
  - Easily utilize SharePoint search
  - Integrated templating engine
  - Chrome control helper to make your app look more like the host SharePoint site.


Usage Examples
--------------
####Initialization
```javascript
var siteUrl = "http://urltomysharepointsite";
var dataService = new SPScript.RestDao(siteUrl);
```

####Get the title of all the tasks in the 'Tasks' list
```javascript
dataService.lists("Tasks").items().done(function(tasks){
    tasks.forEach(function(task){
        console.log(task.Title);
    });
});

```

####GET Request
Both the RestDao and CrossDomainDao implement a `.get()` method that allows you to type in the api call's relative url.  For example, you could rewrite the code above as:
```javascript
dataService.get("/web/lists/getByTitle('Tasks')/items").done(function(data){
    var tasks = data.d.results;
    tasks.forEach(function(task){
        console.log(task.Title);
    });
});
```

####Search for 'petersen' and get the url of each result
```javascript
var searchService = new SPScript.SearchService(siteUrl);
searchService.query('petersen').done(function(searchResults){
    searchResults.items.forEach(function(item){
        console.log(item.FileRef);
    });
});
```

####Templating - Display document name and category on the page
First create the html container
```html
<div id='docs-webpart'><!-- Template html will be injected here --></div>
```
Second create a template using a script tag with a custom type
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
Lastly, use the RestDao to get the documents, and the templating to render them on the page.
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
})
```
Builds
--------------

Everything has been modularized so that you only need to include what is necessary for your app.  Currently I have Gulp tasks for the following custom builds. You can find them in the `/dist` folder.

* **SPScript.RestDao.js** - The minimum amount of code you'll need use the helpers on SharePoint site in the same domain.
* **SPScript.CrossDomain.js** - Same as the RestDao, except that it allows you to make cross-origin requests by utilizing SharePoint's sp.requestExecutor.  You'll still need to register as a SharePoint app in order for SharePoint to allow you through though.
* **SPScript.Search.js** - The minimum amount of code you'll need to utilize the Search helper. Currently there is only a same domain build for this but it would be possible to do this cross domain as well.
* **SPScript.SameDomain.js** - All the helpers built for same-origin requests.  RestDao, search, and templating (as well as their dependencies).  
