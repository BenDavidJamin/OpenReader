define([
 "app",
 "jquery",
 "underscore", 
 "backbone", 
 "handlebars",
 'text!templates/addNote.html'],
  function(App, $, _, Backbone, Handlebars, AddNoteOptionTemplate){
  var AddNoteOption = Backbone.View.extend({

    template: Handlebars.compile(AddNoteOptionTemplate),

    initialize: function(){

    },

    render: function(){
      this.$el.html(this.template());
      return this; 
    },

    events: {
      "click": "addnote"
    },

    addnote: function(event){
      event.preventDefault();
    }

  });

  return AddNoteOption;

});