define(['backbone', 
  'underscore', 
  'jquery', 
  'views/page', 
  'views/library',
  'views/app/current',
  'text!templates/app.html'],
	function (Backbone, _, $, PageView, LibraryView, CurrentView, AppTemplate) {

  /**
   * @class App
   * @extends Backbone.View
   * The first touch down to the application
   */
  var App = Backbone.View.extend({
    // The tag type of the appview.
    tagName: "div",

    template: Handlebars.compile(AppTemplate),

    /**
     * @method initialize
     *
     * This is just the boilerplate so we only print something to the
     * console.log (WARNING: May not work in IE)
     */
    initialize: function() {

      this.current = new CurrentView();


    },
    /**
     * [render description]
     * @return {[type]} [description]
     */
    render: function(){

      this.$el.empty();

      this.$el.html(this.template());

      this.$el.find(".current-reading").append(this.current.render().el);

      return this;
    }

  });

  return App;
});
