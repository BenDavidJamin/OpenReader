module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['gruntfile.js', 'app/js/**/*.js', 'app/js/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          appDir: "app",
          paths: {
            'jquery': '../vendor/jquery/jquery',
            'underscore': '../vendor/underscore-amd/underscore',
            'backbone': '../vendor/backbone-amd/backbone',
            'handlebars': '../vendor/handlebars/handlebars',
            'async': '../vendor/async/lib/async'
          },
          dir: "build",
          name: 'main',
          mainConfigFile: 'app/js/main.js',
          optimizeCss: 'standard',

          //How to optimize all the JS files in the build output directory.
          optimize: "none"
        }
      }
    },

    uglify: {
      my_target: {
        files: {
          'build/js/main.js': ['build/js/main.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('default', ['jshint']);

  grunt.registerTask('build', ['requirejs', 'uglify']);


};