// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise.dock

import org.nlogo.core.Shape.VectorShape

case class DummyShape(val name: String) extends VectorShape {
  def editableColorIndex: Int = throw new UnsupportedOperationException
  def elements: Seq[org.nlogo.core.Shape.Element] = throw new UnsupportedOperationException
  def rotatable: Boolean = throw new UnsupportedOperationException
  def name_=(s: String) = throw new UnsupportedOperationException
}
