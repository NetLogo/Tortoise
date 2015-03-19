# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_     = require('lodash')
Tasks = require('./prim/tasks')
Type  = require('util/typechecker')

# Needs a name here since it's recursive --JAB (4/16/14)
# (Any, Boolean) => String
Dump =
  (x, isReadable = false) ->
    if Type(x).isArray()
      itemStr = _(x).map((y) -> Dump(y, isReadable)).value().join(" ")
      "[#{itemStr}]"
    else if Tasks.isReporterTask(x)
      "(reporter task)"
    else if Tasks.isCommandTask(x)
      "(command task)"
    else if Type(x).isString()
      if isReadable then '"' + x + '"' else x
    else
      String(x)

module.exports = Dump
