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
      var selection = new Selection(TextSelection.get());
      /* TODO add note dialoge to add a note about text */
      selection = _setSelectionDefaults(selection);
      this.$el.hide();
    },

    underline: function(evt){
      var selection = new Selection(TextSelection.underline());
      selection.set("style", "underline");
      selection = _setSelectionDefaults(selection);
      this.$el.hide();
    },

    copy: function(evt){
      var selection = new Selection(TextSelection.get());
      selection = _setSelectionDefaults(selection);
      this.$el.hide();
    },

    highlight: function(event){
      var selection = new Selection(TextSelection.highlight());
      selection.set("style", "highlight");
      selection = _setSelectionDefaults(selection);
      this.$el.hide();
    }

  });

  _setSelectionDefaults = function(selection){
    selection.set("dataIndex",_getDataIndex(selection.get("startXPath")));
    selection.set("documentId",App.currentDocument);
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
