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
            src: ['**/*.coffee', '!**/*-cl.coffee'],
            dest: 'target/classes/js/tortoise',
            ext: '.js'
          }
        ]
      },
      "cc-compile": {
        options: {
          bare: true
        },
        files : [
          {
            expand: true,
            cwd: 'src/main/coffee',
            src: ['**/*-cl.coffee']
            dest: 'target/classes/js/tortoise',
            ext: '-gen.js'
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
      pretty: {
        files: {
          "./target/classes/js/tortoise-engine-cl.js": ["./target/classes/js/tortoise/**/*-gen.js"]
        },
        options: {
          "closure_entry_point": "bootstrap",
          "process_closure_primitives": "true",
          "manage_closure_dependencies": "true",
          "compilation_level": "SIMPLE_OPTIMIZATIONS",
          "max_processes": 5,
          "formatting": "PRETTY_PRINT",
          "output_wrapper_file": "anon-fun-wrapper.js"
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-requirejs')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-rename')
  grunt.loadNpmTasks('grunt-closurecompiler')

  grunt.registerTask('default', ['coffee:compile', 'requirejs'])
  grunt.registerTask('cc', ['coffee:cc-compile', 'closurecompiler:pretty'])
