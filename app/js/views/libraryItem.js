define(['backbone', 'underscore', 'jquery', 'handlebars', 'text!templates/library-item.html'],
  function (Backbone, _, $, Handlebars, libraryItemTemplate) {

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


    render: function(){

      this.$el.html(this.template(
        {title: this.model.get("title"),
         author: this.model.get("author")}));
      return this;
    }

  });

  return LibraryItem;
});
