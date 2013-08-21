define(['backbone', 
  'underscore', 
  'jquery', 
  'views/page', 
  'views/library',
  'text!templates/app.html'],
	function (Backbone, _, $, PageView, LibraryView, AppTemplate) {

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


    },
    /**
     * [render description]
     * @return {[type]} [description]
     */
    render: function(){
      this.$el.html(this.template());

      return this;
    }

  });

  return App;
});
