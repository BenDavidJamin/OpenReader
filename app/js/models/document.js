define(["jquery", "underscore", "backbone"], function($, _, Backbone){
  var Document = Backbone.Model.extend({

    currentDocumentFragement: 0,
    documentFragementCount: 0,
    
    url: function(){
      return 'http://localhost:8001/documents/'+this.get("id");
    },


    getDocumentFragement: function(){
      var fragId = this.get('manifest')[this.currentDocumentFragement].id;
      return $.ajax({
        url: 'http://localhost:8001/documents/'+this.get('id')+"/files/content",
        data: { documentFragement: fragId } 
      });

    },

    getTitle: function(){
      if(!this.get("metadata")){
        return ""; 
      }
      return this.get("metadata")["dc:title"];
    },

    getAuthor: function(){
      if(!this.get("metadata")){
        return "";
      }
      return this.get("metadata")["dc:creator"];
    },

    getCover: function(){
      if(!this.get("guide"))
        return "";
      var href;
      var id;
      var guide = this.get("guide");
      var manifest = this.get("manifest");
      for(var i = 0;i<guide.length;i++){
        if(guide[i].type == "cover")
          href = guide[i].href;
      }
      for(var i = 0;i<manifest.length;i++){
        if(manifest[i].href == href)
          id = manifest[i].id;
      }
      
      console.log(href,id, this.get('id'), this.attributes);
      return $.ajax({
        url: 'http://localhost:8001/documents/'+this.get('_id')+"/files/images/"+id
      });

    },

    getStyle: function(){
     return $.ajax({
       url: 'http://localhost:8001/documents/'+this.get('id')+"/files/style"
     });
    }

  });

  return Document

});
