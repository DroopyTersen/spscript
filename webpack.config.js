module.exports = {
    entry: {
        "spscript": "./entries/spscript.js",
        "tests": "./entries/tests.js",
        "plugins": "./entries/plugins.js"
    },
    output: {
        path: __dirname + "/dist/v2",
        filename: "[name].js",
        sourceMapFilename: "[name].js.map"
    },
    devtool: "source-map",
    externals: {
        "jquery": "jQuery" //assume jquery is added through cdn
    }
};