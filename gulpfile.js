var gulp = require('gulp');

var browserify = require('browserify');
var buffer     = require('vinyl-buffer');
var coffeelint = require('gulp-coffeelint');
var coffee     = require('gulp-coffee');
var del        = require('del');
var gutil      = require('gulp-util');
var insert     = require('gulp-insert');
var remapify   = require('remapify');
var rename     = require('gulp-rename');
var source     = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', function(cb) {
  del(['target/classes/js/'], cb);
});

gulp.task('coffeelint', function () {
  return gulp.src('./src/main/coffee/**/*.coffee')
             .pipe(coffeelint())
             .pipe(coffeelint.reporter())
             .pipe(coffeelint.reporter('fail'));
});

gulp.task('coffee', ['coffeelint'], function() {
  return gulp.src('./src/main/coffee/**/*.coffee')
             .pipe(coffee().on('error', gutil.log))
             .pipe(gulp.dest('./target/classes/js/tortoise/'));
});

gulp.task('browserify', ['coffee'], function() {

  var baseB = browserify({
    debug:   true,
    entries: ['tortoise/bootstrap.js'],
    paths:   [__dirname + '/target/classes/js/']
  });

  baseB.plugin(remapify, [{
    src: '**/*.js',
    expose: 'tortoise',
    cwd: __dirname + "/target/classes/js/tortoise/",
    filter: function(alias, dirname, basename) {
      if (alias.indexOf("\\") === -1) {
        console.log("alias: " + alias + "\ndirname: " + dirname + "\nbasename: " + basename);
        console.log("ENTRY DONE\n");
      }
      return alias;
    }
  }]);

  return baseB.bundle()
              .pipe(source(__dirname + '/package.json'))
              .pipe(rename('tortoise-engine.js'))
              .pipe(buffer())
              .pipe(sourcemaps.init({loadMaps: true}))
              .pipe(sourcemaps.write('.'))
              .pipe(insert.prepend('tortoise_require='))
              .pipe(gulp.dest(__dirname + '/target/classes/js/'));

});

gulp.task('build', ['coffeelint', 'coffee', 'browserify']);
