define(['integration/strictmath', 'engine/exception'], (StrictMath, Exception) -> {
  squash: (x) ->
    if (StrictMath.abs(x) < 3.2e-15)
      0
    else
      x
  sin: (degrees) -> #@# Simplifify x4
    @squash(StrictMath.sin(StrictMath.toRadians(degrees)))
  cos: (degrees) ->
    @squash(StrictMath.cos(StrictMath.toRadians(degrees)))
  unsquashedSin: (degrees) ->
    StrictMath.sin(StrictMath.toRadians(degrees))
  unsquashedCos: (degrees) ->
    StrictMath.cos(StrictMath.toRadians(degrees))
  atan: (d1, d2) ->
    throw new Exception.NetLogoException("Runtime error: atan is undefined when both inputs are zero.") if (d1 == 0 && d2 == 0) #@# Hatred
    if (d1 == 0) #@# Intensified hatred
      if (d2 > 0) then 0 else 180
    else if (d2 == 0)
      if (d1 > 0) then 90 else 270
    else (StrictMath.toDegrees(StrictMath.atan2(d1, d2)) + 360) % 360 #@# Lame style
})
