'use strict';

module.exports = function(grunt) {
  
  // configure the tasks
  grunt.initConfig({
    
    copy: {
      build: {
        files: [
          {
            cwd: 'bower_components',
            src: [ '**/*.min.js' ],
            dest: 'build/js',
            expand: true,
            flatten: true
          },
          {
            cwd: 'src',
            src: [ '**', '!tpl', '!**/*.styl', '!**/*.coffee', '!**/*.jade', '!**/*.json' ],
            dest: 'build',
            expand: true
          }
        ]
      }
    },

    clean: {
      build: {
        src: [ 'build/**' ]
      },
      stylesheets: {
        src: [ 'build/**/*.css', '!build/css/style.css' ]
      },
      scripts: {
        src: [ 'build/**/*.js', '!build/js/script.js', '!build/**/*.min.js' ]
      },
    },

    stylus: {
      build: {
        options: {
          linenos: true,
          compress: false
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: [ '**/*.styl' ],
          dest: 'build',
          ext: '.css'
        }]
      }
    },
    
    autoprefixer: {
      build: {
        expand: true,
        cwd: 'build',
        src: [ '**/*.css' ],
        dest: 'build'
      }
    },

    cssmin: {
      build: {
        files: {
          'build/css/style.css': [ 'build/css/*.css' ]
        }
      }
    },

    coffee: {
      build: {
        expand: true,
        cwd: 'src',
        src: [ '**/*.coffee' ],
        dest: 'build/js',
        ext: '.js'
      }
    },
    
    uglify: {
      build: {
        options: {
          mangle: false
        },
        files: {
          'build/js/script.js': [ 'build/**/*.js', '!build/**/*.min.js' ]
        }
      }
    },
    
    jade: {
      compile: {
        options: {
          data: function(dest, src) {
            return require('./src/content.json');
          }
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: [ '**/*.jade' ],
          dest: 'build',
          ext: '.html'
        }]
      }
    },
    
    watch: {
      stylesheets: {
        files: 'src/**/*.styl',
        tasks: [ 'stylesheets' ]
      },
      scripts: {
        files: 'src/**/*.coffee',
        tasks: [ 'scripts' ]
      },
      jade: {
        files: [ 'src/**/*.jade', 'src/**/*.json' ],
        tasks: [ 'jade' ],
        options: {
          livereload: true,
        },
      },
      copy: {
        files: [ 'src/**', '!src/**/*.styl', '!src/**/*.coffee', '!src/**/*.jade' ],
        tasks: [ 'copy' ]
      }
    },

    connect: {
      server: {
        options: {
          port: 9000,
          base: 'build',
          hostname: '*'
        }
      }
    }

    
  });

  // load the tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');


  // define the tasks
  grunt.registerTask(
    'stylesheets', 
    'Compiles the stylesheets.', 
    [ 'stylus', 'autoprefixer', 'cssmin', 'clean:stylesheets' ]
  );
  
  grunt.registerTask(
    'scripts', 
    'Compiles the JavaScript files.', 
    [ 'coffee', 'uglify', 'clean:scripts' ]
  );
  
  grunt.registerTask(
    'build', 
    'Compiles all of the assets and copies the files to the build directory.', 
    [ 'clean:build', 'copy', 'stylesheets', 'scripts', 'jade' ]
  );
  
  grunt.registerTask(
    'default', 
    'Watches the project for changes, automatically builds them and runs a server.', 
    [ 'build', 'connect', 'watch' ]
  );

};
