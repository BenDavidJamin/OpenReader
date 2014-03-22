define([
  'app',
  'backbone',
  'underscore',
  'jquery',
  'handlebars',
  'text!templates/page.html',
  'text-selection',
  'views/selectOptions'],
  function (App, Backbone, _, $, Handlebars, PageTemplate, TextSelection, SelectOptionsView) {

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
        "calculatePages" 
        );

      App.on("calculate-pages", this.calculatePages);

      this.title = attributes.title;
      this.selectOptions = new SelectOptionsView();

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

    appendDocumentFragement: function(docFrag){
      this.$('#page-body').append(docFrag);
      this.setSingleNote();
      this.calculatePages();
    },

    setStyle: function(style){
      $("<style>"+style+"</style>").appendTo("head");  
    },

    calculatePages: function(){
      console.log("calculate pages");

      if(!$("#page-body")[0]||$("#page-body")[0].scrollWidth === 0){
        return ;
      }
      var width = this.$("#page-body")[0].scrollWidth;
      var pageWidth = this.el.clientWidth + this.padding;
      this.pages =  Math.ceil(width/pageWidth);
      while(width >= this.$("#page-body")[0].scrollWidth){
        $("#page-body").append("<br>");
      }
      $(".current-page").html("1");
      $(".total-page").html(this.pages);
    },

    events: {
      "click #page-next": "nextPage",
      "click #page-prev": "prevPage",
      "mouseup #page-body": "mouseUp",
      "mousedown #page-body": "mouseDown",
      "click a": "routeLink"
    },

    routeLink: function(evt){
      evt.preventDefault();
      var tag = evt.target.href.split("#")[1];
      var element = document.getElementById(tag);
      var left = element.offsetLeft;
      var scrollLeft = this.$(".page-body")[0].scrollLeft;
      var pageWidth = this.$(".page-body")[0].clientWidth - this.padding;

      if( left > scrollLeft){
        while(left > scrollLeft + pageWidth){
          scrollLeft += pageWidth;
        }
      } else if(left < scrollLeft) {
        while(left > scrollLeft - pageWidth){
          scrollLeft -= pageWidth;
        }
      }
      this.$(".page-body")[0].scrollLeft = scrollLeft;
    },

    setSinglePage: function(){
      var page = this.$("#page-body");
      var width = (page.innerWidth()) -100;
      setColumnWidth(page,width);
    },

    setDoublePage: function(){
      var page = this.$("#page-body");
      var width = Math.ceil(((page.innerWidth()) -100)/2);
      setColumnWidth(page,width);
    },

    setSingleNote: function(){
      var page = this.$("#page-body");
      var width = Math.ceil(((page.innerWidth()) -100)/2);
      page.width(width);
      setColumnWidth(page,width);
    },

    nextPage: function(){
      var scrollLeft = this.$(".page-body")[0].scrollLeft;
      this.$(".page-body")[0].scrollLeft += this.$(".page-body")[0].clientWidth - this.padding;
      this.currentPage += 1;
      $(".current-page").html(this.currentPage+1);
    },

    prevPage: function(){
      var scrollLeft = $(".page-body")[0].scrollLeft;
      this.$(".page-body")[0].scrollLeft -= this.$(".page-body")[0].clientWidth - this.padding;
      this.currentPage -= 1;
      $(".current-page").html(this.currentPage+1);
    },

    mouseDown: function(evt){
    },

    mouseUp: function(evt){
      var selObj = window.getSelection();
      var selRange = selObj.getRangeAt(0);
      
      if(selRange.toString().length != 0){
        var newNode = document.createElement("span");
        newNode.setAttribute("id", "finder");
        selRange.insertNode(newNode);
        var position = $("#finder").position();


        this.selectOptions.setLocation(position);
        this.selectOptions.setRange(selRange.cloneRange());
        $("body").append(this.selectOptions.render().el);
        $("#finder").remove();
      }
    }

  });

  function setColumnWidth(node, width){
    node.css("webkit-column-width", width) ;
    node.css("moz-column-width", width); /* Firefox */
    node.css("column-width", width); /* Safari and Chrome */
  }


  return Page;
});
