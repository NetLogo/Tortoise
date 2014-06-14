# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['engine/exception', 'engine/topology/topology'], (Exception, Topology) ->

  class Box extends Topology

    _wrapInX: false
    _wrapInY: false

    #@# Weird x2
    shortestX: (x1, x2) -> Math.abs(x1 - x2) * (if x1 > x2 then -1 else 1)
    shortestY: (y1, y2) -> Math.abs(y1 - y2) * (if y1 > y2 then -1 else 1)
    wrapX: (pos) ->
      minX = @minPxcor - 0.5
      maxX = @maxPxcor + 0.5
      if minX < pos < maxX
        pos
      else # Amusingly, Headless throws a similarly inconsistent and grammatically incorrect error message --JAB (4/29/14)
        throw new Exception.TopologyInterrupt ("Cannot move turtle beyond the worlds edge.")
    wrapY: (pos) ->
      minY = @minPycor - 0.5
      maxY = @maxPycor + 0.5
      if minY < pos < maxY
        pos
      else # Amusingly, Headless throws a similarly inconsistent and grammatically incorrect error message --JAB (4/29/14)
        throw new Exception.TopologyInterrupt ("Cannot move turtle beyond the worlds edge.")

    getPatchNorth: (pxcor, pycor) -> (pycor isnt @maxPycor) and @getPatchAt(pxcor, pycor + 1)
    getPatchSouth: (pxcor, pycor) -> (pycor isnt @minPycor) and @getPatchAt(pxcor, pycor - 1)
    getPatchEast: (pxcor, pycor) -> (pxcor isnt @maxPxcor) and @getPatchAt(pxcor + 1, pycor)
    getPatchWest: (pxcor, pycor) -> (pxcor isnt @minPxcor) and @getPatchAt(pxcor - 1, pycor)

    getPatchNorthWest: (pxcor, pycor) -> (pycor isnt @maxPycor) and (pxcor isnt @minPxcor) and @getPatchAt(pxcor - 1, pycor + 1)
    getPatchSouthWest: (pxcor, pycor) -> (pycor isnt @minPycor) and (pxcor isnt @minPxcor) and @getPatchAt(pxcor - 1, pycor - 1)
    getPatchSouthEast: (pxcor, pycor) -> (pycor isnt @minPycor) and (pxcor isnt @maxPxcor) and @getPatchAt(pxcor + 1, pycor - 1)
    getPatchNorthEast: (pxcor, pycor) -> (pycor isnt @maxPycor) and (pxcor isnt @maxPxcor) and @getPatchAt(pxcor + 1, pycor + 1)

    diffuse: (varName, coefficient) -> #@# Guacy moley
      yy = @height
      xx = @width
      scratch =
        for x in [0...xx]
          for y in [0...yy]
            @getPatchAt(x + @minPxcor, y + @minPycor).getVariable(varName)
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
          @getPatchAt(x + @minPxcor, y + @minPycor).setVariable(varName, scratch2[x][y])

)
