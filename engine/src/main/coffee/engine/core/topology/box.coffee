# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Topology = require('./topology')

module.exports =
  class Box extends Topology

    _wrapInX: false # Boolean
    _wrapInY: false # Boolean

    # (Number) => Number | TopologyInterrupt
    wrapX: (pos) ->
      @_wrapXCautiously(pos)

    # (Number) => Number | TopologyInterrupt
    wrapY: (pos) ->
      @_wrapYCautiously(pos)

    # (Number, Number) => Patch|Boolean
    _getPatchNorth: (pxcor, pycor) -> (pycor isnt @maxPycor) and @_getPatchAt(pxcor, pycor + 1)
    _getPatchSouth: (pxcor, pycor) -> (pycor isnt @minPycor) and @_getPatchAt(pxcor, pycor - 1)
    _getPatchEast:  (pxcor, pycor) -> (pxcor isnt @maxPxcor) and @_getPatchAt(pxcor + 1, pycor)
    _getPatchWest:  (pxcor, pycor) -> (pxcor isnt @minPxcor) and @_getPatchAt(pxcor - 1, pycor)

    # (Number, Number) => Patch|Boolean
    _getPatchNorthWest: (pxcor, pycor) -> (pycor isnt @maxPycor) and (pxcor isnt @minPxcor) and @_getPatchAt(pxcor - 1, pycor + 1)
    _getPatchSouthWest: (pxcor, pycor) -> (pycor isnt @minPycor) and (pxcor isnt @minPxcor) and @_getPatchAt(pxcor - 1, pycor - 1)
    _getPatchSouthEast: (pxcor, pycor) -> (pycor isnt @minPycor) and (pxcor isnt @maxPxcor) and @_getPatchAt(pxcor + 1, pycor - 1)
    _getPatchNorthEast: (pxcor, pycor) -> (pycor isnt @maxPycor) and (pxcor isnt @maxPxcor) and @_getPatchAt(pxcor + 1, pycor + 1)

    # (Number, Number) => Number
    _shortestX: (x1, x2) =>
      @_shortestNotWrapped(x1, x2)

    # (Number, Number) => Number
    _shortestY: (y1, y2) =>
      @_shortestNotWrapped(y1, y2)
