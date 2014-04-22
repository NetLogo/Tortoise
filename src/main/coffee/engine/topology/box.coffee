define(['engine/exception', 'engine/topology/topology'], (Exception, Topology) ->

  class Box extends Topology

    _wrapInX: false
    _wrapInY: false

    #@# Weird x2
    shortestX: (x1, x2) -> Math.abs(x1 - x2) * (if x1 > x2 then -1 else 1)
    shortestY: (y1, y2) -> Math.abs(y1 - y2) * (if y1 > y2 then -1 else 1)
    wrapX: (pos) -> #@# Fun comparator syntax x2
      if(pos >= @maxPxcor + 0.5 || pos <= @minPxcor - 0.5)
        throw new Exception.TopologyInterrupt ("Cannot move turtle beyond the worlds edge.")
      else pos
    wrapY: (pos) ->
      if(pos >= @maxPycor + 0.5 || pos <= @minPycor - 0.5)
        throw new Exception.TopologyInterrupt ("Cannot move turtle beyond the worlds edge.")
      else pos

    getPatchNorth: (pxcor, pycor) -> (pycor != @maxPycor) && @getPatchAt(pxcor, pycor + 1)
    getPatchSouth: (pxcor, pycor) -> (pycor != @minPycor) && @getPatchAt(pxcor, pycor - 1)
    getPatchEast: (pxcor, pycor) -> (pxcor != @maxPxcor) && @getPatchAt(pxcor + 1, pycor)
    getPatchWest: (pxcor, pycor) -> (pxcor != @minPxcor) && @getPatchAt(pxcor - 1, pycor)

    getPatchNorthWest: (pxcor, pycor) -> (pycor != @maxPycor) && (pxcor != @minPxcor) && @getPatchAt(pxcor - 1, pycor + 1)
    getPatchSouthWest: (pxcor, pycor) -> (pycor != @minPycor) && (pxcor != @minPxcor) && @getPatchAt(pxcor - 1, pycor - 1)
    getPatchSouthEast: (pxcor, pycor) -> (pycor != @minPycor) && (pxcor != @maxPxcor) && @getPatchAt(pxcor + 1, pycor - 1)
    getPatchNorthEast: (pxcor, pycor) -> (pycor != @maxPycor) && (pxcor != @maxPxcor) && @getPatchAt(pxcor + 1, pycor + 1)

    diffuse: (vn, amount) -> #@# Guacy moley
      yy = @height
      xx = @width
      scratch = for x in [0...xx]
        for y in [0...yy]
          @getPatchAt(x + @minPxcor, y + @minPycor).getPatchVariable(vn)
      scratch2 = for x in [0...xx]
        for y in [0...yy]
          0
      for y in [0...yy]
        for x in [0...xx]
          diffuseVal = (scratch[x][y] / 8) * amount
          if (y > 0 && y < yy - 1 && x > 0 && x < xx - 1)
            scratch2[x    ][y    ] += scratch[x][y] - (8 * diffuseVal)
            scratch2[x - 1][y - 1] += diffuseVal
            scratch2[x - 1][y    ] += diffuseVal
            scratch2[x - 1][y + 1] += diffuseVal
            scratch2[x    ][y + 1] += diffuseVal
            scratch2[x    ][y - 1] += diffuseVal
            scratch2[x + 1][y - 1] += diffuseVal
            scratch2[x + 1][y    ] += diffuseVal
            scratch2[x + 1][y + 1] += diffuseVal
          else if (y > 0 && y < yy - 1)
            if (x == 0)
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
          else if (x > 0 && x < xx - 1)
            if (y == 0)
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
          else if (x == 0)
            if (y == 0)
              scratch2[x    ][y    ] += scratch[x][y] - (3 * diffuseVal)
              scratch2[x    ][y + 1] += diffuseVal
              scratch2[x + 1][y    ] += diffuseVal
              scratch2[x + 1][y + 1] += diffuseVal
            else
              scratch2[x    ][y    ] += scratch[x][y] - (3 * diffuseVal)
              scratch2[x    ][y - 1] += diffuseVal
              scratch2[x + 1][y    ] += diffuseVal
              scratch2[x + 1][y - 1] += diffuseVal
          else if (y == 0)
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
          @getPatchAt(x + @minPxcor, y + @minPycor).setPatchVariable(vn, scratch2[x][y])

)
