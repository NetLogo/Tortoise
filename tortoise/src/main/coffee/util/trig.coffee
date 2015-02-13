# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

StrictMath = require('../shim/strictmath')
Exception  = require('./exception')

module.exports = {

  # (Number) => Number
  sin: (degrees) ->
    @_squash(@unsquashedSin(degrees))

  # (Number) => Number
  cos: (degrees) ->
    @_squash(@unsquashedCos(degrees))

  # (Number) => Number
  unsquashedSin: (degrees) ->
    StrictMath.sin(StrictMath.toRadians(degrees))

  # (Number) => Number
  unsquashedCos: (degrees) ->
    StrictMath.cos(StrictMath.toRadians(degrees))

  # (Number, Number) => Number
  atan: (d1, d2) ->
    if d1 is 0 and d2 is 0
      throw new Error("Runtime error: atan is undefined when both inputs are zero.")
    else if d1 is 0
      if d2 > 0 then 0 else 180
    else if d2 is 0
      if d1 > 0 then 90 else 270
    else
      (StrictMath.toDegrees(StrictMath.atan2(d1, d2)) + 360) % 360

  # (Number) => Number
  _squash: (x) ->
    if StrictMath.abs(x) < 3.2e-15
      0
    else
      x

}
