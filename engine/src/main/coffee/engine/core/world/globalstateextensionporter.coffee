# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{
  ExportedExtensionObject
, ExportedStatedExtension
} = require('../../../serialize/exportstructures')

{ exceptionFactory: exceptions } = require('util/exception')

SingleObjectExtensionPorter = require('./singleobjectextensionporter')

class GlobalStateExtensionPorter extends SingleObjectExtensionPorter
  constructor: (
    @extensionName
  , @exportGlobalState
  , @formatGlobalState
  , @readGlobalState
  , @importGlobalState
  , @canHandle
  , @dumpObjectData
  , @exportObjectData
  , @formatObjectData
  , @readObjectData
  , @importObjectData
  ) ->
    super()
    @canHandle = (any) -> false if not @canHandle

  export: (objects) ->
    new ExportedStatedExtension(@extensionName, @exportGlobalState(), objects)

  format: (exportedExt, formatAny) ->
    mapped = exportedExt.objects.map( (exportedObj, index) => @formatObject(index, exportedObj, formatAny) )
    mapped.unshift(@formatGlobalState(exportedExt.state))
    mapped.join("\n")

  read: (sectionLines, parseAny) ->
    new ExportedStatedExtension(@extensionName, @readGlobalState(sectionLines), @readObjects(sectionLines.slice(1), parseAny))

  import: (exportedExt) ->
    if exportedExp isnt null
      @importGlobalState(exportedExt.state)

module.exports = GlobalStateExtensionPorter
