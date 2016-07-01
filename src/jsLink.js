var renderers = exports.renderers = require("./csr-renderers");

//fieldComponent = { name, onReady, render, getValue, locations:["View", "NewForm","DisplayForm", "EditForm"] }
var registerFormField = exports.registerFormField = function(fieldComponent, opts) {
    var renderer = renderers.formField.create(fieldComponent);
    formField.locations = formField.locations || ["NewForm", "EditForm"];
    registerField(fieldComponent, renderer, opts);
};

//{name, onReady, render, locations: ["View", "DisplayForm"]}
var registerDisplayField = exports.registerDisplayField = function(fieldComponent, opts) {
    var renderer = renders.displayField.create(fieldComponent);
    formField.locations = formField.locations || ["View", "DisplayForm"];
    registerField(fieldComponent, renderer, opts);
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
    templateOverride.Fields[field.name] = renderers;
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(templateOverride);
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
