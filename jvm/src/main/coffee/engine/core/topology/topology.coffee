# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_              = require('lodash')
Topology       = require('./topology')
StrictMath     = require('shim/strictmath')
abstractMethod = require('util/abstractmethoderror')

{ AgentException, TopologyInterrupt } = require('util/exception')

module.exports =
  class Topology

    _wrapInX: undefined # Boolean
    _wrapInY: undefined # Boolean

    height: undefined # Number
    width:  undefined # Number

    _neighborCache:  undefined
    _neighbor4Cache: undefined

    # (Number, Number, Number, Number, () => PatchSet, (Number, Number) => Patch) => Topology
    constructor: (@minPxcor, @maxPxcor, @minPycor, @maxPycor, @_getPatches, @_getPatchAt) ->
      @height          = 1 + @maxPycor - @minPycor
      @width           = 1 + @maxPxcor - @minPxcor
      @_neighborCache  = {}
      @_neighbor4Cache = {}

    # (String, Number) => Unit
    diffuse: (varName, coefficient) ->
      @_sloppyDiffuse(varName, coefficient)
      return

    # (Number, Number) => Array[Patch]
    getNeighbors: (pxcor, pycor) ->
      key = "(#{pxcor}, #{pycor})"
      if @_neighborCache.hasOwnProperty(key)
        @_neighborCache[key]
      else
        @_neighborCache[key] = @_filterNeighbors(@_getNeighbors(pxcor, pycor))

    # (Number, Number) => Array[Patch]
    getNeighbors4: (pxcor, pycor) ->
      key = "(#{pxcor}, #{pycor})"
      if @_neighbor4Cache.hasOwnProperty(key)
        @_neighbor4Cache[key]
      else
        @_neighbor4Cache[key] = @_filterNeighbors(@_getNeighbors4(pxcor, pycor))

    # Sadly, having topologies give out `false` and filtering it away seems to give the best balance between
    # NetLogo semantics, code clarity, and efficiency.  I tried to kill this `false`-based nonsense, but I
    # couldn't strike a better balance. --JAB (7/30/14)
    # (Array[Patch]) => Array[Patch]
    _filterNeighbors: (neighbors) ->
      _(neighbors).filter((patch) -> patch isnt false).uniq().value()

    # (Number, Number, Number, Number) => Number
    distanceXY: (x1, y1, x2, y2) ->
      a2 = StrictMath.pow(@_shortestX(x1, x2), 2)
      b2 = StrictMath.pow(@_shortestY(y1, y2), 2)
      StrictMath.sqrt(a2 + b2)

    # (Number, Number, Turtle|Patch) => Number
    distance: (x1, y1, agent) ->
      [x2, y2] = agent.getCoords()
      @distanceXY(x1, y1, x2, y2)

    # (Number, Number, Number, Number) => Number
    towards: (x1, y1, x2, y2) ->
      @_towards(x1, y1, x2, y2, @_shortestX, @_shortestY)

    # (Number, Number) => Number
    midpointx: (x1, x2) ->
      pos = (x1 + (x1 + @_shortestX(x1, x2))) / 2
      @_wrap(pos, @minPxcor - 0.5, @maxPxcor + 0.5)

    # (Number, Number) => Number
    midpointy: (y1, y2) ->
      pos = (y1 + (y1 + @_shortestY(y1, y2))) / 2
      @_wrap(pos, @minPycor - 0.5, @maxPycor + 0.5)

    # (Number, Number, AbstractAgents[Agent], Number)
    inRadius: (x, y, agents, radius) ->
      agents.filter(
        (agent) =>
          [xcor, ycor] = agent.getCoords()
          @distanceXY(xcor, ycor, x, y) <= radius
      )

    # (Number, Number) => Array[Patch]
    _getNeighbors: (pxcor, pycor) ->
      if pxcor is @maxPxcor and pxcor is @minPxcor
        if pycor is @maxPycor and pycor is @minPycor
          []
        else
          [@_getPatchNorth(pxcor, pycor), @_getPatchSouth(pxcor, pycor)]
      else if pycor is @maxPycor and pycor is @minPycor
        [@_getPatchEast(pxcor, pycor), @_getPatchWest(pxcor, pycor)]
      else
        [@_getPatchNorth(pxcor, pycor),     @_getPatchEast(pxcor, pycor),
         @_getPatchSouth(pxcor, pycor),     @_getPatchWest(pxcor, pycor),
         @_getPatchNorthEast(pxcor, pycor), @_getPatchSouthEast(pxcor, pycor),
         @_getPatchSouthWest(pxcor, pycor), @_getPatchNorthWest(pxcor, pycor)]

    # (Number, Number) => Array[Patch]
    _getNeighbors4: (pxcor, pycor) ->
      if pxcor is @maxPxcor and pxcor is @minPxcor
        if pycor is @maxPycor and pycor is @minPycor
          []
        else
          [@_getPatchNorth(pxcor, pycor), @_getPatchSouth(pxcor, pycor)]
      else if pycor is @maxPycor and pycor is @minPycor
        [@_getPatchEast(pxcor, pycor), @_getPatchWest(pxcor, pycor)]
      else
        [@_getPatchNorth(pxcor, pycor), @_getPatchEast(pxcor, pycor),
         @_getPatchSouth(pxcor, pycor), @_getPatchWest(pxcor, pycor)]

    # (Number, Number, Array[Array[Number]], Array[Array[Number]], Number) => Unit
    _refineScratchPads: (yy, xx, scratch, scratch2, coefficient) ->
      return # If you want to use `_sloppyDiffuse` in your topology, override this --JAB (8/6/14)

    # (Number, Number) => Number
    _shortestNotWrapped: (cor1, cor2) ->
      StrictMath.abs(cor1 - cor2) * (if cor1 > cor2 then -1 else 1)

    # (Number, Number, Number) => Number
    _shortestWrapped: (cor1, cor2, limit) ->
      absDist = StrictMath.abs(cor1 - cor2)
      if absDist > limit / 2
        (limit - absDist) * (if cor2 > cor1 then -1 else 1)
      else
        @_shortestNotWrapped(cor1, cor2)

    # (Number, Number) => Number
    _shortestXWrapped: (cor1, cor2) ->
      @_shortestWrapped(cor1, cor2, @width)

    # (Number, Number) => Number
    _shortestYWrapped: (cor1, cor2) ->
      @_shortestWrapped(cor1, cor2, @height)

    # Used by most implementations of `diffuse`
    # (String, Number) => Unit
    _sloppyDiffuse: (varName, coefficient) ->
      yy = @height
      xx = @width

      mapAll =
        (f) ->
          for x in [0...xx]
            for y in [0...yy]
              f(x, y)

      scratch  = mapAll((x, y) => @_getPatchAt(x + @minPxcor, y + @minPycor).getVariable(varName))
      scratch2 = mapAll(-> 0)

      @_refineScratchPads(yy, xx, scratch, scratch2, coefficient)

      mapAll((x, y) => @_getPatchAt(x + @minPxcor, y + @minPycor).setVariable(varName, scratch2[x][y]))

      return

    # (Number, Number, Number, Number, (Number, Number) => Number, (Number, Number) => Number) => Number
    _towards: (x1, y1, x2, y2, findXDist, findYDist) ->
      if (x1 isnt x2) or (y1 isnt y2)
        dx = findXDist(x1, x2)
        dy = findYDist(y1, y2)
        if dx is 0
          if dy >= 0 then 0 else 180
        else if dy is 0
          if dx >= 0 then 90 else 270
        else
          (270 + StrictMath.toDegrees(StrictMath.PI() + StrictMath.atan2(-dy, dx))) % 360
      else
        throw new AgentException("No heading is defined from a point (#{x1},#{x2}) to that same point.")

    # (Number, Number, Number, Number) => Number
    _towardsNotWrapped: (x1, y1, x2, y2) ->
      @_towards(x1, y1, x2, y2, @_shortestNotWrapped, @_shortestNotWrapped)

    # (Number, Number, Number) => Number
    _wrap: (pos, min, max) ->
      if pos >= max
        min + ((pos - max) % (max - min))
      else if pos < min
        result = max - ((min - pos) % (max - min))
        if result < max
          result
        else
          min
      else
        pos

    # (Number) => Number
    _wrapXCautiously: (pos) ->
      @_wrapCautiously(@minPxcor, @maxPxcor, pos)

    # (Number) => Number
    _wrapXLeniently: (pos) ->
      @_wrapLeniently(@minPxcor, @maxPxcor, pos)

    # (Number) => Number
    _wrapYCautiously: (pos) ->
      @_wrapCautiously(@minPycor, @maxPycor, pos)

    # (Number) => Number
    _wrapYLeniently: (pos) ->
      @_wrapLeniently(@minPycor, @maxPycor, pos)

    # (Number, Number, Number) => Number
    _wrapCautiously: (minCor, maxCor, pos) ->
      min = minCor - 0.5
      max = maxCor + 0.5
      if min <= pos < max
        pos
      else
        throw new TopologyInterrupt("Cannot move turtle beyond the world's edge.")

    # (Number, Number, Number) => Number
    _wrapLeniently:  (minCor, maxCor, pos) ->
      @_wrap(pos, minCor - 0.5, maxCor + 0.5)

    # (Number) => Number
    wrapX: (pos) -> abstractMethod('Topology.wrapX')
    wrapY: (pos) -> abstractMethod('Topology.wrapY')

    # (Number, Number) => Number
    _shortestX: (x1, x2) => abstractMethod('Topology._shortestX')
    _shortestY: (y1, y2) => abstractMethod('Topology._shortestY')

    # (Number, Number) => Patch|Boolean
    _getPatchNorth:     (x, y) -> abstractMethod('Topology._getPatchNorth')
    _getPatchEast:      (x, y) -> abstractMethod('Topology._getPatchEast')
    _getPatchSouth:     (x, y) -> abstractMethod('Topology._getPatchSouth')
    _getPatchWest:      (x, y) -> abstractMethod('Topology._getPatchWest')
    _getPatchNorthEast: (x, y) -> abstractMethod('Topology._getPatchNorthEast')
    _getPatchSouthEast: (x, y) -> abstractMethod('Topology._getPatchSouthEast')
    _getPatchSouthWest: (x, y) -> abstractMethod('Topology._getPatchSouthWest')
    _getPatchNorthWest: (x, y) -> abstractMethod('Topology._getPatchNorthWest')
