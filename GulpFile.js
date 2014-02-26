var gulp = require('gulp');
var concat = require('gulp-concat');


gulp.task('restDao', function() {
	gulp.src(['./baseDao.js', './restDao.js'])
		.pipe(concat("SPScript.RestDao.js"))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('search', function() {
	gulp.src(['./baseDao.js', './restDao.js', 'queryString.js', 'search.js'])
		.pipe(concat("SPScript.Search.js"))
		.pipe(gulp.dest('./dist/'));
});