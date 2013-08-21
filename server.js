var express = require("express"),
  path = require('path'),
  http = require('http'),
  documentdb = require('./routes/documents');

var app = express();

app.configure(function (){
  app.set('port', process.env.PORT || 8000);

  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.static(path.join(__dirname, 'app')));
});

app.get('/documents', documentdb.findAll);
//app.get('/documents/:id', document.findById);
app.post('/documents', documentdb.addDocument);
//app.put('/documents/:id', document.updateDocument);
//app.delete('/documents/:id', document.deleteDocument);
//

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
