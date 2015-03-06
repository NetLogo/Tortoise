# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class NetLogoException
  constructor: (@message) ->

class AgentException    extends NetLogoException
class DeathInterrupt    extends NetLogoException
class TopologyInterrupt extends NetLogoException
class StopInterrupt     extends NetLogoException

module.exports = {
  AgentException
  NetLogoException
  DeathInterrupt
  TopologyInterrupt
  StopInterrupt
}

