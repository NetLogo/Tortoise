# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# DEATH TO `SimplePrims.SimpleReporter` AND `SimplePrims.InfixReporter`!

module.exports = {

      case call: prim._callreport         => (handlers.ident(call.name) +: args).mkString("Call(", ", ", ")")

      case _: prim._unaryminus         => s" -${arg(0)}" // The space is important, because these can be nested --JAB (6/12/14)
      case _: prim._not                => s"!${arg(0)}"
      case _: prim._count              => s"${arg(0)}.size()"
      case _: prim._any                => s"${arg(0)}.nonEmpty()"
      case _: prim._word               => ("''" +: args).map(arg => s"Dump($arg)").mkString("(", " + ", ")")
      case _: prim._of                 => generateOf(r)
      case _: prim.etc._ifelsevalue    => s"(${arg(0)} ? ${arg(1)} : ${arg(2)})"
      case _: prim.etc._reduce         => s"${arg(1)}.reduce(${arg(0)})"
      case _: prim.etc._filter         => s"${arg(1)}.filter(${arg(0)})"
      case _: prim.etc._nvalues        => s"Tasks.nValues(${arg(0)}, ${arg(1)})"
      case _: prim.etc._basecolors     => "ColorModel.BASE_COLORS"
      case prim._errormessage(Some(l)) => s"_error_${l.hashCode()}.message"

      case _: prim._with => s"$agents.agentFilter(${handlers.fun(r.args(1), true)})"
      case _: prim.etc._maxoneof => s"$agents.maxOneOf(${handlers.fun(r.args(1), true)})"
      case _: prim.etc._minoneof => s"$agents.minOneOf(${handlers.fun(r.args(1), true)})"
      case o: prim.etc._all => s"$agents.agentAll(${handlers.fun(r.args(1), true)})"

      case b: prim._breed                 => s"world.turtleManager.turtlesOfBreed(${jsString(b.breedName)})"
      case b: prim.etc._breedsingular     => s"world.turtleManager.getTurtleOfBreed(${jsString(b.breedName)}, ${arg(0)})"
      case b: prim.etc._linkbreed         => s"world.linkManager.linksOfBreed(${jsString(b.breedName)})"
      case p: prim.etc._linkbreedsingular => s"world.linkManager.getLink(${arg(0)}, ${arg(1)}, ${jsString(p.breedName)})"
      case b: prim.etc._breedhere         => s"SelfManager.self().breedHere(${jsString(b.breedName)})"
      case b: prim.etc._breedon           => s"Prims.breedOn(${jsString(b.breedName)}, ${arg(0)})"

      case bv: prim._breedvariable        => s"SelfPrims.getVariable(${jsString(bv.name.toLowerCase)})"
      case bv: prim._linkbreedvariable    => s"SelfPrims.getVariable(${jsString(bv.name.toLowerCase)})"
      case tv: prim._turtlevariable       => s"SelfPrims.getVariable(${jsString(tv.displayName.toLowerCase)})"
      case tv: prim._linkvariable         => s"SelfPrims.getVariable(${jsString(tv.displayName.toLowerCase)})"
      case tv: prim._turtleorlinkvariable => s"SelfPrims.getVariable(${jsString(tv.varName.toLowerCase)})"
      case pv: prim._patchvariable        => s"SelfPrims.getPatchVariable(${jsString(pv.displayName.toLowerCase)})"
      case ov: prim._observervariable     => s"world.observer.getGlobal(${jsString(ov.displayName.toLowerCase)})"

      case _: prim.etc._isagent          => s"NLType(${arg(0)}).isValidAgent()"
      case _: prim.etc._isagentset       => s"NLType(${arg(0)}).isAgentSet()"
      case x: prim.etc._isbreed          => s"NLType(${arg(0)}).isBreed(${jsString(x.breedName)})"
      case _: prim.etc._iscommandtask    => s"NLType(${arg(0)}).isCommandTask()"
      case _: prim.etc._isdirectedlink   => s"NLType(${arg(0)}).isDirectedLink()"
      case _: prim.etc._islink           => s"NLType(${arg(0)}).isValidLink()"
      case _: prim.etc._islinkset        => s"NLType(${arg(0)}).isLinkSet()"
      case _: prim.etc._islist           => s"NLType(${arg(0)}).isList()"
      case _: prim.etc._isnumber         => s"NLType(${arg(0)}).isNumber()"
      case _: prim.etc._ispatch          => s"NLType(${arg(0)}).isPatch()"
      case _: prim.etc._ispatchset       => s"NLType(${arg(0)}).isPatchSet()"
      case _: prim.etc._isreportertask   => s"NLType(${arg(0)}).isReporterTask()"
      case _: prim.etc._isstring         => s"NLType(${arg(0)}).isString()"
      case _: prim.etc._isturtle         => s"NLType(${arg(0)}).isValidTurtle()"
      case _: prim.etc._isturtleset      => s"NLType(${arg(0)}).isTurtleSet()"
      case _: prim.etc._isundirectedlink => s"NLType(${arg(0)}).isUndirectedLink()"

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

      case tv: prim._taskvariable => s"taskArguments[${tv.vn - 1}]"
      case _:  prim._reportertask => s"Tasks.reporterTask(${handlers.fun(r.args(0), isReporter = true, isTask = true)})"
      case _:  prim._commandtask  => s"Tasks.commandTask(${handlers.fun(r.args(0), isReporter = false, isTask = true)})"
      case rr: prim.etc._runresult => s"(${arg(0)})($taskInputs)"

      case _: prim._set                  => generateSet(s)
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
      case _: prim.etc._diffuse          => s"world.topology.diffuse(${jsString(getReferenceName(s))}, ${arg(1)})"
      case x: prim.etc._setdefaultshape  => s"BreedManager.setDefaultShape(${arg(0)}.getBreedName(), ${arg(1)})"
      case _: prim.etc._hidelink         => "SelfPrims.setVariable('hidden?', true)"
      case _: prim.etc._showlink         => "SelfPrims.setVariable('hidden?', false)"
      case call: prim._call              => (handlers.ident(call.name) +: args).mkString("Call(", ", ", ");")
      case _: prim.etc._report           => s"return ${arg(0)};"
      case _: prim.etc._ignore           => s"${arg(0)};"
      case l: prim._let                  => s"var ${handlers.ident(l.let.name)} = ${arg(0)};"
      case _: prim.etc._run => s"(${arg(0)})($taskInputs);"
      case _: prim.etc._foreach => s"Tasks.forEach(${arg(s.args.size - 1)}, $lists);"

      case p: prim._letvariable => s"${handlers.ident(p.let.name)} = ${arg(1)};"
      case p: prim._observervariable => s"world.observer.setGlobal(${jsString(p.displayName.toLowerCase)}, ${arg(1)});"
      case bv: prim._breedvariable => s"SelfPrims.setVariable(${jsString(bv.name.toLowerCase)}, ${arg(1)});"
      case bv: prim._linkbreedvariable => s"SelfPrims.setVariable(${jsString(bv.name.toLowerCase)}, ${arg(1)});"
      case p: prim._linkvariable => s"SelfPrims.setVariable(${jsString(p.displayName.toLowerCase)}, ${arg(1)});"
      case p: prim._turtlevariable => s"SelfPrims.setVariable(${jsString(p.displayName.toLowerCase)}, ${arg(1)});"
      case p: prim._turtleorlinkvariable => s"SelfPrims.setVariable(${jsString(p.varName.toLowerCase)}, ${arg(1)});"
      case p: prim._patchvariable => s"SelfPrims.setPatchVariable(${jsString(p.displayName.toLowerCase)}, ${arg(1)});"
      case p: prim._procedurevariable => s"${handlers.ident(p.name)} = ${arg(1)};"

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
    genAsk(s"LinkPrims.$name($other, ${jsString(fixBN(breedName))})", nonEmptyCommandBlock, body)
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
    genAsk(s"world.turtleManager.$name($n, ${jsString(breed)})", true, body)
  }

  def generateSprout(s: Statement): String = {
    val n = handlers.reporter(s.args(0))
    val body = handlers.fun(s.args(1))
    val breedName = s.command.asInstanceOf[prim._sprout].breedName
    val trueBreedName = if (breedName.nonEmpty) breedName else "TURTLES"
    val sprouted = s"SelfPrims.sprout($n, ${jsString(trueBreedName)})"
    genAsk(sprouted, true, body)
  }

  def generateHatch(s: Statement, breedName: String): String = {
    val n = handlers.reporter(s.args(0))
    val body = handlers.fun(s.args(1))
    genAsk(s"SelfPrims.hatch($n, ${jsString(breedName)})", true, body)
  }

  def generateEvery(w: Statement): String = {
    val time = handlers.reporter(w.args(0))
    val body = handlers.commands(w.args(1))
    val everyId = handlers.nextEveryID()
    s"""|if (Prims.isThrottleTimeElapsed("$everyId", workspace.selfManager.self(), $time)) {
        |  Prims.resetThrottleTimerFor("$everyId", workspace.selfManager.self());
        |${handlers.indented(body)}
        |}""".stripMargin
  }

  def genAsk(agents: String, shouldShuffle: Boolean, body: String): String =
    s"""$agents.ask($body, $shouldShuffle);"""

  def generateOf(r: ReporterApp): String = {
    val agents = handlers.reporter(r.args(1))
    val func   = handlers.fun(r.args(0), isReporter = true)
    s"AgentSetPrims.of($agents, $func)"
  }








  abs: -> # NLMath.abs
  acos: -> # NLMath.acos
  and: -> # &&
  asin: -> # NLMath.asin
  atan: -> # NLMath.atan
  autoplotoff: -> # plotManager.disableAutoplotting
  autoploton: -> # plotManager.enableAutoplotting
  autoplot: -> # plotManager.isAutoplotting
  bk: -> # SelfPrims.bk
  boom: -> # Prims.boom
  bothends: -> # SelfManager.self().bothEnds
  butfirst: -> # ListPrims.butFirst
  butlast: -> # ListPrims.butLast
  canmove: -> # SelfManager.self().canMove
  ceil: -> # NLMath.ceil
  changetopology: -> # world.changeTopology
  clearallplots: -> # plotManager.clearAllPlots
  clearall: -> # world.clearAll
  clearlinks: -> # world.linkManager.clear
  clearoutput: -> # OutputPrims.clear
  clearpatches: -> # world.clearPatches
  clearplot: -> # plotManager.clearPlot
  clearticks: -> # world.ticker.clear
  clearturtles: -> # world.turtleManager.clearTurtles
  cos: -> # NLMath.cos
  createtemporaryplotpen: -> # plotManager.createTemporaryPen
  die: -> # SelfPrims.die
  distance: -> # SelfManager.self().distance
  distancexy: -> # SelfManager.self().distanceXY
  div: -> # /
  done: -> # 
  dx: -> # SelfManager.self().dx
  dy: -> # SelfManager.self().dy
  empty: -> # ListPrims.empty
  equal: -> # Prims.equality
  exp: -> # NLMath.exp
  face: -> # SelfManager.self().face
  facexy: -> # SelfManager.self().faceXY
  fd: -> # SelfPrims.fd
  first: -> # ListPrims.first
  floor: -> # NLMath.floor
  followme: -> # SelfManager.self().followMe
  follow: -> # world.observer.follow
  fput: -> # ListPrims.fput
  greaterorequal: -> # Prims.gte
  greaterthan: -> # Prims.gt
  hideturtle: -> # SelfManager.self().hideTurtle(true);
  histogram: -> # plotManager.drawHistogramFrom
  inradius: -> # SelfManager.self().inRadius
  int: -> # NLMath.toInt
  item: -> # ListPrims.item
  jump: -> # SelfPrims.jump
  last: -> # ListPrims.last
  layoutspring: -> # LayoutManager.layoutSpring
  left: -> # SelfPrims.left
  length: -> # ListPrims.length
  lessorequal: -> # Prims.lte
  lessthan: -> # Prims.lt
  linkheading: -> # SelfPrims.linkHeading
  linklength: -> # SelfPrims.linkLength
  linkset: -> # AgentSetPrims.linkSet
  links: -> # world.links
  link: -> # world.linkManager.getLink
  list: -> # ListPrims.list
  ln: -> # NLMath.ln
  log: -> # NLMath.log
  lput: -> # ListPrims.lput
  map: -> # Tasks.map
  max: -> # ListPrims.max
  maxpxcor: -> # world.topology.maxPxcor
  maxpycor: -> # world.topology.maxPycor
  mean: -> # ListPrims.mean
  median: -> # ListPrims.median
  member: -> # ListPrims.member
  min: -> # ListPrims.min
  minpxcor: -> # world.topology.minPxcor
  minpycor: -> # world.topology.minPycor
  minus: -> # -
  mod: -> # NLMath.mod
  mousedown: -> # MousePrims.isDown
  mouseinside: -> # MousePrims.isInside
  mousexcor: -> # MousePrims.getX
  mouseycor: -> # MousePrims.getY
  moveto: -> # SelfManager.self().moveTo
  mult: -> # *
  myself: -> # SelfManager.myself
  neighbors4: -> # SelfPrims.getNeighbors4
  neighbors: -> # SelfPrims.getNeighbors
  netlogoapplet: -> # Meta.isApplet
  netlogoversion: -> # Meta.version
  nobody: -> # "Nobody"
  nof: -> # ListPrims.nOf
  nolinks: -> # new LinkSet([])
  nopatches: -> # new PatchSet([])
  notequal: -> # !Prims.equality
  noturtles: -> # new TurtleSet([])
  observercode: -> # 
  oneof: -> # ListPrims.oneOf
  or: -> # ||
  otherend: -> # SelfManager.self().otherEnd
  other: -> # SelfPrims.other
  outputprint: -> # OutputPrims.print
  outputshow: -> # OutputPrims.show(SelfManager.self)
  outputtype: -> # OutputPrims.type
  outputwrite: -> # OutputPrims.write
  patchahead: -> # SelfManager.self().patchAhead
  patchat: -> # SelfManager.self().patchAt
  patches: -> # world.patches
  patchhere: -> # SelfManager.self().getPatchHere
  patchleftandahead: -> # SelfManager.self().patchLeftAndAhead
  patchrightandahead: -> # SelfManager.self().patchRightAndAhead
  patchset: -> # AgentSetPrims.patchSet
  patch: -> # world.getPatchAt
  pendown: -> # SelfManager.self().penManager.lowerPen
  penup: -> # SelfManager.self().penManager.raisePen
  plotname: -> # plotManager.getPlotName
  plotpendown: -> # plotManager.lowerPen
  plotpenexists: -> # plotManager.hasPenWithName
  plotpenreset: -> # plotManager.resetPen
  plotpenup: -> # plotManager.raisePen
  plot: -> # plotManager.plotValue
  plotxmax: -> # plotManager.getPlotXMax
  plotxmin: -> # plotManager.getPlotXMin
  plotxy: -> # plotManager.plotPoint
  plotymax: -> # plotManager.getPlotYMax
  plotymin: -> # plotManager.getPlotYMin
  plus: -> # +
  position: -> # ListPrims.position
  pow: -> # NLMath.pow
  precision: -> # NLMath.precision
  print: -> # PrintPrims.print
  randomfloat: -> # Prims.randomFloat
  random: -> # Prims.random
  randomseed: -> # Random.setSeed
  randomxcor: -> # world.topology.randomXcor
  randomycor: -> # world.topology.randomYcor
  remainder: -> # %
  removeduplicates: -> # ListPrims.removeDuplicates
  removeitem: -> # ListPrims.removeItem
  remove: -> # ListPrims.remove
  replaceitem: -> # ListPrims.replaceItem
  resetperspective: -> # world.observer.resetPerspective
  resetticks: -> # world.ticker.reset
  resettimer: -> # workspace.timer.reset
  resizeworld: -> # world.resize
  reverse: -> # ListPrims.reverse
  rideme: -> # SelfManager.self().rideMe
  ride: -> # world.observer.ride
  right: -> # SelfPrims.right
  round: -> # NLMath.round
  scalecolor: -> # ColorModel.scaleColor
  self: -> # SelfManager.self
  sentence: -> # ListPrims.sentence
  setcurrentplotpen: -> # plotManager.setCurrentPen
  setcurrentplot: -> # plotManager.setCurrentPlot
  sethistogramnumbars: -> # plotManager.setHistogramBarCount
  setplotpencolor: -> # plotManager.setPenColor
  setplotpeninterval: -> # plotManager.setPenInterval
  setplotpenmode: -> # plotManager.setPenMode
  setplotxrange: -> # plotManager.setXRange
  setplotyrange: -> # plotManager.setYRange
  setupplots: -> # plotManager.setupPlots
  setxy: -> # SelfPrims.setXY
  shadeof: -> # ColorModel.areRelatedByShade
  show: -> # PrintPrims.show(SelfManager.self)
  showturtle: -> # SelfManager.self().hideTurtle(false);
  sin: -> # NLMath.sin
  sort: -> # ListPrims.sort
  sqrt: -> # NLMath.sqrt
  standarddeviation: -> # ListPrims.standardDeviation
  stop: -> # throw new Exception.StopInterrupt
  subject: -> # world.observer.subject
  sublist: -> # ListPrims.sublist
  substring: -> # ListPrims.substring
  subtractheadings: -> # NLMath.subtractHeadings
  sum: -> # ListPrims.sum
  tan: -> # NLMath.tan
  tickadvance: -> # world.ticker.tickAdvance
  ticks: -> # world.ticker.tickCount
  tick: -> # world.ticker.tick
  tie: -> # SelfManager.self().tie
  timer: -> # workspace.timer.elapsed
  towards: -> # SelfManager.self().towards
  towardsxy: -> # SelfManager.self().towardsXY
  turtlesat: -> # SelfManager.self().turtlesAt
  turtleset: -> # AgentSetPrims.turtleSet
  turtleshere: -> # SelfManager.self().turtlesHere
  turtleson: -> # Prims.turtlesOn
  turtles: -> # world.turtles
  turtle: -> # world.turtleManager.getTurtle
  type: -> # PrintPrims.type
  untie: -> # SelfManager.self().untie
  updateplots: -> # plotManager.updatePlots
  variance: -> # ListPrims.variance
  watchme: -> # SelfManager.self().watchMe
  watch: -> # world.observer.watch
  worldheight: -> # world.topology.height
  worldwidth: -> # world.topology.width
  write: -> # PrintPrims.write
  xor: -> # !=

}
