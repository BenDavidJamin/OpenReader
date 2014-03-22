define(['backbone', 'underscore', 'jquery', 'app', 'handlebars', 'text!templates/library-item.html'],
  function (Backbone, _, $, App, Handlebars, libraryItemTemplate) {

  /**
   * @class App
   * @extends Backbone.View
   * The first touch down to the application
   */
  var LibraryItem = Backbone.View.extend({
    // The tag type of the appview.
    tagName: "div",

    template: Handlebars.compile(libraryItemTemplate),

    /**
     * @method initialize
     *
     * This is just the boilerplate so we only print something to the
     * console.log (WARNING: May not work in IE)
     */
    initialize: function() {
      console.log( this.model );
    },


    events: {
      "click .library-item": "itemSelect"
    },

    render: function(){
      this.$el.html(this.template(
        {title: this.model.getTitle(),
         author: this.model.getAuthor()}));
      var that = this;
      this.model.getCover().done(function(result){
        that.$(".library-item-image")[0].src = "data:image/jpeg;base64,"+result;
      });

      return this;
    },

    itemSelect: function(evt){
      window.location = "#/document/"+this.model.get("_id");
    }

  });

  return LibraryItem;
});
