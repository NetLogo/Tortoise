// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.engine

import scala.scalajs.js.Dynamic

object MersenneMath {

  private lazy val theOneTrueMath =
    Dynamic.global.StrictMath

  def sqrt(x: Double): Double = theOneTrueMath.sqrt(x).asInstanceOf[Double]

  def log(x: Double): Double = theOneTrueMath.log(x).asInstanceOf[Double]

}
