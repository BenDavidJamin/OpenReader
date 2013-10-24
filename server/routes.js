/**
 * controllers
 */

var documents = require("./controllers/documents");
//var transactions = require("./controllers/transactions");


module.exports = function (server){

  //documents
  server.get("/documents", documents.show);
  server.get("/documents/:id", documents.show);
  server.post("/documents", documents.create);
  server.put("/documents", documents.create);
  server.del("/documents/:id", documents.destroy);

  /*
  server.put("/documents/:id", documents.update);
  */

}



