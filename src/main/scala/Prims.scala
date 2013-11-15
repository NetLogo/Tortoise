// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import org.nlogo.{ api, compile => ast, nvm, prim }

object Prims {

  def generateReporter(r: ast.ReporterApp): String = {
    def arg(i: Int) = Compiler.genArg(r.args(i))
    def commaArgs = argsSep(", ")
    def args =
      r.args.collect{ case x: ast.ReporterApp => Compiler.genArg(x) }
    def argsSep(sep: String) =
      args.mkString(sep)
    r.reporter match {
      case EasyPrims.SimpleReporter(op)     => op
      case EasyPrims.InfixReporter(op)      => s"(${arg(0)} $op ${arg(1)})"
      case EasyPrims.NormalReporter(op)     => s"$op($commaArgs)"
      case x: prim.etc._isbreed             => s"""${arg(0)}.isBreed("${x.breedName}")"""
      case b: prim.etc._breed               => s"""world.turtlesOfBreed("${b.getBreedName}")"""
      case b: prim.etc._breedsingular       => s"""world.getTurtleOfBreed("${b.breedName}", ${arg(0)})"""
      case b: prim.etc._breedhere           => s"""AgentSet.self().breedHere("${b.getBreedName}")"""
      case pure: nvm.Pure if r.args.isEmpty => Compiler.compileLiteral(pure.report(null))
      case lv: prim._letvariable            => Compiler.ident(lv.let.name)
      case pv: prim._procedurevariable      => Compiler.ident(pv.name)
      case call: prim._callreport           => s"${Compiler.ident(call.procedure.name)}($commaArgs)"
      case _: prim._unaryminus              => s"(- ${arg(0)})"
      case bv: prim._breedvariable          => s"""AgentSet.getBreedVariable("${bv.name}")"""
      case tv: prim._turtlevariable         => s"AgentSet.getTurtleVariable(${tv.vn})"
      case tv: prim._linkvariable           => s"AgentSet.getLinkVariable(${tv.vn})"
      case tv: prim._turtleorlinkvariable   =>
        val vn = api.AgentVariables.getImplicitTurtleVariables.indexOf(tv.varName)
        s"AgentSet.getTurtleVariable($vn)"
      case pv: prim._patchvariable          => s"AgentSet.getPatchVariable(${pv.vn})"
      case r: prim._reference               => s"${r.reference.vn}"
      case ov: prim._observervariable       => s"Globals.getGlobal(${ov.vn})"
      case _: prim._word                    =>
        ("\"\"" +: args).map(arg => "Dump(" + arg + ")").mkString("(", " + ", ")")
      case _: prim._with =>
        val agents = arg(0)
        val filter = Compiler.genArg(r.args(1))
        s"AgentSet.agentFilter($agents, function(){ return $filter })"
      case _: prim._of =>
        val agents = arg(1)
        val body = Compiler.genArg(r.args(0))
        s"AgentSet.of($agents, function(){ return $body })"
      case _: prim.etc._islink              => s"(${arg(0)} instanceof Link)"
      case _ =>
        throw new IllegalArgumentException(
          "unknown primitive: " + r.reporter.getClass.getName)
    }
  }

  def generateCommand(s: ast.Statement): String = {
    def arg(i: Int) = Compiler.genArg(s.args(i))
    def args =
      s.args.collect{ case x: ast.ReporterApp =>
        Compiler.genArg(x) }.mkString(", ")
    s.command match {
      case EasyPrims.SimpleCommand(op)   => op
      case EasyPrims.NormalCommand(op)   => s"$op($args)"
      case _: prim._set                  => generateSet(s)
      case _: prim.etc._while            => generateWhile(s)
      case _: prim.etc._if               => generateIf(s)
      case _: prim.etc._ifelse           => generateIfElse(s)
      case _: prim._ask                  => generateAsk(s, shuffle = true)
      case _: prim._createturtles        => generateCreateTurtles(s, ordered = false)
      case _: prim._createorderedturtles => generateCreateTurtles(s, ordered = true)
      case _: prim._sprout               => generateSprout(s)
      case _: prim.etc._createlinkfrom   => generateCreateLink(s, "createLinkFrom")
      case _: prim.etc._createlinksfrom  => generateCreateLink(s, "createLinksFrom")
      case _: prim.etc._createlinkto     => generateCreateLink(s, "createLinkTo")
      case _: prim.etc._createlinksto    => generateCreateLink(s, "createLinksTo")
      case _: prim.etc._createlinkwith   => generateCreateLink(s, "createLinkWith")
      case _: prim.etc._createlinkswith  => generateCreateLink(s, "createLinksWith")
      case h: prim._hatch                => generateHatch(s, h.breedName)
      case call: prim._call              => s"${Compiler.ident(call.procedure.name)}($args)"
      case _: prim.etc._report           => s"return $args;"
      case l: prim._let                  =>
        // arg 0 is the name but we don't access it because LetScoper took care of it.
        // arg 1 is the value.
        s"var ${Compiler.ident(l.let.name)} = ${arg(1)};"
      case _: prim._repeat               =>
        s"for(var i = 0; i < ${arg(0)}; i++) { ${Compiler.genArg(s.args(1))} }"
      case _ =>
        throw new IllegalArgumentException(
          "unknown primitive: " + s.command.getClass.getName)
    }
  }

  /// custom generators for particular Commands

  def generateSet(s: ast.Statement): String = {
    def arg(i: Int) = Compiler.genArg(s.args(i))
    s.args(0).asInstanceOf[ast.ReporterApp].reporter match {
      case p: prim._letvariable =>
        s"${Compiler.ident(p.let.name)} = ${arg(1)};"
      case p: prim._observervariable =>
        s"Globals.setGlobal(${p.vn},${arg(1)})"
      case bv: prim._breedvariable =>
        s"""AgentSet.setBreedVariable("${bv.name}",${arg(1)})"""
      case p: prim._linkvariable =>
        s"AgentSet.setLinkVariable(${p.vn},${arg(1)})"
      case p: prim._turtlevariable =>
        s"AgentSet.setTurtleVariable(${p.vn},${arg(1)})"
      case p: prim._turtleorlinkvariable if p.varName == "BREED" =>
        s"AgentSet.setBreed(${arg(1)})"
      case p: prim._turtleorlinkvariable =>
        val vn = api.AgentVariables.getImplicitTurtleVariables.indexOf(p.varName)
        s"AgentSet.setTurtleVariable($vn,${arg(1)})"
      case p: prim._patchvariable =>
        s"AgentSet.setPatchVariable(${p.vn},${arg(1)})"
      case p: prim._procedurevariable =>
        s"${Compiler.ident(p.name)} = ${arg(1)};"
      case x =>
        throw new IllegalArgumentException(
          "unknown settable: " + x.getClass.getName)
    }
  }

  def generateWhile(w: ast.Statement): String = {
    val pred = Compiler.genArg(w.args.head)
    val body = Compiler.genArg(w.args.tail.head)
    s"""while ($pred) {
      |$body
      |}""".stripMargin
  }

  def generateIf(s: ast.Statement): String = {
    val pred = Compiler.genArg(s.args.head)
    val body = Compiler.genArg(s.args.tail.head)
    s"""if ($pred) {
      |$body
      |}""".stripMargin
  }

  def generateIfElse(s: ast.Statement): String = {
    val pred      = Compiler.genArg(s.args.head)
    val thenBlock = Compiler.genArg(s.args.tail.head)
    val elseBlock = Compiler.genArg(s.args.tail.tail.head)
    s"""if ($pred) {
      |$thenBlock
      |} else {
      |$elseBlock
      |}""".stripMargin
  }

  def generateAsk(s: ast.Statement, shuffle: Boolean): String = {
    val agents = Compiler.genArg(s.args.head)
    val body   = fun(Compiler.genArg(s.args.tail.head))
    s"AgentSet.ask($agents, $shuffle, $body);"
  }

  def generateCreateLink(s: ast.Statement, name: String): String = {
    import org.nlogo.prim._
    val other = Compiler.genArg(s.args.head)
    // This is so that we don't shuffle unnecessarily.  FD 10/31/2013
    val nonEmptyCommandBlock =
      s.args.tail.head.asInstanceOf[ast.CommandBlock]
        .statements.nonEmpty
    val body = fun(Compiler.genArg(s.args.tail.head))
    s"""AgentSet.ask(AgentSet.$name($other), $nonEmptyCommandBlock, $body);"""
  }

  def generateCreateTurtles(s: ast.Statement, ordered: Boolean): String = {
    import org.nlogo.prim._
    val n = Compiler.genArg(s.args.head)
    val name = if (ordered) "createorderedturtles" else "createturtles"
    val breed =
      s.command match {
        case x: _createturtles => x.breedName
        case x: _createorderedturtles => x.breedName
        case x => throw new IllegalArgumentException("How did you get here with class of type " + x.getClass.getName)
      }
    val body = fun(Compiler.genArg(s.args.tail.head))
    s"""AgentSet.ask(world.$name($n, "$breed"), true, $body);"""
  }

  def generateSprout(s: ast.Statement): String = {
    val n = Compiler.genArg(s.args.head)
    val body = fun(Compiler.genArg(s.args.tail.head))
    val breedName = s.command.asInstanceOf[prim._sprout].breedName
    s"""AgentSet.ask(Prims.sprout($n, "$breedName"), true, $body);"""
  }

  def generateHatch(s: ast.Statement, breedName: String): String = {
    val n = Compiler.genArg(s.args.head)
    val body = fun(Compiler.genArg(s.args.tail.head))
    s"""AgentSet.ask(Prims.hatch($n, "$breedName"), true, $body);"""
  }

  def fun(body: String) = s"function(){ $body }"

}
