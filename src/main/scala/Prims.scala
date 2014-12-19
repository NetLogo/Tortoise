// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  org.nlogo.core.{ CommandBlock, CompilerException, prim, ReporterApp, Statement, Token }

trait Prims {

  def handlers: Handlers

  def reporter(r: ReporterApp): String = {
    def arg(i: Int) = handlers.reporter(r.args(i))
    def commaArgs = argsSep(", ")
    def args =
      r.args.collect{ case x: ReporterApp => handlers.reporter(x) }
    def argsSep(sep: String) =
      args.mkString(sep)
    r.reporter match {
      case SimplePrims.SimpleReporter(op)   => op
      case SimplePrims.InfixReporter(op)    => s"(${arg(0)} $op ${arg(1)})"
      case SimplePrims.NormalReporter(op)   => s"$op($commaArgs)"
      case x: prim.etc._isbreed             => s"""Prims.isBreed("${x.breedName}", ${arg(0)})"""
      case b: prim._breed                   => s"""world.turtleManager.turtlesOfBreed("${b.breedName}")"""
      case b: prim.etc._linkbreed           => s"""world.linkManager.linksOfBreed("${b.breedName}")"""
      case b: prim.etc._breedsingular       => s"""world.turtleManager.getTurtleOfBreed("${b.breedName}", ${arg(0)})"""
      case b: prim.etc._breedhere           => s"""SelfManager.self().breedHere("${b.breedName}")"""
      case b: prim.etc._breedon             => s"""Prims.breedOn("${b.breedName}", ${arg(0)})"""
      case x: prim.etc._isstring            => s"Type(${arg(0)}).isString()"
      case p: prim._const                   => handlers.literal(p.value)
      case lv: prim._letvariable            => handlers.ident(lv.let.name)
      case pv: prim._procedurevariable      => handlers.ident(pv.name)
      case call: prim._callreport           =>
        (handlers.ident(call.name) +: args)
          .mkString("Call(", ", ", ")")
      case _: prim._unaryminus              => s" -${arg(0)}" // The space is important, because these can be nested --JAB (6/12/14)
      case _: prim._not                     => s"!${arg(0)}"
      case bv: prim._breedvariable          => s"SelfPrims.getVariable('${bv.name.toLowerCase}')"
      case bv: prim._linkbreedvariable      => s"SelfPrims.getVariable('${bv.name.toLowerCase}')"
      case tv: prim._turtlevariable         => s"SelfPrims.getVariable('${tv.displayName.toLowerCase}')"
      case tv: prim._linkvariable           => s"SelfPrims.getVariable('${tv.displayName.toLowerCase}')"
      case tv: prim._turtleorlinkvariable   => s"SelfPrims.getVariable('${tv.varName.toLowerCase}')"
      case pv: prim._patchvariable          => s"SelfPrims.getPatchVariable('${pv.displayName.toLowerCase}')"
      case ov: prim._observervariable       => s"world.observer.getGlobal('${ov.displayName.toLowerCase}')"
      case p: prim.etc._linkbreedsingular   => s"world.linkManager.getLink(${arg(0)}, ${arg(1)}, '${p.breedName}')"
      case _: prim._count                   => s"${arg(0)}.size()"
      case _: prim._any                     => s"${arg(0)}.nonEmpty()"
      case _: prim._word                    =>
        ("\"\"" +: args).map(arg => "Dump(" + arg + ")").mkString("(", " + ", ")")
      case _: prim._with =>
        val agents = arg(0)
        s"$agents.agentFilter(${handlers.fun(r.args(1), true)})"
      case _: prim.etc._maxoneof =>
        val agents = arg(0)
        s"$agents.maxOneOf(${handlers.fun(r.args(1), true)})"
      case _: prim.etc._minoneof =>
        val agents = arg(0)
        s"$agents.minOneOf(${handlers.fun(r.args(1), true)})"
      case o: prim.etc._all =>
        val agents = arg(0)
        s"$agents.agentAll(${handlers.fun(r.args(1), true)})"
      case _: prim._of                      => generateOf(r)
      case _: prim.etc._islink              => s"(${arg(0)} instanceof Link)"
      case _: prim.etc._isturtle            => s"(${arg(0)} instanceof Turtle)"
      case _: prim.etc._ifelsevalue         => s"(${arg(0)} ? ${arg(1)} : ${arg(2)})"
      case _: prim.etc._reduce              => s"${arg(1)}.reduce(${arg(0)})"
      case _: prim.etc._filter              => s"${arg(1)}.filter(${arg(0)})"
      case _: prim.etc._nvalues             => s"Tasks.nValues(${arg(0)}, ${arg(1)})"
      case _: prim.etc._basecolors          => "ColorModel.BASE_COLORS"
      case p: prim.etc._inlinkfrom          => s"LinkPrims.inLinkFrom('${fixBN(p.breedName)}', ${arg(0)})"
      case p: prim.etc._inlinkneighbor      => s"LinkPrims.isInLinkNeighbor('${fixBN(p.breedName)}', ${arg(0)})"
      case p: prim.etc._inlinkneighbors     => s"LinkPrims.inLinkNeighbors('${fixBN(p.breedName)}')"
      case p: prim.etc._linkneighbor        => s"LinkPrims.isLinkNeighbor('${fixBN(p.breedName)}', ${arg(0)})"
      case p: prim.etc._linkneighbors       => s"LinkPrims.linkNeighbors('${fixBN(p.breedName)}')"
      case p: prim.etc._linkwith            => s"LinkPrims.linkWith('${fixBN(p.breedName)}', ${arg(0)})"
      case p: prim.etc._myinlinks           => s"LinkPrims.myInLinks('${fixBN(p.breedName)}')"
      case p: prim.etc._mylinks             => s"LinkPrims.myLinks('${fixBN(p.breedName)}')"
      case p: prim.etc._myoutlinks          => s"LinkPrims.myOutLinks('${fixBN(p.breedName)}')"
      case p: prim.etc._outlinkneighbor     => s"LinkPrims.isOutLinkNeighbor('${fixBN(p.breedName)}', ${arg(0)})"
      case p: prim.etc._outlinkneighbors    => s"LinkPrims.outLinkNeighbors('${fixBN(p.breedName)}')"
      case p: prim.etc._outlinkto           => s"LinkPrims.outLinkTo('${fixBN(p.breedName)}', ${arg(0)})"
      case tv: prim._taskvariable           => s"taskArguments[${tv.vn - 1}]"
      case prim._errormessage(Some(l))      => s"_error_${l.hashCode()}.message"
      case _: prim._reportertask =>
        s"Tasks.reporterTask(${handlers.fun(r.args(0), isReporter = true, isTask = true)})"
      case _: prim._commandtask =>
        s"Tasks.commandTask(${handlers.fun(r.args(0), isReporter = false, isTask = true)})"
      case rr: prim.etc._runresult =>
        val taskInputs = args.tail.mkString(", ")
        s"(${arg(0)})($taskInputs)"
      case _ =>
        failCompilation(s"unknown primitive: ${r.reporter.getClass.getName}", r.instruction.token)
    }
  }

  def generateCommand(s: Statement): String = {
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
      case _: prim.etc._diffuse          => s"world.topology.diffuse('${getReferenceName(s)}', ${arg(1)})"
      case x: prim.etc._setdefaultshape  => s"BreedManager.setDefaultShape(${arg(0)}.getBreedName(), ${arg(1)})"
      case _: prim.etc._hidelink         => "SelfPrims.setVariable('hidden?', true)"
      case _: prim.etc._showlink         => "SelfPrims.setVariable('hidden?', false)"
      case call: prim._call              =>
        (handlers.ident(call.name) +: args)
          .mkString("Call(", ", ", ");")
      case _: prim.etc._report           => s"return ${arg(0)};"
      case _: prim.etc._ignore           => s"${arg(0)};"
      case l: prim._let                  =>
        s"var ${handlers.ident(l.let.name)} = ${arg(0)};"
      case _: prim.etc._run =>
        val taskInputs = args.tail.mkString(", ")
        s"(${arg(0)})($taskInputs);"
      case _: prim.etc._foreach =>
        val lists = args.init.mkString(", ")
        s"Tasks.forEach(${arg(s.args.size - 1)}, $lists);"
      case _ =>
        failCompilation(s"unknown primitive: ${s.command.getClass.getName}", s.instruction.token)
    }
  }

  def getReferenceName(s: Statement): String =
    s.args(0).asInstanceOf[ReporterApp].reporter match {
      case p: prim._patchvariable => p.displayName.toLowerCase
      case x                      => failCompilation(s"unknown reference: ${x.getClass.getName}", s.instruction.token)
    }

  /// custom generators for particular Commands

  def generateSet(s: Statement): String = {
    def arg(i: Int) = handlers.reporter(s.args(i))
    s.args(0).asInstanceOf[ReporterApp].reporter match {
      case p: prim._letvariable =>
        s"${handlers.ident(p.let.name)} = ${arg(1)};"
      case p: prim._observervariable =>
        s"world.observer.setGlobal('${p.displayName.toLowerCase}', ${arg(1)});"
      case bv: prim._breedvariable =>
        s"SelfPrims.setVariable('${bv.name.toLowerCase}', ${arg(1)});"
      case bv: prim._linkbreedvariable =>
        s"SelfPrims.setVariable('${bv.name.toLowerCase}', ${arg(1)});"
      case p: prim._linkvariable =>
        s"SelfPrims.setVariable('${p.displayName.toLowerCase}', ${arg(1)});"
      case p: prim._turtlevariable =>
        s"SelfPrims.setVariable('${p.displayName.toLowerCase}', ${arg(1)});"
      case p: prim._turtleorlinkvariable =>
        s"SelfPrims.setVariable('${p.varName.toLowerCase}', ${arg(1)});"
      case p: prim._patchvariable =>
        s"SelfPrims.setPatchVariable('${p.displayName.toLowerCase}', ${arg(1)});"
      case p: prim._procedurevariable =>
        s"${handlers.ident(p.name)} = ${arg(1)};"
      case x =>
        failCompilation(s"unknown settable: ${x.getClass.getName}", s.instruction.token)
    }
  }

  def generateLoop(w: Statement): String = {
    val body = handlers.commands(w.args(0))
    s"""|while (true) {
        |${handlers.indented(body)}
        |};""".stripMargin
  }

  def generateRepeat(w: Statement): String = {
    val count = handlers.reporter(w.args(0))
    val body = handlers.commands(w.args(1))
    val i = handlers.unusedVarname(w.command.token, "index")
    val j = handlers.unusedVarname(w.command.token, "repeatcount")
    s"""|for (var $i = 0, $j = StrictMath.floor($count); $i < $j; $i++){
        |${handlers.indented(body)}
        |}""".stripMargin
  }

  def generateWhile(w: Statement): String = {
    val pred = handlers.reporter(w.args(0))
    val body = handlers.commands(w.args(1))
    s"""|while ($pred) {
        |${handlers.indented(body)}
        |}""".stripMargin
  }

  def generateIf(s: Statement): String = {
    val pred = handlers.reporter(s.args(0))
    val body = handlers.commands(s.args(1))
    s"""|if ($pred) {
        |${handlers.indented(body)}
        |}""".stripMargin
  }

  def generateIfElse(s: Statement): String = {
    val pred      = handlers.reporter(s.args(0))
    val thenBlock = handlers.commands(s.args(1))
    val elseBlock = handlers.commands(s.args(2))
    s"""|if ($pred) {
        |${handlers.indented(thenBlock)}
        |}
        |else {
        |${handlers.indented(elseBlock)}
        |}""".stripMargin
  }

  def generateAsk(s: Statement, shuffle: Boolean): String = {
    val agents = handlers.reporter(s.args(0))
    val body = handlers.fun(s.args(1))
    genAsk(agents, shuffle, body)
  }

  def generateCarefully(s: Statement, c: prim._carefully): String = {
    val errorName   = handlers.unusedVarname(s.command.token, "error")
    val doCarefully = handlers.commands(s.args(0))
    val handleError = handlers.commands(s.args(1)).replaceAll(s"_error_${c.let.hashCode()}", errorName)
    s"""
       |try {
       |${handlers.indented(doCarefully)}
       |} catch ($errorName) {
       |${handlers.indented(handleError)}
       |}
     """.stripMargin
  }

  def generateCreateLink(s: Statement, name: String, breedName: String): String = {
    val other = handlers.reporter(s.args(0))
    // This is so that we don't shuffle unnecessarily.  FD 10/31/2013
    val nonEmptyCommandBlock =
      s.args(1).asInstanceOf[CommandBlock]
        .statements.stmts.nonEmpty
    val body = handlers.fun(s.args(1))
    genAsk(s"LinkPrims.$name($other, '${fixBN(breedName)}')", nonEmptyCommandBlock, body)
  }

  def generateCreateTurtles(s: Statement, ordered: Boolean): String = {
    val n = handlers.reporter(s.args(0))
    val name = if (ordered) "createOrderedTurtles" else "createTurtles"
    val breed =
      s.command match {
        case x: prim._createturtles => x.breedName
        case x: prim._createorderedturtles => x.breedName
        case x => throw new IllegalArgumentException("How did you get here with class of type " + x.getClass.getName)
      }
    val body = handlers.fun(s.args(1))
    genAsk(s"world.turtleManager.$name($n, '$breed')", true, body)
  }

  def generateSprout(s: Statement): String = {
    val n = handlers.reporter(s.args(0))
    val body = handlers.fun(s.args(1))
    val breedName = s.command.asInstanceOf[prim._sprout].breedName
    val trueBreedName = if (breedName.nonEmpty) breedName else "TURTLES"
    val sprouted = s"SelfPrims.sprout($n, '$trueBreedName')"
    genAsk(sprouted, true, body)
  }

  def generateHatch(s: Statement, breedName: String): String = {
    val n = handlers.reporter(s.args(0))
    val body = handlers.fun(s.args(1))
    genAsk(s"SelfPrims.hatch($n, '$breedName')", true, body)
  }

  def generateEvery(w: Statement): String = {
    val time = handlers.reporter(w.args(0))
    s"""Prims.every($time, ${handlers.fun(w.args(1))}, '${handlers.nextEveryID()}');"""
  }

  private def failCompilation(msg: String, token: Token): Nothing =
    throw new CompilerException(msg, token.start, token.end, token.filename)

  private def fixBN(breedName: String): String =
    Option(breedName) filter (_.nonEmpty) getOrElse "LINKS"

  def genAsk(agents: String, shouldShuffle: Boolean, body: String): String =
    s"""$agents.ask($body, $shouldShuffle);"""

  def generateOf(r: ReporterApp): String = {
    val agents = handlers.reporter(r.args(1))
    val func   = handlers.fun(r.args(0), isReporter = true)
    s"$agents.projectionBy($func)"
  }

}
