// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import org.nlogo.{ api, compile => ast, nvm, prim, workspace },
   nvm.FrontEndInterface.{ ProceduresMap, NoProcedures },
   org.nlogo.shape.{LinkShape, VectorShape}

import collection.JavaConverters._

object Compiler {

  val frontEnd: ast.FrontEndInterface = ast.front.FrontEnd

  // three main entry points. input is NetLogo, result is JavaScript.

  def compileReporter(logo: String,
    oldProcedures: ProceduresMap = NoProcedures,
    program: api.Program = api.Program.empty()): String =
    compile(logo, commands = false, oldProcedures, program)

  def compileCommands(logo: String,
    oldProcedures: ProceduresMap = NoProcedures,
    program: api.Program = api.Program.empty()): String =
    compile(logo, commands = true, oldProcedures, program)

  def compileProcedures(
      logo: String,
      interfaceGlobals: Seq[String] = Seq(),
      interfaceGlobalCommands: String = "",
      dimensions: api.WorldDimensions = api.WorldDimensions.square(0),
      turtleShapeList: api.ShapeList = new api.ShapeList(api.AgentKind.Turtle),
      linkShapeList: api.ShapeList = new api.ShapeList(api.AgentKind.Link))
      : (String, api.Program, ProceduresMap) = {
    // (Seq[ProcedureDefinition], StructureParser.Results)
    val (defs, sp) =
      frontEnd.frontEnd(logo,
        program = api.Program.empty.copy(interfaceGlobals = interfaceGlobals))
    val js =
      new RuntimeInit(sp.program, dimensions, turtleShapeList, linkShapeList).init +
        defs.map(compileProcedureDef).mkString("", "\n", "\n") +
        compileCommands(interfaceGlobalCommands, program = sp.program)
    if (sp.program.linkBreeds.nonEmpty)
      throw new IllegalArgumentException("unknown language feature: link breeds")
    (js, sp.program, sp.procedures)
  }

  private def compileProcedureDef(pd: ast.ProcedureDefinition): String = {
    val name = ident(pd.procedure.name)
    val body = generateCommands(pd.statements)
    val args = pd.procedure.args.map(ident).mkString(", ")
    s"function $name ($args) {\n$body\n};"
  }

  // bogus, will need work - ST 9/13/13
  def ident(s: String) =
    s.replaceAll("-", "_")
     .replaceAll("\\?", "_P")

  ///

  // How this works:
  // - the header/footer stuff wraps the code in `to` or `to-report`
  // - the compile returns a Seq, whose head is a ProcedureDefinition
  //   containing some Statements (the procedure body)
  // - in the reporter case, the procedure body starts with the
  //   `__observer-code` command followed by the `report` command, so the
  //   actual reporter is the first (and only) argument to `report`

  def compile(logo: String, commands: Boolean,
      oldProcedures: ProceduresMap = NoProcedures,
      program: api.Program = api.Program.empty()): String = {
    val wrapped =
      workspace.Evaluator.getHeader(api.AgentKind.Observer, commands) +
        logo + workspace.Evaluator.getFooter(commands)
    val (defs, _) = frontEnd.frontEnd(wrapped, oldProcedures, program)  // Seq[ProcedureDefinition]
    if (commands) generateCommands(defs.head.statements)
    else genArg(defs.head.statements.tail.head.args.head)
  }

  ///

  def generateCommands(cs: ast.Statements): String =
    cs.map(generateCommand).filter(_.nonEmpty).mkString("\n")

  ///

  def generateCommand(s: ast.Statement): String = {
    def arg(i: Int) = genArg(s.args(i))
    def args =
      s.args.collect{ case x: ast.ReporterApp =>
        genArg(x) }.mkString(", ")
    s.command match {
      case _: prim._done             => ""
      case _: prim.etc._observercode => ""
      case _: prim.etc._while        => Prims.generateWhile(s)
      case _: prim.etc._if           => Prims.generateIf(s)
      case _: prim.etc._ifelse       => Prims.generateIfElse(s)
      case l: prim._let
        // arg 0 is the name but we don't access it because LetScoper took care of it.
        // arg 1 is the value.
                                     => s"var ${ident(l.let.name)} = ${arg(1)};"
      case call: prim._call          => s"${ident(call.procedure.name)}($args)"
      case _: prim.etc._report       => s"return $args;"
      case _: prim.etc._stop         => "return"
      case _: prim._ask              => Prims.generateAsk(s, shuffle = true)
      case _: prim._createturtles        => Prims.generateCreateTurtles(s, ordered = false)
      case _: prim._createorderedturtles => Prims.generateCreateTurtles(s, ordered = true)
      case _: prim._sprout               => Prims.generateSprout(s)
      case _: prim.etc._createlinkfrom   => Prims.generateCreateLink(s, "createLinkFrom")
      case _: prim.etc._createlinksfrom  => Prims.generateCreateLink(s, "createLinksFrom")
      case _: prim.etc._createlinkto     => Prims.generateCreateLink(s, "createLinkTo")
      case _: prim.etc._createlinksto    => Prims.generateCreateLink(s, "createLinksTo")
      case _: prim.etc._createlinkwith   => Prims.generateCreateLink(s, "createLinkWith")
      case _: prim.etc._createlinkswith  => Prims.generateCreateLink(s, "createLinksWith")
      case h: prim._hatch                => Prims.generateHatch(s, h.breedName)
      case _: prim.etc._hideturtle       => "AgentSet.self().hideTurtle(true);"
      case _: prim.etc._showturtle       => "AgentSet.self().hideTurtle(false);"
      case Prims.NormalCommand(op)   => s"$op($args)"
      case r: prim._repeat           =>
        s"for(var i = 0; i < ${arg(0)}; i++) { ${genCommandBlock(s.args(1))} }"
      case _: prim._set              =>
        s.args(0).asInstanceOf[ast.ReporterApp].reporter match {
          case p: prim._letvariable =>
            s"${ident(p.let.name)} = ${arg(1)};"
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
            s"${ident(p.name)} = ${arg(1)};"
          case x =>
            throw new IllegalArgumentException(
              "unknown settable: " + x.getClass.getName)
        }
      case _ =>
        throw new IllegalArgumentException(
          "unknown primitive: " + s.command.getClass.getName)
    }
  }

  def generateReporter(r: ast.ReporterApp): String = {
    def arg(i: Int) = genArg(r.args(i))
    def commaArgs = argsSep(", ")
    def args =
      r.args.collect{ case x: ast.ReporterApp => genArg(x) }
    def argsSep(sep: String) =
      args.mkString(sep)
    r.reporter match {
      case _: prim._nobody                  => "Nobody"
      case x: prim.etc._isbreed             => s"""${arg(0)}.isBreed("${x.breedName}")"""
      case b: prim.etc._breed               => s"""world.turtlesOfBreed("${b.getBreedName}")"""
      case b: prim.etc._breedsingular       => s"""world.getTurtleOfBreed("${b.breedName}", ${arg(0)})"""
      case b: prim.etc._breedhere           => s"""AgentSet.self().breedHere("${b.getBreedName}")"""
      case x: prim.etc._turtle              => s"world.getTurtle(${arg(0)})"
      case pure: nvm.Pure if r.args.isEmpty => compileLiteral(pure.report(null))
      case lv: prim._letvariable            => ident(lv.let.name)
      case pv: prim._procedurevariable      => ident(pv.name)
      case call: prim._callreport           => s"${ident(call.procedure.name)}($commaArgs)"
      case Prims.InfixReporter(op)          => s"(${arg(0)} $op ${arg(1)})"
      case Prims.NormalReporter(op)         => s"$op($commaArgs)"
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
      case s: prim._word                    =>
        ("\"\"" +: args).map(arg => "Dump(" + arg + ")").mkString("(", " + ", ")")
      case w: prim._with =>
        val agents = arg(0)
        val filter = genReporterBlock(r.args(1))
        s"AgentSet.agentFilter($agents, function(){ return $filter })"
      case o: prim._of =>
        val agents = arg(1)
        val body = genReporterBlock(r.args(0))
        s"AgentSet.of($agents, function(){ return $body })"
      case p: prim.etc._patch               => s"Prims.patch($commaArgs)"
      case _: prim.etc._nopatches           => "new Agents([])"
      case _: prim.etc._noturtles           => "new Agents([])"
      case n: prim._neighbors               => s"Prims.getNeighbors()"
      case n: prim._neighbors4              => s"Prims.getNeighbors4()"
      case _: prim.etc._minpxcor            => "world.minPxcor"
      case _: prim.etc._minpycor            => "world.minPycor"
      case _: prim.etc._maxpxcor            => "world.maxPxcor"
      case _: prim.etc._maxpycor            => "world.maxPycor"
      case _: prim.etc._worldwidth          => "world.width()"
      case _: prim.etc._worldheight         => "world.height()"
      case _: prim.etc._linkneighbors       => "AgentSet.linkNeighbors(false, false)"
      case _: prim.etc._inlinkneighbors     => "AgentSet.linkNeighbors(true, false)"
      case _: prim.etc._outlinkneighbors    => "AgentSet.linkNeighbors(true, true)"
      case _: prim.etc._mylinks             => "AgentSet.connectedLinks(false, false)"
      case _: prim.etc._myinlinks           => "AgentSet.connectedLinks(true, false)"
      case _: prim.etc._myoutlinks          => "AgentSet.connectedLinks(true, true)"
      case _: prim.etc._islink              => s"(${arg(0)} instanceof Link)"
      case _ =>
        throw new IllegalArgumentException(
          "unknown primitive: " + r.reporter.getClass.getName)
    }
  }

  def compileLiteral(x: AnyRef): String = x match {
    case ll: api.LogoList => ll.map(compileLiteral).mkString("[", ", ", "]")
    case x                => api.Dump.logoObject(x, readable = true, exporting = false)
  }

  // these could be merged into one function, genExpression
  // but I think the resulting code would be confusing and potentially error prone.
  // having different functions for each is more clear.

  def genReporterApp(e: ast.Expression) = e match {
    case r: ast.ReporterApp => generateReporter(r)
  }
  def genArg(e: ast.Expression) = genReporterApp(e)
  def genReporterBlock(e: ast.Expression) = e match {
    case r: ast.ReporterBlock => Compiler.generateReporter(r.app)
  }
  def genCommandBlock(e: ast.Expression) = e match {
    case cb: ast.CommandBlock => Compiler.generateCommands(cb.statements)
  }
}
