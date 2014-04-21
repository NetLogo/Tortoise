define(['engine/agentkind', 'engine/agents',  'engine/nobody', 'integration/strictmath', 'engine/turtle', 'engine/patch']
     , ( AgentKind,          Agents,           Nobody,          StrictMath,               Turtle,          Patch) ->

  class Topology

    _wrapInX: undefined # Boolean
    _wrapInY: undefined # Boolean

    #@# Room for improvement
    constructor: (@minPxcor, @maxPxcor, @minPycor, @maxPycor, @getPatches, @getPatchAt) ->
      @height = 1 + @maxPycor - @minPycor
      @width  = 1 + @maxPxcor - @minPxcor
    # based on agent.Topology.wrap()
    wrap: (pos, min, max) ->
      if (pos >= max)
        (min + ((pos - max) % (max - min)))
      else if (pos < min)
        result = max - ((min - pos) % (max - min)) #@# FP
        if (result < max)
          result
        else
          min
      else
        pos

    getNeighbors: (pxcor, pycor) -> #@# The line's too full of nonsense
      new Agents((patch for patch in @_getNeighbors(pxcor, pycor) when patch != false), undefined, AgentKind.Patch)

    _getNeighbors: (pxcor, pycor) -> #@# Was I able to fix this in the ScalaJS version?
      if (pxcor == @maxPxcor && pxcor == @minPxcor) #@# How can you just go and reference properties of yourself that you don't require?
        if (pycor == @maxPycor && pycor == @minPycor)
          []
        else
          [@getPatchNorth(pxcor, pycor), @getPatchSouth(pxcor, pycor)]
      else if (pycor == @maxPycor && pycor == @minPycor)
        [@getPatchEast(pxcor, pycor), @getPatchWest(pxcor, pycor)]
      else
        [@getPatchNorth(pxcor, pycor),     @getPatchEast(pxcor, pycor),
         @getPatchSouth(pxcor, pycor),     @getPatchWest(pxcor, pycor),
         @getPatchNorthEast(pxcor, pycor), @getPatchSouthEast(pxcor, pycor),
         @getPatchSouthWest(pxcor, pycor), @getPatchNorthWest(pxcor, pycor)]

    getNeighbors4: (pxcor, pycor) -> #@# Line too full
      new Agents((patch for patch in @_getNeighbors4(pxcor, pycor) when patch != false), undefined, AgentKind.Patch)

    _getNeighbors4: (pxcor, pycor) -> #@# Any improvement in ScalaJS version?
      if (pxcor == @maxPxcor && pxcor == @minPxcor)
        if (pycor == @maxPycor && pycor == @minPycor)
          []
        else
          [@getPatchNorth(pxcor, pycor), @getPatchSouth(pxcor, pycor)]
      else if (pycor == @maxPycor && pycor == @minPycor)
        [@getPatchEast(pxcor, pycor), @getPatchWest(pxcor, pycor)]
      else
        [@getPatchNorth(pxcor, pycor), @getPatchEast(pxcor, pycor),
         @getPatchSouth(pxcor, pycor), @getPatchWest(pxcor, pycor)]

    distanceXY: (x1, y1, x2, y2) -> #@# Long line
      StrictMath.sqrt(StrictMath.pow(@shortestX(x1, x2), 2) + StrictMath.pow(@shortestY(y1, y2), 2))
    distance: (x1, y1, agent) -> #@# If you're polymorphizing, you ought to just do it properly in the OO way
      if (agent instanceof Turtle)
        @distanceXY(x1, y1, agent.xcor(), agent.ycor())
      else if(agent instanceof Patch)
        @distanceXY(x1, y1, agent.pxcor, agent.pycor)

    towards: (x1, y1, x2, y2) ->
      dx = @shortestX(x1, x2)
      dy = @shortestY(y1, y2)
      if dx == 0 #@# Code of anger
        if dy >= 0 then 0 else 180
      else if dy == 0
        if dx >= 0 then 90 else 270
      else
        (270 + StrictMath.toDegrees (Math.PI + StrictMath.atan2(-dy, dx))) % 360 #@# Long line
    midpointx: (x1, x2) -> @wrap((x1 + (x1 + @shortestX(x1, x2))) / 2, @minPxcor - 0.5, @maxPxcor + 0.5) #@# What does this mean?  I don't know!
    midpointy: (y1, y2) -> @wrap((y1 + (y1 + @shortestY(y1, y2))) / 2, @minPycor - 0.5, @maxPycor + 0.5) #@# What does this mean?  I don't know!

    inRadius: (origin, x, y, agents, radius) ->
      result = []

      r = Math.ceil(radius)
      width = @width / 2
      height = @height / 2
      if(r < width || @wrapInX) #@# FP
        minDX = -r
        maxDX = r
      else
        maxDX = StrictMath.floor(width)
        minDX = -Math.ceil(width - 1)
      if(r < height || @wrapInY)
        minDY = -r
        maxDY = r
      else
        maxDY = StrictMath.floor(height)
        minDY = -Math.ceil(height - 1)

      for dy in [minDY..maxDY] #@# 'Tis crap
        for dx in [minDX..maxDX]
          p = origin.patchAt(dx, dy)
          if p != Nobody #@# Feels `Option.map(f).getOrElse`-ish
            if(@distanceXY(p.pxcor, p.pycor, x, y) <= radius && agents.items.filter((o) -> o == p).length > 0)
              result.push(p)
            for t in p.turtlesHere().items
              if(@distanceXY(t.xcor(), t.ycor(), x, y) <= radius && agents.items.filter((o) -> o == t).length > 0)
                result.push(t)
      new Agents(result, agents.breed, agents.kind)

)
