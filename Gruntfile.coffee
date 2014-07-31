module.exports = (grunt) ->

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      compile: {
        options: {
          bare: true
        },
        files: [
          {
            expand: true,
            cwd: 'src/main/coffee',
            src: ['**/*.coffee'],
            dest: 'target/classes/js/tortoise',
            ext: '.js'
          }
        ]
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: "target/classes/js/tortoise",
          mainConfigFile: "require-config.js",
          out: "target/classes/js/tortoise-engine.js",
          name: "bootstrap"
        }
      }
    },
    closurecompiler: {
      compile: {
        files: {
          "./target/classes/js/tortoise-engine-cl.js": ["./target/classes/js/tortoise/*-cl.js"]
        },
        options: {
          "compilation_level": "SIMPLE_OPTIMIZATIONS",
          "max_processes": 5,
          "Formatting": "PRETTY_PRINT"
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-requirejs')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-rename')

  grunt.registerTask('default', ['coffee', 'requirejs'])
  grunt.registerTask('cc', ['closurecompiler:pretty'])
