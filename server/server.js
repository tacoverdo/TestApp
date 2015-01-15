/**
 * Created by theotheu on 24-12-13.
 */
/**
 * Module dependencies.
 */
var express = require('express')
    , fs = require('fs')
    , http = require('http')
    , path = require('path')
    , morgan = require('morgan')
    , methodOverride = require('method-override')
    , cookieParser = require('cookie-parser')
    , session = require('express-session')
    , favicon = require('static-favicon')
    , bodyParser = require('body-parser')
    , errorHandler = require('express-error-handler');

// Load configuration
var env = process.env.NODE_ENV || 'development'
    , config = require('./config/config.js')[env];

// Bootstrap db connection
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
mongoose.connect(config.db);

mongoose.connection.on('error', function (err) {
    console.error('MongoDB error: %s', err);
});

// Set debugging on/off
if (config.debug) {
    mongoose.set('debug', true);
} else {
    mongoose.set('debug', false);
}


// Bootstrap models
var models_path = __dirname + '/app/models'
    , model_files = fs.readdirSync(models_path);
model_files.forEach(function (file) {
    require(models_path + '/' + file);
})

var app = express();
app.listen(process.env.PORT || config.port);    // listen on the configured port number
app.use(favicon(__dirname + '/public/favicon.ico'));
if (env === 'development') {
    app.use(morgan('dev')); 					// log every request to the console
}
//app.use(json);
app.use(methodOverride()); 					    // simulate DELETE and PUT
app.use(cookieParser());                        // required before session.
app.use(session({ secret: 'keyboard cat', key: 'sid'}));    // https://github.com/expressjs/session/blob/master/README.md
app.use(bodyParser());                          // instruct the app to use the `bodyParser()` middleware for all routes
                                                // FIXME: check if this is still valid: http://andrewkelley.me/post/do-not-use-bodyparser-with-express-js.html
app.use(express.static(path.join(__dirname, '../client')));
app.use(errorHandler());


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

// Bootstrap routes
//require('./routes/users.js')(app);
var routes_path = __dirname + '/routes'
    , route_files = fs.readdirSync(routes_path);
route_files.forEach(function (file) {
    require(routes_path + '/' + file)(app);
})

// Last line to serve static page
console.log('last resort');
app.use(express.static(__dirname + '../client/'));
