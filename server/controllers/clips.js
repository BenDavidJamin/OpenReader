var mongoose = require('mongoose');


var Clip = mongoose.model('Selection', require('../models/selection'));

exports.show = function(req, res, next){

}

exports.index = function(req, res, next){
  Clip.find(function(err, results){
    if(err)
      throw err;

    return res.send(results);

  });
}

exports.destroy = function(req, res, next){

}

exports.create = function(req, res, next){
  var datums = req.params;
  datums.documentId = mongoose.Types.ObjectId(datums.documentId);
  datums.userId = mongoose.Types.ObjectId(datums.userId);

  var clip = new Clip(datums);
  clip.save();
  res.send();
  return next();
}
