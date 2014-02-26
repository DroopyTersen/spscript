var gulp = require("gulp");
var concat = require('gulp-concat');

gulp.task('search', function() {
  gulp.src(['./baseDao.js', './restDao.js', 'querystring.js', 'search.js'])
    .pipe(concat("SPScript.Search.js"))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('rest', function() {
  gulp.src(['./baseDao.js', './restDao.js'])
    .pipe(concat("SPScript.RestDao.js"))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('crossdomain', function() {
  gulp.src(['./baseDao.js', './odatahelpers.js', './crossDomainDao.js'])
    .pipe(concat("SPScript.CrossDomain.js"))
    .pipe(gulp.dest('./dist/'));
});