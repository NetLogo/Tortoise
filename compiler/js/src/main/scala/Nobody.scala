// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  scala.scalajs.js.annotation.{ JSExportTopLevel, JSExportAll }

@JSExportTopLevel("Nobody")
@JSExportAll
object Nobody {
  /*
    Inclusion of `ask` is inspired by the fact that, since a primitive like `create-link-with` can
    return `nobody`, and it can also take an initialization block for the to-be-created thing, either
    the init block must be branched against or `nobody` must ignore it  --JAB (7/18/14)
  */
  def ask(): Unit                 = {}
  def id: Int                     = -1
  def isDead(): Boolean           = true
  override def toString(): String = "nobody"
}
