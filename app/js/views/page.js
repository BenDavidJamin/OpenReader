define([
  'app',
  'backbone',
  'underscore',
  'jquery',
  'handlebars',
  'text!templates/page.html',
  'text-selection',
  'views/thumb'],
  function (App, Backbone, _, $, Handlebars, PageTemplate, TextSelection, ThumbView) {

  /**
   * @class App
   * @extends Backbone.View
   * Has two modes. Portrate and landscape. 
   * two 'pages' will be displayed in landscape iff App.showNotationPage == false
   */
  var Page = Backbone.View.extend({
    // The tag type of the appview.
    tagName: "div",

    template: Handlebars.compile(PageTemplate),

    pages: null,

    currentPage: 0,

    padding: 20,

    press_time: 1000,  // Maybe hardcode this value in setTimeout

    thumbs: {right: null, left: null},

    /**
     * @method initialize
     *
     * This is just the boilerplate so we only print something to the
     * console.log (WARNING: May not work in IE)
     */
    initialize: function() {
      _.bindAll(this,
        "calculatePages", 
        "touchDown", 
        "touchLeave",
        "underline",
        "highlight",
        "endSelection",
        "flipPage");

      App.on("left-thumb-move",function(offset){
        TextSelection.preappendPosition(offset);
      });
      
      App.on("right-thumb-move",function(offset){
        TextSelection.appendPosition(offset);
      });

      App.on("underline",this.underline);

      App.on("highlight",this.highlight);

      App.on("copy-selection", this.endSelection);

      App.on("calculate-pages", this.calculatePages);

    },



    render: function(){

      var body = "\
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).\
        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, 'Lorem ipsum dolor sit amet..', comes from a line in section 1.10.32.\
        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.\
        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words e";

      var words = body.split(" ");
      var bodySpanned = "";
      for(var i = 0;i< words.length;i++){
        bodySpanned += "<span>"+ words[i] +"</span> ";
      }
      var width = (window.innerWidth) -100;

      this.$el.html(this.template(
        {
          title: "This will be great", 
          body:bodySpanned,
          padding: this.padding, 
          height: window.innerHeight -120
        }));

      var page = this.$el.find(".page-body");
      var width = (window.innerWidth) -100;

      page.css("webkit-column-width", width) ;
      page.css("moz-column-width", width); /* Firefox */
      page.css("column-width", width); /* Safari and Chrome */


      return this;
    },

    handleClick: function(event){
      event.preventDefault();
      this.flipPage(event);
    },

    highlight: function(){
      TextSelection.highlight();
    },

    underline: function(){
      TextSelection.underline();
    },  

    endSelection: function(){
      this.thumbs.right.remove();
      this.thumbs.left.remove();
      this.thumbs.right = null;
      this.thumbs.left = null;

      var range = TextSelection.get();
      //want to get a pointer to the first parent that isn't a span
      // aka has id. 

      // broad casts current selection?
      // actually we could just copy it to the App copy board.
      console.log(range.toString()); 
      App.clipboard.push({container: range.startContainer.parentNode.id, range: range.textContent});
      TextSelection.clear();
      console.log(App);
      App.trigger("text-deselection");
    },

    touchDown: function(event){
      event.preventDefault();
      var that = this;
      var target = $(event.target);
      if(this.thumbs.right !== null){
        this.endSelection();
        App.trigger("text-deselection");
      }
      that.$el.data("checkdown", setTimeout(function () {
          // Add your code to run
          TextSelection.selectText(event.target);
          App.trigger("text-selection");
          var target = $(event.target)[0];
          that.thumbs.right = new ThumbView(
            {
              top:target.offsetTop+target.offsetHeight,
              left:((target.offsetLeft+target.offsetWidth) - (that.el.clientWidth - that.padding)*that.currentPage),
              position:"right"
            }
          );
          that.thumbs.left = new ThumbView(
            {
              top:target.offsetTop+target.offsetHeight,
              left:target.offsetLeft-(that.el.clientWidth - that.padding)*that.currentPage,
              position:"left"
            }
          );
          that.$el.append(that.thumbs.right.render().el);
          that.$el.append(that.thumbs.left.render().el);
      }, that.press_time));
    },

    touchLeave: function(event){
      event.preventDefault();
      clearTimeout(this.$el.data("checkdown"));
    },

    flipPage: function(event){
      event.preventDefault();
      var boundStart = (this.el.clientWidth)*this.currentPage;
      var boundEnd = boundStart+this.el.clientWidth;
      var clickSpan = (this.el.clientWidth)*.40;
      var point = event.clientX + this.currentPage*this.el.clientWidth;
      var scrollLeft = $(".page-body")[0].scrollLeft
      if(this.currentPage != 0 
        && point > boundStart 
        && point < (boundStart + clickSpan)){
        $(".page-body").animate({
            scrollLeft: scrollLeft-(this.el.clientWidth - this.padding)
        }, 800);
        console.log("previous page");
        this.currentPage -= 1;
      }else if( this.currentPage != this.pages -1
        && point < boundEnd 
        && point > boundEnd - clickSpan){
        var scroll = (this.el.clientWidth - this.padding) + scrollLeft;
        $(".page-body").animate({
            scrollLeft: scroll
        }, 800);

        this.currentPage += 1;
      }
      $(".current-page").html(this.currentPage+1);

    },

    calculatePages: function(){
      var width = this.$el.find(".page-body")[0].scrollWidth;
      var pageWidth = this.el.clientWidth + this.padding;
      this.pages =  Math.ceil(width/pageWidth);
      while(width >= this.$el.find(".page-body")[0].scrollWidth){
        this.$el.find(".page-body").append("<br>");
      }
      $(".current-page").html("1");
      $(".total-page").html(this.pages);
    },

    events: {
      "click .page-body": "handleClick",
      "touch ": "handleClick",
      "mousedown": "touchDown",
      "mouseup": "touchLeave",
      "mouseout": "touchLeave"
    }

  });

  return Page;
});
