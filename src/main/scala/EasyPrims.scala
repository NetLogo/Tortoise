// (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

package org.nlogo.tortoise

import org.nlogo.{ nvm, prim }

object EasyPrims {

  object SimpleReporter {
    def unapply(r: nvm.Reporter): Option[String] =
      PartialFunction.condOpt(r) {
        case _: prim._nobody               => "Nobody"
        case _: prim.etc._nopatches        => "new Agents([])"
        case _: prim.etc._noturtles        => "new Agents([])"
        case _: prim.etc._minpxcor         => "world.minPxcor"
        case _: prim.etc._minpycor         => "world.minPycor"
        case _: prim.etc._maxpxcor         => "world.maxPxcor"
        case _: prim.etc._maxpycor         => "world.maxPycor"
        case _: prim.etc._linkneighbors    => "AgentSet.linkNeighbors(false, false)"
        case _: prim.etc._inlinkneighbors  => "AgentSet.linkNeighbors(true, false)"
        case _: prim.etc._outlinkneighbors => "AgentSet.linkNeighbors(true, true)"
        case _: prim.etc._mylinks          => "AgentSet.connectedLinks(false, false)"
        case _: prim.etc._myinlinks        => "AgentSet.connectedLinks(true, false)"
        case _: prim.etc._myoutlinks       => "AgentSet.connectedLinks(true, true)"
      }
  }

  object InfixReporter {
    def unapply(r: nvm.Reporter): Option[String] =
      PartialFunction.condOpt(r) {
        case _: prim.etc._plus           => "+"
        case _: prim._minus              => "-"
        case _: prim.etc._mult           => "*"
        case _: prim.etc._div            => "/"
        case _: prim.etc._mod            => "%"
        case _: prim._lessthan           => "<"
        case _: prim._greaterthan        => ">"
        case _: prim.etc._greaterorequal => ">="
        case _: prim.etc._lessorequal    => "<="
        case _: prim._and                => "&&"
        case _: prim._or                 => "||"
      }
  }

  object NormalReporter {
    def unapply(r: nvm.Reporter): Option[String] =
      PartialFunction.condOpt(r) {
        case _: prim.etc._turtle             => "world.getTurtle"
        case _: prim.etc._patch              => "Prims.patch"
        case _: prim._neighbors              => "Prims.getNeighbors"
        case _: prim._neighbors4             => "Prims.getNeighbors4"
        case _: prim.etc._worldwidth         => "world.width"
        case _: prim.etc._worldheight        => "world.height"
        case _: prim._equal                  => "Prims.equality"
        case _: prim._notequal               => "!Prims.equality"
        case _: prim.etc._self               => "AgentSet.self"
        case _: prim.etc._myself             => "AgentSet.myself"
        case _: prim.etc._turtles            => "world.turtles"
        case _: prim.etc._links              => "world.links"
        case _: prim._patches                => "world.patches"
        case _: prim.etc._ticks              => "world.ticks"
        case _: prim.etc._timer              => "world.timer"
        case _: prim._count                  => "AgentSet.count"
        case _: prim._any                    => "AgentSet.any"
        case _: prim._random                 => "Random.nextLong"
        case _: prim._list                   => "Prims.list"
        case _: prim.etc._item               => "Prims.item"
        case _: prim.etc._first              => "Prims.first"
        case _: prim.etc._last               => "Prims.last"
        case _: prim.etc._fput               => "Prims.fput"
        case _: prim.etc._lput               => "Prims.lput"
        case _: prim.etc._butfirst           => "Prims.butfirst"
        case _: prim.etc._butlast            => "Prims.butlast"
        case _: prim.etc._sort               => "Prims.sort"
        case _: prim.etc._max                => "Prims.max"
        case _: prim.etc._length             => "Prims.length"
        case _: prim.etc._min                => "Prims.min"
        case _: prim.etc._mean               => "Prims.mean"
        case _: prim._sum                    => "Prims.sum"
        case _: prim.etc._abs                => "StrictMath.abs"
        case _: prim.etc._randomfloat        => "Prims.randomfloat"
        case _: prim.etc._randomxcor         => "Prims.randomxcor"
        case _: prim.etc._randomycor         => "Prims.randomycor"
        case _: prim._oneof                  => "AgentSet.oneOf"
        case _: prim.etc._nof                => "AgentSet.nOf"
        case _: prim.etc._removeduplicates   => "Prims.removeDuplicates"
        case _: prim.etc._patchset           => "Prims.patchset"
        case _: prim._not                    => "!"
        case _: prim.etc._distance           => "AgentSet.self().distance"
        case _: prim.etc._distancexy         => "AgentSet.self().distancexy"
        case _: prim.etc._inradius           => "AgentSet.self().inRadius"
        case _: prim._patchat                => "AgentSet.self().patchAt"
        case _: prim.etc._patchahead         => "AgentSet.self().patchAhead"
        case _: prim.etc._patchrightandahead => "AgentSet.self().patchRightAndAhead"
        case _: prim.etc._patchleftandahead  => "AgentSet.self().patchLeftAndAhead"
        case _: prim.etc._canmove            => "AgentSet.self().canMove"
        case _: prim.etc._shadeof            => "Prims.shadeOf"
        case _: prim.etc._scalecolor         => "Prims.scaleColor"
        case _: prim.etc._patchhere          => "AgentSet.self().getPatchHere"
        case _: prim.etc._turtleshere        => "AgentSet.self().turtlesHere"
        case _: prim.etc._turtleson          => "AgentSet.turtlesOn"
        case _: prim.etc._turtlesat          => "AgentSet.self().turtlesAt"
        case _: prim._other                  => "AgentSet.other"
        case _: prim.etc._sin                => "Trig.unsquashedSin"
        case _: prim.etc._cos                => "Trig.unsquashedCos"
        case _: prim.etc._floor              => "StrictMath.floor"
        case _: prim.etc._int                => "Prims._int"
        case _: prim.etc._round              => "StrictMath.round"
        case _: prim.etc._link               => "world.getLink"
        case _: prim.etc._linkneighbor       => "AgentSet.isLinkNeighbor(false, false)"
        case _: prim.etc._inlinkneighbor     => "AgentSet.isLinkNeighbor(true, false)"
        case _: prim.etc._outlinkneighbor    => "AgentSet.isLinkNeighbor(true, true)"
        case _: prim.etc._inlinkfrom         => "AgentSet.findLinkViaNeighbor(true, false)"
        case _: prim.etc._outlinkto          => "AgentSet.findLinkViaNeighbor(true, true)"
        case _: prim.etc._linkwith           => "AgentSet.findLinkViaNeighbor(false, false)"
        case _: prim.etc._bothends           => "AgentSet.self().bothEnds"
        case _: prim.etc._otherend           => "AgentSet.self().otherEnd"
      }
  }

  object SimpleCommand {
    def unapply(c: nvm.Command): Option[String] =
      PartialFunction.condOpt(c) {
        case _: prim._done             => ""
        case _: prim.etc._observercode => ""
        case _: prim.etc._stop         => "return"
        case _: prim.etc._hideturtle   => "AgentSet.self().hideTurtle(true);"
        case _: prim.etc._showturtle   => "AgentSet.self().hideTurtle(false);"
      }
  }

  object NormalCommand {
    def unapply(c: nvm.Command): Option[String] =
      PartialFunction.condOpt(c) {
        case _: prim.etc._outputprint       => "Prims.outputprint"
        case _: prim.etc._clearall          => "world.clearall"
        case _: prim.etc._clearticks        => "world.clearTicks"
        case _: prim.etc._resizeworld       => "world.resize"
        case _: prim.etc._resetticks        => "world.resetTicks"
        case _: prim.etc._resettimer        => "world.resetTimer"
        case _: prim.etc._tick              => "world.tick"
        case _: prim.etc._tickadvance       => "world.advancetick"
        case _: prim.etc._setdefaultshape   => "Breeds.setDefaultShape"
        case _: prim.etc._moveto            => "AgentSet.self().moveto"
        case _: prim.etc._face              => "AgentSet.self().face"
        case _: prim.etc._facexy            => "AgentSet.self().facexy"
        case _: prim._fd                    => "Prims.fd"
        case _: prim._bk                    => "Prims.bk"
        case _: prim.etc._left              => "Prims.left"
        case _: prim.etc._right             => "Prims.right"
        case _: prim.etc._setxy             => "Prims.setxy"
        case _: prim.etc._die               => "AgentSet.die"
        case _: prim.etc._randomseed        => "Random.setSeed"
        case _: prim.etc._diffuse           => "world.topology().diffuse"
        case _: prim.etc._setcurrentplot    => "noop"
        case _: prim.etc._setcurrentplotpen => "noop"
        case _: prim.etc._plot              => "noop"
      }
  }

}
