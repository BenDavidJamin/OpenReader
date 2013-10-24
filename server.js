var path = require('path');
var http = require('http');
var mongoose = require('mongoose');
var restify = require("restify");

var env = 'development';
var config = require('./config/config.js')[env];

//connect to mongoose. 
mongoose.connect(config.mongoose.url);

var server = restify.createServer();

// restify settings
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Bootstrap routes
require('./server/routes')(server);

/**
 * route all get calls to the backbone app
 */
server.get(/\//, restify.serveStatic({
  directory: './app',
  default: 'index.html',
  maxAge: config.maxAge
}));



server.listen(config.port, function() {
  console.log('%s listening at %s', config.name, JSON.stringify(config));
});

