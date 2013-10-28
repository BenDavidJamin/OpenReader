/**
 * controllers
 */

var documents = require("./controllers/documents");
//var transactions = require("./controllers/transactions");


/**
 * not sure if I have to pass in gridfs at this point but I'll find out soon 
 * enough.
 */
module.exports = function (server, gridfs){

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



