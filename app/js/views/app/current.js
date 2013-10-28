define(['backbone', 'underscore', 'jquery', 'app', 'text!templates/app/current.html'],
function (Backbone, _, $, App, CurrentTemplate) {

  /**
   * @class  CurrentView 
   * @extends Backbone.View
   */
  var CurrentView = Backbone.View.extend({

    template: Handlebars.compile(CurrentTemplate),

    initialize: function(){

    },

    render: function(){
      this.$el.html(this.template());

      return this;
    }

  });

  return CurrentView;

  });