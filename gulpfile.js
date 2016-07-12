'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');

gulp.task('default', ['copy-css', 'copy-html', 'copy-js', 'watch-css', 'watch-html','watch-js'], function(){
  console.log("DEFAULT!");
}); 
 
gulp.task('copy-css', function(){
  return gulp.src('client/**/*.css')
    .pipe(gulp.dest('public'))
});

gulp.task('copy-html', function(){
  return gulp.src('client/**/*.html')
    .pipe(gulp.dest('public'))
});

gulp.task('copy-js', function(){
  return gulp.src('client/**/*.js')
    .pipe(gulp.dest('public'))
});


gulp.task('watch-css', function(){
  gulp.watch('public/css/*.css', ['copy-css']);
})

gulp.task('watch-html', function(){
  gulp.watch('public/html/*.html', ['copy-html']);
})

gulp.task('watch-js', function(){
  gulp.watch('public/js/*.js', ['copy-js']);
})


