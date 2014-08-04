# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('engine.dump')

goog.require('engine.prim.tasks')
goog.require('shim.lodash')

# Needs a name here since it's recursive --JAB (4/16/14)
# (Any) => String
Dump =
  (x) ->
    if _(x).isArray()
      itemStr = _(x).map(Dump).value().join(" ")
      "[#{itemStr}]"
    else if Tasks.isReporterTask(x)
      "(reporter task)"
    else if Tasks.isCommandTask(x)
      "(command task)"
    else
      String(x)

Dump

