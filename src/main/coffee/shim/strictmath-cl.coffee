# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('shim.strictmath')

goog.require('shim.cloner')

if StrictMath? # Nashorn
  StrictMath
else
  obj = Cloner(Math)
  # For functions that are not "close enough," or that don't exist in the browser, manually define them here!
  obj.toRadians = (degrees) -> degrees * Math.PI / 180
  obj.toDegrees = (radians) -> radians * 180 / Math.PI
  obj
