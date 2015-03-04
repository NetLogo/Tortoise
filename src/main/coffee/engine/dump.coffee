# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_      = require('lodash')
NLType = require('./core/typechecker')
Tasks  = require('./prim/tasks')

# Needs a name here since it's recursive --JAB (4/16/14)
# (Any, Boolean) => String
Dump =
  (x, isReadable = false) ->
    type = NLType(x)
    if type.isList()
      itemStr = _(x).map((y) -> Dump(y, isReadable)).value().join(" ")
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
