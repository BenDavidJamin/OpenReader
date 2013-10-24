define(['backbone', 'underscore', 'jquery', 'text!templates/new.html'],
  function (Backbone, _, $, NewTemplate) {

    var NewDocument = Backbone.View.extend({

      //tag type of uploader
      tagName: "div",

      files: [],

      url: "documents",

      template: Handlebars.compile(NewTemplate),

      initialize: function(){

      },

      render: function(){
        this.$el.html(this.template());

        return this;
      },

      events: {
        "change #file": "fileSelect",
        "click #upload": "upload"
      },

      fileSelect: function(e){
        this.files = e.target.files;
      },

      upload: function(e){
        e.preventDefault();
        var xhr;
        var file;
        var formData;
        var self = this;

        if(!this.files.length > 0){
          alert("No files to upload.");
          return;
        }

        for(var i = 0; i < this.files.length; i++){

          file = this.files[i];
          console.log(file);

          xhr = new XMLHttpRequest();
                    
          xhr.addEventListener("load", transferComplete, false);
          xhr.addEventListener("error", transferFailed, false);
          xhr.addEventListener("abort", transferCanceled, false);

          function transferComplete(evt) {
            alert("The transfer is complete.");
          }

          function transferFailed(evt) {
            alert("An error occurred while transferring the file.");
          }

          function transferCanceled(evt) {
            alert("The transfer has been canceled by the user.");
          }

          xhr.open("POST", self.url);

          // Attach the fileId to the xhr obj so that we now which file the callback
          // events are assoicated with when they get triggered
          xhr.fileId = file.name;
          //xhr.upload.fileId = file.fileId; //THIS DIDN'T WORK - see notes in _uploadProgress()

          formData = new FormData();
          formData.append("files", file)
          //note: the server is expecting a form field name of files[]

          xhr.send(formData);
        }
      }

    });

    return NewDocument;
  });
