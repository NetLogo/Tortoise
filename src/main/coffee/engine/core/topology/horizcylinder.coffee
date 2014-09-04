# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Topology = require('./topology')

module.exports =
  class HorizCylinder extends Topology

    _wrapInX: false # Boolean
    _wrapInY: true  # Boolean

    # (Number) => Number
    wrapX: (pos) ->
      @_wrapXCautiously(pos)

    # (Number) => Number
    wrapY: (pos) ->
      @_wrapYLeniently(pos)

    # (Number, Number) => Patch|Boolean
    _getPatchEast: (pxcor, pycor) ->
      (pxcor isnt @maxPxcor) and @_getPatchAt(pxcor + 1, pycor)

    # (Number, Number) => Patch|Boolean
    _getPatchWest: (pxcor, pycor) ->
      (pxcor isnt @minPxcor) and @_getPatchAt(pxcor - 1, pycor)

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
    _getPatchNorthWest: (pxcor, pycor) ->
      if pxcor is @minPxcor
        false
      else if pycor is @maxPycor
        @_getPatchAt(pxcor - 1, @minPycor)
      else
        @_getPatchAt(pxcor - 1, pycor + 1)

    # (Number, Number) => Patch|Boolean
    _getPatchSouthWest: (pxcor, pycor) ->
      if pxcor is @minPxcor
        false
      else if pycor is @minPycor
        @_getPatchAt(pxcor - 1, @maxPycor)
      else
        @_getPatchAt(pxcor - 1, pycor - 1)

    # (Number, Number) => Patch|Boolean
    _getPatchSouthEast: (pxcor, pycor) ->
      if pxcor is @maxPxcor
        false
      else if pycor is @minPycor
        @_getPatchAt(pxcor + 1, @maxPycor)
      else
        @_getPatchAt(pxcor + 1, pycor - 1)

    # (Number, Number) => Patch|Boolean
    _getPatchNorthEast: (pxcor, pycor) ->
      if pxcor is @maxPxcor
        false
      else if pycor is @maxPycor
        @_getPatchAt(pxcor + 1, @minPycor)
      else
        @_getPatchAt(pxcor + 1, pycor + 1)

    # (Number, Number, Array[Array[Number]], Array[Array[Number]], Number) => Unit
    _refineScratchPads: (yy, xx, scratch, scratch2, coefficient) ->
      for y in [yy...(yy * 2)]
        for x in [xx...(xx * 2)]
          diffuseVal = (scratch[x - xx][y - yy] / 8) * coefficient
          if xx < x < (xx * 2) - 1
            scratch2[(x    ) - xx][(y    ) - yy] += scratch[x - xx][y - yy] - (8 * diffuseVal)
            scratch2[(x - 1) % xx][(y - 1) % yy] += diffuseVal
            scratch2[(x - 1) % xx][(y    ) % yy] += diffuseVal
            scratch2[(x - 1) % xx][(y + 1) % yy] += diffuseVal
            scratch2[(x    ) % xx][(y + 1) % yy] += diffuseVal
            scratch2[(x    ) % xx][(y - 1) % yy] += diffuseVal
            scratch2[(x + 1) % xx][(y - 1) % yy] += diffuseVal
            scratch2[(x + 1) % xx][(y    ) % yy] += diffuseVal
            scratch2[(x + 1) % xx][(y + 1) % yy] += diffuseVal
          else if x is xx
            scratch2[(x    ) - xx][(y    ) - yy] += scratch[x - xx][y - yy] - (5 * diffuseVal)
            scratch2[(x    ) % xx][(y + 1) % yy] += diffuseVal
            scratch2[(x    ) % xx][(y - 1) % yy] += diffuseVal
            scratch2[(x + 1) % xx][(y - 1) % yy] += diffuseVal
            scratch2[(x + 1) % xx][(y    ) % yy] += diffuseVal
            scratch2[(x + 1) % xx][(y + 1) % yy] += diffuseVal
          else
            scratch2[(x    ) - xx][(y    ) - yy] += scratch[x - xx][y - yy] - (5 * diffuseVal)
            scratch2[(x    ) % xx][(y + 1) % yy] += diffuseVal
            scratch2[(x    ) % xx][(y - 1) % yy] += diffuseVal
            scratch2[(x - 1) % xx][(y - 1) % yy] += diffuseVal
            scratch2[(x - 1) % xx][(y    ) % yy] += diffuseVal
            scratch2[(x - 1) % xx][(y + 1) % yy] += diffuseVal
      return

    # (Number, Number) => Number
    _shortestX: (x1, x2) ->
      @_shortestNotWrapped(x1, x2)

    # (Number, Number) => Number
    _shortestY: (y1, y2) ->
      @_shortestYWrapped(y1, y2)
