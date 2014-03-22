define([
  'jquery',
  'underscore',
  'backbone',
  'models/document'
], function($, _, Backbone, DocumentModel){

  var Documents = Backbone.Collection.extend({
    model: DocumentModel, // Generally best practise to bring down a Model/Schema for your collection
    currentPage: 0,
    genre: "",
    search: "",
    url: function(){
      return 'http://localhost:8001/documents?page='+this.currentPage;
    }
    
  });

  return Documents;
});
