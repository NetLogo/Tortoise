// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  CompilerFlags.WidgetPropagation

import
  JsOps.{ indented, jsString, jsStringEscaped }

import
  org.nlogo.core.{ CommandBlock, CompilerException, prim, Reporter, ReporterApp, Statement, Token }

// The Prim traits are split apart as follows
//                  JsOps
//                   |
//      +----> PrimUtils <------+
//      |            |          |
//  ReporterPrims<-+ | +--> CommandPrims
//                 | | |
//                 Prim
//
// The reason for this split is that (as of v0.5.5), scala.js will not compile
// a single Prim trait that handles both command and reporter prims.
// Having two separate traits makes the code a bit easier to manage, but
// the decision of whether there are separate traits or not could be revisited
// in the future after a scala.js upgrade shows that it won't break stuff (RG 3/30/2015)
trait PrimUtils {
  def handlers: Handlers

  protected def failCompilation(msg: String, token: Token): Nothing =
    throw new CompilerException(msg, token.start, token.end, token.filename)

  protected def fixBN(breedName: String): String =
    Option(breedName) filter (_.nonEmpty) getOrElse "LINKS"

  protected def generateNotImplementedStub(primName: String): String =
    s"notImplemented(${jsString(primName)}, undefined)"

  object VariableReporter extends VariablePrims {
    def unapply(r: Reporter): Option[String] =
      procedureAndVarName(r, "get").map {
        case (proc: String, varName: String) => s"$proc(${jsString(varName)})"
      }
  }

  object VariableSetter extends VariablePrims {
    def unapply(r: Reporter): Option[String => String] =
      procedureAndVarName(r, "set").map {
        case (proc: String, varName: String) =>
          ((setValue: String) => s"$proc(${jsString(varName)}, $setValue);")
      }
  }

  trait VariablePrims {
    protected def procedureAndVarName(r: Reporter, action: String): Option[(String, String)] = PartialFunction.condOpt(r) {
      case bv: prim._breedvariable        => (s"SelfManager.self().${action}Variable", bv.name.toLowerCase)
      case bv: prim._linkbreedvariable    => (s"SelfManager.self().${action}Variable", bv.name.toLowerCase)
      case tv: prim._turtlevariable       => (s"SelfManager.self().${action}Variable", tv.displayName.toLowerCase)
      case tv: prim._linkvariable         => (s"SelfManager.self().${action}Variable", tv.displayName.toLowerCase)
      case tv: prim._turtleorlinkvariable => (s"SelfManager.self().${action}Variable", tv.varName.toLowerCase)
      case pv: prim._patchvariable        => (s"SelfManager.self().${action}PatchVariable", pv.displayName.toLowerCase)
      case ov: prim._observervariable     => (s"world.observer.${action}Global", ov.displayName.toLowerCase)
      }
  }
}

trait ReporterPrims extends PrimUtils {
  // scalastyle:off method.length
  // scalastyle:off cyclomatic.complexity
  def reporter(r: ReporterApp)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String = {
    def arg(i: Int) = handlers.reporter(r.args(i))
    def commaArgs = argsSep(", ")
    def args =
      r.args.collect{ case x: ReporterApp => handlers.reporter(x) }
    def argsSep(sep: String) =
      args.mkString(sep)
    r.reporter match {

      // Basics stuff
      case SimplePrims.SimpleReporter(op) => op
      case SimplePrims.InfixReporter(op)  => s"(${arg(0)} $op ${arg(1)})"
      case SimplePrims.NormalReporter(op) => s"$op($commaArgs)"
      case SimplePrims.TypeCheck(check)   => s"NLType(${arg(0)}).$check"
      case VariableReporter(op)           => op
      case p: prim._const                 => handlers.literal(p.value)
      case lv: prim._letvariable          => handlers.ident(lv.let.name)
      case pv: prim._procedurevariable    => handlers.ident(pv.name)
      case lv: prim._lambdavariable       => handlers.ident(lv.name)
      case call: prim._callreport         =>
        s"""procedures["${call.name}"](${args.mkString(",")})"""

      // Blarg
      case _: prim._unaryminus         => s" -${arg(0)}" // The space is important, because these can be nested --JAB (6/12/14)
      case _: prim._not                => s"!${arg(0)}"
      case _: prim._count              => s"${arg(0)}.size()"
      case _: prim._any                => s"!${arg(0)}.isEmpty()"
      case _: prim._word               => ("''" +: args).map(arg => s"Dump($arg)").mkString("(", " + ", ")")
      case _: prim._of                 => generateOf(r)
      case _: prim.etc._ifelsevalue    => s"(${arg(0)} ? ${arg(1)} : ${arg(2)})"
      case _: prim.etc._reduce         => s"${arg(1)}.reduce(${arg(0)})"
      case _: prim.etc._filter         => s"${arg(1)}.filter(${arg(0)})"
      case _: prim.etc._nvalues        => s"Tasks.nValues(${arg(0)}, ${arg(1)})"
      case prim._errormessage(Some(l)) => s"_error_${l.hashCode()}.message"

      // Agentset filtering
      case _: prim._with =>
        val agents = arg(0)
        s"$agents.agentFilter(${handlers.fun(r.args(1), true)})"
      case _: prim.etc._maxnof =>
        val agents = arg(1)
        s"$agents.maxNOf(${arg(0)}, ${handlers.fun(r.args(2), true)})"
      case _: prim.etc._maxoneof =>
        val agents = arg(0)
        s"$agents.maxOneOf(${handlers.fun(r.args(1), true)})"
      case _: prim.etc._minnof =>
        val agents = arg(1)
        s"$agents.minNOf(${arg(0)}, ${handlers.fun(r.args(2), true)})"
      case _: prim.etc._minoneof =>
        val agents = arg(0)
        s"$agents.minOneOf(${handlers.fun(r.args(1), true)})"
      case o: prim.etc._all =>
        val agents = arg(0)
        s"$agents.agentAll(${handlers.fun(r.args(1), true)})"
      case _: prim.etc._withmax =>
        val agents = arg(0)
        s"$agents.maxesBy(${handlers.fun(r.args(1), true)})"
      case _: prim.etc._withmin =>
        val agents = arg(0)
        s"$agents.minsBy(${handlers.fun(r.args(1), true)})"
      case _: prim.etc._atpoints =>
        val agents = arg(0)
        s"$agents.atPoints(${arg(1)})"
      case _: prim.etc._sorton =>
        val agents = arg(1)
        s"$agents.sortOn(${handlers.fun(r.args(0), true)})"

      // Lookup by breed
      case b: prim._breed                 => s"world.turtleManager.turtlesOfBreed(${jsString(b.breedName)})"
      case b: prim.etc._breedsingular     => s"world.turtleManager.getTurtleOfBreed(${jsString(b.breedName)}, ${arg(0)})"
      case b: prim.etc._linkbreed         => s"world.linkManager.linksOfBreed(${jsString(b.breedName)})"
      case p: prim.etc._linkbreedsingular => s"world.linkManager.getLink(${arg(0)}, ${arg(1)}, ${jsString(p.breedName)})"
      case b: prim.etc._breedat           => s"SelfManager.self().breedAt(${jsString(b.breedName)}, ${arg(0)}, ${arg(1)})"
      case b: prim.etc._breedhere         => s"SelfManager.self().breedHere(${jsString(b.breedName)})"
      case b: prim.etc._breedon           => s"Prims.breedOn(${jsString(b.breedName)}, ${arg(0)})"


      // Link finding
      case p: prim.etc._inlinkfrom       => s"LinkPrims.inLinkFrom(${jsString(fixBN(p.breedName))}, ${arg(0)})"
      case p: prim.etc._inlinkneighbor   => s"LinkPrims.isInLinkNeighbor(${jsString(fixBN(p.breedName))}, ${arg(0)})"
      case p: prim.etc._inlinkneighbors  => s"LinkPrims.inLinkNeighbors(${jsString(fixBN(p.breedName))})"
      case p: prim.etc._linkneighbor     => s"LinkPrims.isLinkNeighbor(${jsString(fixBN(p.breedName))}, ${arg(0)})"
      case p: prim.etc._linkneighbors    => s"LinkPrims.linkNeighbors(${jsString(fixBN(p.breedName))})"
      case p: prim.etc._linkwith         => s"LinkPrims.linkWith(${jsString(fixBN(p.breedName))}, ${arg(0)})"
      case p: prim.etc._myinlinks        => s"LinkPrims.myInLinks(${jsString(fixBN(p.breedName))})"
      case p: prim.etc._mylinks          => s"LinkPrims.myLinks(${jsString(fixBN(p.breedName))})"
      case p: prim.etc._myoutlinks       => s"LinkPrims.myOutLinks(${jsString(fixBN(p.breedName))})"
      case p: prim.etc._outlinkneighbor  => s"LinkPrims.isOutLinkNeighbor(${jsString(fixBN(p.breedName))}, ${arg(0)})"
      case p: prim.etc._outlinkneighbors => s"LinkPrims.outLinkNeighbors(${jsString(fixBN(p.breedName))})"
      case p: prim.etc._outlinkto        => s"LinkPrims.outLinkTo(${jsString(fixBN(p.breedName))}, ${arg(0)})"

      case l: prim._reporterlambda => {
        val localSource = getSourceInRange(compilerContext.source, r.sourceLocation.start, r.sourceLocation.end)
        s"Tasks.reporterTask(${handlers.task(r.args(0), isReporter = true, args = l.argumentNames.map(handlers.ident))}, ${jsStringEscaped(localSource)})"
      }
      case l: prim._commandlambda  => {
        val localSource = getSourceInRange(compilerContext.source, r.sourceLocation.start, r.sourceLocation.end)
        s"Tasks.commandTask(${handlers.task(r.args(0), isReporter = false, args = l.argumentNames.map(handlers.ident))}, ${jsStringEscaped(localSource)})"
      }

      case rr: prim.etc._runresult =>
        s"Prims.runResult(${args.mkString(", ")})"

      case x: prim._externreport =>
        val ExtensionPrimRegex = """_externreport\(([^:]+):([^)]+)\)""".r
        val ExtensionPrimRegex(extName, primName) = x.toString
        s"Extensions[${jsString(extName)}].prims[${jsString(primName)}]($commaArgs)"

      case _: prim.etc._range =>
        generateRange(args)

      case _ if compilerFlags.generateUnimplemented =>
        generateNotImplementedStub(r.reporter.getClass.getName.drop(1))
      case _                                        =>
        failCompilation(s"unimplemented primitive: ${r.instruction.token.text}", r.instruction.token)

    }
  }
  // scalastyle:on method.length
  // scalastyle:on cyclomatic.complexity

  private def getSourceInRange(source: String, start: Int, end: Int): String = {
    if (end < source.length)
      source.substring(start, end)
    else
      source
  }

  def generateOf(r: ReporterApp)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String = {
    val agents = handlers.reporter(r.args(1))
    val func   = handlers.fun(r.args(0), isReporter = true)
    s"$agents.projectionBy($func)"
  }

  // The fact that there are three different functions for `range` is intentional--incredibly intentional.
  // The engine has this to say on the matter (with me acting as ventriloquist):
  // "Call with me with the correct number of arguments or GTFO."
  // I will open a can of whoop-ass on anyone who thinks differently. --Stone Cold J. Bertsche (3/16/17)
  def generateRange(args: Seq[String]): String =
    args match {
      case Seq(a)       => s"Prims.rangeUnary($a)"
      case Seq(a, b)    => s"Prims.rangeBinary($a, $b)"
      case Seq(a, b, c) => s"Prims.rangeTernary($a, $b, $c)"
      case _            => throw new IllegalArgumentException("range expects at most three arguments")
    }

}

trait CommandPrims extends PrimUtils {
  // scalastyle:off cyclomatic.complexity
  // scalastyle:off method.length
  def generateCommand(s: Statement)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String = {
    def arg(i: Int) = handlers.reporter(s.args(i))
    def commaArgs = argsSep(", ")
    def args =
      s.args.collect{ case x: ReporterApp => handlers.reporter(x) }
    def argsSep(sep: String) =
      args.mkString(sep)
    s.command match {
      case SimplePrims.SimpleCommand(op) => if (op.isEmpty) "" else s"$op;"
      case SimplePrims.NormalCommand(op) => s"$op($commaArgs);"
      case _: prim._set                  => generateSet(s)
      case _: prim.etc._loop             => generateLoop(s)
      case _: prim._repeat               => generateRepeat(s)
      case _: prim.etc._while            => generateWhile(s)
      case _: prim.etc._if               => generateIf(s)
      case _: prim.etc._ifelse           => generateIfElse(s)
      case _: prim._ask                  => generateAsk(s, shuffle = true)
      case p: prim._carefully            => generateCarefully(s, p)
      case _: prim._createturtles        => generateCreateTurtles(s, ordered = false)
      case _: prim._createorderedturtles => generateCreateTurtles(s, ordered = true)
      case _: prim._sprout               => generateSprout(s)
      case p: prim.etc._createlinkfrom   => generateCreateLink(s, "createLinkFrom",  p.breedName)
      case p: prim.etc._createlinksfrom  => generateCreateLink(s, "createLinksFrom", p.breedName)
      case p: prim.etc._createlinkto     => generateCreateLink(s, "createLinkTo",    p.breedName)
      case p: prim.etc._createlinksto    => generateCreateLink(s, "createLinksTo",   p.breedName)
      case p: prim.etc._createlinkwith   => generateCreateLink(s, "createLinkWith",  p.breedName)
      case p: prim.etc._createlinkswith  => generateCreateLink(s, "createLinksWith", p.breedName)
      case _: prim.etc._every            => generateEvery(s)
      case _: prim.etc._error            => s"throw new Error(${arg(0)});"
      case h: prim._hatch                => generateHatch(s, h.breedName)
      case _: prim._bk                   => s"SelfManager.self().fd(-${arg(0)});"
      case _: prim.etc._left             => s"SelfManager.self().right(-${arg(0)});"
      case _: prim.etc._diffuse          => s"world.topology.diffuse(${jsString(getReferenceName(s))}, ${arg(1)})"
      case _: prim.etc._uphill           => s"Prims.uphill(${jsString(getReferenceName(s))})"
      case _: prim.etc._uphill4          => s"Prims.uphill4(${jsString(getReferenceName(s))})"
      case _: prim.etc._downhill         => s"Prims.downhill(${jsString(getReferenceName(s))})"
      case _: prim.etc._downhill4        => s"Prims.downhill4(${jsString(getReferenceName(s))})"
      case x: prim.etc._setdefaultshape  => s"BreedManager.setDefaultShape(${arg(0)}.getSpecialName(), ${arg(1)})"
      case _: prim.etc._hidelink         => "SelfManager.self().setVariable('hidden?', true)"
      case _: prim.etc._showlink         => "SelfManager.self().setVariable('hidden?', false)"
      case call: prim._call              => generateCall(call, args)
      case _: prim._report               => s"throw new Exception.ReportInterrupt(${arg(0)});"
      case _: prim.etc._ignore           => s"${arg(0)};"
      case l: prim._let                  =>
        l.let.map(inner => s"let ${handlers.ident(inner.name)} = ${arg(0)};").getOrElse("")
      case _: prim.etc._withlocalrandomness =>
        s"workspace.rng.withClone(function() { ${handlers.commands(s.args(0))} })"
      case _: prim._run =>
        s"Prims.run(${args.mkString(", ")});"
      case _: prim.etc._foreach          =>
        val lists = args.init.mkString(", ")
        s"Tasks.forEach(${arg(s.args.size - 1)}, $lists);"
      case x: prim._extern =>
        val ExtensionPrimRegex = """_extern\(([^:]+):([^)]+)\)""".r
        val ExtensionPrimRegex(extName, primName) = x.toString
        s"Extensions[${jsString(extName)}].prims[${jsString(primName)}]($commaArgs);"
      case _ if compilerFlags.generateUnimplemented =>
        s"${generateNotImplementedStub(s.command.getClass.getName.drop(1))};"
      case _                                        =>
        failCompilation(s"unimplemented primitive: ${s.instruction.token.text}", s.instruction.token)
    }
  }
  // scalastyle:on method.length
  // scalastyle:on cyclomatic.complexity

  def getReferenceName(s: Statement)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String =
    s.args(0).asInstanceOf[ReporterApp].reporter match {
      case p: prim._patchvariable => p.displayName.toLowerCase
      case x                      => failCompilation(s"unknown reference: ${x.getClass.getName}", s.instruction.token)
    }

  /// custom generators for particular Commands
  def generateCall(call: prim._call, args: Seq[String])(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String = {
    val callDecl =
      s"""procedures["${call.name}"](${args.mkString(",")});"""
    if (compilerFlags.propagationStyle == WidgetPropagation && compilerContext.blockLevel == 1) {
      val tmp = handlers.unusedVarname(call.token, "maybestop")
      s"""|let $tmp = $callDecl
          |if ($tmp instanceof Exception.StopInterrupt) { return $tmp; }""".stripMargin
    } else
      callDecl
  }

  def generateSet(s: Statement)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String = {
    def arg(i: Int) = handlers.reporter(s.args(i))
    s.args(0).asInstanceOf[ReporterApp].reporter match {
      case p: prim._letvariable =>
        s"${handlers.ident(p.let.name)} = ${arg(1)};"
      case p: prim._procedurevariable =>
        s"${handlers.ident(p.name)} = ${arg(1)};"
      case p: prim._lambdavariable =>
        s"${handlers.ident(p.name)} = ${arg(1)};"
      case VariableSetter(setValue) =>
        setValue(arg(1))
      case x =>
        failCompilation("This isn't something you can use \"set\" on.", s.instruction.token)
    }
  }

  def generateLoop(w: Statement)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String = {
    val body = handlers.commands(w.args(0))
    s"""|while (true) {
        |${indented(body)}
        |};""".stripMargin
  }

  def generateRepeat(w: Statement)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String = {
    val count = handlers.reporter(w.args(0))
    val body = handlers.commands(w.args(1))
    val i = handlers.unusedVarname(w.command.token, "index")
    val j = handlers.unusedVarname(w.command.token, "repeatcount")
    s"""|for (let $i = 0, $j = StrictMath.floor($count); $i < $j; $i++){
        |${indented(body)}
        |}""".stripMargin
  }

  def generateWhile(w: Statement)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String = {
    val pred = handlers.reporter(w.args(0))
    val body = handlers.commands(w.args(1))
    s"""|while ($pred) {
        |${indented(body)}
        |}""".stripMargin
  }

  def generateIf(s: Statement)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String = {
    val pred = handlers.reporter(s.args(0))
    val body = handlers.commands(s.args(1))
    s"""|if ($pred) {
        |${indented(body)}
        |}""".stripMargin
  }

  def generateIfElse(s: Statement)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String = {
    val pred      = handlers.reporter(s.args(0))
    val thenBlock = handlers.commands(s.args(1))
    val elseBlock = handlers.commands(s.args(2))
    s"""|if ($pred) {
        |${indented(thenBlock)}
        |}
        |else {
        |${indented(elseBlock)}
        |}""".stripMargin
  }

  def generateAsk(s: Statement, shuffle: Boolean)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String = {
    val agents = handlers.reporter(s.args(0))
    val body = handlers.fun(s.args(1))
    genAsk(agents, shuffle, body)
  }

  def generateCarefully(s: Statement, c: prim._carefully)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String = {
    val errorName   = handlers.unusedVarname(s.command.token, "error")
    val doCarefully = handlers.commands(s.args(0))
    val handleError = handlers.commands(s.args(1)).replaceAll(s"_error_${c.let.hashCode()}", errorName)
    s"""
       |try {
       |${indented(doCarefully)}
       |} catch ($errorName) {
       |${indented(handleError)}
       |}
     """.stripMargin
  }

  def generateCreateLink(s: Statement, name: String, breedName: String)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String = {
    val other = handlers.reporter(s.args(0))
    // This is so that we don't shuffle unnecessarily.  FD 10/31/2013
    val nonEmptyCommandBlock =
      s.args(1).asInstanceOf[CommandBlock]
        .statements.stmts.nonEmpty
    val body = handlers.fun(s.args(1))
    genAsk(s"LinkPrims.$name($other, ${jsString(fixBN(breedName))})", nonEmptyCommandBlock, body)
  }

  def generateCreateTurtles(s: Statement, ordered: Boolean)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String = {
    val n = handlers.reporter(s.args(0))
    val name = if (ordered) "createOrderedTurtles" else "createTurtles"
    val breed =
      s.command match {
        case x: prim._createturtles => x.breedName
        case x: prim._createorderedturtles => x.breedName
        case x => throw new IllegalArgumentException("How did you get here with class of type " + x.getClass.getName)
      }
    val body = handlers.fun(s.args(1))
    genAsk(s"world.turtleManager.$name($n, ${jsString(breed)})", true, body)
  }

  def generateSprout(s: Statement)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String = {
    val n = handlers.reporter(s.args(0))
    val body = handlers.fun(s.args(1))
    val breedName = s.command.asInstanceOf[prim._sprout].breedName
    val trueBreedName = if (breedName.nonEmpty) breedName else "TURTLES"
    val sprouted = s"SelfManager.self().sprout($n, ${jsString(trueBreedName)})"
    genAsk(sprouted, true, body)
  }

  def generateHatch(s: Statement, breedName: String)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String = {
    val n = handlers.reporter(s.args(0))
    val body = handlers.fun(s.args(1))
    genAsk(s"SelfManager.self().hatch($n, ${jsString(breedName)})", true, body)
  }

  def generateEvery(w: Statement)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String = {
    val time = handlers.reporter(w.args(0))
    val body = handlers.commands(w.args(1))
    val everyId = handlers.nextEveryID()
    s"""|if (Prims.isThrottleTimeElapsed("$everyId", workspace.selfManager.self(), $time)) {
        |  Prims.resetThrottleTimerFor("$everyId", workspace.selfManager.self());
        |${indented(body)}
        |}""".stripMargin
  }

  def genAsk(agents: String, shouldShuffle: Boolean, body: String)(implicit compilerFlags: CompilerFlags, compilerContext: CompilerContext): String =
    s"""$agents.ask($body, $shouldShuffle);"""
}

trait Prims extends PrimUtils with CommandPrims with ReporterPrims
