# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLType = require('./core/typechecker')
Tasks  = require('./prim/tasks')

{ map } = require('brazierjs/array')

# Needs a name here since it's recursive --JAB (4/16/14)
# (Any, Boolean) => String
Dump =
  (x, isReadable = false) ->
    type = NLType(x)
    if type.isList()
      itemStr = map((y) -> Dump(y, isReadable))(x).join(" ")
      "[#{itemStr}]"
    else if type.isReporterTask()
      "(reporter task)"
    else if type.isCommandTask()
      "(command task)"
    else if type.isString()
      if isReadable then '"' + x + '"' else x
    else
      String(x)

module.exports = Dump
