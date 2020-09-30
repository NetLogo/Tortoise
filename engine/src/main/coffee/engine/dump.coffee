# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLType = require('./core/typechecker')
Tasks  = require('./prim/tasks')

ExtensionsHandler = require('./core/world/extensionshandler')

{ find, map             } = require('brazierjs/array')
{ apply, flip, pipeline } = require('brazierjs/function')
{ fold                  } = require('brazierjs/maybe')

# Needs a name here since it's recursive --JAB (4/16/14)
# (Array[ExtensionPorter]) => (Any, Boolean) => String
dump =
  (extensionPorters) ->
    extensions = ExtensionsHandler.makeDumper(extensionPorters)

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
