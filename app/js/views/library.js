define(['app','backbone', 'underscore', 'jquery', 'handlebars', 'views/libraryItem', 'text!templates/library.html'],
  function (App, Backbone, _, $, Handlebars, LibraryItem, LibraryTemplate) {

  /**
   * @class App
   * @extends Backbone.View
   * The first touch down to the application
   */
  var Library = Backbone.View.extend({
    // The tag type of the appview.
    tagName: "div",

    template: Handlebars.compile(LibraryTemplate),

    /**
     * @method initialize
     *
     * This is just the boilerplate so we only print something to the
     * console.log (WARNING: May not work in IE)
     */
    initialize: function(attributes) {
      this.documents = attributes.documents;
      this.listenTo(this.documents, {
        "change reset add remove": this.renderLibrary
      });
    },


    render: function(){
      this.$el.html(this.template());

      return this;
    },

    renderLibrary: function(){
      this.$el.find(".library").empty();
      this.documents.each(function(doc) {
        var item = new LibraryItem({model: doc});
        this.$el.find(".library").append(item.render().el);
      }, this);
    },

    events: {
      "click #pagination-next": "nextPagination",
      "click #pagination-prev": "prevPagination"
    },

    nextPagination: function(evt){

    },

    prevPagination: function(evt){

    }

  });

  return Library;
});
