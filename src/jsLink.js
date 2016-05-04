var templating = require("droopy-templating").templating;

var createRenderer = exports.createRenderer = function(htmlTemplate) {
    return function(ctx) {
        return templating.renderTemplate(htmlTemplate, ctx);
    }
};

var registerField = exports.registerField = function(fieldName, renderers, options) {
    //View, DisplayForm, EditForm, NewForm
    var defaults = {
        Templates: {
            Fields: {}
        }
    };
    var templateOverride = Object.assign({}, defaults, options);
    templateOverride.Templates.Fields[fieldName] = renderers;
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(templateOverride);
};

/**
* Returns a function that can be passed in as Edit/New form template function.
* It does the work of registering the getValue callback
* @param {function} renderer - Function that takes in ctx and returns html
* @param {function} getter - function to get the value of the field you are overriding
*/
var createEditControl = exports.createEditControl = function(renderer, getter) {
    return function(ctx) {
        var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx); 
        formCtx.registerGetValueCallback(formCtx.fieldName, getter.bind(null, formCtx));
        return renderer(ctx);
    };
};

var registerEditField = exports.registerEditField = function(fieldName, renderer, getter) {
    var formRenderer = createEditControl(renderer, getter);
    registerField(fieldName, {
        "NewForm": formRenderer,
        "EditForm": formRenderer
    });
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