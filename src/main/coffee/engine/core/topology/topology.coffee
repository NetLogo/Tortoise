# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['shim/lodash', 'shim/strictmath', 'util/abstractmethoderror', 'engine/core/patchset']
     , ( _,             StrictMath,        abstractMethod,             PatchSet) ->

  class Topology

    _wrapInX: undefined # Boolean
    _wrapInY: undefined # Boolean

    height: undefined # Number
    width:  undefined # Number

    #@# Room for improvement
    # (Number, Number, Number, Number, () => PatchSet, (Number, Number) => Patch) => Topology
    constructor: (@minPxcor, @maxPxcor, @minPycor, @maxPycor, @_getPatches, @_getPatchAt) ->
      @height = 1 + @maxPycor - @minPycor
      @width  = 1 + @maxPxcor - @minPxcor

    # (Number, Number) => PatchSet
    getNeighbors: (pxcor, pycor) -> #@# This should memoize
      patches = _(@_getNeighbors(pxcor, pycor)).filter((patch) -> patch isnt false).value()
      new PatchSet(patches)

    # (Number, Number) => PatchSet
    getNeighbors4: (pxcor, pycor) ->
      patches = _(@_getNeighbors4(pxcor, pycor)).filter((patch) -> patch isnt false).value() #@# This code is awkward
      new PatchSet(patches)

    # (Number, Number, Number, Number) => Number
    distanceXY: (x1, y1, x2, y2) -> #@# Long line
      StrictMath.sqrt(StrictMath.pow(@_shortestX(x1, x2), 2) + StrictMath.pow(@_shortestY(y1, y2), 2))

    # (Number, Number, Turtle|Patch) => Number
    distance: (x1, y1, agent) ->
      [x2, y2] = agent.getCoords()
      @distanceXY(x1, y1, x2, y2)

    # (Number, Number, Number, Number) => Number
    towards: (x1, y1, x2, y2) ->
      dx = @_shortestX(x1, x2)
      dy = @_shortestY(y1, y2)
      if dx is 0 #@# Code of anger
        if dy >= 0 then 0 else 180
      else if dy is 0
        if dx >= 0 then 90 else 270
      else
        (270 + StrictMath.toDegrees (Math.PI + StrictMath.atan2(-dy, dx))) % 360 #@# Long line

    # (Number, Number) => Number
    midpointx: (x1, x2) -> @_wrap((x1 + (x1 + @_shortestX(x1, x2))) / 2, @minPxcor - 0.5, @maxPxcor + 0.5) #@# What does this mean?  I don't know!
    midpointy: (y1, y2) -> @_wrap((y1 + (y1 + @_shortestY(y1, y2))) / 2, @minPycor - 0.5, @maxPycor + 0.5) #@# What does this mean?  I don't know!

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

    # (Number, Number) => Number
    _shortestX: (x1, x2) -> abstractMethod('Topology._shortestX')
    _shortestY: (y1, y2) -> abstractMethod('Topology._shortestY')

    # (Number, Number) => Patch
    _getPatchNorth:     (x, y) -> abstractMethod('Topology._getPatchNorth')
    _getPatchEast:      (x, y) -> abstractMethod('Topology._getPatchEast')
    _getPatchSouth:     (x, y) -> abstractMethod('Topology._getPatchSouth')
    _getPatchWest:      (x, y) -> abstractMethod('Topology._getPatchWest')
    _getPatchNorthEast: (x, y) -> abstractMethod('Topology._getPatchNorthEast')
    _getPatchSouthEast: (x, y) -> abstractMethod('Topology._getPatchSouthEast')
    _getPatchSouthWest: (x, y) -> abstractMethod('Topology._getPatchSouthWest')
    _getPatchNorthWest: (x, y) -> abstractMethod('Topology._getPatchNorthWest')

)
