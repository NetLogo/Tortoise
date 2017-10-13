# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Topology = require('./topology')

module.exports =
  class Box extends Topology

    _wrapInX: false # Boolean
    _wrapInY: false # Boolean

    # (Number) => Number
    wrapX: (pos) ->
      @_wrapXCautiously(pos)

    # (Number) => Number
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

    # (Number, Number, Array[Array[Number]], Array[Array[Number]], Number) => Unit
    _refineScratchPads: (yy, xx, scratch, scratch2, coefficient) ->
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
      return

      # (Number, Number, Array[Array[Number]], Array[Array[Number]], Number) => Unit
    _refineScratchPads4: (yy, xx, scratch, scratch2, coefficient) ->
      for y in [0...yy]
        for x in [0...xx]
          diffuseVal = (scratch[x][y] / 4) * coefficient
          if 0 < y < yy - 1 and 0 < x < xx - 1
            scratch2[x    ][y    ] += scratch[x][y] - (4 * diffuseVal)
            scratch2[x - 1][y    ] += diffuseVal
            scratch2[x    ][y + 1] += diffuseVal
            scratch2[x    ][y - 1] += diffuseVal
            scratch2[x + 1][y    ] += diffuseVal
          else if 0 < y < yy - 1
            if x is 0
              scratch2[x    ][y    ] += scratch[x][y] - (3 * diffuseVal)
              scratch2[x    ][y + 1] += diffuseVal
              scratch2[x    ][y - 1] += diffuseVal
              scratch2[x + 1][y    ] += diffuseVal
            else
              scratch2[x    ][y    ] += scratch[x][y] - (3 * diffuseVal)
              scratch2[x    ][y + 1] += diffuseVal
              scratch2[x    ][y - 1] += diffuseVal
              scratch2[x - 1][y    ] += diffuseVal
          else if 0 < x < xx - 1
            if y is 0
              scratch2[x    ][y    ] += scratch[x][y] - (3 * diffuseVal)
              scratch2[x - 1][y    ] += diffuseVal
              scratch2[x    ][y + 1] += diffuseVal
              scratch2[x + 1][y    ] += diffuseVal
            else
              scratch2[x    ][y    ] += scratch[x][y] - (3 * diffuseVal)
              scratch2[x - 1][y    ] += diffuseVal
              scratch2[x    ][y - 1] += diffuseVal
              scratch2[x + 1][y    ] += diffuseVal
          else if x is 0
            if y is 0
              scratch2[x    ][y    ] += scratch[x][y] - (2 * diffuseVal)
              scratch2[x    ][y + 1] += diffuseVal
              scratch2[x + 1][y    ] += diffuseVal
            else
              scratch2[x    ][y    ] += scratch[x][y] - (2 * diffuseVal)
              scratch2[x    ][y - 1] += diffuseVal
              scratch2[x + 1][y    ] += diffuseVal
          else if y is 0
            scratch2[x    ][y    ] += scratch[x][y] - (2 * diffuseVal)
            scratch2[x    ][y + 1] += diffuseVal
            scratch2[x - 1][y    ] += diffuseVal
          else
            scratch2[x    ][y    ] += scratch[x][y] - (2 * diffuseVal)
            scratch2[x    ][y - 1] += diffuseVal
            scratch2[x - 1][y    ] += diffuseVal
      return

    # (Number, Number) => Number
    _shortestX: (x1, x2) =>
      @_shortestNotWrapped(x1, x2)

    # (Number, Number) => Number
    _shortestY: (y1, y2) =>
      @_shortestNotWrapped(y1, y2)
