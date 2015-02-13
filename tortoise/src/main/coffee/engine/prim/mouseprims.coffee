# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports.Config =
  class MouseConfig
    # (() => Boolean, () => Boolean, () => Number, () => Number)
    constructor: (@peekIsDown = (-> false), @peekIsInside = (-> false), @peekX = (-> 0), @peekY = (-> 0)) ->

module.exports.Prims =
  class MousePrims
    # (MouseConfig) => MousePrims
    constructor: ({ peekIsDown: @isDown, peekIsInside: @isInside, peekX: @getX, peekY: @getY }) ->
