# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# type ExtensionPorter[T] = {
#   canHandle: (Any) => Boolean,

#   dump: (T, (Any) => String) => String,

#   exportObject: (T, (Any) => Any) => ExportedExtensionObject,
#   export:       (Array[ExportedExtensionObject]) => ExportedExtension

#   format:       (ExportedExtension, (Any) => String) => String
#   formatObject: (ExportedExtensionObject, (Any) => String) => String

#   readObject: (String, String, (String) => Any) => ExportedExtensionObject
#   read:       (String, (String) => Any) => ExportedExtension

#   import:       (ExportedExtension, (Any) => Any) => Unit
#   importObject: (ExportedExtension, ExtensionPlaceholder, (Any) => Any)) => T

# }

{ exceptionFactory: exceptions } = require('util/exception')

# (ExtensionPorter, Any) => Boolean
canHandleCheck = (p, x) ->
  p.canHandle(x)

# (ExtensionPorter, Any) => Boolean
placeholderCheck = (p, x) ->
  isPlaceholder(x) and p.extensionName is x.extensionName

# (ExtensionPorter, Any) => Boolean
eitherCheck = (p, x) ->
  canHandleCheck(p, x) or placeholderCheck(p, x)

# (Array[ExtensionPorter], (ExtensionPorter, Any) => Boolean) => (Any) => Boolean
makeCanHandle = (extensionPorters, check) -> (x) ->
  applicablePorters = extensionPorters.filter( (p) -> check(p, x) )
  if applicablePorters.length > 1
    throw exceptions.internal("Multiple extensions claim to know how to handle this object type: #{JSON.stringify(x)}")
  (applicablePorters.length is 1)

# (Array[ExtensionPorter], (ExtensionPorter, Any, (Any) => Any) => Any) => ExtensionsHandler
makeTraverse = (extensionPorters, objectHandler, check) ->
  extensionReferences = new Map()
  inProgressMarker    = Object.freeze({ type: "operation-in-progress" })

  # (Any, (Any) => Any) => Any
  traverse = (x, helper) ->
    if not extensionReferences.has(x)
      porter = extensionPorters.filter( (p) -> check(p, x) )[0]
      extensionReferences.set(x, inProgressMarker)
      extensionObject = objectHandler(porter, x, helper)
      extensionReferences.set(x, extensionObject)
      extensionObject

    else
      extensionObject = extensionReferences.get(x)
      if extensionObject is inProgressMarker
        throw exceptions.internal("Circular references within extension objects are not supported.")
      extensionObject

  {
    traverse
  , extensionReferences
  }

# (String, String, Int) => ExtensionPlaceholder
createPlaceholder = (extensionName, subType, index) ->
  {
    type: "extension-object-placeholder"
  , extensionName
  , subType
  , index
  }

# (Any) => Boolean
isPlaceholder = (x) ->
  x.type? and x.type is "extension-object-placeholder"

# (ExtensionPlaceholder) => String
formatPlaceholder = (x) ->
  "{{#{x.extensionName}:#{x.subType} #{x.index}}}"

# (Array[ExtensionPorter]) => ExtensionsDumper
makeDumper = (extensionPorters) ->
  dumpPorterObject = (porter, x, helper) ->
    porter.dump(x, helper)

  traverser = makeTraverse(extensionPorters, dumpPorterObject, canHandleCheck)

  {
    canHandle: makeCanHandle(extensionPorters, canHandleCheck)
    dump:      traverser.traverse
    reset:     () -> traverser.extensionReferences.clear()
  }

# (Array[ExtensionPorter]) => ExtensionsExporter
makeExporter = (extensionPorters) ->
  # Map[ExtensionPorter, Array[ExportedExtensionObject]]
  extensionObjects = new Map()
  exportObject = (porter, x, helper) ->
    porterObjects = if not extensionObjects.has(porter)
      pos = []
      extensionObjects.set(porter, pos)
      pos
    else
      extensionObjects.get(porter)

    porterObject = porter.exportObject(x, helper)
    porterObjects.push(porterObject)
    createPlaceholder(porter.extensionName, porterObject.subType, porterObjects.length - 1)

  # () => Map[ExtensionPorter, ExportedExtension]
  exportExt = () ->
    extensionStates = new Map()
    extensionPorters.forEach( (porter) ->
      porterObjects = extensionObjects.get(porter)
      extensionStates.set(porter, porter.export(porterObjects ? []))
    )
    extensionStates

  {
    canHandle:    makeCanHandle(extensionPorters, canHandleCheck)
    exportObject: makeTraverse(extensionPorters, exportObject, canHandleCheck).traverse
    export:       exportExt
  }

# (Array[ExtensionPorter]) => ExtensionsFormatter
makeFormatter = (extensionPorters) ->
  formatPlaceholderObject = (_1, x, _2) ->
    formatPlaceholder(x)

  # (Map[ExtensionPorter, ExportedExtension], (Any) => String) => String
  format = (extensionExports, helper) ->
    porters = Array.from(extensionExports.keys())
    # `sort()` to match the order desktop returns the extensions in -Jeremy B September 2020
    porters.sort( (p1, p2) -> p1.extensionName.localeCompare(p2.extensionName) )
    porterStrings = porters.map( (porter) ->
      extensionCSV = porter.format(extensionExports.get(porter), helper)
      if extensionCSV.trim() is ''
        ''
      else
        "\"#{porter.extensionName}\"\n#{extensionCSV}"
    )
    porterStrings.filter( (str) -> str isnt '' ).join("\n\n")

  {
    canHandle:         makeCanHandle(extensionPorters, eitherCheck)
    formatPlaceholder: makeTraverse(extensionPorters, formatPlaceholderObject, placeholderCheck).traverse
    format
  }

# (Array[ExtensionPorter], Map[ExtensionPorter, ExportedExtension]) => ExtensionsImporter
makeImporter = (extensionPorters, extensionExports) ->
  importedObjects = new Map()

  importObject = (porter, placeholder, helper) ->
    if importedObjects.has(placeholder)
      importedObjects.get(placeholder)
    else
      exportedExt     = extensionExports.get(porter)
      importedObject  = porter.importObject(exportedExt, placeholder, helper)
      importedObjects.set(placeholder, importedObject)
      importedObject

  importState = (porter) ->
    porter.import(extensionExports.get(porter) ? {})

  {
    canHandle:    makeCanHandle(extensionPorters, placeholderCheck)
    importObject: makeTraverse(extensionPorters, importObject, placeholderCheck).traverse
    importState:  () => extensionPorters.forEach(importState)
  }

placeholderRegEx = /{{(.+)\:(.*) (\d+)}}/

# (Array[ExtensionPorter]) => ExtensionsReader
makeReader = (extensionPorters) ->
  matchesPlaceholder = (x) ->
    x.match(placeholderRegEx)

  readPlaceholder = (match) ->
    createPlaceholder(match[1], match[2], parseFloat(match[3]))

  extensionNames = extensionPorters.map( (porter) -> porter.extensionName.toUpperCase() )

  readExtensions = (porterSections, parseAny) ->
    extensionExps = new Map()
    Object.keys(porterSections).forEach( (extensionName) ->

      possiblePorters = extensionPorters.filter( (porter) -> porter.extensionName is extensionName )
      if possiblePorters.length is 0
        throw exceptions.internal("No extension porter found for this thing?")
      if possiblePorters.length > 1
        throw exceptions.internal("Multiple extension porters found for this thing?")

      porter       = possiblePorters[0]
      section      = porterSections[extensionName]
      extensionExp = porter.read(section, parseAny)
      extensionExps.set(porter, extensionExp)
    )
    extensionExps

  {
    matchesPlaceholder
  , readPlaceholder
  , extensionNames
  , readExtensions
  }

module.exports = {
  makeDumper
  makeExporter
  makeFormatter
  makeImporter
  makeReader
}
