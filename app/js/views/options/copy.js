define([
 "app",
 "jquery",
 "underscore", 
 "backbone", 
 "handlebars", 
 'text!templates/copy.html'],
  function(App, $, _, Backbone, Handlebars, CopyOptionTemplate){
  var CopyOption = Backbone.View.extend({

    template: Handlebars.compile(CopyOptionTemplate),

    initialize: function(){

    },

    render: function(){
      this.$el.html(this.template());
      return this; 
    },

    events: {
      "click": "copySelection"
    },

    copySelection: function(event){
      event.preventDefault();
      App.trigger("copy-selection");
    }

  });

  return CopyOption;

});