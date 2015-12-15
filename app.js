if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'){
  console.log('Dev environment')
  require('dotenv').load();
}

var express = require('express');
var path = require('path');
var cors = require('cors')

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./server/routes/index');
var api = require('./server/routes/api/index');

var app = express();


// enforce SSL in production
if(app.get('env') === 'production'){
  var enforce = require('express-sslify');
  app.use(enforce.HTTPS({ trustProtoHeader: true }))
}

app.use(logger('dev'));


var whitelist = [
  'https://admin.centreforeffectivealtruism.org',
  'https://server.centreforeffectivealtruism.org',
  'https://www.givingwhatwecan.org',
  'https://www.centreforeffectivealtruism.org',
  'http://localhost:4000'
];
var corsOptions = {
  origin: function(origin, callback){
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  }
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

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
