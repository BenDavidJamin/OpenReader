var mongoose = require('mongoose');

var Document = mongoose.model('Document', require('../models/document')); 

exports.show = function(req, res){
  if(typeof req.params.id === "undefined"){
    Document.find(function(err, result){
      if(err){

      }
      res.send(result);
    });
  }else{
    Document.findOne({id: req.params.id},function(err, result){
      if(err){

      }
      res.send(result);
    });
  }
}

exports.destroy = function(req, res, next){
  res.send();

  return next();
}

exports.create = function(req, res, next){
  console.log(req.files);
  //TODO this should be req.files.name? path?
  var grid = new Grid(db, 'fs');
  fs.createReadStream(req.files.path)
  .pipe(unzip.Parse())
  //on the entries we'll construct the document structure that is saved in the database
  .on('entry', function (entry) {
    var fileName = entry.path;
    var type = entry.type; // 'Directory' or 'File'
    var size = entry.size;
    if (fileName === "this IS the file I'm looking for") {
      entry.pipe(fs.createWriteStream('output/path'));
    } else {
      entry.autodrain();
    }
  });

  //By now we've saved out the 

  var doc = new Document(req.params);
  doc.save(function(err){
    if(err){

    }
    console.log("saved new Document");
  });


  res.send();

  return next();
}

