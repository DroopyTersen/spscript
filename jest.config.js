module.exports = {
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
	testPathIgnorePatterns: ["/lib/", "/node_modules/", "testUtils.ts"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	collectCoverage: true,
	collectCoverageFrom: ["src/**/*.{ts,tsx}", "!<rootDir>/node_modules/", "!<rootDir>/path/to/dir/"],
};
