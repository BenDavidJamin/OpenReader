require.config({
  baseUrl: 'js',
  paths: {
    'jquery': '../vendor/jquery/jquery.min',
    'underscore': '../vendor/underscore/underscore',
    'backbone': '../vendor/backbone/backbone',
    'handlebars': '../vendor/handlebars/handlebars',
    'async': '../vendor/async/lib/async',
    'text': '../vendor/text/text',
    'jquery-ui-draggable': '../vendor/jquery-ui/ui/minified/jquery-ui.min',
    'text-selection': '../vendor/text-selection/app/js/TextSelection',
    'paperjs': '../vendor/paper/dist/paper-full'
  },
   shim: {

    'underscore': {
      exports: '_',
      deps: ['handlebars']
    },

    'backbone': {
      exports: 'Backbone',
      deps: ['underscore']
    },

    'handlebars': {
      exports: 'Handlebars'
    },


    'text-selection': {
      exports: 'TextSelection'
    }

  }
});

require(["router","text"],
  /**
   *
   * Initiates the router for the app.
   *
   */
  function(Router) {
    if (typeof DEBUG == 'undefined') DEBUG = true;
    if (typeof PRODUCTION == 'undefined') PRODUCTION = false;
    return new Router();
  }
);
