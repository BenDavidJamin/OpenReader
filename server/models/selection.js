var mongoose = require("mongoose");

var SelectionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  documentId: mongoose.Schema.Types.ObjectId,
  dataIndex: String,
  startContainer: String,
  endContainer: String,
  startOffset: Number,
  endOffset: Number,
  color: String,
  style: String,
  text: String,
  selections: mongoose.Schema.Types.Mixed,
  noteText: String

});

module.exports = mongoose.model("Selection", SelectionSchema);
