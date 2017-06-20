module.exports = {
    entry: {
        "spscript": "./lib/entry.browser.js",
        "tests": "./src/test/test.browser.js",
    },
    output: {
        path: __dirname + "/dist/v3",
        filename: "[name].js",
        sourceMapFilename: "[name].js.map"
    },
    devtool: "source-map",
    module: {
        loaders: [
            addBabelLoader() //Enable writing ES6 javascript
        ]
    },
};

function addBabelLoader() {
    return {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
            presets: ['es2015'],
            plugins: ["transform-object-assign"]
        }
    };
}