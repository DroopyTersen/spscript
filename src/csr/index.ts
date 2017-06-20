import utils from "../utils";
declare var SPClientTemplates:any;

export type CSRLocation = "View" | "NewForm" | "DisplayForm" | "EditForm";

export interface FieldComponent {
    /** Internal Name of the field to override */
    name:string,
    /** Array of locations. "View" | "NewForm" | "DisplayForm" | "EditForm" */
    locations?:CSRLocation[],
    /** Function that should return an HTML string */
    render(ctx:any),
    /** Optional function used to set the field value */
    getValue?(),
    /** Function that is invoked when the field has been rendered. Useful for init'ing jQuery plugins */
    onReady?(),
    setValue?(value:any)
}

export interface CSRUtils {
    registerDisplayField(field:FieldComponent, opts?:any)
    registerFormField(field:FieldComponent, opts?:any)
}


var registerField = function(field:FieldComponent, renderer, opts = {}) : FieldComponent {
    if (!utils.validateNamespace("SPClientTemplates.TemplateManager")) {
        throw new Error("Unable to register CSR template.  SPClientTemplates.TemplateManager does not exist")
    }
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

var registerDisplayField = function(fieldComponent:FieldComponent, opts = {}) {
    var renderer = createDisplayFieldRenderer(fieldComponent);
    fieldComponent.locations = fieldComponent.locations || ["View", "DisplayForm"];
    return registerField(fieldComponent, renderer, opts);
};

var registerFormField = function(fieldComponent:FieldComponent, opts = {}) {
    var renderer = createFormFieldRenderer(fieldComponent);
    fieldComponent.locations = fieldComponent.locations || ["NewForm", "EditForm"];
    return registerField(fieldComponent, renderer, opts);
};

function createFormFieldRenderer(field:FieldComponent) {
    return function(ctx) {
        var formCtx = ctx.FormContext;
        // need to clone ctx, it is getting overwritten so we lost CurrentItem
        var clonedCtx = Object.assign({}, ctx);
        if (field.onReady) {
            if (formCtx) {
                formCtx.registerInitCallback(field.name, field.onReady.bind(null, clonedCtx))
            } else {
                setTimeout(field.onReady.bind(null, clonedCtx), 100);
            }
        }
        if (field.getValue && formCtx) {
            formCtx.registerGetValueCallback(field.name, field.getValue.bind(null, clonedCtx));
        }
        // tack on 'setValue' function
        if (formCtx && formCtx.updateControlValue) {
            field.setValue = function(value) {
                formCtx.updateControlValue(field.name, value);
            }            
        }

        return field.render(ctx);
    }
}

function createDisplayFieldRenderer(field:FieldComponent) {
    return function(ctx) {
        var formCtx = ctx.FormContext;
        if(formCtx && formCtx.registerInitCallback && field.onReady) {
            formCtx.registerInitCallback(field.name, field.onReady)
        }
        return field.render(ctx);
    }
}

var CSR:CSRUtils = {
    registerDisplayField,
    registerFormField
}
export default CSR;