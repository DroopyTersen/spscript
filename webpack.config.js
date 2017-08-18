module.exports = {
	entry: {
		spscript: `./src/entry.browser.ts`
		// tests: "./src/test/test.browser.js"
	},
	output: {
		path: __dirname + "/dist/v3",
		filename: "[name].js",
		sourceMapFilename: "[name].js.map",
		libraryTarget: "umd",
		library: "SPScript",
		umdNamedDefine: true
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	devtool: "source-map",
	module: {
		loaders: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader"
			}
			// addBabelLoader() //Enable writing ES6 javascript
		]
	}
};

function addBabelLoader() {
	return {
		test: /\.js?$/,
		exclude: /(node_modules)/,
		loader: "babel",
		query: {
			presets: ["es2015"],
			plugins: ["transform-object-assign"]
		}
	};
}
