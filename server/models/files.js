var mongoose = require("mongoose");

var FilesSchema = new mongoose.Schema({
  docId: mongoose.Schema.Types.ObjectId,
  style: mongoose.Schema.Types.Mixed,
  contents: mongoose.Schema.Types.Mixed,
  images: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Files', FilesSchema);
