"use strict";

var CSR = require("../../csr");
exports.register = function (fieldName) {
    var editorId = "ace-editor";
    var editor;

    var setupEditor = function setupEditor(ctx) {
        console.log("SETUP EDITOR");
        editor = ace.edit(editorId);
        editor.setTheme("ace/theme/monokai");
        var language = document.getElementById(editorId).getAttribute("data-language");
        if (language) {
            editor.getSession().setMode("ace/mode/" + language);
        }
    };

    var codeEditorField = {
        name: fieldName,
        onReady: function onReady(ctx) {
            console.log("Onload");
            console.log(ctx);
            SPScript.utils.waitForLibrary("ace").then(function () {
                return setupEditor(ctx);
            });
        },
        render: function render(ctx) {
            var item = ctx.CurrentItem;
            var language = item["Language"] ? " data-language='" + item.Language + "' " : "";
            return "<div id='" + editorId + "' " + language + " style='min-height:200px; min-width:300px'>" + (item[fieldName] || "") + "</div>";
        },
        getValue: function getValue(ctx) {
            console.log("GET VALUE");
            return editor.getValue();
        },

        locations: ["View", "NewForm", "DisplayForm", "EditForm"]
    };

    SPScript.utils.waitForLibrary("SPClientTemplates.TemplateManager").then(function () {
        CSR.registerFormField(codeEditorField);
    });
};
setTimeout(function () {
    SPScript.utils.getScript("https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/ace.js");
}, 10);
//# sourceMappingURL=index.js.map