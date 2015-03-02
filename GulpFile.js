var gulp = require("gulp");
var concat = require('gulp-concat');
var minify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');

var concatAndMinify = function(sourceFiles, name) {
	gulp.src(sourceFiles)
		.pipe(concat("SPScript." + name + ".js"))
		.pipe(gulp.dest('./dist/v1/'))
		.pipe(rename("SPScript." + name + ".min.js"))
		.pipe(minify())
		.pipe(gulp.dest('./dist/v1/'));
};

var browserifyAndMinify = function(entry, minifiedName) {
	return gulp.src(entry)
		.pipe(browserify())
		.pipe(gulp.dest('./dist/v1/'))
		.pipe(rename(minifiedName))
		.pipe(minify())
		.pipe(gulp.dest('./dist/v1/'));
};

gulp.task('full', function(){
	browserifyAndMinify('./src/entries/spscript.js', 'spscript.min.js');
});

gulp.task('jquery', function(){
	browserifyAndMinify('./src/entries/spscript.jquery.js', 'spscript.jquery.min.js');
});

gulp.task('zepto', function(){
	browserifyAndMinify('./src/entries/spscript.zepto.js', 'spscript.zepto.min.js');
});

gulp.task('default', ['full', 'jquery', 'zepto']);