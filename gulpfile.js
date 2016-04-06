
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
    entries: ['./src/components/' + file],
    debug : true,
    cache: {},
    packageCache: {},
    transform: [babelify.configure({ presets: ["es2015", "react"]})]
  };

  // watchify() if watch requested, otherwise run browserify() once 
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(gulp.dest('./public/dist/'))
      .pipe(reload({stream:true}))
  }
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  return rebundle();
}

gulp.task('default', function() {
  buildScript('CampaignList.js', true); 
  buildScript('Inbox.js', true);
  buildScript('CampaignGallery.js', true);
  buildScript('Reportback.js', true);
  return;
});

