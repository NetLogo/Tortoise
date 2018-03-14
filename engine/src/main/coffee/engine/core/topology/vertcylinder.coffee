# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Topology = require('./topology')

module.exports =
  class VertCylinder extends Topology

    _wrapInX: true  # Boolean
    _wrapInY: false # Boolean

    # (Number) => Number
    wrapX: (pos) ->
      @_wrapXLeniently(pos)

    # (Number) => Number
    wrapY: (pos) ->
      @_wrapYCautiously(pos)

    # (Number, Number) => Patch|Boolean
    _getPatchNorth: (pxcor, pycor) ->
      (pycor isnt @maxPycor) and @_getPatchAt(pxcor, pycor + 1)

    # (Number, Number) => Patch|Boolean
    _getPatchSouth: (pxcor, pycor) ->
      (pycor isnt @minPycor) and @_getPatchAt(pxcor, pycor - 1)

    # (Number, Number) => Patch|Boolean
    _getPatchEast: (pxcor, pycor) ->
      if pxcor is @maxPxcor
        @_getPatchAt(@minPxcor, pycor)
      else
        @_getPatchAt(pxcor + 1, pycor)

    # (Number, Number) => Patch|Boolean
    _getPatchWest: (pxcor, pycor) ->
      if pxcor is @minPxcor
        @_getPatchAt(@maxPxcor, pycor)
      else
        @_getPatchAt(pxcor - 1, pycor)

    # (Number, Number) => Patch|Boolean
    _getPatchNorthWest: (pxcor, pycor) ->
      if pycor is @maxPycor
        false
      else if pxcor is @minPxcor
        @_getPatchAt(@maxPxcor, pycor + 1)
      else
        @_getPatchAt(pxcor - 1, pycor + 1)

    # (Number, Number) => Patch|Boolean
    _getPatchSouthWest: (pxcor, pycor) ->
      if pycor is @minPycor
        false
      else if pxcor is @minPxcor
        @_getPatchAt(@maxPxcor, pycor - 1)
      else
        @_getPatchAt(pxcor - 1, pycor - 1)

    # (Number, Number) => Patch|Boolean
    _getPatchSouthEast: (pxcor, pycor) ->
      if pycor is @minPycor
        false
      else if pxcor is @maxPxcor
        @_getPatchAt(@minPxcor, pycor - 1)
      else
        @_getPatchAt(pxcor + 1, pycor - 1)

    # (Number, Number) => Patch|Boolean
    _getPatchNorthEast: (pxcor, pycor) ->
      if pycor is @maxPycor
        false
      else if pxcor is @maxPxcor
        @_getPatchAt(@minPxcor, pycor + 1)
      else
        @_getPatchAt(pxcor + 1, pycor + 1)

    # (Number, Number) => Number
    _shortestX: (x1, x2) =>
      @_shortestXWrapped(x1, x2)

    # (Number, Number) => Number
    _shortestY: (y1, y2) =>
      @_shortestNotWrapped(y1, y2)
