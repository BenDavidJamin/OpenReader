define(["jquery", "underscore", "backbone"], function($, _, Backbone){
  var Document = Backbone.Model.extend({

    currentDocumentFragement: 0,
    documentFragementCount: 0,
    
    url: function(){
      return '/documents/'+this.get("id");
    },


    /**
     * This method calls document fragements asyncly trigger events with 
     * the promise that is returned. 
     * On completion a 'loadFragementsComplete' event is fired. 
     */
    getDocumentFragements: function(){
      for(var i = 0;i<this.get('manifest').length; i++){
        var obj = this.get('manifest')[i];
        if(obj.mediaType == "application/xhtml+xml"){
          this.trigger("loadFragement", $.ajax({
              url: '/documents/'+this.get('id')+"/files/content",
              data: { documentFragement: obj.id} 
            }));
        }
      }
      this.trigger("loadFragementsComplete");
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
        url: 'documents/'+this.get('_id')+"/files/images/"+id
      });

    },

    getStyle: function(){
     return $.ajax({
       url: '/documents/'+this.get('id')+"/files/style"
     });
    }

  });

  return Document

});
