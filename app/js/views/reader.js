define(["app", 
  "jquery", 
  "underscore", 
  "backbone", 
  'views/page',
  'views/androidHeader',
  'views/options/addNote',
  'views/options/copy'],
   function(App, $, _, Backbone, Page, AndroidHeader, AddNoteOption, CopyOption){
  /**
   * This class determins how many pages are rendered on screen and how they are deligated. 
   * Since we have a concept of a reader and note page this will determine from 
   * the application settings.
   * @type {[type]}
   */
  var ReaderView = Backbone.View.extend({


    /**
     * In charge of setting up all of the header buttons for actions on the application
     * domain. So actions like copy-selected text or make notation will all be. 
     * initialized in this view for the application. 
     * @return {[type]} [description]
     */
    initialize: function(){

      //In the reader view we take in the 
      _.bindAll(this, "addSelectionOptions", "removeSelectionOptions");
      //add options to the top navigation bar.
      App.on("text-selection", this.addSelectionOptions);

      //remove options from the top navigation 
      App.on("text-deselection", this.removeSelectionOptions);
    },

    render: function(){      
      var page = new Page({padding: 20});
      var header = new AndroidHeader();
      this.$el.append(header.render().el);
      this.$el.append(page.render().el);
      return this;
    },

    addSelectionOptions: function(){
      App.trigger("add-option", new AddNoteOption().render().el);
      App.trigger("add-option", new CopyOption().render().el);
    },

    removeSelectionOptions: function(){
      App.trigger("remove-option", "copy");
      App.trigger("remove-option", "addnote");
    }

  });

  return ReaderView

});