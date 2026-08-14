# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AbstractAgentSet = require('./abstractagentset')
AgentKinds       = require('./agentkinds')
Iterator         = require('util/iterator')

module.exports =
  class PatchSet extends AbstractAgentSet

    agentBit: AgentKinds.Patch # Int

    # [T <: Patch] @ (Array[T], World, String) => PatchSet
    constructor: (agents, world, specialName) ->
      super(agents, world, "patches", specialName)
