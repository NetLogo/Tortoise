# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLType = require('../core/typechecker')

module.exports.Config =
  class InspectConfig
    # ((Agent) => Unit) => InspectConfig
    constructor: (@inspect = (->), @stopInspecting = (->), @stopInspectingDeadAgents = (->)) ->

module.exports.Prims =
  class InspectPrims
    # (InspectConfig, Dumper) => InspectPrims
    constructor: ({ inspect: @_inspect, stopInspecting: @_stopInspecting, stopInspectingDeadAgents: @_stopInspectingDeadAgents }, @_dump) ->

    # (Agent) => Unit
    inspect: (agent) ->
      type = NLType(agent)
      if type.isTurtle() and agent.isDead()
        throw new Error("That turtle is dead.")
      else if type.isLink() and agent.isDead()
        throw new Error("That link is dead.")
      else if type.isTurtle() or type.isPatch() or type.isLink()
        @_inspect(agent)
      else
        throw new Error("INSPECT expected input to be an agent but got #{@_dump(agent)} instead.")
