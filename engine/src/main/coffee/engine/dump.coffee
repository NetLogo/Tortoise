# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLType = require('./core/typechecker')
Tasks  = require('./prim/tasks')

{ find, map             } = require('brazierjs/array')
{ apply, flip, pipeline } = require('brazierjs/function')
{ fold                  } = require('brazierjs/maybe')

# type ExtensionDumper = { canDump: (Any) => Boolean, dumper: (Any) => String }

# Needs a name here since it's recursive --JAB (4/16/14)
# (Array[ExtensionDumper]) => (Any, Boolean) => String
dump =
  (extensionDumpers) ->
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
        else
          pipeline(find((d) -> d.canDump(x)), fold(-> String)((d) -> d.dump), flip(apply)(x))(extensionDumpers)
    helper

module.exports = dump
