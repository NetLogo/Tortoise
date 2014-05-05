define(->

  class NetLogoException
    constructor: (@message) ->

  #@# All of these interrupts are really internal-only things, so I'm not entirely sure about putting them in a separate package...
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
