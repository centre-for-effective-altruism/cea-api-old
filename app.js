if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'){
  console.log('Dev environment')
  require('dotenv').load();
}

var express = require('express');
var path = require('path');


var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./server/routes/index');
var api = require('./server/routes/api/index');

var app = express();


// enforce SSL

if(app.get('env') === 'production'){
  var enforce = require('express-sslify');
  app.use(enforce.HTTPS({ trustProtoHeader: true }))
}

// view engine setup
app.set('views', path.join(__dirname, 'client', 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client','public')));

app.use('/v1', api);
app.use('/', routes);


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
    res.send(err)
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log('\nError:')
  console.log(err,'\n')
  res.status(err.status || 500);
  res.send(err.message || 'Error')
});


module.exports = app;
