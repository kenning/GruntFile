module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Building

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['./client/dist/app.js'],
        dest: './client/dist/<%= pkg.name %>.js'
      }
    },

    uglify: {
      dist: {
        files: {
          './client/dist/<%= pkg.name %>.min.js' : ['<%= concat.dist.dest %>']
        }
      }
    },

    cssmin: {
      target: {
        files: {
          './client/styles/styles.min.css' : ['./client/styles/styles.css']
        }
      }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer-core')({browsers: 'last 2 versions'}).postcss
        ]
      },
      dist: {
        src: 'cssmin/*.css'
      }
    },

    react: {
      files: {
        'client/dist/app.js': [
          'client/components/app.jsx'
        ]
      }
    },

    // Testing

    jshint: {
      files: ['./dist/<%= pkg.name %>.min.js'],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'client/bower_components/**/*.js',
          'client/dist/**/*.js'
        ]
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    // Watching

    watch: {
      scripts: {
        files: [
          'client/dist/*.js',
          'client/components/*.jsx'
        ],
        tasks: [
          'react',
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'client/*.css',
        tasks: ['cssmin']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    // Deploying

    shell: {
      prodServer: {
        command: 'git push origin master',
        options: {
            stdout: true,
            stderr: true
        }
      },

      herokuDeploy: {
        command: 'git push heroku master',
        options: {
            stdout: true,
            stderr: true
        }
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-react');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest','jshint'
  ]);

  grunt.registerTask('build', [
    'react', 'concat','uglify','postcss','cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run(['shell:prodServer'])
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', 
    function(n) {
      grunt.task.run(['shell:herokuDeploy'])
    }
  );
};
