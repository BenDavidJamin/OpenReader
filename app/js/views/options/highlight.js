define([
 "app",
 "jquery",
 "underscore", 
 "backbone", 
 "handlebars"], 
  function(App, $, _, Backbone, Handlebars){
  var HighlightOption = Backbone.View.extend({

    template: Handlebars.compile(),

    initialize: function(){

    },

    render: function(){
      this.$el.html(this.template());
      return this; 
    }

  });

  return HighlightOption;

});