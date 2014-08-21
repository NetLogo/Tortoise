module.exports = (grunt) ->

  massAlias =
    (glob, base) ->
      files = grunt.file.expand({ filter: 'isFile' }, glob)
      regex = new RegExp(".*?/" + base + "/(.*)\.js")
      splitter = (file) ->
        alias = file.match(regex)[1]
        "#{file}:#{alias}"
      files.map(splitter)

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
    browserify: {
      main: {
        src: ['target/classes/js/tortoise/bootstrap.js'],
        dest: 'target/classes/js/tortoise-engine.js',
        options: {
          alias: ["./node_modules/lodash/lodash.js:lodash", "./node_modules/mori/mori.js:mori"].concat(massAlias('./target/classes/js/tortoise/**/*.js', 'tortoise'))
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-rename')

  grunt.task.registerTask('fix_require', 'Changes "require" varname to "tortoise_require"', ->
    filepath    = './target/classes/js/tortoise-engine.js'
    strContents = grunt.file.read(filepath)
    grunt.file.write(filepath, "tortoise_#{strContents}")
    return
  )

  grunt.registerTask('default', ['coffee', 'browserify', 'fix_require'])
