'use strict';
/**
 * Dependencies
 */

const gulp = require('gulp'),
    debug = require('gulp-debug'),
    _ = require('lodash'),
    concat = require('gulp-concat'),
    path = require('path'),
    fs = require('fs'),
    mainBowerFiles = require('main-bower-files'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    connect = require('gulp-connect');


function htmlTask() {
    var htmlConf = ENV.html;
    var currentPipe = gulp.src(paths.html)
        .pipe(connect.reload())
        .pipe(plumber({errorHandler: onError}));

    if (env.isProduction || env.isStaging) {
        currentPipe = currentPipe.pipe(htmlmin({collapseWhitespace: true}))
    }
}

gulp.task('html', htmlTask);
gulp.task('build:html', ['build:clean'], htmlTask);


function bowerListTask() {
    return gulp
        .src(mainBowerFiles())
        .pipe(debug());
}

function bowerJSTask() {
    return gulp
        .src(mainBowerFiles({
            filter: '**/*.js',
            checkExistence: true
        }))
        .pipe(concat('bower_components.js'))
        .pipe(gulp.dest('./tmp/js/', {overwrite: true}));
}

function bowerCSSTask() {
    return gulp
        .src(mainBowerFiles({
            filter: '**/*.css',
            checkExistence: true
        }))
        .pipe(concat('bower_components.css'))
        .pipe(gulp.dest('./dist/css/', {overwrite: true}));
}

function bowerFontTask() {
    return gulp
        .src(mainBowerFiles({
            filter: '**/fonts/*',
            checkExistence: true
        }))
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest('./dist/fonts/', {overwrite: true}));
}

gulp.task('bower-js', bowerJSTask);
gulp.task('bower-css', bowerCSSTask);
gulp.task('bower-fonts', bowerFontTask);
gulp.task('bower-list', bowerListTask);


function vendorJSTask() {
    return gulp
        .src('./src/assets/js/*.js')
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest('./tmp/js/', {overwrite: true}));
}

function vendorConcatJSTask() {
    return gulp
        .src(['./tmp/js/bower_components.js', './tmp/js/vendors.js'])
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest('./dist/js', {overwrite: true}));
}

gulp.task('vendor-js', vendorJSTask);
gulp.task('vendor-concat-js', ['bower-js', 'vendor-js'], vendorConcatJSTask);
gulp.task('build:vendors', ['vendor-concat-js', 'bower-css', 'bower-fonts']);


function appJSTask() {
    return gulp
        .src('./src/modules/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./dist/js/', {overwrite: true}));
}

gulp.task('app-js', appJSTask);

function appCSSTask() {
    return gulp
        .src('./src/modules/**/*.css')
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./dist/css/', {overwrite: true}));
}

gulp.task('app-css', appCSSTask);

function appHtmlTask() {
    return gulp
        .src('./src/modules/**/*.html')
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest('./dist/templates/', {overwrite: true}));
}

gulp.task('app-html', appHtmlTask);

gulp.task('watch', function () {
    gulp.watch('./src/**/*', ['buildAssets']);
});

gulp.task('connect', function () {
    connect.server({
        port: 9000,
        livereload: true,
        root: ['./dist']
    });
});

/**
 * Default task
 */
gulp.task('buildAssets', ['build:vendors', 'app-js', 'app-css', 'app-html']);

gulp.task('default', ['buildAssets', 'watch', 'connect']);