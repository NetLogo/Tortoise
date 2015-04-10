// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  org.nlogo.core.{ Command, prim, Reporter }

object SimplePrims {

  object SimpleReporter {
    def unapply(r: Reporter): Option[String] =
      PartialFunction.condOpt(r) {
        case _: prim._nobody             => "Nobody"
        case _: prim.etc._nopatches      => "new PatchSet([])"
        case _: prim.etc._noturtles      => "new TurtleSet([])"
        case _: prim.etc._nolinks        => "new LinkSet([])"
        case _: prim.etc._minpxcor       => "world.topology.minPxcor"
        case _: prim.etc._minpycor       => "world.topology.minPycor"
        case _: prim.etc._maxpxcor       => "world.topology.maxPxcor"
        case _: prim.etc._maxpycor       => "world.topology.maxPycor"
        case _: prim.etc._worldwidth     => "world.topology.width"
        case _: prim.etc._worldheight    => "world.topology.height"
        case _: prim.etc._netlogoapplet  => "Meta.isApplet"
        case _: prim.etc._netlogoversion => "Meta.version"
      }
  }

  object InfixReporter {
    def unapply(r: Reporter): Option[String] =
      PartialFunction.condOpt(r) {
        case _: prim.etc._plus      => "+"
        case _: prim._minus         => "-"
        case _: prim.etc._mult      => "*"
        case _: prim.etc._div       => "/"
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
        case _: prim._neighbors4      => "SelfPrims.getNeighbors4"
        case _: prim._neighbors       => "SelfPrims.getNeighbors"
        case _: prim._other           => "SelfPrims.other"

        // SelfManager
        case _: prim.etc._bothends           => "SelfManager.self().bothEnds"
        case _: prim.etc._canmove            => "SelfManager.self().canMove"
        case _: prim.etc._distance           => "SelfManager.self().distance"
        case _: prim.etc._distancexy         => "SelfManager.self().distanceXY"
        case _: prim.etc._dx                 => "SelfManager.self().dx"
        case _: prim.etc._dy                 => "SelfManager.self().dy"
        case _: prim.etc._myself             => "SelfManager.myself"
        case _: prim.etc._otherend           => "SelfManager.self().otherEnd"
        case _: prim.etc._patchahead         => "SelfManager.self().patchAhead"
        case _: prim.etc._patchhere          => "SelfManager.self().getPatchHere"
        case _: prim.etc._patchleftandahead  => "SelfManager.self().patchLeftAndAhead"
        case _: prim.etc._patchrightandahead => "SelfManager.self().patchRightAndAhead"
        case _: prim.etc._self               => "SelfManager.self"
        case _: prim.etc._towards            => "SelfManager.self().towards"
        case _: prim.etc._towardsxy          => "SelfManager.self().towardsXY"
        case _: prim.etc._turtlesat          => "SelfManager.self().turtlesAt"
        case _: prim.etc._turtleshere        => "SelfManager.self().turtlesHere"
        case _: prim._inradius               => "SelfManager.self().inRadius"
        case _: prim._patchat                => "SelfManager.self().patchAt"

        // ListPrims
        case _: prim.etc._butfirst          => "ListPrims.butFirst"
        case _: prim.etc._butlast           => "ListPrims.butLast"
        case _: prim.etc._empty             => "ListPrims.empty"
        case _: prim.etc._first             => "ListPrims.first"
        case _: prim.etc._fput              => "ListPrims.fput"
        case _: prim.etc._item              => "ListPrims.item"
        case _: prim.etc._last              => "ListPrims.last"
        case _: prim.etc._length            => "ListPrims.length"
        case _: prim.etc._lput              => "ListPrims.lput"
        case _: prim.etc._max               => "ListPrims.max"
        case _: prim.etc._mean              => "ListPrims.mean"
        case _: prim.etc._median            => "ListPrims.median"
        case _: prim.etc._member            => "ListPrims.member"
        case _: prim.etc._min               => "ListPrims.min"
        case _: prim.etc._nof               => "ListPrims.nOf"
        case _: prim.etc._position          => "ListPrims.position"
        case _: prim.etc._removeduplicates  => "ListPrims.removeDuplicates"
        case _: prim.etc._removeitem        => "ListPrims.removeItem"
        case _: prim.etc._remove            => "ListPrims.remove"
        case _: prim.etc._replaceitem       => "ListPrims.replaceItem"
        case _: prim.etc._reverse           => "ListPrims.reverse"
        case _: prim.etc._sort              => "ListPrims.sort"
        case _: prim.etc._standarddeviation => "ListPrims.standardDeviation"
        case _: prim.etc._sublist           => "ListPrims.sublist"
        case _: prim.etc._substring         => "ListPrims.substring"
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

        case _: prim._turtle             => "world.turtleManager.getTurtle"
        case _: prim.etc._patch          => "world.getPatchAt"
        case _: prim._equal              => "Prims.equality"
        case _: prim._notequal           => "!Prims.equality"
        case _: prim._turtles            => "world.turtles"
        case _: prim.etc._links          => "world.links"
        case _: prim._patches            => "world.patches"
        case _: prim.etc._ticks          => "world.ticker.tickCount"
        case _: prim.etc._timer          => "workspace.timer.elapsed"
        case _: prim.etc._map            => "Tasks.map"
        case _: prim._random             => "Prims.random"
        case _: prim.etc._randomfloat    => "Prims.randomFloat"
        case _: prim.etc._randomxcor     => "world.topology.randomXcor"
        case _: prim.etc._randomycor     => "world.topology.randomYcor"
        case _: prim.etc._linkset        => "Prims.linkSet"
        case _: prim.etc._patchset       => "Prims.patchSet"
        case _: prim.etc._turtleset      => "Prims.turtleSet"
        case _: prim.etc._shadeof        => "ColorModel.areRelatedByShade"
        case _: prim.etc._scalecolor     => "ColorModel.scaleColor"
        case _: prim.etc._turtleson      => "Prims.turtlesOn"
        case _: prim._greaterthan        => "Prims.gt"
        case _: prim._lessthan           => "Prims.lt"
        case _: prim.etc._greaterorequal => "Prims.gte"
        case _: prim.etc._lessorequal    => "Prims.lte"
        case _: prim.etc._link           => "world.linkManager.getLink"
        case _: prim.etc._boom           => "Prims.boom"
        case _: prim.etc._subject        => "world.observer.subject"

      }
  }

  object SimpleCommand {
    def unapply(c: Command): Option[String] =
      PartialFunction.condOpt(c) {
        case _: prim._done             => ""
        case _: prim.etc._observercode => ""
        case _: prim.etc._stop         => "throw new Exception.StopInterrupt"
        case _: prim.etc._hideturtle   => "SelfManager.self().hideTurtle(true);"
        case _: prim.etc._showturtle   => "SelfManager.self().hideTurtle(false);"
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

        // SelfManager
        case _: prim.etc._face     => "SelfManager.self().face"
        case _: prim.etc._facexy   => "SelfManager.self().faceXY"
        case _: prim.etc._followme => "SelfManager.self().followMe"
        case _: prim.etc._moveto   => "SelfManager.self().moveTo"
        case _: prim.etc._pendown  => "SelfManager.self().penManager.lowerPen"
        case _: prim.etc._penup    => "SelfManager.self().penManager.raisePen"
        case _: prim.etc._rideme   => "SelfManager.self().rideMe"
        case _: prim.etc._tie      => "SelfManager.self().tie"
        case _: prim.etc._untie    => "SelfManager.self().untie"
        case _: prim.etc._watchme  => "SelfManager.self().watchMe"

        // SelfPrims
        case _: prim._bk        => "SelfPrims.bk"
        case _: prim.etc._die   => "SelfPrims.die"
        case _: prim.etc._left  => "SelfPrims.left"
        case _: prim.etc._right => "SelfPrims.right"
        case _: prim.etc._setxy => "SelfPrims.setXY"
        case _: prim.etc._stamp => "SelfPrims.stamp"
        case _: prim._fd        => "SelfPrims.fd"
        case _: prim._jump      => "SelfPrims.jump"

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

        // Misc.
        case _: prim.etc._clearall         => "world.clearAll"
        case _: prim.etc._clearpatches     => "world.clearPatches"
        case _: prim.etc._clearturtles     => "world.turtleManager.clearTurtles"
        case _: prim.etc._clearticks       => "world.ticker.clear"
        case _: prim.etc._clearlinks       => "world.linkManager.clear"
        case _: prim.etc._resizeworld      => "world.resize"
        case _: prim.etc._resetticks       => "world.ticker.reset"
        case _: prim.etc._tick             => "world.ticker.tick"
        case _: prim.etc._tickadvance      => "world.ticker.tickAdvance"
        case _: prim.etc._resettimer       => "workspace.timer.reset"
        case _: prim.etc._randomseed       => "Random.setSeed"
        case _: prim.etc._follow           => "world.observer.follow"
        case _: prim.etc._ride             => "world.observer.ride"
        case _: prim.etc._watch            => "world.observer.watch"
        case _: prim.etc._resetperspective => "world.observer.resetPerspective"
        case _: prim.etc._layoutspring     => "LayoutManager.layoutSpring"
        case _: prim.etc._changetopology   => "world.changeTopology"

        // Unimplemented
        case _: prim.etc._display     => "notImplemented('display', undefined)"
        case _: prim.etc._usermessage => "notImplemented('user-message', undefined)"

      }
  }

}
