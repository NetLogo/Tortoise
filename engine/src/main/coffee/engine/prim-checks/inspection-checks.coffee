# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ Something } = require('brazier/maybe')
{ exceptionFactory: exceptions } = require('util/exception')

class InspectionChecks

  constructor: (@validator, @prims) ->

  # (Int, Int, Agent) => Unit
  inspect: (sourceStart, sourceEnd, agent) ->
    if agent.isDead()
      throw exceptions.runtime("That #{agent.getBreedNameSingular()} is dead.", "inspect", Something(sourceStart), Something(sourceEnd))
    else
      @prims.inspect(agent)
      return

module.exports = InspectionChecks
