var gulp = require("gulp");
var concat = require('gulp-concat');
var minify = require('gulp-uglify');
var rename = require('gulp-rename');

var concatAndMinify = function(sourceFiles, name) {
	gulp.src(sourceFiles)
		.pipe(concat("SPScript." + name + ".js"))
		.pipe(gulp.dest('./dist/'))
		.pipe(rename("SPScript." + name + ".min.js"))
		.pipe(minify())
		.pipe(gulp.dest('./dist/'));
};

gulp.task('search', function() {
	var files = [
		'./src/baseDao.js',
		'./src/restDao.js',
		'./src/querystring.js',
		'./src/search.js'
	];
	concatAndMinify(files, "Search");
});

gulp.task('rest', function() {
	var files = ['./src/baseDao.js', './src/restDao.js'];
	concatAndMinify(files, 'RestDao');
});

gulp.task('crossdomain', function() {
	var files = [
		'./src/baseDao.js', 
		'./src/odatahelpers.js', 
		'./src/crossDomainDao.js'
	];
	concatAndMinify(files, 'CrossDomain');
});

gulp.task('full', function() {
	var files = [
		'./src/baseDao.js', 
		'./src/odatahelpers.js', 
		'./src/restDao.js', 
		'./src/crossDomainDao', 
		'./src/querystring.js', 
		"./src/search.js", 
		"./src/templating.js"];
	concatAndMinify(files, 'Full');
});

gulp.task('default', ['full', 'search', 'rest', 'crossdomain']);