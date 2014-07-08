define([
  'app',
  'backbone',
  'underscore',
  'jquery',
  'handlebars',
  'text!templates/page.html',
  'views/page',
  'text-selection',
  'views/selectOptions'],
  function (App, Backbone, _, $, Handlebars, PageTemplate, Page, TextSelection, SelectOptionsView) {

  console.log(Page.View);
  /**
   * @class App
   * @extends Backbone.View
   * Has two modes. Portrate and landscape. 
   * two 'pages' will be displayed in landscape iff App.showNotationPage == false
   */
  var DocumentPage = Page.extend({
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

      App.on("calculate-pages", this.calculatePages);

      console.log(this.events);
      this.title = attributes.title;
      this.selectOptions = new SelectOptionsView();
      this.events["mouseup #page-body"] = "mouseUp";
      this.events["mousedown #page-body"] = "mouseDown";
      this.events["click a"] = "routeLink";
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
    },

    setStyle: function(style){
      $("<style>"+style+"</style>").appendTo("head");  
    },



    routeLink: function(evt){
      evt.preventDefault();
      var tag = evt.target.href.split("#")[1];
      var element = document.getElementById(tag);
      var left = element.offsetLeft;
      var scrollLeft = this.$(".page-body")[0].scrollLeft;
      
      var pageWidth = this.$(".page-body")[0].clientWidth - this.padding//(this.padding + 0.112);

      if( left > scrollLeft){
        while(left > scrollLeft + pageWidth){
          scrollLeft += pageWidth;
          this.currentPage++;
        }
      } else if(left < scrollLeft) {
        while(left < scrollLeft - pageWidth){
          scrollLeft -= pageWidth;
          this.currentPage--;
        }
      }
      this.$(".page-body")[0].scrollLeft = scrollLeft;
      
      this.$(".current-page").html(this.currentPage+1);
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

  return DocumentPage;
});
