// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  JsOps.jsString

import
  org.nlogo.core.{ Command, prim, Reporter }

object SimplePrims {
  // scalastyle:off method.length
  // scalastyle:off cyclomatic.complexity
  // scalastyle:off line.size.limit
  object SimpleReporter {
    def unapply(r: Reporter): Option[String] =
      PartialFunction.condOpt(r) {
        case _: prim._nobody             => "Nobody"
        case _: prim.etc._basecolors     => "ColorModel.BASE_COLORS"
        case _: prim.etc._behaviorspaceexperimentname => "Meta.behaviorSpaceName"
        case _: prim.etc._behaviorspacerunnumber      => "Meta.behaviorSpaceRun"
        case _: prim.etc._linkshapes     => "Object.keys(world.linkShapeMap)"
        case _: prim.etc._maxpxcor       => "world.topology.maxPxcor"
        case _: prim.etc._maxpycor       => "world.topology.maxPycor"
        case _: prim.etc._minpxcor       => "world.topology.minPxcor"
        case _: prim.etc._minpycor       => "world.topology.minPycor"
        case _: prim.etc._netlogoapplet  => "Meta.isApplet"
        case _: prim.etc._netlogoversion => "Meta.version"
        case _: prim.etc._netlogoweb     => "Meta.isWeb"
        case _: prim.etc._nolinks        => "new LinkSet([], world)"
        case _: prim.etc._nopatches      => "new PatchSet([], world)"
        case _: prim.etc._noturtles      => "new TurtleSet([], world)"
        case _: prim.etc._patchsize      => "world.patchSize"
        case _: prim.etc._randompxcor    => "RandomPrims.randomInRange(world.topology.minPxcor, world.topology.maxPxcor)"
        case _: prim.etc._randompycor    => "RandomPrims.randomInRange(world.topology.minPycor, world.topology.maxPycor)"
        case _: prim.etc._randomxcor     => "RandomPrims.randomFloatInRange(world.topology.minPxcor, world.topology.maxPxcor)"
        case _: prim.etc._randomycor     => "RandomPrims.randomFloatInRange(world.topology.minPycor, world.topology.maxPycor)"
        case _: prim.etc._shapes         => "Object.keys(world.turtleShapeMap)"
        case _: prim.etc._worldheight    => "world.topology.height"
        case _: prim.etc._worldwidth     => "world.topology.width"
      }
  }

  object CheckedReporter {
    def unapply(r: Reporter): Option[String] =
      PartialFunction.condOpt(r) {

        // List prims
        case _: prim.etc._empty             => "PrimChecks.list.empty"
        case _: prim.etc._filter            => "PrimChecks.list.filter"
        case _: prim.etc._first             => "PrimChecks.list.first"
        case _: prim.etc._fput              => "PrimChecks.list.fput"
        case _: prim.etc._insertitem        => "PrimChecks.list.insertItem"
        case _: prim.etc._item              => "PrimChecks.list.item"
        case _: prim.etc._last              => "PrimChecks.list.last"
        case _: prim.etc._length            => "PrimChecks.list.length"
        case _: prim.etc._lput              => "PrimChecks.list.lput"
        case _: prim.etc._max               => "PrimChecks.list.max"
        case _: prim.etc._mean              => "PrimChecks.list.mean"
        case _: prim.etc._median            => "PrimChecks.list.median"
        case _: prim.etc._member            => "PrimChecks.list.member"
        case _: prim.etc._min               => "PrimChecks.list.min"
        case _: prim.etc._modes             => "PrimChecks.list.modes"
        case _: prim.etc._nof               => "PrimChecks.list.nOf"
        case _: prim.etc._position          => "PrimChecks.list.position"
        case _: prim.etc._reduce            => "PrimChecks.list.reduce"
        case _: prim.etc._removeduplicates  => "PrimChecks.list.removeDuplicates"
        case _: prim.etc._removeitem        => "PrimChecks.list.removeItem"
        case _: prim.etc._remove            => "PrimChecks.list.remove"
        case _: prim.etc._replaceitem       => "PrimChecks.list.replaceItem"
        case _: prim.etc._reverse           => "PrimChecks.list.reverse"
        case _: prim.etc._shuffle           => "PrimChecks.list.shuffle"
        case _: prim.etc._sort              => "PrimChecks.list.sort"
        case _: prim.etc._sortby            => "PrimChecks.list.sortBy"
        case _: prim.etc._standarddeviation => "PrimChecks.list.standardDeviation"
        case _: prim.etc._sublist           => "PrimChecks.list.sublist"
        case _: prim.etc._substring         => "PrimChecks.list.substring"
        case _: prim.etc._uptonof           => "PrimChecks.list.upToNOf"
        case _: prim.etc._variance          => "PrimChecks.list.variance"
        case _: prim._oneof                 => "PrimChecks.list.oneOf"
        case _: prim._sum                   => "PrimChecks.list.sum"

        // Math
        case _: prim.etc._abs              => "PrimChecks.math.abs"
        case _: prim.etc._acos             => "PrimChecks.math.acos"
        case _: prim.etc._asin             => "PrimChecks.math.asin"
        case _: prim.etc._atan             => "PrimChecks.math.atan"
        case _: prim.etc._ceil             => "PrimChecks.math.ceil"
        case _: prim.etc._cos              => "PrimChecks.math.cos"
        case _: prim.etc._div              => "PrimChecks.math.div"
        case _: prim.etc._exp              => "PrimChecks.math.exp"
        case _: prim.etc._floor            => "PrimChecks.math.floor"
        case _: prim.etc._int              => "PrimChecks.math.int"
        case _: prim.etc._ln               => "PrimChecks.math.ln"
        case _: prim.etc._log              => "PrimChecks.math.log"
        case _: prim.etc._mod              => "PrimChecks.math.mod"
        case _: prim.etc._pow              => "PrimChecks.math.pow"
        case _: prim.etc._precision        => "PrimChecks.math.precision"
        case _: prim.etc._remainder        => "PrimChecks.math.remainder"
        case _: prim.etc._round            => "PrimChecks.math.round"
        case _: prim.etc._sin              => "PrimChecks.math.sin"
        case _: prim.etc._sqrt             => "PrimChecks.math.sqrt"
        case _: prim.etc._subtractheadings => "PrimChecks.math.subtractHeadings"
        case _: prim.etc._tan              => "PrimChecks.math.tan"
        case _: prim._unaryminus           => "PrimChecks.math.unaryminus"

        // Infix math
        case _: prim.etc._plus => "PrimChecks.math.plus"
        case _: prim._minus    => "PrimChecks.math.minus"
        case _: prim.etc._mult => "PrimChecks.math.mult"

        // Boolean
        case _: prim._not     => "PrimChecks.math.not"
        case _: prim.etc._xor => "PrimChecks.math.xor"

        // Random
        case _: prim._random                => "PrimChecks.math.random"
        case _: prim.etc._randomexponential => "PrimChecks.math.randomExponential"
        case _: prim.etc._randomfloat       => "PrimChecks.math.randomFloat"
        case _: prim.etc._randomnormal      => "PrimChecks.math.randomNormal"
        case _: prim.etc._randompoisson     => "PrimChecks.math.randomPoisson"
        case _: prim.etc._randomgamma       => "PrimChecks.math.randomGamma"

        // Agentset
        case _: prim._any           => "PrimChecks.agentset.any"
        case _: prim.etc._atpoints  => "PrimChecks.agentset.atPoints"
        case _: prim._count         => "PrimChecks.agentset.count"
        case _: prim.etc._turtleson => "PrimChecks.agentset.turtlesOn"

        // Turtle
        case _: prim.etc._towards   => "PrimChecks.turtle.towards"
        case _: prim.etc._towardsxy => "PrimChecks.turtle.towardsXY"

        // Patch
        case _: prim.etc._patch => "world.getPatchAt"

        // Link
        case _: prim.etc._linkheading => "PrimChecks.link.linkHeading"

        // Other
        case _: prim.etc._readfromstring => "ProcedurePrims.readFromString"

      }
  }

  object NormalReporter {
    def unapply(r: Reporter): Option[String] =
      PartialFunction.condOpt(r) {

        // SelfPrims
        case _: prim.etc._linklength  => "SelfPrims.linkLength"
        case _: prim._other           => "SelfPrims.other"

        // Optimizations
        case _: Optimizer._anyother   => "SelfPrims._optimalAnyOther"
        case _: Optimizer._countother => "SelfPrims._optimalCountOther"
        case _: Optimizer._patchrow   => "world._optimalPatchRow"
        case _: Optimizer._patchcol   => "world._optimalPatchCol"

        // SelfManager
        case _: prim.etc._bothends                   => "SelfManager.self().bothEnds"
        case _: prim.etc._canmove                    => "SelfManager.self().canMove"
        case _: prim.etc._distance                   => "SelfManager.self().distance"
        case _: prim.etc._distancexy                 => "SelfManager.self().distanceXY"
        case _: prim.etc._dx                         => "SelfManager.self().dx"
        case _: prim.etc._dy                         => "SelfManager.self().dy"
        case _: prim.etc._myself                     => "SelfManager.myself"
        case _: prim.etc._otherend                   => "SelfManager.self().otherEnd"
        case _: prim.etc._patchahead                 => "SelfManager.self().patchAhead"
        case _: prim.etc._patchatheadinganddistance  => "SelfManager.self().patchAtHeadingAndDistance"
        case _: prim.etc._patchhere                  => "SelfManager.self().getPatchHere"
        case _: prim.etc._patchleftandahead          => "SelfManager.self().patchLeftAndAhead"
        case _: prim.etc._patchrightandahead         => "SelfManager.self().patchRightAndAhead"
        case _: prim.etc._self                       => "SelfManager.self"
        case _: prim.etc._turtlesat                  => "SelfManager.self().turtlesAt"
        case _: prim.etc._turtleshere                => "SelfManager.self().turtlesHere"
        case _: prim.etc._incone                     => "SelfManager.self().inCone"
        case _: prim._inradius                       => "SelfManager.self().inRadius"
        case _: prim._neighbors                      => "SelfManager.self().getNeighbors"
        case _: prim._neighbors4                     => "SelfManager.self().getNeighbors4"
        case _: prim._patchat                        => "SelfManager.self().patchAt"

        // ListPrims
        case _: prim._list     => "ListPrims.list"
        case _: prim._sentence => "ListPrims.sentence"

        // Agentset
        // In theory these should be able to be made standard `CheckedReporters`, but in practice
        // their errors are weird enough that I'm going to leave them as custom.
        // -Jeremy B February 2021
        case _: prim.etc._linkset   => "PrimChecks.agentset.linkSet"
        case _: prim.etc._patchset  => "PrimChecks.agentset.patchSet"
        case _: prim.etc._turtleset => "PrimChecks.agentset.turtleSet"

        // Plotting
        case _: prim.etc._autoplot      => "plotManager.isAutoplotting"
        case _: prim.etc._plotname      => "plotManager.getPlotName"
        case _: prim.etc._plotpenexists => "plotManager.hasPenWithName"
        case _: prim.etc._plotxmax      => "plotManager.getPlotXMax"
        case _: prim.etc._plotxmin      => "plotManager.getPlotXMin"
        case _: prim.etc._plotymax      => "plotManager.getPlotYMax"
        case _: prim.etc._plotymin      => "plotManager.getPlotYMin"

        // MousePrims
        case _: prim.etc._mousedown   => "MousePrims.isDown"
        case _: prim.etc._mouseinside => "MousePrims.isInside"
        case _: prim.etc._mousexcor   => "MousePrims.getX"
        case _: prim.etc._mouseycor   => "MousePrims.getY"

        // Random
        case _: Optimizer._randomconst => "RandomPrims.randomLong"

        // ColorModel
        case _: prim.etc._approximatehsb => "ColorModel.nearestColorNumberOfHSB"
        case _: prim.etc._approximatergb => "ColorModel.nearestColorNumberOfRGB"
        case _: prim.etc._extracthsb     => "ColorModel.colorToHSB"
        case _: prim.etc._extractrgb     => "ColorModel.colorToRGB"
        case _: prim.etc._hsb            => "ColorModel.hsbToRGB"
        case _: prim.etc._rgb            => "ColorModel.genRGBFromComponents"
        case _: prim.etc._scalecolor     => "ColorModel.scaleColor"
        case _: prim.etc._shadeof        => "ColorModel.areRelatedByShade"
        case _: prim.etc._wrapcolor      => "ColorModel.wrapColor"

        case _: prim._turtle             => "world.turtleManager.getTurtle"
        case _: prim._equal              => "Prims.equality"
        case _: prim._notequal           => "!Prims.equality"
        case _: prim._turtles            => "world.turtles"
        case _: prim.etc._links          => "world.links"
        case _: prim._patches            => "world.patches"
        case _: prim.etc._ticks          => "world.ticker.tickCount"
        case _: prim.etc._timer          => "workspace.timer.elapsed"
        case _: prim.etc._map            => "Tasks.map"
        case _: prim.etc._newseed        => "Prims.generateNewSeed"
        case _: prim.etc._randomstate    => "Random.save"
        case _: prim._greaterthan        => "Prims.gt"
        case _: prim._lessthan           => "Prims.lt"
        case _: prim.etc._greaterorequal => "Prims.gte"
        case _: prim.etc._lessorequal    => "Prims.lte"
        case _: prim.etc._link           => "world.linkManager.getLink"
        case _: prim.etc._applyresult    => "Tasks.apply(\"__apply-result\")"
        case _: prim.etc._boom           => "Prims.boom"
        case _: prim.etc._subject        => "world.observer.subject"
        case _: prim.etc._dateandtime    => "Prims.dateAndTime"
        case _: prim.etc._nanotime       => "Prims.nanoTime"
        case _: prim.etc._useryesorno    => "UserDialogPrims.yesOrNo"
        case _: prim.etc._userinput      => "UserDialogPrims.input"

      }
  }

  object TypeCheck {
    def unapply(r: Reporter): Option[String] =
      PartialFunction.condOpt(r) {
        case _: prim.etc._isagent             => "isValidAgent("
        case _: prim.etc._isagentset          => "isAgentSet("
        case _: prim.etc._isanonymouscommand  => "isCommandLambda("
        case _: prim.etc._isanonymousreporter => "isReporterLambda("
        case _: prim.etc._isboolean           => "isBoolean("
        case x: prim.etc._isbreed             => s"isBreed(${jsString(x.breedName)}, "
        case _: prim.etc._isdirectedlink      => "isDirectedLink("
        case _: prim.etc._islink              => "isValidLink("
        case _: prim.etc._islinkset           => "isLinkSet("
        case _: prim.etc._islist              => "isList("
        case _: prim.etc._isnumber            => "isNumber("
        case _: prim.etc._ispatch             => "isPatch("
        case _: prim.etc._ispatchset          => "isPatchSet("
        case _: prim.etc._isstring            => "isString("
        case _: prim.etc._isturtle            => "isValidTurtle("
        case _: prim.etc._isturtleset         => "isTurtleSet("
        case _: prim.etc._isundirectedlink    => "isUndirectedLink("
      }
  }

  object SimpleCommand {
    def unapply(c: Command): Option[String] =
      PartialFunction.condOpt(c) {

        case _: prim._done             => ""
        case _: prim._stop             => "return PrimChecks.procedure.stop()"
        case _: prim.etc._die          => "return SelfManager.self().die()"
        case _: prim.etc._observercode => ""
        case _: prim.etc._hideturtle   => "SelfManager.self().hideTurtle(true)"
        case _: prim.etc._showturtle   => "SelfManager.self().hideTurtle(false)"

        case _: prim.etc._importpatchcolors => "PrimChecks.imperfectImport('import-pcolors')"
        case _: prim.etc._importpcolorsrgb  => "PrimChecks.imperfectImport('import-pcolors-rgb')"
        case _: prim.etc._importworld       => "PrimChecks.imperfectImport('import-world')"

      }
  }

  object CheckedCommand {
    def unapply(c: Command): Option[String] =
      PartialFunction.condOpt(c) {

        // Turtle
        case _: prim.etc._setxy  => "PrimChecks.turtle.setXY"
        case _: prim.etc._face   => "SelfManager.self().face"
        case _: prim.etc._facexy => "SelfManager.self().faceXY"

        // Random
        case _: prim.etc._randomseed => "PrimChecks.math.randomSeed"

      }
  }

  object NormalCommand {
    def unapply(c: Command): Option[String] =
      PartialFunction.condOpt(c) {

        // Text-printing
        case _: prim.etc._print => "PrintPrims.print"
        case _: prim.etc._show  => "PrintPrims.show(SelfManager.self)"
        case _: prim.etc._type  => "PrintPrims.type"
        case _: prim.etc._write => "PrintPrims.write"

        // Output
        case _: prim.etc._clearoutput => "OutputPrims.clear"
        case _: prim.etc._outputprint => "OutputPrims.print"
        case _: prim.etc._outputshow  => "OutputPrims.show(SelfManager.self)"
        case _: prim.etc._outputtype  => "OutputPrims.type"
        case _: prim.etc._outputwrite => "OutputPrims.write"

        // Optimizations
        case _: Optimizer._fdone       => "SelfManager.self()._optimalFdOne"
        case _: Optimizer._fdlessthan1 => "SelfManager.self()._optimalFdLessThan1"

        // SelfManager
        case _: prim._fd             => "SelfManager.self().fd"
        case _: prim._jump           => "SelfManager.self().jumpIfAble"
        case _: prim.etc._followme   => "SelfManager.self().followMe"
        case _: prim.etc._home       => "SelfManager.self().goHome"
        case _: prim.etc._moveto     => "SelfManager.self().moveTo"
        case _: prim.etc._pendown    => "SelfManager.self().penManager.lowerPen"
        case _: prim.etc._penerase   => "SelfManager.self().penManager.useEraser"
        case _: prim.etc._penup      => "SelfManager.self().penManager.raisePen"
        case _: prim.etc._rideme     => "SelfManager.self().rideMe"
        case _: prim.etc._right      => "SelfManager.self().right"
        case _: prim.etc._stamp      => "SelfManager.self().stamp"
        case _: prim.etc._stamperase => "SelfManager.self().stampErase"
        case _: prim.etc._tie        => "SelfManager.self().tie"
        case _: prim.etc._untie      => "SelfManager.self().untie"
        case _: prim.etc._watchme    => "SelfManager.self().watchMe"

        // Plotting
        case _: prim.etc._autoplotoff            => "plotManager.disableAutoplotting"
        case _: prim.etc._autoploton             => "plotManager.enableAutoplotting"
        case _: prim.etc._clearallplots          => "plotManager.clearAllPlots"
        case _: prim.etc._clearplot              => "plotManager.clearPlot"
        case _: prim.etc._createtemporaryplotpen => "plotManager.createTemporaryPen"
        case _: prim.etc._histogram              => "plotManager.drawHistogramFrom"
        case _: prim.etc._plotpendown            => "plotManager.lowerPen"
        case _: prim.etc._plotpenreset           => "plotManager.resetPen"
        case _: prim.etc._plotpenup              => "plotManager.raisePen"
        case _: prim.etc._plot                   => "plotManager.plotValue"
        case _: prim.etc._plotxy                 => "plotManager.plotPoint"
        case _: prim.etc._setcurrentplotpen      => "plotManager.setCurrentPen"
        case _: prim.etc._setcurrentplot         => "plotManager.setCurrentPlot"
        case _: prim.etc._sethistogramnumbars    => "plotManager.setHistogramBarCount"
        case _: prim.etc._setplotpencolor        => "plotManager.setPenColor"
        case _: prim.etc._setplotpeninterval     => "plotManager.setPenInterval"
        case _: prim.etc._setplotpenmode         => "plotManager.setPenMode"
        case _: prim.etc._setplotxrange          => "plotManager.setXRange"
        case _: prim.etc._setplotyrange          => "plotManager.setYRange"
        case _: prim.etc._setupplots             => "plotManager.setupPlots"
        case _: prim.etc._updateplots            => "plotManager.updatePlots"

        // Inspection
        case _: prim.etc._inspect                  => "InspectionPrims.inspect"
        case _: prim.etc._stopinspecting           => "InspectionPrims.stopInspecting"
        case _: prim.etc._stopinspectingdeadagents => "InspectionPrims.clearDead"

        // Misc.
        case _: prim.etc._clearall         => "world.clearAll"
        case _: prim.etc._cleardrawing     => "world.clearDrawing"
        case _: prim.etc._clearglobals     => "world.observer.clearCodeGlobals"
        case _: prim.etc._clearpatches     => "world.clearPatches"
        case _: prim.etc._clearturtles     => "world.turtleManager.clearTurtles"
        case _: prim.etc._clearticks       => "world.ticker.clear"
        case _: prim.etc._clearlinks       => "world.clearLinks"
        case _: prim.etc._resizeworld      => "world.resize"
        case _: prim.etc._setpatchsize     => "world.setPatchSize"
        case _: prim.etc._resetticks       => "world.ticker.reset"
        case _: prim.etc._tick             => "world.ticker.tick"
        case _: prim.etc._tickadvance      => "world.ticker.tickAdvance"
        case _: prim.etc._resettimer       => "workspace.timer.reset"
        case _: prim.etc._follow           => "world.observer.follow"
        case _: prim.etc._ride             => "world.observer.ride"
        case _: prim.etc._watch            => "world.observer.watch"
        case _: prim.etc._resetperspective => "world.observer.resetPerspective"
        case _: prim.etc._layoutspring     => "LayoutManager.layoutSpring"
        case _: prim.etc._layoutcircle     => "LayoutManager.layoutCircle"
        case _: prim.etc._layoutradial     => "LayoutManager.layoutRadial"
        case _: prim.etc._layouttutte      => "LayoutManager.layoutTutte"
        case _: prim.etc._changetopology   => "world.changeTopology"
        case _: prim.etc._apply            => "Tasks.apply(\"__apply\")"
        case _: prim.etc._stdout           => "Prims.stdout"
        case _: prim.etc._usermessage      => "UserDialogPrims.confirm"
        case _: prim.etc._exportoutput     => "ImportExportPrims.exportOutput"
        case _: prim.etc._exportplot       => "ImportExportPrims.exportPlot"
        case _: prim.etc._exportplots      => "ImportExportPrims.exportAllPlots"
        case _: prim.etc._exportview       => "ImportExportPrims.exportView"
        case _: prim.etc._exportworld      => "ImportExportPrims.exportWorld"
        case _: prim.etc._wait             => "Prims.wait"

        case _: prim.etc._importdrawing => "ImportExportPrims.importDrawing"

        // Unimplemented
        case _: prim.etc._display => "Prims.display"

      }
  }
  // scalastyle:on method.length
  // scalastyle:on cyclomatic.complexity
  // scalastyle:on line.size.limit
}
