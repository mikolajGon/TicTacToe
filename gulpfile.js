'use strict';

var gulp = require('gulp'),
    gulpConcat = require('gulp-concat'),
    gulpUglify = require('gulp-uglify'),
    gulpRename = require('gulp-rename'),
    gulpSass = require('gulp-sass'),
    gulpSourcemaps = require('gulp-sourcemaps'),
    gulpBabel = require('gulp-babel'),
    gulpEsLint = require('gulp-eslint'),
    del = require('del'),
    htmlreplace = require('gulp-html-replace');

gulp.task('concatScripts', function() {
    return gulp.src([
        'js/board.js',
        'js/fields.js',
        'js/game.js',
        'js/players.js', ,
        'js/main.js',])
    .pipe(gulpSourcemaps.init())
    .pipe(gulpConcat('app.js'))
    .pipe(gulpSourcemaps.write('./'))
    .pipe(gulp.dest('js'));
});

gulp.task('uglifyScripts', ['concatScripts'], function() {
    return gulp.src('js/app.js')
    .pipe(gulpEsLint())
    .pipe(gulpEsLint.format())
    .pipe(gulpEsLint.failAfterError())
    .pipe(gulpBabel())
    .pipe(gulpUglify())
    .pipe(gulpRename('app-min.js'))
    .pipe(gulp.dest('js'));
});

gulp.task('compileSass', function() {
    return gulp.src('scss/styles.scss')
    .pipe(gulpSourcemaps.init())
    .pipe(gulpSass())
    .pipe(gulpSourcemaps.write('./'))
    .pipe(gulp.dest('css'));
});

gulp.task('watchFiles', function() {
    gulp.watch('scss/*.scss', ['compileSass']);
    gulp.watch('js/*.js', ['concatScripts']);
});

gulp.task('clean', function() {
    del(['dist', 'css/styles.css*', 'js/app*.js*']);
});

gulp.task('serve', ['watchFiles']);

gulp.task('replaceScriptName', function() {
    gulp.src('index.html')
    .pipe(htmlreplace({
        'js' : 'js/app-min.js'
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('build', ['uglifyScripts', 'compileSass', 'replaceScriptName'], function() {
    return gulp.src(['css/styles.css', 'js/app-min.js'], {base: './'})
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean'], function() {
    gulp.start('build');
});