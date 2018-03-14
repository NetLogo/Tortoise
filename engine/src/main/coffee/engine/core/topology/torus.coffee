# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Topology = require('./topology')

{ foldl, map } = require('brazierjs/array')
{ pipeline }   = require('brazierjs/function')
{ rangeUntil } = require('brazierjs/number')

# Why our own custom add function?  To avoid anonymous functions getting created as part
# of the fold below.  This bad boy will add any two numbers together, no problem.
# -JMB 07/2017
add = (a, b) ->
  a + b

module.exports =
  class Torus extends Topology

    _wrapInX: true # Boolean
    _wrapInY: true # Boolean

    # (Number) => Number
    wrapX: (pos) ->
      @_wrapXLeniently(pos)

    # (Number) => Number
    wrapY: (pos) ->
      @_wrapYLeniently(pos)

    # (Number, Number) => Patch|Boolean
    _getPatchNorth: (pxcor, pycor) ->
      if pycor is @maxPycor
        @_getPatchAt(pxcor, @minPycor)
      else
        @_getPatchAt(pxcor, pycor + 1)

    # (Number, Number) => Patch|Boolean
    _getPatchSouth: (pxcor, pycor) ->
      if pycor is @minPycor
        @_getPatchAt(pxcor, @maxPycor)
      else
        @_getPatchAt(pxcor, pycor - 1)

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
        if pxcor is @minPxcor
          @_getPatchAt(@maxPxcor, @minPycor)
        else
          @_getPatchAt(pxcor - 1, @minPycor)
      else if pxcor is @minPxcor
        @_getPatchAt(@maxPxcor, pycor + 1)
      else
        @_getPatchAt(pxcor - 1, pycor + 1)

    # (Number, Number) => Patch|Boolean
    _getPatchSouthWest: (pxcor, pycor) ->
      if pycor is @minPycor
        if pxcor is @minPxcor
          @_getPatchAt(@maxPxcor, @maxPycor)
        else
          @_getPatchAt(pxcor - 1, @maxPycor)
      else if pxcor is @minPxcor
        @_getPatchAt(@maxPxcor, pycor - 1)
      else
        @_getPatchAt(pxcor - 1, pycor - 1)

    # (Number, Number) => Patch|Boolean
    _getPatchSouthEast: (pxcor, pycor) ->
      if pycor is @minPycor
        if pxcor is @maxPxcor
          @_getPatchAt(@minPxcor, @maxPycor)
        else
          @_getPatchAt(pxcor + 1, @maxPycor)
      else if pxcor is @maxPxcor
        @_getPatchAt(@minPxcor, pycor - 1)
      else
        @_getPatchAt(pxcor + 1, pycor - 1)

    # (Number, Number) => Patch|Boolean
    _getPatchNorthEast: (pxcor, pycor) ->
      if pycor is @maxPycor
        if pxcor is @maxPxcor
          @_getPatchAt(@minPxcor, @minPycor)
        else
          @_getPatchAt(pxcor + 1, @minPycor)
      else if pxcor is @maxPxcor
        @_getPatchAt(@minPxcor, pycor + 1)
      else
        @_getPatchAt(pxcor + 1, pycor + 1)

    # (Number, Number) => Number
    _shortestX: (x1, x2) =>
      @_shortestXWrapped(x1, x2)

    # (Number, Number) => Number
    _shortestY: (y1, y2) =>
      @_shortestYWrapped(y1, y2)
