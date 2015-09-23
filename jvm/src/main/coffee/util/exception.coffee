# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class NetLogoException
  constructor: (@message) ->

class AgentException    extends NetLogoException
class DeathInterrupt    extends NetLogoException
class ReportInterrupt   extends NetLogoException
class StopInterrupt     extends NetLogoException
class TopologyInterrupt extends NetLogoException

class HaltInterrupt extends NetLogoException
  constructor: ->
    super("model halted by user")

module.exports = {
  AgentException
  DeathInterrupt
  HaltInterrupt
  NetLogoException
  ReportInterrupt
  StopInterrupt
  TopologyInterrupt
}

