/*
@Shan
25/04/2016
Gulp file for deployment
*/

// Init variables and add libs
var gulp = require('gulp'),
    del = require('del'),
    webserver = require('gulp-webserver'),
    typescript = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    runSequence = require('run-sequence'),
    tscConfig = require('./tsconfig.json');

// Paths
var appSrc = 'dev/app/',
    appTarget = 'builds/dist/',
    tsSrc = 'dev/app/typescript/';

gulp.task('html', function() {
  gulp.src(appSrc + '*.html')
  .pipe(gulp.dest(appTarget));
});

gulp.task('css', function() {
  gulp.src(appSrc + 'assets/css' + '/**/*')
  .pipe(gulp.dest(appTarget + 'css'));
});

gulp.task('images', function() {
  gulp.src(appSrc + 'assets/images' + '/**/*')
  .pipe(gulp.dest(appTarget + 'images'));
});

gulp.task('templates', function() {
  gulp.src(appSrc + 'templates' + '/**/*')
  .pipe(gulp.dest(appTarget + 'templates'));
});

gulp.task('copylibs', function() {
  return gulp
    .src([
      'node_modules/es6-shim/es6-shim.min.js',
      'node_modules/systemjs/dist/system-polyfills.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/angular2/bundles/angular2-polyfills.js',
      'node_modules/angular2/bundles/angular2.dev.js',
      'node_modules/rxjs/bundles/Rx.js',
    ])
    .pipe(gulp.dest(appTarget + 'js/lib/angular2'));
});

gulp.task('typescript', function () {
  return gulp
    .src(tsSrc + '**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(appTarget + 'js/'));
});

//Clean the dist folder
gulp.task('clean', function(cb){
    return del([appTarget+'**/*']);
});

// Watch depends on webserver
gulp.task('watch', ['webserver'], function() {
  gulp.watch(tsSrc + '**/*.ts', ['typescript']);
  gulp.watch(appSrc + 'assets/' + 'css/*.css', ['css']);
  gulp.watch(appSrc + '**/*.html', ['html']);
});

gulp.task('webserver', function() {
  gulp.src(appTarget)
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

//gulp.task('build', ['typescript','copylibs','html', 'templates', 'css', 'images']);
//gulp.task('server', ['build', 'watch', 'webserver']);
//gulp.task('default', ['clean', 'server']);

gulp.task('default', function(callback) {
  runSequence('clean',
    ['typescript', 'copylibs', 'html', 'templates', 'css', 'images'],
    'watch',
    callback);
});
