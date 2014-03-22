define(['jquery', 'underscore', 'backbone'], function($, _, Backbone){

  var app = {

    // either portrate or landscape
    screenOrientation: "portrate",

    clipboard: [],

    //If the screenOrientation is landscape
    // you can display the notes associated with the current page. 
    showNotationPage: "false"

  };
  
  return _.extend(app, {}, Backbone.Events);


});
