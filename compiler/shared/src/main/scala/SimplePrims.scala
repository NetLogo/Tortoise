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
        case _: prim.etc._randompxcor    => "Prims.randomPatchCoord(world.topology.minPxcor, world.topology.maxPxcor)"
        case _: prim.etc._randompycor    => "Prims.randomPatchCoord(world.topology.minPycor, world.topology.maxPycor)"
        case _: prim.etc._randomxcor     => "Prims.randomCoord(world.topology.minPxcor, world.topology.maxPxcor)"
        case _: prim.etc._randomycor     => "Prims.randomCoord(world.topology.minPycor, world.topology.maxPycor)"
        case _: prim.etc._shapes         => "Object.keys(world.turtleShapeMap)"
        case _: prim.etc._worldheight    => "world.topology.height"
        case _: prim.etc._worldwidth     => "world.topology.width"
      }
  }

  object InfixReporter {
    def unapply(r: Reporter): Option[String] =
      PartialFunction.condOpt(r) {
        case _: prim.etc._plus      => "+"
        case _: prim._minus         => "-"
        case _: prim.etc._mult      => "*"
        case _: prim.etc._remainder => "%"
        case _: prim._and           => "&&"
        case _: prim._or            => "||"
        case _: prim.etc._xor       => "!="
      }
  }

  object NormalReporter {
    def unapply(r: Reporter): Option[String] =
      PartialFunction.condOpt(r) {

        // SelfPrims
        case _: prim.etc._linkheading => "SelfPrims.linkHeading"
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
        case _: prim.etc._towards                    => "SelfManager.self().towards"
        case _: prim.etc._towardsxy                  => "SelfManager.self().towardsXY"
        case _: prim.etc._turtlesat                  => "SelfManager.self().turtlesAt"
        case _: prim.etc._turtleshere                => "SelfManager.self().turtlesHere"
        case _: prim.etc._incone                     => "SelfManager.self().inCone"
        case _: prim._inradius                       => "SelfManager.self().inRadius"
        case _: prim._neighbors                      => "SelfManager.self().getNeighbors"
        case _: prim._neighbors4                     => "SelfManager.self().getNeighbors4"
        case _: prim._patchat                        => "SelfManager.self().patchAt"

        // ListPrims
        case _: prim.etc._butfirst          => "ListPrims.butFirst"
        case _: prim.etc._butlast           => "ListPrims.butLast"
        case _: prim.etc._empty             => "ListPrims.empty"
        case _: prim.etc._first             => "ListPrims.first"
        case _: prim.etc._fput              => "ListPrims.fput"
        case _: prim.etc._insertitem        => "ListPrims.insertItem"
        case _: prim.etc._item              => "ListPrims.item"
        case _: prim.etc._last              => "ListPrims.last"
        case _: prim.etc._length            => "ListPrims.length"
        case _: prim.etc._lput              => "ListPrims.lput"
        case _: prim.etc._max               => "ListPrims.max"
        case _: prim.etc._mean              => "ListPrims.mean"
        case _: prim.etc._median            => "ListPrims.median"
        case _: prim.etc._member            => "ListPrims.member"
        case _: prim.etc._min               => "ListPrims.min"
        case _: prim.etc._modes             => "ListPrims.modes"
        case _: prim.etc._nof               => "ListPrims.nOf"
        case _: prim.etc._position          => "ListPrims.position"
        case _: prim.etc._removeduplicates  => "ListPrims.removeDuplicates"
        case _: prim.etc._removeitem        => "ListPrims.removeItem"
        case _: prim.etc._remove            => "ListPrims.remove"
        case _: prim.etc._replaceitem       => "ListPrims.replaceItem"
        case _: prim.etc._reverse           => "ListPrims.reverse"
        case _: prim.etc._shuffle           => "ListPrims.shuffle"
        case _: prim.etc._sort              => "ListPrims.sort"
        case _: prim.etc._sortby            => "ListPrims.sortBy"
        case _: prim.etc._standarddeviation => "ListPrims.standardDeviation"
        case _: prim.etc._sublist           => "ListPrims.sublist"
        case _: prim.etc._substring         => "ListPrims.substring"
        case _: prim.etc._uptonof           => "ListPrims.upToNOf"
        case _: prim.etc._variance          => "ListPrims.variance"
        case _: prim._list                  => "ListPrims.list"
        case _: prim._oneof                 => "ListPrims.oneOf"
        case _: prim._sentence              => "ListPrims.sentence"
        case _: prim._sum                   => "ListPrims.sum"

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

        // NLMath
        case _: prim.etc._abs              => "NLMath.abs"
        case _: prim.etc._acos             => "NLMath.acos"
        case _: prim.etc._asin             => "NLMath.asin"
        case _: prim.etc._atan             => "NLMath.atan"
        case _: prim.etc._ceil             => "NLMath.ceil"
        case _: prim.etc._cos              => "NLMath.cos"
        case _: prim.etc._exp              => "NLMath.exp"
        case _: prim.etc._floor            => "NLMath.floor"
        case _: prim.etc._int              => "NLMath.toInt"
        case _: prim.etc._ln               => "NLMath.ln"
        case _: prim.etc._log              => "NLMath.log"
        case _: prim.etc._mod              => "NLMath.mod"
        case _: prim.etc._pow              => "NLMath.pow"
        case _: prim.etc._precision        => "NLMath.precision"
        case _: prim.etc._round            => "NLMath.round"
        case _: prim.etc._sin              => "NLMath.sin"
        case _: prim.etc._sqrt             => "NLMath.sqrt"
        case _: prim.etc._subtractheadings => "NLMath.subtractHeadings"
        case _: prim.etc._tan              => "NLMath.tan"

        // ColorModel
        case _: prim.etc._approximatehsb    => "ColorModel.nearestColorNumberOfHSB"
        case _: prim.etc._approximatergb    => "ColorModel.nearestColorNumberOfRGB"
        case _: prim.etc._extracthsb        => "ColorModel.colorToHSB"
        case _: prim.etc._extractrgb        => "ColorModel.colorToRGB"
        case _: prim.etc._hsb               => "ColorModel.hsbToRGB"
        case _: prim.etc._rgb               => "ColorModel.genRGBFromComponents"
        case _: prim.etc._scalecolor        => "ColorModel.scaleColor"
        case _: prim.etc._shadeof           => "ColorModel.areRelatedByShade"
        case _: prim.etc._wrapcolor         => "ColorModel.wrapColor"

        case _: prim.etc._div               => "Prims.div"
        case _: prim._turtle                => "world.turtleManager.getTurtle"
        case _: prim.etc._patch             => "world.getPatchAt"
        case _: prim._equal                 => "Prims.equality"
        case _: prim._notequal              => "!Prims.equality"
        case _: prim._turtles               => "world.turtles"
        case _: prim.etc._links             => "world.links"
        case _: prim._patches               => "world.patches"
        case _: prim.etc._ticks             => "world.ticker.tickCount"
        case _: prim.etc._timer             => "workspace.timer.elapsed"
        case _: prim.etc._map               => "Tasks.map"
        case _: prim._random                => "Prims.random"
        case _: prim.etc._newseed           => "Prims.generateNewSeed"
        case _: prim.etc._randomstate       => "Random.save"
        case _: prim.etc._randomexponential => "Prims.randomExponential"
        case _: prim.etc._randomfloat       => "Prims.randomFloat"
        case _: prim.etc._randomnormal      => "Prims.randomNormal"
        case _: prim.etc._randompoisson     => "Prims.randomPoisson"
        case _: prim.etc._randomgamma       => "Prims.randomGamma"
        case _: prim.etc._linkset           => "Prims.linkSet"
        case _: prim.etc._patchset          => "Prims.patchSet"
        case _: prim.etc._turtleset         => "Prims.turtleSet"
        case _: prim.etc._turtleson         => "Prims.turtlesOn"
        case _: prim._greaterthan           => "Prims.gt"
        case _: prim._lessthan              => "Prims.lt"
        case _: prim.etc._greaterorequal    => "Prims.gte"
        case _: prim.etc._lessorequal       => "Prims.lte"
        case _: prim.etc._link              => "world.linkManager.getLink"
        case _: prim.etc._applyresult       => "Tasks.apply"
        case _: prim.etc._boom              => "Prims.boom"
        case _: prim.etc._subject           => "world.observer.subject"
        case _: prim.etc._dateandtime       => "Prims.dateAndTime"
        case _: prim.etc._nanotime          => "Prims.nanoTime"
        case _: prim.etc._useryesorno       => "UserDialogPrims.yesOrNo"
        case _: prim.etc._userinput         => "UserDialogPrims.input"
        case _: prim.etc._readfromstring    => "Prims.readFromString"

      }
  }

  object TypeCheck {
    def unapply(r: Reporter): Option[String] =
      PartialFunction.condOpt(r) {
        case _: prim.etc._isagent             => s"isValidAgent()"
        case _: prim.etc._isagentset          => s"isAgentSet()"
        case _: prim.etc._isanonymouscommand  => s"isCommandLambda()"
        case _: prim.etc._isanonymousreporter => s"isReporterLambda()"
        case _: prim.etc._isboolean           => s"isBoolean()"
        case x: prim.etc._isbreed             => s"isBreed(${jsString(x.breedName)})"
        case _: prim.etc._isdirectedlink      => s"isDirectedLink()"
        case _: prim.etc._islink              => s"isValidLink()"
        case _: prim.etc._islinkset           => s"isLinkSet()"
        case _: prim.etc._islist              => s"isList()"
        case _: prim.etc._isnumber            => s"isNumber()"
        case _: prim.etc._ispatch             => s"isPatch()"
        case _: prim.etc._ispatchset          => s"isPatchSet()"
        case _: prim.etc._isstring            => s"isString()"
        case _: prim.etc._isturtle            => s"isValidTurtle()"
        case _: prim.etc._isturtleset         => s"isTurtleSet()"
        case _: prim.etc._isundirectedlink    => s"isUndirectedLink()"
      }
  }

  object SimpleCommand {
    def unapply(c: Command): Option[String] =
      PartialFunction.condOpt(c) {

        case _: prim._done                         => ""
        case _: prim._stop                         => "throw new Exception.StopInterrupt"
        case _: prim.etc._observercode             => ""
        case _: prim.etc._hideturtle               => "SelfManager.self().hideTurtle(true);"
        case _: prim.etc._showturtle               => "SelfManager.self().hideTurtle(false);"

        case _: prim.etc._importpatchcolors => """throw new Error("Unfortunately, no perfect equivalent to `import-pcolors` can be implemented in NetLogo Web.  However, the \'import-a\' and \'fetch\' extensions offer primitives that can accomplish this in both NetLogo and NetLogo Web.")"""
        case _: prim.etc._importpcolorsrgb  => """throw new Error("Unfortunately, no perfect equivalent to `import-pcolors-rgb` can be implemented in NetLogo Web.  However, the \'import-a\' and \'fetch\' extensions offer primitives that can accomplish this in both NetLogo and NetLogo Web.")"""
        case _: prim.etc._importworld       => """throw new Error("Unfortunately, no perfect equivalent to `import-world` can be implemented in NetLogo Web.  However, the \'import-a\' and \'fetch\' extensions offer primitives that can accomplish this in both NetLogo and NetLogo Web.")"""

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
        case _: prim.etc._die        => "SelfManager.self().die"
        case _: prim.etc._face       => "SelfManager.self().face"
        case _: prim.etc._facexy     => "SelfManager.self().faceXY"
        case _: prim.etc._followme   => "SelfManager.self().followMe"
        case _: prim.etc._home       => "SelfManager.self().goHome"
        case _: prim.etc._moveto     => "SelfManager.self().moveTo"
        case _: prim.etc._pendown    => "SelfManager.self().penManager.lowerPen"
        case _: prim.etc._penerase   => "SelfManager.self().penManager.useEraser"
        case _: prim.etc._penup      => "SelfManager.self().penManager.raisePen"
        case _: prim.etc._rideme     => "SelfManager.self().rideMe"
        case _: prim.etc._right      => "SelfManager.self().right"
        case _: prim.etc._setxy      => "SelfManager.self().setXY"
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
        case _: prim.etc._randomseed       => "workspace.rng.setSeed"
        case _: prim.etc._follow           => "world.observer.follow"
        case _: prim.etc._ride             => "world.observer.ride"
        case _: prim.etc._watch            => "world.observer.watch"
        case _: prim.etc._resetperspective => "world.observer.resetPerspective"
        case _: prim.etc._layoutspring     => "LayoutManager.layoutSpring"
        case _: prim.etc._layoutcircle     => "LayoutManager.layoutCircle"
        case _: prim.etc._layoutradial     => "LayoutManager.layoutRadial"
        case _: prim.etc._layouttutte      => "LayoutManager.layoutTutte"
        case _: prim.etc._changetopology   => "world.changeTopology"
        case _: prim.etc._apply            => "Tasks.apply"
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
        case _: prim.etc._display => "notImplemented('display', undefined)"

      }
  }
  // scalastyle:on method.length
  // scalastyle:on cyclomatic.complexity
  // scalastyle:on line.size.limit
}
