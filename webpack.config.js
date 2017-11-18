module.exports = {
	entry: {
		spscript: `./src/entry.spscript.ts`,
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
			},
			addBabelLoader() //Enable writing ES6 javascript
		]
	},
	// Not totally getting why i need to do this but...
	//https://github.com/matthew-andrews/isomorphic-fetch/issues/98
	externals: [
		{
			"isomorphic-fetch": {
				root: "isomorphic-fetch",
				commonjs2: "isomorphic-fetch",
				commonjs: "isomorphic-fetch",
				amd: "isomorphic-fetch"
			}
		}
	]
};

function addBabelLoader() {
	return {
		test: /\.js?$/,
		exclude: /(node_modules)/,
		loader: "babel-loader",
		query: {
			presets: ["es2015"],
			plugins: ["transform-object-assign"]
		}
	};
}
