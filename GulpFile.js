var gulp = require("gulp");
var minify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var gzip = require('gulp-gzip'); 
var concat = require("gulp-concat");

var browserifyAndMinify = function(entry, minifiedName) {
	return gulp.src(entry)
		.pipe(browserify({
			debug: false
		}))
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

gulp.task('plugins', function() {
	//splanguage picker
	gulp.src('./src/plugins/SPLanguagePicker/splanguagepicker.jquery.js')
		.pipe(gulp.dest('./dist/v1/plugins/splanguagepicker'))
		.pipe(gulp.dest('./examples/app/SPScriptApp/Pages/plugins/SPLanguagePicker'));
	
	//spfiletree
	gulp.src("./src/plugins/SPFileTree/images/**/*.*")
		.pipe(gulp.dest("./dist/v1/plugins/SPFileTree/images"));
	
	gulp.src("./lib/fancytree/skin-win8/**/*.*")
		.pipe(gulp.dest("./dist/v1/plugins/SPFileTree/skin-win8"));
	
	gulp.src(["./lib/jquery.ui.custom.min.js",
				"./lib/fancytree/jquery.fancytree.min.js",
				"./src/plugins/SPFileTree/spfiletree.jquery.js"])
		.pipe(concat("spfiletree.js"))
		.pipe(gulp.dest("./dist/v1/plugins/SPFileTree"));
	
	gulp.src('./dist/v1/spscript.jquery.js')
		.pipe(rename('spscript.js'))
		.pipe(gulp.dest('./examples/app/SPScriptApp/Pages/plugins'));

	gulp.src('./dist/v1/plugins/**/*.*')
		.pipe(gulp.dest('./examples/app/SPScriptApp/Pages/plugins'));
	
})
gulp.task('zepto', function() {
	return browserifyAndMinify('./src/entries/spscript.zepto.js', 'spscript.zepto.min.js');
});

gulp.task('select2', function() {
	return browserifyAndMinify('./src/entries/spselect2.js', 'spselect2.min.js');
});

gulp.task('test-app', ['zepto'], function(){
	gulp.src('./dist/v1/spscript.zepto.js')
		.pipe(rename('spscript.js'))
		.pipe(gulp.dest('./examples/app/SPScriptApp/Pages/test'));

	gulp.src('./test/test.js')
		.pipe(browserify({ debug: true }))
		.pipe(gulp.dest('./examples/app/SPScriptApp/Pages/test'));
});

gulp.task('plugins-app', ['jquery'], function(){
	gulp.src('./dist/v1/spscript.jquery.js')
		.pipe(rename('spscript.js'))
		.pipe(gulp.dest('./examples/app/SPScriptApp/Pages/plugins'));

	gulp.src('./dist/v1/plugins/**/*.*')
		.pipe(gulp.dest('./examples/app/SPScriptApp/Pages/plugins'));
});
gulp.task('watch', function() {
	var scripts = [ "src/**/*.js"];
	gulp.watch(scripts, ['default']);
});

gulp.task('default', ['full', 'jquery', 'zepto', 'select2', 'plugins', 'test-app']);