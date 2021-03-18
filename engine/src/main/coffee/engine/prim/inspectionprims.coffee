# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')

module.exports.Config =
  class InspectionConfig
    # ((Agent) => Unit, (Agent) => Unit, () => Unit) => InspectionConfig
    constructor: (@inspect = (->), @stopInspecting = (->), @clearDead = (->)) ->

module.exports.Prims =
  class InspectionPrims
    # (InspectionConfig) => InspectionPrims
    constructor: ({ inspect, @stopInspecting, @clearDead }) ->
      @inspect = (agent) ->
        if not agent.isDead()
          inspect(agent)
        else
          throw exceptions.runtime("That #{agent.getBreedNameSingular()} is dead.")
