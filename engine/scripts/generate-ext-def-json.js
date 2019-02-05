'use strict'

// Just run `node scripts/generate-ext-def-json.js` from the `engine` directory and this will generate some strings
// to stuff into the `ExtDefReader.scala` for `compilerJS`.  -JMB Feb 2019

var fs = require( 'fs' )
var path = require( 'path' )

var extensionFiles = fs.readdirSync( "./src/main/coffee/extensions/" )
var json = extensionFiles
    .filter( ( extensionFile ) => path.extname(extensionFile) === ".json" )
    .sort( ( f1, f2 ) => f1 < f2 )
    .map( ( extensionFile ) => {
      var file = fs.readFileSync(`./src/main/coffee/extensions/${extensionFile}`, "utf8").trim()
      return `"""${file}"""`
    })

fs.writeFileSync('./target/ext-def.json', json.join(",\n"), { encoding: "utf8", flag: "w" })
