var mongoose = require("mongoose");

var DocumentSchema = new mongoose.Schema({
  spine: mongoose.Schema.Types.Mixed,
  manifest: mongoose.Schema.Types.Mixed,
  guide: mongoose.Schema.Types.Mixed,
  metadata: mongoose.Schema.Types.Mixed,
  navMap: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Document', DocumentSchema); 

