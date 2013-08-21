define([
  'app', 
  'backbone', 
  'underscore', 
  'jquery',
  'text!templates/thumb.html',
  "jquery-ui-draggable"],
  function (App, Backbone, _, $, ThumbTemplate) {

  /**
   * @class App
   * @extends Backbone.View
   * The first touch down to the application
   */
  var Thumb = Backbone.View.extend({
    // The tag type of the appview.
    tagName: "div",

    className: "thumb",

    touchStart: null,

    template: Handlebars.compile(ThumbTemplate),

    /**
     * @method initialize
     *
     * This is just the boilerplate so we only print something to the
     * console.log (WARNING: May not work in IE)
     */
    initialize: function() {
      this.position = this.options.position;
      _.bindAll(this, "touch", "touchMove", "touchEnd");

    },

    render: function() {
      this.$el.html(this.template({top:this.options.top, left:this.options.left, id: this.position}));

      $(this.el.firstChild).draggable();
      return this;
    },

    events: {
      //"click .thumb": "touch",
      "mousedown": "touch",
      "mouseup": "touchEnd",
      //"mouseout": "touchEnd",
      "mousemove": "touchMove",
      "touchmove": "touchMove"

    },

    touch: function(event){
      event.stopPropagation();
      //use jquery draggable
      
      this.touchStart = {
        top: event.pageY,
        left: event.pageX
      };
    },

    touchMove: function(event){
      if(this.touchStart !== null){

        var thumb = this.$el.find(".thumb")
        var left = thumb.offset().left;
        var movement = event.pageX - this.touchStart.left;
        var newPos = left + movement;
        thumb.offset({left: newPos});
        this.touchStart.left += movement;
        //trigger the on move event
        App.trigger(this.position+"-thumb-move", {
          left: thumb.offset().left,
          top: thumb.offset().top - 10
        });
      }

    },

    touchEnd: function(event){
      this.touchStart = null;
      App.trigger("thumb-end");
    }

  });

  return Thumb;
});
