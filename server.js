var path = require('path');
var http = require('http');
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var restify = require("restify");

var env = 'development';
var config = require('./config/config.js')[env];
var gridfs;

//construct GridFS
Grid.mongo = mongoose.mongo;

//connect to mongoose. 
var conn = mongoose.createConnection(config.mongoose.url);
conn.once('open', function(){
  gridfs = Grid(conn.db);
});


var server = restify.createServer();

// restify settings
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Bootstrap routes
require('./server/routes')(server, gridfs);

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

