// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  JavascriptObject.JsFunction

import
  json.{ JsonWriter, TortoiseJson },
    JsonWriter._,
    TortoiseJson.JsObject

import
  JsOps.{ jsArrayString, jsFunction, jsString, sanitizeNil, thunkifyFunction, thunkifyProcedure }

import
  org.nlogo.core.{ Button, CompilerException, Monitor, Pen, Plot, Slider, Token, Widget }

import
  scalaz.Scalaz.ToValidationOps

import
  TortoiseSymbol.JsDeclare

import
  WidgetCompilation._

class WidgetCompiler(compileCommand:  String => CompiledStringV,
                     compileReporter: String => CompiledStringV) {

  def compileWidgets(widgets: Seq[Widget]): Seq[CompiledWidget] = {
    validatePlots(widgets)
    widgets.map(compileWidget)
  }

  private def validatePlots(widgets: Seq[Widget]): Unit = {
    val invalidPlots =
      widgets.filter(_.isInstanceOf[Plot]).groupBy {
        case p: Plot => p.display
      }.filter(_._2.size > 1)
    if (invalidPlots.nonEmpty) {
      import Token.Eof
      val message =
        s"Having multiple plots with same display name is not supported. Duplicate names detected: ${invalidPlots.keys.mkString(", ")}"
      throw new CompilerException(message, Eof.start, Eof.end, Eof.filename)
    }
  }

  private def askWithKind(kind: String)(command: String): String = {
    def fail(kind: String): Nothing =
      throw new IllegalArgumentException(s"This type of agent cannot be asked: $kind")

    def askBlock(agents: String)(logoAsk: String): String =
      s"ask $agents [ $logoAsk ]"

    val kindToAgentSetString = Map[String, String => String](
      "OBSERVER" -> identity _,
      "TURTLE"   -> askBlock("turtles") _,
      "PATCH"    -> askBlock("patches") _,
      "LINK"     -> askBlock("links")   _)

    kindToAgentSetString.getOrElse(kind, fail(kind)).apply(command)
  }

  private def sanitizeSource(s: String) =
    s.replace("\\n", "\n").replace("\\\\", "\\").replace("\\\"", "\"")

  private def compileWidget(w: Widget): CompiledWidget =
    w match {
      case b: Button  => CompiledWidget(w, SourceCompilation(
        compileCommand(sanitizeSource(askWithKind(b.buttonType.toUpperCase)(b.source)))))
      case m: Monitor => CompiledWidget(w, SourceCompilation(compileReporter(m.source)))
      case p: Plot    =>
        val cleanDisplay = sanitizeNil(p.display)
        new CompiledPlot(p, cleanDisplay,
          compileInContext(p.setupCode,  cleanDisplay),
          compileInContext(p.updateCode, cleanDisplay),
          p.pens.map(compilePen(cleanDisplay)))
      case s: Slider  => CompiledWidget(w, SliderCompilation(
        compileReporter(s.min),
        compileReporter(s.max),
        compileReporter(s.step)))
      case _          => CompiledWidget(w, NotCompiled)
    }

  private def compilePen(ownerName: String)(pen: Pen): CompiledPen =
    new CompiledPen(pen,
       compileInContext(pen.setupCode,  ownerName, Option(pen.display)),
       compileInContext(pen.updateCode, ownerName, Option(pen.display)))

  private def compileInContext(code:        String,
                               plotNameRaw: String,
                               penNameOpt:  Option[String] = None): CompiledStringV = {
    val penName       = penNameOpt map (name => s"'$name'") getOrElse "undefined"
    val inTempContext = (f: String) => s"plotManager.withTemporaryContext('$plotNameRaw', $penName)($f)"
    val withAuxRNG    = (f: String) => s"workspace.rng.withAux($f)"
    if (code.trim.isEmpty)
      thunkifyProcedure("").successNel
    else
      compileCommand(code) map thunkifyProcedure map
        (inTempContext andThen thunkifyProcedure) map
        (withAuxRNG    andThen thunkifyProcedure)
  }
}

object WidgetCompiler {
  val monitorRenames = Map(
    "compiledSource" -> "reporter")

  val sliderRenames = Map(
    "compiledMin" -> "getMin",
    "compiledMax" -> "getMax",
    "compiledStep" -> "getStep")

  def formatWidgets(cws: Seq[CompiledWidget]): String =
    jsArrayString(cws.map(formatWidget(_).toJsString), "\n")

  def formatWidget(compiledWidget: CompiledWidget): JavascriptObject = {
      val javascriptObject = new JavascriptObject().addObjectProperties(compiledWidget.toJsonObj.asInstanceOf[JsObject])
      compiledWidget match {
        case CompiledWidget(monitor: Monitor, comp: SourceCompilation) =>
          comp.fold(javascriptObject)(addCompiledField(monitorRenames))
        case CompiledWidget(slider:  Slider,  comp: SliderCompilation) =>
          comp.fold(javascriptObject)(addCompiledField(sliderRenames))
        case _ => javascriptObject
      }
    }

  private def addCompiledField(fnNames:          Map[String, String])
                              (javascriptObject: JavascriptObject,
                               compileResult:    (String, CompiledStringV)) =
    compileResult match {
      case (fieldName, compilation) => compilation.fold(
        e    => javascriptObject,
        body => javascriptObject.addFunction(fnNames(fieldName), JsFunction(Seq(), Seq(s"return $body;"))))
    }
}
