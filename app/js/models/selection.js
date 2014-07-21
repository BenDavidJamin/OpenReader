define(["jquery", "underscore", "backbone"], function($, _, Backbone){

  var Clip = Backbone.Model.extend({

    url: function(){
      return '/clips';
    },

    defaults: {
      "dataIndex": 0,
      "startXPath": "",
      "startOffset": 0,
      "endXPath": "",
      "endOffset": 0,
      "style": "",
      "color": "yellow",
      "text": "",
      "noteText": "",
      "selections": [],
      "documentId": "",
      "userId": ""
    }
  });

  return Clip; 
});
