define(['backbone', 'underscore', 'jquery', 'handlebars', 'text!templates/document.html'],
  function (Backbone, _, $, Handlebars,  DocumentTemplate) {


  var Document = Backbone.View.extend({

    tagName: "div",

    template: Handlebars.compile(DocumentTemplate),

    initialize: function(attributes){
      _.bindAll(this,"getImage");
      this.document = attributes.document;
    },

    render: function(){
      this.$el.html(this.template({
        title: this.document.getTitle(),
        author: this.document.getAuthor()
      }));
      this.model.getCover()
        .done(
          this.getImage
        );

      return this;
    },

    getImage: function(result){
      this.$(".document-image")[0].src = "data:image/jpeg;base64,"+result;
    }




  });

  return Document;

});
