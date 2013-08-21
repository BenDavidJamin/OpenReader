define(["app",
 "jquery", 
 "underscore", 
 "backbone", "text!templates/AndroidHeader.html"], 
 function(App, $, _, Backbone, AndroidHeader){
  var AndroidHeaderView = Backbone.View.extend({


    template: Handlebars.compile(AndroidHeader),
    /**
     * The AndroidHeader view listens to App events on 
     *  add-option
     *  remove-option 
     * @return {[type]} [description]
     */
    initialize: function(){

      _.bindAll(this, "addOption", "removeOption");

      //We append a View that extends Android Header option
      App.on("add-option", this.addOption);

      //We remove a View Option that has the class name given.
      App.on("remove-option", this.removeOption);

    },

    render: function(){
      this.$el.html(this.template());

      return this;
    },

    addOption: function(view){
      this.$el.find(".android-header").append(view);
    },

    removeOption: function(optionClassName){
      this.$el.find("."+optionClassName).remove();
    },

    events: {
      "click": "prevent",
      "mousedown": "prevent"

    },

    prevent: function(event){
      event.preventDefault();
    }

  });

  return AndroidHeaderView 

});