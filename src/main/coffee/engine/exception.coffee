#@# Just put it in a package...
define(->

  class NetLogoException
    constructor: (@message) ->

  class DeathInterrupt    extends NetLogoException
  class TopologyInterrupt extends NetLogoException
  class StopInterrupt     extends NetLogoException

  {
    NetLogoException  : NetLogoException
    DeathInterrupt    : DeathInterrupt
    TopologyInterrupt : TopologyInterrupt
    StopInterrupt     : StopInterrupt
  }

)
