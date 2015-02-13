# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class NetLogoException
  constructor: (@message) ->

class DeathInterrupt    extends NetLogoException
class TopologyInterrupt extends NetLogoException
class StopInterrupt     extends NetLogoException

module.exports = {
  NetLogoException  : NetLogoException
  DeathInterrupt    : DeathInterrupt
  TopologyInterrupt : TopologyInterrupt
  StopInterrupt     : StopInterrupt
}

