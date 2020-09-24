# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLType = require('./core/typechecker')
Tasks  = require('./prim/tasks')

{ find, map             } = require('brazierjs/array')
{ apply, flip, pipeline } = require('brazierjs/function')
{ fold                  } = require('brazierjs/maybe')

# type ExtensionPorter[T] = {
#   canHandle:      (Any) => Boolean,
#   dump:           (T) => String,
#   importState:    (T, (Any) => Any) => T
# }

extensionsHandler = (extensionPorters) ->
  extensionReferences = new Map()
  inProgressMarker    = Object.freeze({ type: "reify-in-progress" })

  {
    canHandle: (x) ->
      applicablePorters = extensionPorters.filter( (p) -> p.canHandle(x) )
      if applicablePorters.length > 1
        throw new Error("Multiple extensions claim to know how to handle this object type: #{JSON.stringify(x)}")
      (applicablePorters.length is 1)

    dump: (x, helper) ->
      if not extensionReferences.has(x)
        porter = extensionPorters.filter( (p) -> p.canHandle(x) )[0]
        extensionReferences.set(x, inProgressMarker)
        dumped = porter.dump(x, helper)
        extensionReferences.set(x, dumped)
        dumped

      else
        dumped = extensionReferences.get(x)
        if dumped is inProgressMarker
          throw new Error("Circular references within extension objects are not supported.")
        dumped

    reset: () ->
      extensionReferences.clear()
  }

# Needs a name here since it's recursive --JAB (4/16/14)
# (Array[ExtensionPorter]) => (Any, Boolean) => String
dump =
  (extensionPorters) ->
    extensions = extensionsHandler(extensionPorters)

    helper =
      (x, isReadable = false) ->
        type = NLType(x)
        if type.isList()
          itemStr = map((y) -> helper(y, isReadable))(x).join(" ")
          "[#{itemStr}]"
        else if type.isReporterLambda()
          "(anonymous reporter: #{x.nlogoBody})"
        else if type.isCommandLambda()
          "(anonymous command: #{x.nlogoBody})"
        else if type.isString()
          if isReadable then '"' + x + '"' else x
        else if type.isNumber()
          String(x).toUpperCase() # For scientific notation, handles correct casing of the 'E' --JAB (8/28/17)
        else if extensions.canHandle(x)
          extensions.dump(x, helper)
        else
          String(x)

    startDump = (x, isReadable) ->
      extensions.reset()
      helper(x, isReadable)

    startDump

module.exports = dump
