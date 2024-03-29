var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
  res.render('index', { title: 'Login' });
});

app.get('/campaigns', function(req, res, next) {
  res.render('layout', {
    title: 'Campaigns',
    membersClassName: null,
    campaignsClassName: 'active',
    contentSrc: '/dist/CampaignList.js',
  });
});

app.get('/campaign/:id', function(req, res, next) {
  res.render('layout', {
    title: 'Inbox',
    membersClassName: null,
    campaignsClassName: 'active',
    contentSrc: '/dist/Inbox.js',
  });
});

app.get('/gallery/:id', function(req, res, next) {
  res.render('layout', {
    title: 'Gallery',
    membersClassName: null,
    campaignsClassName: 'active',
    contentSrc: '/dist/CampaignGallery.js',
  });
});

app.get('/reportback/:id', function(req, res, next) {
  res.render('layout', {
    title: 'Reportback',
    fid: req.query.fid,
    membersClassName: 'active',
    campaignsClassName: null,
    contentSrc: '/dist/Reportback.js',
  });
});

app.get('/user/:id', function(req, res, next) {
  res.render('layout', {
    title: 'Profile',
    membersClassName: 'active',
    campaignsClassName: null,
    contentSrc: '/dist/Profile.js',
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
