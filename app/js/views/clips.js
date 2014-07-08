define(['backbone', 'underscore', 'jquery', 'handlebars', 'views/clipItem', 'text!templates/clips.html', 'collections/clips'],
  function (Backbone, _, $, Handlebars, ClipItem, ClipTemplate, ClipCollection) {

  /**
   * @class App
   * @extends Backbone.View
   */
  var Clips = Backbone.View.extend({
    // The tag type of the appview.
    tagName: "div",

    template: Handlebars.compile(ClipTemplate),

    /**
     * @method initialize
     *
     * This is just the boilerplate so we only print something to the
     * console.log (WARNING: May not work in IE)
     */
    initialize: function(attributes) {
      this.clips = new ClipCollection({id: attributes.id});
      this.clips.fetch();
      this.listenTo(this.clips, {
        "change reset add remove": this.render
      });
    },


    render: function(){
      //this.$el.html(this.template());
      this.$el.empty();
      console.log("clips render");
      this.clips.each(function(model){
        var clip = new ClipItem({model: model});
        this.$el.append(clip.render().el);
      },this);

      return this;
    },

    events: {
    }


  });

  return Clips;
});
