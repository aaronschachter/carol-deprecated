
var source     = require('vinyl-source-stream');
var gulp       = require('gulp');
var gutil       = require('gulp-util');
var rename     = require('gulp-rename');
var browserify = require('browserify');
var babelify   = require('babelify');
var watchify   = require('watchify');
var notify = require('gulp-notify');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {
  var props = {
    entries: ['./app/' + file],
    debug : true,
    cache: {},
    packageCache: {},
    transform: [babelify.configure({ presets: ["react"] })]
  };

  // watchify() if watch requested, otherwise run browserify() once 
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(rename('app.min.js'))
      .pipe(gulp.dest('./public/dist/'))
      .pipe(reload({stream:true}))
  }

  // listen for an update and run rebundle
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  // run it once the first time buildScript is called
  return rebundle();
}

gulp.task('scripts', function() {
  return buildScript('campaigns.js', false); // this will run once because we set watch to false
});

// run 'scripts' task first, then watch for future changes
gulp.task('default', ['scripts'], function() {
  return buildScript('campaigns.js', true); // browserify watch for JS changes
});