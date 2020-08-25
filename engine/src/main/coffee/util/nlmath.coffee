# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

StrictMath = require('../shim/strictmath')
Exception  = require('./exception')

# The compiler should favor calling into this object over `StrictMath`, because this is where error messages are implemented --JAB (3/5/15)
module.exports = {

  # (Number) => Number
  abs: (n) ->
    StrictMath.abs(n)

  # (Number) => Number
  acos: (radians) ->
    @validateNumber(StrictMath.toDegrees(StrictMath.acos(radians)))

  # (Number) => Number
  asin: (radians) ->
    @validateNumber(StrictMath.toDegrees(StrictMath.asin(radians)))

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
  ceil: (n) ->
    StrictMath.ceil(n)

  # (Number) => Number
  cos: (degrees) ->
    StrictMath.cos(StrictMath.toRadians(degrees))

  # (Number, Number) => Number
  distance2_2D: (x, y) ->
    StrictMath.sqrt(x * x + y * y)

  # (Number, Number, Number, Number) => Number
  distance4_2D: (x1, y1, x2, y2) ->
    @distance2_2D(x1 - x2, y1 - y2)

  # (Number) => Number
  exp: (n) ->
    StrictMath.exp(n)

  # (Number) => Number
  floor: (n) ->
    StrictMath.floor(n)

  # (Number) => Number
  ln: (n) ->
    StrictMath.log(n)

  # (Number, Number) => Number
  log: (num, base) ->
    StrictMath.log(num) / StrictMath.log(base)

  # (Number*) => Number
  max: (xs...) ->
    Math.max(xs...) # Variadic `max` doesn't exist on the Java `Math` object --JAB (9/23/15)

  # (Number*) => Number
  min: (xs...) ->
    Math.min(xs...) # Variadic `min` doesn't exist on the Java `Math` object --JAB (9/15/15)

  # (Number, Number) => Number
  mod: (a, b) ->
    a %% b

  # (Number) => Number
  normalizeHeading: (heading) ->
    if (0 <= heading < 360)
      heading
    else
      ((heading % 360) + 360) % 360

  # (Number, Number) => Number
  precision: (n, places) ->
    multiplier = StrictMath.pow(10, places)
    result = StrictMath.floor(n * multiplier + .5) / multiplier
    if places > 0
      result
    else
      StrictMath.round(result)

  # (Number, Number) => Number
  pow: (base, exponent) ->
    StrictMath.pow(base, exponent)

  # (Number) => Number
  round: (n) ->
    StrictMath.round(n)

  # (Number) => Number
  sin: (degrees) ->
    StrictMath.sin(StrictMath.toRadians(degrees))

  # (Number) => Number
  sqrt: (n) ->
    StrictMath.sqrt(n)

  # (Number) => Number
  squash: (x) ->
    if StrictMath.abs(x) < 3.2e-15
      0
    else
      x

  # (Number, Number) => Number
  subtractHeadings: (h1, h2) ->
    diff = (h1 % 360) - (h2 % 360)
    if -180 < diff <= 180
      diff
    else if diff > 0
      diff - 360
    else
      diff + 360

  # (Number) => Number
  tan: (degrees) ->
    StrictMath.tan(StrictMath.toRadians(degrees))

  # (Number) => Number
  toInt: (n) ->
    n | 0

  trunc: (n) ->
    StrictMath.trunc(n)

  # (Number) => Number
  validateNumber: (x) ->
    if not isFinite(x)
      throw new Error("math operation produced a non-number")
    else if isNaN(x)
      throw new Error("math operation produced a number too large for NetLogo")
    else
      x

}
