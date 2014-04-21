# on Nashorn, we use the JVM StrictMath stuff so results are identical
# with regular NetLogo. in browser, be satisfied with "close enough"
define(['integration/cloner'], (Cloner) ->
  if StrictMath?
    StrictMath
  else
    obj = Cloner.clone(Math)
    # For functions that are not "close enough," or that don't exist in the browser, manually define them here!
    obj.toRadians = (degrees) -> degrees * Math.PI / 180
    obj.toDegrees = (radians) -> radians * 180 / Math.PI
    obj
)
