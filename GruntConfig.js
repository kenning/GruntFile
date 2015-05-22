/*# GruntFile*/

  // "dependencies": {
  //   "mocha": "^1.17.1",
  //   "chai": "^1.9.0",
  //   "grunt": "^0.4.4",
  //   "grunt-contrib-jshint": "^0.9.2",
  //   "grunt-contrib-concat": "^0.3.0",
  //   "grunt-contrib-uglify": "^0.4.0",
  //   "grunt-contrib-watch": "^0.6.1",
  //   "grunt-shell": "^0.6.4",
  //   "grunt-contrib-cssmin": "^0.9.0",
  //   "grunt-nodemon": "^0.2.1",
  //   "grunt-mocha-test": "^0.10.0",
  // },
  // "devDependencies": {
  //   "supertest": "^0.10.0"
  // },
  // "scripts": {
  //   "start": "node server.js"
  // }

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      
      options: {
        separator: ';'
      },

      dist: {
        src: ['./public/**/*.js'],
        dest: './public/dist/<%= pkg.name %>.js'
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

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      dist: {
        files: {
          './public/dist/<%= pkg.name %>.min.js' : ['<%= concat.dist.dest %>']
        }
      }
    },

    jshint: {
      files: ['./dist/<%= pkg.name %>.min.js'],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      target: {
        files: {
          './public/dist/style.min.css' : ['./public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

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
    'concat','uglify'
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
