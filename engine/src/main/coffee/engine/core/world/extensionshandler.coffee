# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# type ExtensionPorter[T] = {
#   canHandle:      (Any) => Boolean,
#   dump:           (T, (Any) => String) => String,
#   exportState:    (T, (Any) => Any) => T,
#   importState:    (T, (Any) => Any) => T
# }

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
    throw new Error("Multiple extensions claim to know how to handle this object type: #{JSON.stringify(x)}")
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
        throw new Error("Circular references within extension objects are not supported.")
      extensionObject

  {
    traverse
  , extensionReferences
  }

# (String, Int) => ExtensionPlaceholder
createPlaceholder = (extensionName, index) ->
  {
    type: "extension-object-placeholder"
  , extensionName
  , index
  }

# (Any) => Boolean
isPlaceholder = (x) ->
  x.type? and x.type is "extension-object-placeholder"

# (ExtensionPlaceholder) => String
formatPlaceholder = (x) ->
  "{{#{x.extensionName}: #{x.index}}}"

# (Array[ExtensionPorter]) => ExtensionsDumper
makeDumper = (extensionPorters) ->
  dumpPorterObject = (porter, x, helper) ->
    "{{#{porter.extensionName}: #{porter.dump(x, helper)}}}"

  traverser = makeTraverse(extensionPorters, dumpPorterObject, canHandleCheck)

  {
    canHandle: makeCanHandle(extensionPorters, canHandleCheck)
    dump:      traverser.traverse
    reset:     () -> traverser.extensionReferences.clear()
  }

# (Array[ExtensionPorter]) => ExtensionsStateExport
makeStateExporter = (extensionPorters) ->
  # Map[ExtensionPorter, Array[Any]]
  extensionObjects = new Map()
  exportExtensionObject = (porter, x, helper) ->
    porterObjects = if not extensionObjects.has(porter)
      pos = []
      extensionObjects.set(porter, pos)
      pos

    porterObjects.push(porter.exportState(x, helper))
    createPlaceholder(porter.extensionName, porterObjects.length - 1)

  {
    canHandle:        makeCanHandle(extensionPorters, canHandleCheck)
    exportState:      makeTraverse(extensionPorters, exportExtensionObject, canHandleCheck).traverse
    extensionObjects: extensionObjects
  }

# (Array[ExtensionPorter]) => ExtensionsFormat
makeCsvFormatter = (extensionPorters) ->
  formatPlaceholderObject = (_1, x, _2) ->
    formatPlaceholder(x)

  formatPorterObject = (porter, x, helper) ->
    porter.formatCsv(x, helper)

  formatExtensionObjects = (extensionObjects, helper) ->
    # `sort()` to match the order desktop returns the extensions in -Jeremy B September 2020
    porters = Array.from(extensionObjects.keys())
    porters.sort( (p1, p2) -> p1.extensionName.localeCompare(p2.extensionName) )
    porterStrings = porters.map( (porter) ->
      objectsCSV = extensionObjects.get(porter).map( (x, index) ->
        "\"{{#{porter.extensionName}: #{index}: #{porter.formatCsv(x, helper)}}}\""
      ).join("\n")
      "\"#{porter.extensionName}\"\n#{objectsCSV}"
    )
    porterStrings.join("\n\n")

  {
    canHandle:         makeCanHandle(extensionPorters, eitherCheck)
    formatPlaceholder: makeTraverse(extensionPorters, formatPlaceholderObject, placeholderCheck).traverse
    formatExtensionObjects
  }

# (Array[ExtensionPorter], Map[ExtensionPorter, List[Any]]) => ExtensionsStateImport
makeStateImporter = (extensionPorters, extensionObjects) ->
  importedObjects = new Map()

  importExtensionObject = (porter, placeholder, helper) ->
    if importedObjects.has(placeholder)
      importedObjects.get(placeholder)
    else
      porterObjects   = extensionObjects.get(porter)
      extensionObject = porterObjects[placeholder.index]
      importedObject  = porter.importState(extensionObject, helper)
      importedObjects.set(placeholder, importedObject)
      importedObject

  {
    canHandle:   makeCanHandle(extensionPorters, placeholderCheck)
    importState: makeTraverse(extensionPorters, importExtensionObject, placeholderCheck).traverse
  }

module.exports = {
  makeDumper
  makeStateExporter
  makeCsvFormatter
  makeStateImporter
}
