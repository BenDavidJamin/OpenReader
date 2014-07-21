var path = require('path');
var http = require('http');
var https = require('https');
var fs = require('fs');
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
server.use(restify.gzipResponse());

// Bootstrap routes
require('./server/routes')(server);

/**
 * route all get calls to the backbone app
 */
server.get(/\//, restify.serveStatic({
  directory: './app',
  default: 'index.html',
  maxAge: 1 
}));



server.listen(config.port, function() {
  console.log(" started on port " + config.port + "! " + 
    "config: " + JSON.stringify(config, null, '\t'));
});

