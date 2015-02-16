# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Tasks          = require('./prim/tasks')
{ SuperArray } = require('super/superarray')
Checker        = require('super/_typechecker')

# Needs a name here since it's recursive --JAB (4/16/14)
# (Any) => String
Dump =
  (x) ->
    if Checker.isArray(x)
      SuperArray(x).map(Dump).mkString("[", " ", "]")
    else if Tasks.isReporterTask(x)
      "(reporter task)"
    else if Tasks.isCommandTask(x)
      "(command task)"
    else
      String(x)

module.exports = Dump
