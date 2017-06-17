var renderers = exports.renderers = require("./csr-renderers");

//fieldComponent = { name, onReady, render, getValue, locations:["View", "NewForm","DisplayForm", "EditForm"] }
// var renderColoredStatus = function(ctx) {
//     // map statuses  to colors
//     var colors = {
//         "Not Started": "orange",
//         "In Progress": "yellow",
//         "Done": "green"
//     };

//     // Look at the item's status to get the mapped color
//     // If the item has a status value that is not mapped, then use 'red'
//     var color = colors[ctx.CurrentItem.Status] || "red";

//     // return the html used to render the status field;
//     return "<h4 style='color:" + color + "'>" + ctx.CurrentItem.Status + "</h4>";
// };

// var fieldOverride = {
//     name:  "Status",
//     render: renderColoredStatus
// };

// SPScript.CSR.registerDisplayField(fieldOverride);

var registerFormField = exports.registerFormField = function(fieldComponent, opts) {
    var renderer = renderers.formField.create(fieldComponent);
    fieldComponent.locations = fieldComponent.locations || ["NewForm", "EditForm"];
    return registerField(fieldComponent, renderer, opts);
};

//{name, onReady, render, locations: ["View", "DisplayForm"]}
var registerDisplayField = exports.registerDisplayField = function(fieldComponent, opts) {
    var renderer = renderers.displayField.create(fieldComponent);
    fieldComponent.locations = fieldComponent.locations || ["View", "DisplayForm"];
    return registerField(fieldComponent, renderer, opts);
};

var registerField = exports.registerField = function(field, renderer, opts) {
    var renderers = {}
    //View, DisplayForm, EditForm, NewForm
    field.locations.forEach(l => renderers[l] = renderer);
    var defaults = {
        Templates: {
            Fields: {}
        }
    };
    var templateOverride = Object.assign({}, defaults, opts);
    templateOverride.Templates.Fields[field.name] = renderers;
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(templateOverride);
    return field;
};

var registerView = exports.registerView = function(templates, options) {
    // templates keys are Header, Item, Footer
    //RenderFieldTemplateDefault(ctx); default renderer?
    var defaults = {
        //BaseViewID
        //ListTemplateType
        Templates: {
            Header: function() { return "" },
            Footer: function() { return "" }
        }
    }

    var templateOverride = Object.assign({}, defaults, options);
    templateOverride.Templates = Object.assign({}, templateOverride.Templates, templates);

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(templateOverride);
}
