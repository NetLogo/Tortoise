# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('util.exception')

class NetLogoException
  constructor: (@message) ->

class DeathInterrupt    extends NetLogoException
class TopologyInterrupt extends NetLogoException
class StopInterrupt     extends NetLogoException

util.exception = Exception = {
  NetLogoException  : NetLogoException
  DeathInterrupt    : DeathInterrupt
  TopologyInterrupt : TopologyInterrupt
  StopInterrupt     : StopInterrupt
}

