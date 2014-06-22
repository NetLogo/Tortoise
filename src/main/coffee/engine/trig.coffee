# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['integration/strictmath', 'engine/exception'], (StrictMath, Exception) -> {

  # (Number) => Number
  squash: (x) ->
    if StrictMath.abs(x) < 3.2e-15
      0
    else
      x

  # (Number) => Number
  sin: (degrees) -> #@# Simplifify x4
    @squash(StrictMath.sin(StrictMath.toRadians(degrees)))

  # (Number) => Number
  cos: (degrees) ->
    @squash(StrictMath.cos(StrictMath.toRadians(degrees)))

  # (Number) => Number
  unsquashedSin: (degrees) ->
    StrictMath.sin(StrictMath.toRadians(degrees))

  # (Number) => Number
  unsquashedCos: (degrees) ->
    StrictMath.cos(StrictMath.toRadians(degrees))

  # (Number, Number) => Number
  atan: (d1, d2) ->
    if d1 is 0 and d2 is 0
      throw new Exception.NetLogoException("Runtime error: atan is undefined when both inputs are zero.")
    else if d1 is 0
      if d2 > 0 then 0 else 180
    else if d2 is 0
      if d1 > 0 then 90 else 270
    else
      (StrictMath.toDegrees(StrictMath.atan2(d1, d2)) + 360) % 360 #@# Lame style

})
