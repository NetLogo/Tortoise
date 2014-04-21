module.exports = (grunt) ->

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      compile: {
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
    }
  })

  grunt.loadNpmTasks('grunt-contrib-requirejs')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-rename')

  grunt.registerTask('default', ['coffee', 'requirejs'])
