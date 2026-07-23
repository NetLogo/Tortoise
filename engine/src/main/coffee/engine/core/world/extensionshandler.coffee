# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# An extension "porter" teaches the world how to dump (for `print`/`show`), export (world
# save), and import (world load and recompile) the custom objects an extension creates --
# tables, matrices, gis datasets, and so on.  Each loaded extension that has such objects
# registers one porter (via its `porter` export); the `make*` functions below fan a single
# operation out across every registered porter.
#
# An extension object moves through three lifecycles, each a per-object hook paired with a
# once-per-porter collection hook:
#
#   print / show / word        dump
#   export-world               exportObject (per object)  ->  export + format (per porter)
#   import-world / recompile    read (per porter)  ->  importObject (per object) + import
#
# Two rules are easy to get wrong (both have caused crashes):
#
#   1. The COLLECTION hooks -- export, format, read, import -- run for EVERY registered
#      porter on every world export/import/recompile, even when that extension currently
#      has no live objects.  They must handle the empty case without throwing (e.g.
#      `export([])` returns an empty ExportedExtension, `format` of it returns "").  Only
#      the PER-OBJECT hooks (exportObject, dump, importObject) are handed an actual object,
#      so those may assume one exists (and may throw if the object cannot be serialized).
#
#   2. `importObject` must return a valid NetLogo value -- number, string, boolean, list,
#      agent, agentset, Nobody, or a live extension object -- because it becomes the value
#      of the agent variable / global that referenced it.  Returning null/undefined is not
#      a valid NetLogo value and will break the importer's later handling of reified
#      objects.  If an object cannot be reconstructed, return Nobody.
#
# The porter interface consumed by this module (SingleObjectExtensionPorter implements all
# of it for the common "one object sub-type" extension -- extend it and override only the
# parts that differ, e.g. `dump` when the printed form is not the default `{{name: data}}`):
#
#   extensionName: String
#     Lower-case name, matching the `extensions [ ... ]` declaration.
#
#   canHandle: (Any) => Boolean
#     True iff `x` is one of THIS extension's live objects; false for everything else
#     (other extensions' objects, placeholders, ordinary Logo values).  Exactly one porter
#     may claim any given value.
#
#   dump: (T, dumper: (Any) => String) => String
#     The object's printed form (`print`/`show`/`word`).  `dumper` recursively dumps nested
#     values.
#
#   exportObject: (T, exportValue: (Any) => Any) => ExportedExtensionObject
#     Serialize one live object for a world save.  `exportValue` recursively exports nested
#     values (agents -> references, nested extension objects -> placeholders).  The result's
#     `subType` names the object kind within the extension ("" when there is only one kind).
#
#   export: (Array[ExportedExtensionObject]) => ExportedExtension
#     Bundle this porter's exported objects into the extension's world-save section; called
#     once per porter, with [] when the extension has no objects.
#
#   format: (ExportedExtension, formatAny: (Any) => String) => String
#     Render the section to the text that lands in the world-export file; return "" for an
#     empty section (it is then omitted).  `formatAny` formats nested values.
#
#   read: (section, parseAny: (String) => Any) => ExportedExtension
#     Inverse of `format`: parse a world-save section back into an ExportedExtension.
#     `parseAny` parses nested value strings.
#
#   importObject: (ExportedExtension, ExtensionPlaceholder, reify: (Any) => Any) => T
#     Reconstruct one live object from its placeholder during import.  `reify` turns nested
#     references/placeholders back into live values.  See rule 2 about the return value.
#
#   import: (ExportedExtension, Array[T]) => Unit
#     Final per-porter hook, run after all objects are reified, for any extension-wide
#     fix-up; usually a no-op.  Called with [] when there are no objects.
#
# ExportedExtension and ExportedExtensionObject are defined in serialize/exportstructures;
# a placeholder is the object `{{extensionName:subType index}}` (see `formatPlaceholder`).
# canHandle and the per-object hooks are dispatched through `makeTraverse`, which also
# rejects circular references between extension objects.

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
  # `exportObject` populates `extensionObjects` only for porters whose objects were
  # actually reached during the traversal; this still calls `export` on EVERY porter (with
  # [] for the rest), so every porter's `export` must tolerate an empty list -- see rule 1.
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

  # Runs after every placeholder has been reified.  Calls `import` on EVERY porter (see
  # rule 1); `objects` is that porter's reified objects, so each must be a real object with
  # an `extensionName` -- a null reified value (rule 2) would blow up this filter.
  importExt = () ->
    extensionPorters.forEach( (porter) ->
      state   = extensionExports.get(porter)
      objects = Array.from(importedObjects.values()).filter( (eo) -> eo.extensionName is porter.extensionName )
      porter.import(state, objects)
    )

  {
    canHandle:    makeCanHandle(extensionPorters, placeholderCheck)
    importObject: makeTraverse(extensionPorters, importObject, placeholderCheck).traverse
    importState:  importExt
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
