# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('engine.core.topology.box')

goog.require('engine.core.topology.topology')
goog.require('util.exception')

  class Box extends Topology

    _wrapInX: false # Boolean
    _wrapInY: false # Boolean

    # (Number) => Number
    wrapX: (pos) ->
      minX = @minPxcor - 0.5
      maxX = @maxPxcor + 0.5
      if minX < pos < maxX
        pos
      else # Amusingly, Headless throws a similarly inconsistent and grammatically incorrect error message --JAB (4/29/14)
        throw new Exception.TopologyInterrupt("Cannot move turtle beyond the worlds edge.")

    # (Number) => Number
    wrapY: (pos) ->
      minY = @minPycor - 0.5
      maxY = @maxPycor + 0.5
      if minY < pos < maxY
        pos
      else # Amusingly, Headless throws a similarly inconsistent and grammatically incorrect error message --JAB (4/29/14)
        throw new Exception.TopologyInterrupt("Cannot move turtle beyond the worlds edge.")

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

    # (String, Number) => Unit
    diffuse: (varName, coefficient) ->
      yy = @height
      xx = @width
      scratch =
        for x in [0...xx]
          for y in [0...yy]
            @_getPatchAt(x + @minPxcor, y + @minPycor).getVariable(varName)
      scratch2 =
        for [0...xx]
          for [0...yy]
            0
      for y in [0...yy]
        for x in [0...xx]
          diffuseVal = (scratch[x][y] / 8) * coefficient
          if 0 < y < yy - 1 and 0 < x < xx - 1
            scratch2[x    ][y    ] += scratch[x][y] - (8 * diffuseVal)
            scratch2[x - 1][y - 1] += diffuseVal
            scratch2[x - 1][y    ] += diffuseVal
            scratch2[x - 1][y + 1] += diffuseVal
            scratch2[x    ][y + 1] += diffuseVal
            scratch2[x    ][y - 1] += diffuseVal
            scratch2[x + 1][y - 1] += diffuseVal
            scratch2[x + 1][y    ] += diffuseVal
            scratch2[x + 1][y + 1] += diffuseVal
          else if 0 < y < yy - 1
            if x is 0
              scratch2[x    ][y    ] += scratch[x][y] - (5 * diffuseVal)
              scratch2[x    ][y + 1] += diffuseVal
              scratch2[x    ][y - 1] += diffuseVal
              scratch2[x + 1][y - 1] += diffuseVal
              scratch2[x + 1][y    ] += diffuseVal
              scratch2[x + 1][y + 1] += diffuseVal
            else
              scratch2[x    ][y    ] += scratch[x][y] - (5 * diffuseVal)
              scratch2[x    ][y + 1] += diffuseVal
              scratch2[x    ][y - 1] += diffuseVal
              scratch2[x - 1][y - 1] += diffuseVal
              scratch2[x - 1][y    ] += diffuseVal
              scratch2[x - 1][y + 1] += diffuseVal
          else if 0 < x < xx - 1
            if y is 0
              scratch2[x    ][y    ] += scratch[x][y] - (5 * diffuseVal)
              scratch2[x - 1][y    ] += diffuseVal
              scratch2[x - 1][y + 1] += diffuseVal
              scratch2[x    ][y + 1] += diffuseVal
              scratch2[x + 1][y    ] += diffuseVal
              scratch2[x + 1][y + 1] += diffuseVal
            else
              scratch2[x    ][y    ] += scratch[x][y] - (5 * diffuseVal)
              scratch2[x - 1][y    ] += diffuseVal
              scratch2[x - 1][y - 1] += diffuseVal
              scratch2[x    ][y - 1] += diffuseVal
              scratch2[x + 1][y    ] += diffuseVal
              scratch2[x + 1][y - 1] += diffuseVal
          else if x is 0
            if y is 0
              scratch2[x    ][y    ] += scratch[x][y] - (3 * diffuseVal)
              scratch2[x    ][y + 1] += diffuseVal
              scratch2[x + 1][y    ] += diffuseVal
              scratch2[x + 1][y + 1] += diffuseVal
            else
              scratch2[x    ][y    ] += scratch[x][y] - (3 * diffuseVal)
              scratch2[x    ][y - 1] += diffuseVal
              scratch2[x + 1][y    ] += diffuseVal
              scratch2[x + 1][y - 1] += diffuseVal
          else if y is 0
            scratch2[x    ][y    ] += scratch[x][y] - (3 * diffuseVal)
            scratch2[x    ][y + 1] += diffuseVal
            scratch2[x - 1][y    ] += diffuseVal
            scratch2[x - 1][y + 1] += diffuseVal
          else
            scratch2[x    ][y    ] += scratch[x][y] - (3 * diffuseVal)
            scratch2[x    ][y - 1] += diffuseVal
            scratch2[x - 1][y    ] += diffuseVal
            scratch2[x - 1][y - 1] += diffuseVal
      for y in [0...yy]
        for x in [0...xx]
          @_getPatchAt(x + @minPxcor, y + @minPycor).setVariable(varName, scratch2[x][y])

      return

    # (Number, Number) => Number
    _shortestX: (x1, x2) ->
      Math.abs(x1 - x2) * (if x1 > x2 then -1 else 1)

    # (Number, Number) => Number
    _shortestY: (y1, y2) ->
      Math.abs(y1 - y2) * (if y1 > y2 then -1 else 1)

