define(["app", 
  "jquery", 
  "underscore", 
  "backbone", 
  "handlebars",
  'models/document',
  'text!templates/reader.html',
  'views/docPage',
  'views/notePage',
  'views/options/addNote',
  'views/options/copy',
  'views/clips',
  'paperjs'],
   function(App, $, _, Backbone, Handlebars, Document, ReaderTemplate, DocumentPage, NotePage, AddNoteOption, CopyOption, Clips){
  /**
   * This class determins how many pages are rendered on screen and how they are deligated. 
   * Since we have a concept of a reader and note page this will determine from 
   * the application settings.
   * @type {[type]}
   */
  var ReaderView = Backbone.View.extend({

    template: Handlebars.compile(ReaderTemplate),

    /**
     * In charge of setting up all of the header buttons for actions on the application
     * domain. So actions like copy-selected text or make notation will all be. 
     * initialized in this view for the application. 
     * @return {[type]} [description]
     */
    initialize: function(attributes){

      //In the reader view we take in the 
      _.bindAll(this, "addSelectionOptions", "removeSelectionOptions", "loadFragement", "loadFragementsComplete");
      //add options to the top navigation bar.
      App.on("text-selection", this.addSelectionOptions);

      //remove options from the top navigation 
      App.on("text-deselection", this.removeSelectionOptions);
      this.document = new Document({id: attributes.id});
      this.document.fetch();
      this.clips = new Clips({id: attributes.id});

      this.listenTo(this.document, "sync", this.docRender);
      this.listenTo(this.document, "loadFragement", this.loadFragement);
      this.listenTo(this.document, "loadFragementsComplete", this.loadFragementsComplete);

      this.listenTo(App, "highlight-selection", this.highlightSelection);

    },

    render: function(){      
      this.$el.empty();
      this.$el.html(this.template());
      return this;
    },

    docRender: function(){
      this.page = new DocumentPage({padding: 20, body: "", title: this.document.getTitle() });
      var page = this.page;      
      this.$("#openreader-title").text(this.document.getTitle());
      
      //this.document.getStyle().done(function(result){
      //  page.setStyle(result);
      //}); 
      this.document.getDocumentFragements();
      //this.$el.append(this.page.render().el);
    },

    renderNotes: function(){
      if(typeof this.notePage == "undefined"){
        this.notePage = new NotePage({padding: 20, body: "", width: "50%"});
        this.$("#content").append(this.notePage.render().el);
        this.notePage.appendView(this.clips);
      }
    },

    highlightSelection: function(selection){
      var selObj = window.getSelection();
      var range = selObj.getRangeAt(0);
      var startIndex = _createInserter(true,range.cloneRange());
      var endIndex = _createInserter(false,range.cloneRange());
      var start = $("#start");
      var end = $("#end");
      var segments = [];
      var topOffset = 32;
      if(end.position().top == start.position().top){
        segments = [
          [start.position().left,start.position().top],
          [start.position().left,start.position().top+start.height()],
          [end.position().left,end.position().top+end.height()],
          [end.position().left,end.position().top]
        ];

      // in this case two paths need to be created since there is no intersecting
      //  highlight
      }else if(end.position().top >= start.position.top-start.height() &&
        end.position().left < start.position().left){
        segments = [
          [start.position().left,start.position().top],
          [start.position().left,start.position().top+start.height()],
          [this.$("#page-body").width(),start.position().top+start.height()],
          [this.$("#page-body").width(),start.position().top]
        ];

       new paper.Path({
        segments: [
          [this.$("#page-body").position().left,end.position().top+end.height()],
          [this.$("#page-body").position().left,end.position().top],
          [end.position().left,end.position().top+end.height()],
          [end.position().left,end.position().top]
        ],
        fillColor: 'yellow',
        closed: true
       });

      }else{
        segments = [
          [start.position().left,start.position().top],
          [start.position().left,start.position().top+start.height()],
          [end.position().left,end.position().top+end.height()],
          [end.position().left,end.position().top]
        ];
      }

      new paper.Path({
        segments: segments,
        fillColor: 'yellow',
        closed: true
      });
      
      start.remove();
      end.remove();
      
    },

    loadFragement: function(result){
      console.log("loading fragement");
      var page = this.page;
      result.done(function(fragement){
        page.appendDocumentFragement(fragement);
      });
    },

    loadFragementsComplete: function(result){
      this.$("#content").append(this.page.render().el);
      this.page.setSingleNote();
      this.page.calculatePages();
      var canvas = this.$("#page-overlay")[0];
      paper.setup(canvas);
    },

    events: {
      "click #notes a": "renderNotes"
    },


    addSelectionOptions: function(){
      App.trigger("add-option", new AddNoteOption().render().el);
      App.trigger("add-option", new CopyOption().render().el);
    },

    removeSelectionOptions: function(){
      App.trigger("remove-option", "copy");
      App.trigger("remove-option", "addnote");
    },


  });

  function _createInserter(isBefore, range) {
    var node;
    range.collapse(isBefore);
                                                                                                        
    // Range.createContextualFragment() would be useful here but is
    // non-standard and not supported in all browsers (IE9, for one)
    var el = document.createElement("div");
    var id = isBefore == true?"start":"end";
    el.innerHTML = "<span id='"+id+"'>|</span>";
    el.setAttribute("id",id);
    var frag = document.createDocumentFragment(), node, lastNode;
    while ( (node = el.firstChild) ) {
      lastNode = frag.appendChild(node);
    }
    range.insertNode(frag);
    return el;
  }

  return ReaderView

});
