'use strict';

var gulp    = require('gulp');
var karma   = require('karma');
var jshint  = require('gulp-jshint');
var uglify  = require('gulp-uglify');
var concat  = require('gulp-concat');
var stylish = require('jshint-stylish');

var config = {
    test: __dirname + '/test/karma.conf.js',
    src: [
        './src/in-viewport.module.js',
        './src/directives/*.js'
    ],
    dist: './dist/'
};


// Run karma unit tests
gulp.task('karma', function (done) {
    var karmaConfig = {
        configFile: config.test,
        singleRun: true
    };


    var server = new karma.Server(karmaConfig, karmaCallback);
    server.start();

    function karmaCallback ()
    {
        done();
    }

});

// JSHint the source files
gulp.task('jshint', function () {
    return gulp.src(config.src)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// Copy src to dist
gulp.task('build-regular', ['test'], function () {
    return gulp
        .src(config.src)
        .pipe(concat('in-viewport.js'))
        .pipe(gulp.dest(config.dist));
});

// Copy minified src to dist
gulp.task('build-minified', ['test'], function () {
    return gulp
        .src(config.src)
        .pipe(uglify())
        .pipe(concat('in-viewport.min.js'))
        .pipe(gulp.dest(config.dist));
});

// Run tests
gulp.task('test', ['jshint', 'karma']);

// Build
gulp.task('build', ['test', 'build-regular', 'build-minified']);