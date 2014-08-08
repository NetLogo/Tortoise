gulp      = require('gulp')
closurify = require('closurify')
coffee    = require('gulp-coffee')
gutil     = require('gulp-util')
rename    = require('gulp-rename')
rm        = require('gulp-rm')
replace   = require('gulp-replace')
amd2c     = require('amd-to-closure')

gulp.task('closurify/clean', () ->
  return gulp.src(['./target/closurificated/**/*', './target/classes/js/tortoise/**/*iffy*'], {read: false})
      .pipe( rm() )
)

gulp.task('closurify/replace-shim', () ->
  return gulp.src('cl-shiv/shim/*-cl.coffee')
             .pipe(rename((path) ->
               path.basename = path.basename.split('-')[0]
               return
             ))
             .pipe(gulp.dest('src/main/coffee/shim'))
)

gulp.task('closurify/replace-bootstrap', () ->
  return gulp.src('cl-shiv/bootstrap-cl.coffee')
             .pipe(rename((path) ->
               path.basename = path.basename.split('-')[0]
               return
             ))
               .pipe(gulp.dest('src/main/coffee'))
)

gulp.task('closurify/replace', ['closurify/replace-bootstrap', 'closurify/replace-shim'])

gulp.task('closurify/all', ['closurify/clean'], () ->
  gulp.src(['./target/classes/js/tortoise/**/*.js', '!./target/classes/js/tortoise/cljs/*.js', '!./target/classes/js/**/*-cl.js'])
      .pipe(closurify({baseUrl: "./target/classes/js/tortoise"}))
      .pipe(replace(/\$\$([' ])/g, '$1'))
      .pipe(replace(/([A-z0-9])\$([A-z0-9])/g, '$1.$2'))
      .pipe(replace(/[A-z0-9.]+\$\$([A-z0-9]+)/g, '$1'))
      .pipe(replace(/\$\$\./g, '.'))
      .pipe(replace(/\$\$/g, ''))
      .pipe(gulp.dest('./target/closurificated'))
      .pipe(rename({suffix: "-cl"}))
      .pipe(gulp.dest('./target/classes/js/tortoise'))
)

