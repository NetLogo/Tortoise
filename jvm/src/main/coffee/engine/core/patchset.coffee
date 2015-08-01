# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AbstractAgentSet = require('./abstractagentset')
Iterator         = require('util/iterator')

module.exports =
  class PatchSet extends AbstractAgentSet

    # [T <: Patch] @ (Array[T], String) => PatchSet
    constructor: (agents, specialName) ->
      super(agents, "patches", specialName)
