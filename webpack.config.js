module.exports = {
    entry: {
        "spscript": "./src/entries/spscript.js",
        "tests": "./test/test.js"
    },
    output: {
        path: __dirname + "/dist/v2",
        filename: "[name].js"
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /(node_modules)/,
            loader: 'babel',
            query: {
                presets: ['es2015']
            }
        }]
    },
    externals: {
        "jquery": "jQuery" //assume jquery is added through cdn
    }
};