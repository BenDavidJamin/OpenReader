define([
  'jquery',
  'underscore',
  'backbone',
  'models/document'
], function($, _, Backbone){

  var Clips = Backbone.Collection.extend({

    initialize: function(attributes){
      this.docId = typeof attributes != "undefined"?attributes.id:"";
    },
    
    url: function(){
      return 'documents/'+this.docId+'/clips';
    },

    parse: function(response){
      return response;
    }
    
  });

  return Clips;
});
