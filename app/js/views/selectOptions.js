define(['backbone', 'underscore', 'jquery', 'handlebars', 'app', 'models/selection', 'text!templates/selectOptions.html', 'text-selection'],
  function (Backbone, _, $, Handlebars, App, Selection,  SelectOptionsTemplate) {


  var SelectOptions = Backbone.View.extend({

    tagName: "div",

    className: "select-options",

    id: "select-options",

    template: Handlebars.compile(SelectOptionsTemplate),

    initialize: function(){ 
      this.position;
    },

    events: {
      "click #highlight": "highlight",
      "click #copy": "copy",
      "click #underline": "underline",
      "click #note": "note"
    },


    setLocation: function(position){
      this.$el.css("left", position.left);
      this.$el.css("top", position.top);
      this.$el.css("position","absolute");
    },

    setRange: function(range){
      this.range = range;
      this.$el.show();
      TextSelection.setRange(range);
      console.log("set Range: ",range);
    },

    render: function(){
      this.$el.html(this.template());  
      var top = parseInt(this.$el.css("top"),10)-this.$el.height();
      this.$el.css("top",top);

      return this;
    },

    note: function(evt){
      console.log(TextSelection.get());
      var selection = new Selection(TextSelection.get());
      /* TODO add note dialoge to add a note about text */
      _setSelectionDefaults(selection);
      this.$el.hide();
    },

    copy: function(evt){
      console.log(TextSelection.get());
      var selection = new Selection(TextSelection.get());
      _setSelectionDefaults(selection);
      this.$el.hide();
    },

    highlight: function(evt){
      var selection = new Selection(TextSelection.get());
      selection.set("style", "highlight");
      _setSelectionDefaults(selection);
      App.trigger("highlight-selection",TextSelection.get());
      this.$el.hide();
    }

  });

  _setSelectionDefaults = function(selection){
    selection.set("dataIndex",_getDataIndex(selection.get("startXPath")));
    selection.set("documentId",App.currentDocument.get('_id'));
    selection.set("author",App.currentDocument.getAuthor());
    selection.set("userId", App.currentUser);
    selection.save();
  }
  
  

  _getDataIndex = function(path){
    var node = $(document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue); 
    while(typeof node.data("index") == "undefined" && node.prop("tagName") != "BODY"){
      node = node.parent();
    }
    return node.data("index");
  }

  return SelectOptions;

});
