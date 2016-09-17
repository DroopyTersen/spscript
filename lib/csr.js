"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var renderers = exports.renderers = require("./csr-renderers");

//fieldComponent = { name, onReady, render, getValue, locations:["View", "NewForm","DisplayForm", "EditForm"] }
var registerFormField = exports.registerFormField = function (fieldComponent, opts) {
    var renderer = renderers.formField.create(fieldComponent);
    fieldComponent.locations = fieldComponent.locations || ["NewForm", "EditForm"];
    return registerField(fieldComponent, renderer, opts);
};

//{name, onReady, render, locations: ["View", "DisplayForm"]}
var registerDisplayField = exports.registerDisplayField = function (fieldComponent, opts) {
    var renderer = renderers.displayField.create(fieldComponent);
    fieldComponent.locations = fieldComponent.locations || ["View", "DisplayForm"];
    return registerField(fieldComponent, renderer, opts);
};

var registerField = exports.registerField = function (field, renderer, opts) {
    var renderers = {};
    //View, DisplayForm, EditForm, NewForm
    field.locations.forEach(function (l) {
        return renderers[l] = renderer;
    });
    var defaults = {
        Templates: {
            Fields: {}
        }
    };
    var templateOverride = _extends({}, defaults, opts);
    templateOverride.Templates.Fields[field.name] = renderers;
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(templateOverride);
    return field;
};

var registerView = exports.registerView = function (templates, options) {
    // templates keys are Header, Item, Footer
    //RenderFieldTemplateDefault(ctx); default renderer?
    var defaults = {
        //BaseViewID
        //ListTemplateType
        Templates: {
            Header: function Header() {
                return "";
            },
            Footer: function Footer() {
                return "";
            }
        }
    };

    var templateOverride = _extends({}, defaults, options);
    templateOverride.Templates = _extends({}, templateOverride.Templates, templates);

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(templateOverride);
};
//# sourceMappingURL=csr.js.map