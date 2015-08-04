# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class NetLogoException
  constructor: (@message) ->

class AgentException    extends NetLogoException
class DeathInterrupt    extends NetLogoException
class ReportInterrupt   extends NetLogoException
class StopInterrupt     extends NetLogoException
class TopologyInterrupt extends NetLogoException

module.exports = {
  AgentException
  DeathInterrupt
  NetLogoException
  ReportInterrupt
  StopInterrupt
  TopologyInterrupt
}

