// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  org.nlogo.core.CompilerException

class WidgetCompilerException(
  message:         String,
  start:           Int,
  end:             Int,
  filename:        String,
  val widgetType:  String,
  val widgetName:  String,
  val widgetField: String
) extends CompilerException(message, start, end, filename)
