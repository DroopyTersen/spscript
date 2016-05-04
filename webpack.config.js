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
    // module: {
    //     loaders: [{
    //         test: /\.js?$/,
    //         exclude: /(node_modules)/,
    //         loader: 'babel',
    //         query: {
    //             presets: ['es2015'],
    //             plugins: ["transform-object-assign"]
    //         }
    //     }]
    // },
    externals: {
        "jquery": "jQuery" //assume jquery is added through cdn
    }
};