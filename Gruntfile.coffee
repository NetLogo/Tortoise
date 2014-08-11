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
          "./target/classes/js/tortoise-engine-cl.js": ["./target/classes/js/tortoise/**/*-cl.js", "./node_modules/closure-library/closure/goog/**/*.js"],
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
      "replace-with-cljs": {
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
      },
      "cljs-compile-auto": {
        command: "lein cljsbuild auto default",
        stdout: true
      },
      "closurificate": {
        command: "gulp closurify/all"
      },
      "cl-shiv": {
        command: "gulp closurify/replace"
      },
      "unshiv": {
        command: "git checkout src/main/coffee/bootstrap.coffee src/main/coffee/shim"
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
              dest + src_ext[0] + "-replaced-cl" + "." + src_ext[1]
          }
        ]
      },
      "import-cljs-core": {
        files: [
          {
            src: ["./target/cljsbuild-compiler-0/cljs/core.js"],
            dest: "./target/classes/js/tortoise/cljs/core-cl.js"
          }
        ]
      }
    },
    watch: {
      cljs: {
        files: ['src/**/*.{cljs,clj}'],
        tasks: ['exec:cljs-clean', 'exec:cljs-compile'],
        options: {
          interrupt: true # this should stop the task
                          # if files change during compile and
                          # restart with the most recent changes
                          # -- JTT (8/8/14)
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-requirejs')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-rename')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-closurecompiler')
  grunt.loadNpmTasks('grunt-exec')

  grunt.registerTask('default', ['coffee:compile', 'requirejs'])

  grunt.registerTask('cljs-compile', () ->
    tasks = ['exec:cljs-compile']
    if grunt.file.exists('./target/cljsbuild-compiler-0/cljs/core.js')
      tasks.unshift('exec:cljs-clean')
    grunt.task.run(tasks)
  )

  grunt.registerTask('replace', ['cljs-compile', 'exec:replace-with-cljs', "copy:import-cljs-core", 'closurecompiler:pretty'])
  grunt.registerTask('replace-all', ['cljs-compile', 'copy:replace-all-with-cljs', "copy:import-cljs-core", 'closurecompiler:pretty'])
  # this is LOTS slower, but more useful, than just exec:cljs-compile-auto -- JTT (8/8/14)
  grunt.registerTask('cljs-compile/auto', ['watch:cljs'])
  grunt.registerTask('catchup', ['exec:cl-shiv', 'coffee:compile', 'exec:unshiv', 'exec:closurificate', 'closurecompiler:pretty'])
