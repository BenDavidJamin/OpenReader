define([
  'app',
  'backbone',
  'underscore',
  'jquery',
  'handlebars',
  'text!templates/page.html',
  'text-selection'],
  function (App, Backbone, _, $, Handlebars, PageTemplate, TextSelection) {

  /**
   * @class App
   * @extends Backbone.View
   * Has two modes. Portrate and landscape. 
   * two 'pages' will be displayed in landscape iff App.showNotationPage == false
   */
  var Page = Backbone.View.extend({
    // The tag type of the appview.
    tagName: "div",

    body: "",

    template: Handlebars.compile(PageTemplate),

    pages: null,

    className: "page",

    currentPage: 0,

    padding: 20,

    /**
     * @method initialize
     *
     * This is just the boilerplate so we only print something to the
     * console.log (WARNING: May not work in IE)
     */
    initialize: function(attributes) {
      _.bindAll(this,
        "calculatePages",
        "moveOverlay"
        );

      App.on("calculate-pages", this.calculatePages);

      this.title = attributes.title;

    },

    render: function(){
      var width = (window.innerWidth) -100;
      this.$el.empty();

      this.$el.html(this.template(
        {
          title: this.title, 
          padding: this.padding, 
          height: window.innerHeight -120
        }));
      return this;
    },

    calculatePages: function(){
      console.log("calculate pages");

      if(!$("#page-body")[0]||$("#page-body")[0].scrollWidth === 0){
        return ;
      }
      var width = this.$(".page-body")[0].scrollWidth;
      console.log(width);
      var pageWidth = this.el.clientWidth + this.padding;
      this.pages =  Math.ceil(width/pageWidth);
      console.log(this.pages);
//      while(width >= this.$("#page-body")[0].scrollWidth){
//        $("#page-body").append("<br>");
//      }
      this.$(".current-page").html("1");
      this.$(".total-page").html(this.pages);
    },

    events: {
      "click #page-next": "nextPage",
      "click #page-prev": "prevPage",
      "mouseup #page-body": "mouseUp",
      "mousedown #page-body": "mouseDown",
      "click a": "routeLink"
    },

    setSinglePage: function(){
      var page = this.$("#page-body");
      var width = (page.innerWidth()) -100;
      setColumnWidth(page,width);
    },

    setDoublePage: function(){
      var page = this.$("#page-body");
      var width = Math.ceil(((page.innerWidth()) -100)/2);
      console.log(width); 
      setColumnWidth(page,width);
    },

    setSingleNote: function(){
      var page = this.$("#page-body");
      this.$el.width("50%");
      console.log(page.width());
      var width = Math.ceil(((page.width()) -100));
      //page.width(width);
      setColumnWidth(page,width);
    },

    nextPage: function(){
      var scrollLeft = this.$(".page-body")[0].scrollLeft;
      this.$(".page-body")[0].scrollLeft += this.$(".page-body")[0].clientWidth - this.padding;
      this.currentPage += 1;
      this.$(".current-page").html(this.currentPage+1);
      this.moveOverlay();
      //loadNotes
    },

    prevPage: function(){
      var scrollLeft = $(".page-body")[0].scrollLeft;
      if(this.currentPage != 0){
        this.$(".page-body")[0].scrollLeft -= this.$(".page-body")[0].clientWidth - this.padding;
        this.currentPage -= 1;
        this.$(".current-page").html(this.currentPage+1);
        this.moveOverlay();
        //loadNotes
      }
      
    },

    /**
      * Moves the underlying underlay to match the current scrolling. 
      */
    moveOverlay: function(){
      var scrollPosition = this.$(".page-body")[0].scrollLeft;
      var overlayLeftPosition = this.$("#page-overlay").css("left");
      this.$("#page-overlay").css("left",scrollPosition);

    },

    mouseDown: function(evt){
    },

    mouseUp: function(evt){
    }

  });

  function setColumnWidth(node, width){
    node.css("webkit-column-width", width) ;
    node.css("moz-column-width", width); /* Firefox */
    node.css("column-width", width); /* Safari and Chrome */
  }


  return Page;
});
