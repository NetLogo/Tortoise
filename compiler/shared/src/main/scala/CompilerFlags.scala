// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import CompilerFlags.{ PropagationStyle, NoPropagation }

case class CompilerFlags(
  generateUnimplemented:  Boolean,
  onTickCallback:         String           = "function(){}",
  propagationStyle:       PropagationStyle = NoPropagation,
  optimizationsEnabled:   Boolean          = true
)

object CompilerFlags {

  implicit val Default = CompilerFlags(generateUnimplemented = false)

  sealed trait PropagationStyle
  // never propagate out stops from called procedures
  case object NoPropagation     extends PropagationStyle
  // propagate out stops from called procedures to the first level
  case object WidgetPropagation extends PropagationStyle

}
