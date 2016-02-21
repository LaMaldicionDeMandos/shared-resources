var gulp = require('gulp-npm-run')(require('gulp'), {
    require: ['tests']
});
gulp.task('staging', ['tests']);
gulp.task('production', function(){});
gulp.task('test', ['tests']);
