# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# { checks, getTypeOf, types } = require('engine/core/typechecker')

class AgentSetChecks

  constructor: (@validator, @dumper) ->

  # (AgentSet[T], () => Boolean) => AgentSet[T]
  with: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", arguments, 1)
    agentset.agentFilter(f)

module.exports = AgentSetChecks
