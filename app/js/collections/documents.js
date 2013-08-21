define([
  'jquery',
  'underscore',
  'backbone',
  'models/document'
], function($, _, Backbone, DocumentModel){
  var Documents = Backbone.Collection.extend({
    model: DocumentModel, // Generally best practise to bring down a Model/Schema for your collection
    url: 'http://localhost:8000/documents'
  });

  return Documents;
});