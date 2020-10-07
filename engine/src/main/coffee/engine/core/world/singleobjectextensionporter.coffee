# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{
  ExportedExtensionObject
, ExportedSimpleExtension
} = require('../../../serialize/exportstructures')

porterStringRegEx = /{{(.+)\:(.*) (\d+)\:  ?(.+)}}/

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
        throw new Error("Cannot read this extension object string: #{porterString}")

      extensionName = match[1]
      subType       = match[2] # ignored for an extension with only a single object sub-type
      index         = parseFloat(match[3])
      formattedData = match[4]

      if @extensionName isnt extensionName
        throw new Error("This extension porter (#{@extensionName}) does not match the extension object: #{porterString}")

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
