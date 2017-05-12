"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function createFormFieldRenderer(field) {
    return function (ctx) {
        var formCtx = ctx.FormContext;
        // need to clone ctx, it is getting overwritten so we lost CurrentItem
        var clonedCtx = _extends({}, ctx);
        if (field.onReady) {
            if (formCtx) {
                formCtx.registerInitCallback(field.name, field.onReady.bind(null, clonedCtx));
            } else {
                setTimeout(field.onReady.bind(null, clonedCtx), 100);
            }
        }
        if (field.getValue && formCtx) {
            formCtx.registerGetValueCallback(field.name, field.getValue.bind(null, clonedCtx));
        }
        // tack on 'setValue' function
        if (formCtx && formCtx.updateControlValue) {
            field.setValue = function (value) {
                formCtx.updateControlValue(field.name, value);
            };
        }

        return field.render(ctx);
    };
}

function createDisplayFieldRenderer(field) {
    return function (ctx) {
        var formCtx = ctx.FormContext;
        if (formCtx && formCtx.registerInitCallback && field.onReady) {
            formCtx.registerInitCallback(field.name, field.onReady);
        }
        return field.render(ctx);
    };
}

var renderers = {
    formField: {
        create: createFormFieldRenderer
    },
    displayField: {
        create: createDisplayFieldRenderer
    }
};

module.exports = renderers;
//# sourceMappingURL=csr-renderers.js.map