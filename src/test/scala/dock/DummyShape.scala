// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.dock

import
  org.nlogo.core.Shape.{ Element, VectorShape }

case class DummyShape(name: String) extends VectorShape {
  override def name_=(s: String):  Unit         = throw new UnsupportedOperationException
  override def rotatable:          Boolean      = throw new UnsupportedOperationException
  override def editableColorIndex: Int          = throw new UnsupportedOperationException
  override def elements:           Seq[Element] = throw new UnsupportedOperationException
}
