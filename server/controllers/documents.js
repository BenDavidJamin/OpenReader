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
/*
  var doc = new Document(req.params);
  doc.save(function(err){
    if(err){

    }
    console.log("saved new Document");
  });
*/

  res.send();

  return next();
}

