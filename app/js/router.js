// Filename: router.js
define([
  'jquery',
  'backbone',
  'views/app',
  'views/reader',
  'views/page',
  'views/library',
  'views/new',
  'collections/documents',
  'app'
], function($, Backbone, AppView, Reader, Page, Library, NewDocument, DocumentCollection, App){

  /**
   *
   * @class Router
   * @extends Backbone.Router
   * Provides the routes for the app
   *
   */
  var Router = Backbone.Router.extend({
    /**
     * @method initialize
     * Starts up the Backbone history for correct
     * site navigation.
     */
    initialize: function() {
      this.documents = new DocumentCollection();
      Backbone.history.start();
      $("#main").append()
    },



    routes: {
      // Define some URL routes
      "": "index",
      "doc/:id": "document",
      "upload": "upload"
    },

    /**
     * @method index
     * The default view for the application.
     */
    index: function(){
      /*
      this.documents.reset();
      var library = new Library({documents: this.documents});
      $("#main").html(library.render().el);

      this.documents.fetch();
      */

      var appView = new AppView();

      $("#main").html(appView.render().el);

    },

    document: function(id){
      //This is where we would pass the object id here
      var reader = new Reader();
      $("#main").html(reader.render().el);
      App.trigger("calculate-pages");
    },

    upload: function(){
      var newDocument = new NewDocument();
      $("#main").html(newDocument.render().el);
    }
  });

  return Router;
});