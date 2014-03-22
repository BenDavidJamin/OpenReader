/**
 * controllers
 */

var documents = require("./controllers/documents");
var clips = require("./controllers/clips");
//var transactions = require("./controllers/transactions");


module.exports = function (server){

  //documents
  server.get("/documents/:id/files/images/:imageId", documents.getImage);
  server.get("/documents/:id/files/content", documents.getContent);
  server.get("/documents/:id/files/style", documents.getStyle);
  server.get("/documents/:id/files", documents.files);
  server.get("/documents/:id/clips", documents.clips);
  server.del("/documents/:id", documents.destroy);
  server.get("/documents/:id", documents.show);
  server.post("/documents", documents.create);
  server.put("/documents", documents.create);
  server.get("/documents", documents.index);

  server.get("/clear", documents.clear);


  server.get("/clips/:id", clips.show);
  server.get("/clips", clips.index);
  server.post("/clips", clips.create);
  server.del("/clips/:id", clips.destroy);

}



