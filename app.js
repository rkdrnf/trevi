var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var session = require('express-session');
var	passport = require('passport');
var flash = require('express-flash');
var sassMiddleware = require('node-sass-middleware');
var app = express();

var dbConfig = require('./config/database.js');

mongoose.connect(dbConfig.url);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({ secret: 'rkdrnfhellorkdrnf' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/file_upload.js')(app);
require('./config/passport.js')(passport);

app.use(
	sassMiddleware({
		src: __dirname + '/sass',
		dest: __dirname + '/public/stylesheets',
		prefix: '/stylesheets',
		debug: true
	})
);

app.use(express.static(path.join(__dirname, 'public')));


require('./routes/route.js')(app, passport);

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
