// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw.jsengine

// ADDING SOMETHING TO THIS OBJECT?
// WELL, ARE YA, PUNK?
// If you are, open your browser's console and type in "Math.<the name of that thing>".
// If it returns `undefined`, you need to add it to 'strictmath.coffee', too!
// Or, maybe just consult this page to figure out if it's a part of the spec or not:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
// --JAB (11/4/13)
object Strict {
  val PI:                          Double = StrictMath.PI
  def abs(x: Double):              Double = StrictMath.abs(x)
  def acos(x: Double):             Double = StrictMath.acos(x)
  def asin(x: Double):             Double = StrictMath.asin(x)
  def atan2(x: Double, y: Double): Double = StrictMath.atan2(x, y)
  def ceil(x: Double):             Double = StrictMath.ceil(x)
  def cos(x: Double):              Double = StrictMath.cos(x)
  def exp(x: Double):              Double = StrictMath.exp(x)
  def floor(x: Double):            Double = StrictMath.floor(x)
  def log(x: Double):              Double = StrictMath.log(x)
  // Don't bother trying to add `max` or `min`.  They're variadic in JS and binary on the JVM.
  // Doesn't translate well. --JAB (2/18/15)
  def pow(x: Double, y: Double):   Double = StrictMath.pow(x, y)
  def round(x: Double):            Double = StrictMath.round(x)
  def sin(x: Double):              Double = StrictMath.sin(x)
  def sqrt(x: Double):             Double = StrictMath.sqrt(x)
  def tan(x: Double):              Double = StrictMath.tan(x)
  def toDegrees(x: Double):        Double = StrictMath.toDegrees(x)
  def toRadians(x: Double):        Double = StrictMath.toRadians(x)
  def truncate(x: Double):         Double = x.toInt
}
