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
          "./target/classes/js/tortoise-engine-cl.js": ["./target/classes/js/tortoise/**/*-gen.js", "./node_modules/closure-library/closure/goog/**/*.js"]
        },
        options: {
          "closure_entry_point": "bootstrap",
          "process_closure_primitives": "true",
          "manage_closure_dependencies": "true",
          "compilation_level": "SIMPLE_OPTIMIZATIONS",
          "max_processes": 5,
          "formatting": "PRETTY_PRINT",
          "output_wrapper_file": "./client/anon-fun-wrapper.js",
          "only_closure_dependencies": "true"
        }
      }
    },
    exec: {
      "transfer-cljs-core": {
        command: "cp ./target/cljsbuild-compiler-0/cljs/core.js ./target/classes/js/tortoise/cljs/core-gen.js"
      },
      "replace-with-cljs": {
        #grunt.fail.warn("not enough information given\r\n" +
        #                "please use flags \"--files=\"{files}\"" +
        #                " and \"--to={output_directory\" to specify enough information."})
        command: "cp ./target/cljsbuild-compiler-0/" + (grunt.option('file') || '**/*.js') +
                 " ./target/classes/js/tortoise/" + (grunt.option('to') || "" + grunt.option('file')),
        stdout: true
      },
      "cljs-clean": {
        command: "lein cljsbuild clean"
      },
      "cljs-compile": {
        command: "lein cljsbuild once default",
        stdout: true
      }
    },
    copy: {
      "replace-all-with-cljs": {
        files: [
          {
            expand: true,
            src: ["./target/cljsbuild-compiler-0/**/*.js"],
            dest: "./target/classes/js/tortoise/",
            rename: (dest, src) ->
              src_ext = src.split('/cljsbuild-compiler-0/')[1].split('.')
              grunt.log.warn(src_ext)
              dest + src_ext[0] + "-cl-gen" + "." + src_ext[1]
          }
        ]
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-requirejs')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-rename')
  grunt.loadNpmTasks('grunt-closurecompiler')
  grunt.loadNpmTasks('grunt-exec')

  grunt.registerTask('default', ['coffee:compile', 'requirejs'])
  grunt.registerTask('cc', ['coffee:cc-compile', 'closurecompiler:pretty'])

  grunt.registerTask('cljs-compile', () ->
    tasks = ['exec:cljs-compile']
    if grunt.file.exists('./target/cljsbuild-compiler-0/cljs/core.js')
      tasks.unshift('exec:cljs-clean')
    grunt.task.run(tasks)
  )
  grunt.registerTask('replace', ['cljs-compile', 'exec:replace-with-cljs', 'closurecompiler:pretty'])
  grunt.registerTask('replace-all', ['cljs-compile', 'copy:replace-all-with-cljs', 'closurecompiler:pretty'])
  grunt.registerTask('unreplace', ['cc'])
