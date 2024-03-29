module.exports = function(grunt) {
  //Do grunt-related things in here


  //grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-testem');

  //Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Pull in the npm install package for possible variables
    requirejs: {
      compile : {
        options : {
          appDir: "app",
          baseUrl: "js",
          dir: "production/app",
          name: 'main',
          mainConfigFile: 'app/js/main.js',

          //How to optimize all the JS files in the build output directory.
          optimize: "none",
          optimizeCss: 'standard',
          removeCombined:true,
        }
      }
    },

    stylus: {
      compile: {
        files: {
          'app/css/stylesheets/style.css': 'app/css/stylus/style.styl'
        }
      }
    },
    watch: {
      stylesheets: {
        files: ['app/css/stylus/*.styl'],
        tasks: ['stylus'],
        options: {
          interrupt: true
        }
      }
    },

    uglify: {
      my_target: {
        options: {
          output: {
            beautify: false
          },
          compress: {
              sequences: false,
              global_defs: {
                  DEBUG: false,
                  PRODUCTION: true
              }
          },
          warnings: true,
          mangle: false

        },

        files: {
          'production/app/js/main.js': ['production/app/js/main.js']
        }
      }
    },

    clean: [
      'production/app/tests',
      'production/app/testRunner.html',
      'production/app/css/sass',
      'production/app/css/config.rb'    
    ],

    jshint: {
      files: ['app/js/**/*.js']
    },

    testem: {

      options : {
        launch_in_ci: ["PhantonJS"]
      },

      main: {
        src: 'testem.json',
        dest: 'testem.tap'
      }
    },
    
    shell: {
      mongo: {
        command: "mongod"
      },

      postBuild:{
        options: {
          stdout: true
        },
        command: [
          'cd production',
          // save require.js but remove everything else in vendor dir
          'mv vendor/requirejs/require.js require.js',
          'rm -rf vendor',
          'mkdir -p vendor/requirejs',
          'mv require.js vendor/requirejs/require.js',
          // save main.js but remove everything else in js dir
          'mv js/main.js main.js',
          'rm -rf js',
          'mkdir js',
          'mv main.js js/main.js'
        ].join('&&')
      },
      copyServer: {
        command: [
          'cp server.js production/server.js',
          'cp package.json production/package.json',
          'cp bower.json production/bower.json',
          'cp -r config production/config',
          'cp -r node_modules production/node_modules'
        ].join('&&')
      }
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: 'app/js/.',
          outdir: 'apidocs/'
        }
      }
    }

  });
  grunt.registerTask('runNode', function(){
    grunt.util.spawn({
      cmd: 'node',
      args: ['./node_modules/nodemon/nodemon.js', 'index.js'],
      opts: {
        stdio: 'inherit'
      }
    }, function (){
      grunt.fail.fatal(new Error("nodemon quit"));
    });
  });

  grunt.registerTask('compile', ['stylus']);

  // Run the server and watch for file changes
  grunt.registerTask('run', ['runNode', 'watch']);

  grunt.registerTask('test', ['jshint', 'testem']);
  grunt.registerTask('default', ['requirejs', 'uglify', 'clean', 'shell:postBuild', 'shell:copyServer']);
};
