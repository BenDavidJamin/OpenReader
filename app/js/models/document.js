define(["jquery", "underscore", "backbone"], function($, _, Backbone){
  var Document = Backbone.Model.extend({
      url: 'http://localhost:8080/documents'
  });

  return Document

});