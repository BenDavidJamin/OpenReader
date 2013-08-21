require.config({
  baseUrl: 'js',
  paths: {
    'jquery': '../vendor/jquery/jquery.min',
    'underscore': '../vendor/underscore-amd/underscore',
    'backbone': '../vendor/backbone-amd/backbone-min',
    'handlebars': '../vendor/handlebars//handlebars',
    'async': '../vendor/async/lib/async',
    'text': '../vendor/text/text',
    'jquery-ui-draggable': '../vendor/jquery-ui-custom/jquery-ui-1.10.2.custom.min',
    'text-selection': '../vendor/text-selection/text-selection'
  },
   shim: {
    'handlebars': {
      exports: 'Handlebars'
    },

    'underscore': {
      deps: ['handlebars']
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
