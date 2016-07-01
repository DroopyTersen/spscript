var templating = require("mustache");

function createTemplateRenderer(htmlTemplate, events) {
    return function(ctx) {
        return templating.render(htmlTemplate, ctx);
    }
}

function createFormFieldRenderer(formField) {
    return function(ctx) {
        var formCtx = ctx.FormContext;
        if (formField.onReady) {
            formCtx.registerInitCallback(formField.name, formField.onReady)
        }
        if (formField.getValue) {
            formCtx.registerGetValueCallback(formCtx.fieldName, formField.getValue.bind(null, formCtx));
        }
        // tack on 'setValue' function
        if (formCtx.updateControlValue) {
            formField.setValue = function(value) {
                formCtx.updateControlValue(formField.name, value);
            }            
        }

        return formField.render(ctx);
    }
}

function createDisplayFieldRenderer(field) {
    return function(ctx) {
        var formCtx = ctx.FormContext;
        if(formCtx && formCtx.registerInitCallback && field.onReady) {
            formCtx.registerInitCallback(formField.name, formField.onReady)
        }
        return formField.render(ctx);
    }
}

var renderers = {
    template: {
        create: createTemplateRender
    },
    formField : {
        create: createFormFieldRenderer
    },
    displayField: {
        create: createDisplayFieldRenderer
    }
}

module.exports = renderers;