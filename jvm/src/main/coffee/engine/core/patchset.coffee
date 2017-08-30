# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AbstractAgentSet = require('./abstractagentset')
Iterator         = require('util/iterator')

module.exports =
  class PatchSet extends AbstractAgentSet

    # [T <: Patch] @ (Array[T], World, String) => PatchSet
    constructor: (agents, world, specialName) ->
      super(agents, world, "patches", specialName)
