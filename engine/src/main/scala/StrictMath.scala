// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.web

import
  scala.scalajs.js.{ Dynamic, isUndefined }

object StrictMath {

  private lazy val theOneTrueMath = {
    val flatten = (d: Dynamic) => if (isUndefined(d)) None else Some(d)
    val mathOpt = Option(Dynamic.global.java).flatMap(flatten).map(_.lang).flatMap(flatten).map(_.StrictMath).flatMap(flatten)
    mathOpt.getOrElse(Dynamic.global.Math)
  }

  def sqrt(x: Double): Double = theOneTrueMath.sqrt(x).asInstanceOf[Double]

  def log(x: Double): Double = theOneTrueMath.log(x).asInstanceOf[Double]

}
