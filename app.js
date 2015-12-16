if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'){
  console.log('Dev environment')
  require('dotenv').load();
}

// load dependencies
var express = require('express');
var path = require('path');
var cors = require('cors')

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// create the app
var app = express();

// request parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// user authentication
var passwordless = require('passwordless')
var PostgreStore = require('passwordless-postgrestore');
var email = require('emailjs');

passwordless.init(new PostgreStore(process.env.DATABASE_URL),{allowTokenReuse:true});

var smtpServer  = email.server.connect({
   user:    process.env.SERVER_EMAIL_ADDRESS,
   password: process.env.SERVER_EMAIL_PASSWORD,
   host:    process.env.SERVER_EMAIL_HOST,
   ssl:     true
});

passwordless.addDelivery(
    function(tokenToSend, uidToSend, recipient, callback) {
        var host = app.get('env') === 'production' ? 'https://admin.centreforeffectivealtruism.org' : 'http://localhost:4000';

        smtpServer.send({
            text:    'Hello!\nAccess your account here:\n' 
            + host + '/login?token=' + tokenToSend + '&uid=' 
            + encodeURIComponent(uidToSend), 
            from:    process.env.SERVER_EMAIL_ADDRESS, 
            to:      recipient,
            subject: 'Login to the CEA API'
        }, function(err, message) { 
            if(err) {
                console.log(err);
            }
            callback(err);
        });
});

app.use(passwordless.acceptToken())



// enforce SSL in production
if(app.get('env') === 'production'){
  var enforce = require('express-sslify');
  app.use(enforce.HTTPS({ trustProtoHeader: true }))
}

app.use(logger('dev'));

// add CORS
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




// import routes
app.use('/v1', require('./server/routes/api')); // api endpoints
app.use('/', require('./server/routes')); // other endpoints


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
