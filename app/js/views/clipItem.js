define(['backbone', 'underscore', 'jquery', 'handlebars', 'text!templates/clipItem.html'],
  function (Backbone, _, $, Handlebars, ClipTemplate) {

  var ClipItem = Backbone.View.extend({

    tagName: "div",

    className: "clip",

    template: Handlebars.compile(ClipTemplate),

    initialize: function(attributes){
      this.clip = (typeof attributes != "undefined")? attributes.model: null;
    },


    render: function(){
      this.$el.html(this.template(this.clip.attributes));

      return this;
    },

    events: {

    }

  });

  return ClipItem;
})
