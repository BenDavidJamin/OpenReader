define([
  'app',
  'backbone',
  'underscore',
  'jquery',
  'handlebars',
  'text!templates/page.html',
  'views/page',
  'text-selection'
  ],
  function (App, Backbone, _, $, Handlebars, PageTemplate, Page, TextSelection) {

  /**
   * @class App
   * @extends Backbone.View
   * Has two modes. Portrate and landscape. 
   * two 'pages' will be displayed in landscape iff App.showNotationPage == false
   */
  var NotePage = Page.extend({
    // The tag type of the appview.
    pages: null,

    /**
     * @method initialize
     *
     * This is just the boilerplate so we only print something to the
     * console.log (WARNING: May not work in IE)
     */
    initialize: function(attributes) {
      _.bindAll(this,
        "calculatePages" 
        );
      this.width = typeof attributes != "undefined"?attributes.width:undefined;
      App.on("calculate-pages", this.calculatePages);
      this.events["mouseup #page-body"] = "mouseUp";
      this.events["mousedown #page-body"] = "mouseDown";
    },

    render: function(){
      this.$el.empty();
      this.$el.width(this.width ||(window.innerWidth) -100);
      this.$el.html(this.template(
        {
          title: this.title, 
          padding: this.padding, 
          height: window.innerHeight -120
        }));
      return this;
    },

    appendView: function(view){
      this.$("#page-body").html(view.render().el);  
    },

    mouseDown: function(evt){
    },

    mouseUp: function(evt){
    }

  });

  return NotePage;
});
