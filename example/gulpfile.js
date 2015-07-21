'use strict'

var gulp = require('gulp')
  , latex = require('../lib')

gulp.task('latex',function() {
  return gulp.src('*.tex')
    .pipe(latex())
    .pipe(gulp.dest('./'))
})
