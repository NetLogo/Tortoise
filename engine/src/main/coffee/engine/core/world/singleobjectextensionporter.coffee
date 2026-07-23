# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{
  ExportedExtensionObject
, ExportedSimpleExtension
} = require('../../../serialize/exportstructures')

{ exceptionFactory: exceptions } = require('util/exception')

porterStringRegEx = /{{(.+)\:(.*) (\d+)\:  ?(.+)}}/

# Reference implementation of the ExtensionPorter interface (documented in full in
# extensionshandler.coffee) for the common case of an extension with a single kind of
# object -- table, matrix, and array all use it directly.  It provides every method the
# world handler calls (dump/exportObject/export/format/read/importObject/import) by
# composing seven small per-object callbacks you supply, so an extension author only
# writes the object-level logic and never the collection-level plumbing (which, notably,
# already tolerates the empty-porter case -- `export([])` returns an empty extension,
# `format` of it returns "").
#
# To use: `new SingleObjectExtensionPorter(name, canHandle, dumpData, exportData,
# formatData, readData, importData)`.  To customize (e.g. a different printed form),
# extend it and override the composed method -- gis overrides `dump`.
#
# The seven constructor callbacks:
#   extensionName    String -- lower-case, matches the `extensions [ ... ]` entry
#   canHandle        (Any) => Boolean -- is this value one of our live objects?
#   dumpObjectData   (T, dumper) => String -- printed guts, wrapped as `{{name: <guts>}}`
#   exportObjectData (T, exportValue) => Any -- serializable data for one object
#   formatObjectData (ExportedData, formatAny) => String -- that data as export text
#   readObjectData   (String, parseAny) => Any -- parse export text back to that data
#   importObjectData (ExportedData, reify) => T -- reconstruct the live object (a valid
#                    NetLogo value -- see rule 2 in extensionshandler.coffee)
class SingleObjectExtensionPorter
  constructor: (
    @extensionName
  , @canHandle
  , @dumpObjectData
  , @exportObjectData
  , @formatObjectData
  , @readObjectData
  , @importObjectData
  ) ->

  dump: (extObj, dumper) ->
    "{{#{@extensionName}: #{@dumpObjectData(extObj, dumper)}}}"

  exportObject: (extObj, exportValue) ->
    new ExportedExtensionObject(@extensionName, "", @exportObjectData(extObj, exportValue))

  export: (objects) ->
    new ExportedSimpleExtension(@extensionName, objects)

  formatObject: (index, exportedObj, formatAny) ->
    "\"{{#{@extensionName}: #{index}: #{@formatObjectData(exportedObj, formatAny)}}}\""

  format: (exportedExt, formatAny) ->
    exportedExt.objects.map( (exportedObj, index) => @formatObject(index, exportedObj, formatAny) ).join("\n")

  readObject: (text, parseAny) ->
    new ExportedExtensionObject(@extensionName, "", @readObjectData(text, parseAny))

  readObjects: (porterStrings, helper) ->
    porterObjects = []
    porterStrings.forEach( (porterString) =>

      match = porterString.match(porterStringRegEx)
      if not match?
        throw exceptions.internal("Cannot read this extension object string: #{porterString}")

      extensionName = match[1]
      subType       = match[2] # ignored for an extension with only a single object sub-type
      index         = parseFloat(match[3])
      formattedData = match[4]

      if @extensionName isnt extensionName
        throw exceptions.internal("This extension porter (#{@extensionName}) does not match the extension object: #{porterString}")

      porterObject = @readObject(formattedData, helper)
      porterObjects[index] = porterObject
    )
    porterObjects

  read: (sectionLines, parseAny) ->
    new ExportedSimpleExtension(@extensionName, @readObjects(sectionLines, parseAny))

  importObject: (exportedExt, placeholder, reify) ->
    exportedObj = exportedExt.objects[placeholder.index]
    @importObjectData(exportedObj, reify)

  import: (_1, _2) ->

module.exports = SingleObjectExtensionPorter
