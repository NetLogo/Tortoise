# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports.Config =
  class InspectionConfig
    # ((Agent) => Unit, (Agent) => Unit, () => Unit) => InspectionConfig
    constructor: (@inspect = (->), @stopInspecting = (->), @clearDead = (->)) ->

module.exports.Prims =
  class InspectionPrims
    # (InspectionConfig) => InspectionPrims
    constructor: ({ @inspect, @stopInspecting, @clearDead }) ->
