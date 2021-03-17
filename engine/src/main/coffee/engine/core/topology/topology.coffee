# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

InRadiusOrCone = require('./inradiusorcone')
Topology       = require('./topology')
Diffuser       = require('./diffuser')
StrictMath     = require('shim/strictmath')
abstractMethod = require('util/abstractmethoderror')

{ filter, unique } = require('brazierjs/array')
{ pipeline }       = require('brazierjs/function')

{ AgentException }    = require('util/exception')
{ TopologyInterrupt } = require('util/interrupts')

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
      @diffuser        = new Diffuser(@_setPatchVariable, @width, @height, @_wrapInX, @_wrapInY)
      @_neighborCache  = {}
      @_neighbor4Cache = {}

    # (String, Number, Boolean) => Unit (side effect: diffuse varName by coeffecient among patches)
    diffuse: (varName, coefficient, fourWay) ->
      yy = @height
      xx = @width

      mapAll = (f) ->
        for x in [0...xx]
          for y in [0...yy]
            f(x, y)
      scratch = mapAll((x, y) => @_getPatchAt(x + @minPxcor, y + @minPycor).getVariable(varName))

      if fourWay
        @diffuser.diffuse4(varName, coefficient, scratch)
      else
        @diffuser.diffuse8(varName, coefficient, scratch)

      return

    # (Number, Number, String, Number, Number) => Unit
    _setPatchVariable: (x, y, varName, newVal, oldVal) =>
      if newVal isnt oldVal
        @_getPatchAt(x + @minPxcor, y + @minPycor).setVariable(varName, newVal)

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
      pipeline(filter((patch) -> patch isnt false), unique)(neighbors)

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
    distanceXYNotWrapped: (x1, y1, x2, y2) ->
      a2 = StrictMath.pow(@_shortestNotWrapped(x1, x2), 2)
      b2 = StrictMath.pow(@_shortestNotWrapped(y1, y2), 2)
      StrictMath.sqrt(a2 + b2)

    # Some prims, like `layout-spring`, want the "visual" view distance rather than the wrapped distance, so this
    # lives here even for wrapping topologies. -Jeremy B August 2020
    # (Number, Number, Turtle|Patch) => Number
    distanceNotWrapped: (x1, y1, agent) ->
      [x2, y2] = agent.getCoords()
      @distanceXYNotWrapped(x1, y1, x2, y2)

    # (Number, Number, Number, Number, Number, Number) => Number
    distanceToLine: (x1, y1, x2, y2, xcor, ycor) ->

      closestPoint = (x1, y1, x2, y2, xDiff, yDiff) ->
        # all this math determines a point on the line defined by the endpoints of the
        # link nearest to the given point --??? (??/??/??)
        u = ((x1 - x2) * xDiff + (y1 - y2) * yDiff) / (xDiff * xDiff + yDiff * yDiff)
        x = x2 + u * xDiff
        y = y2 + u * yDiff
        { x, y }

      # since this is a segment not a continuous line we have to check the bounds
      # we know it's a point on the line, so if it's in the bounding box then
      # we're good and just return that point. ev 10/12/06
      isInBounds = (x1, y1, x2, y2, pointX, pointY) ->

        [bottom, top] =
          if y1 > y2
            [y2, y1]
          else
            [y1, y2]

        [left, right] =
          if x1 > x2
            [x2, x1]
          else
            [x1, x2]

        pointX <= right and pointX >= left and pointY <= top and pointY >= bottom

      wrappedX1   = @wrapX(x1)
      wrappedX2   = @wrapX(x2)
      wrappedXcor = @wrapX(xcor)

      wrappedY1   = @wrapY(y1)
      wrappedY2   = @wrapY(y2)
      wrappedYcor = @wrapY(ycor)

      xDiff = wrappedX2 - wrappedX1
      yDiff = wrappedY2 - wrappedY1

      { x: closestX, y: closestY } = closestPoint(wrappedXcor, wrappedYcor, wrappedX1, wrappedY1, xDiff, yDiff)

      if isInBounds(wrappedX1, wrappedY1, wrappedX2, wrappedY2, closestX, closestY)
        @distanceXY(closestX, closestY, wrappedXcor, wrappedYcor)
      else
        Math.min(@distanceXY(x1, y1, xcor, ycor), @distanceXY(x2, y2, xcor, ycor))

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

    # [T] @ (Number, Number, Number, AbstractAgents[T], Number, Number) => AbstractAgentSet[T]
    inCone: (x, y, heading, agents, distance, angle) ->
      InRadiusOrCone.inCone.call(this, x, y, heading, agents, distance, angle)

    # [T] @ (Number, Number, AbstractAgents[T], Number) => AbstractAgentSet[T]
    inRadius: (x, y, agents, radius) ->
      InRadiusOrCone.inRadius(this, x, y, agents, radius)

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

    # (Number) => Number | TopologyInterrupt
    _wrapXCautiously: (pos) ->
      @_wrapCautiously(@minPxcor, @maxPxcor, pos)

    # (Number) => Number
    _wrapXLeniently: (pos) ->
      @_wrapLeniently(@minPxcor, @maxPxcor, pos)

    # (Number) => Number | TopologyInterrupt
    _wrapYCautiously: (pos) ->
      @_wrapCautiously(@minPycor, @maxPycor, pos)

    # (Number) => Number
    _wrapYLeniently: (pos) ->
      @_wrapLeniently(@minPycor, @maxPycor, pos)

    # (Number, Number, Number) => Number | TopologyInterrupt
    _wrapCautiously: (minCor, maxCor, pos) ->
      min = minCor - 0.5
      max = maxCor + 0.5
      if min <= pos < max
        pos
      else
        TopologyInterrupt

    # (Number, Number, Number) => Number
    _wrapLeniently:  (minCor, maxCor, pos) ->
      @_wrap(pos, minCor - 0.5, maxCor + 0.5)

    # (Number) => Number | TopologyInterrupt
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
