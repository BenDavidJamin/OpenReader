define(["app", 
  "jquery", 
  "underscore", 
  "backbone", 
  "handlebars",
  'models/document',
  'text!templates/reader.html',
  'views/page',
  'views/androidHeader',
  'views/options/addNote',
  'views/options/copy'],
   function(App, $, _, Backbone, Handlebars, Document, ReaderTemplate, Page, AndroidHeader, AddNoteOption, CopyOption){
  /**
   * This class determins how many pages are rendered on screen and how they are deligated. 
   * Since we have a concept of a reader and note page this will determine from 
   * the application settings.
   * @type {[type]}
   */
  var ReaderView = Backbone.View.extend({

    template: Handlebars.compile(ReaderTemplate),

    /**
     * In charge of setting up all of the header buttons for actions on the application
     * domain. So actions like copy-selected text or make notation will all be. 
     * initialized in this view for the application. 
     * @return {[type]} [description]
     */
    initialize: function(attributes){

      //In the reader view we take in the 
      _.bindAll(this, "addSelectionOptions", "removeSelectionOptions", "loadFragement", "loadFragementsComplete");
      //add options to the top navigation bar.
      App.on("text-selection", this.addSelectionOptions);

      //remove options from the top navigation 
      App.on("text-deselection", this.removeSelectionOptions);
      this.document = new Document();
      this.document.set("id", attributes.id);
      this.document.fetch();

      this.listenTo(this.document, "sync", this.docRender);
      this.listenTo(this.document, "loadFragement", this.loadFragement);
      this.listenTo(this.document, "loadFragementsComplete", this.loadFragementsComplete);

    },

    render: function(){      
      this.$el.empty();
      this.$el.html(this.template());
      return this;
    },

    docRender: function(){
      this.page = new Page({padding: 20, body: "", title: this.document.getTitle() });
      var page = this.page;      
      
      this.document.getStyle().done(function(result){
        page.setStyle(result);
      }); 
      this.document.getDocumentFragements();
      //this.$el.append(this.page.render().el);
    },

    loadFragement: function(result){
      console.log("loading fragement");
      var page = this.page;
      result.done(function(fragement){
        page.appendDocumentFragement(fragement);
        page.setDoublePage();
      });
    },

    loadFragementsComplete: function(result){
      this.$("#content").html(this.page.render().el);
//      this.page.setSinglePage();
      this.page.calculatePages();
    },

    addSelectionOptions: function(){
      App.trigger("add-option", new AddNoteOption().render().el);
      App.trigger("add-option", new CopyOption().render().el);
    },

    removeSelectionOptions: function(){
      App.trigger("remove-option", "copy");
      App.trigger("remove-option", "addnote");
    },


  });

  return ReaderView

});
