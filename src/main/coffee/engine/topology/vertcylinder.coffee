# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['integration/strictmath', 'engine/exception', 'engine/topology/topology'], (StrictMath, Exception, Topology) ->

  class VertCylinder extends Topology

    _wrapInX: true  # Boolean
    _wrapInY: false # Boolean

    # (Number) => Number
    wrapX: (pos) ->
      @_wrap(pos, @minPxcor - 0.5, @maxPxcor + 0.5)

    # (Number) => Number
    wrapY: (pos) ->
      minY = @minPycor - 0.5
      maxY = @maxPycor + 0.5
      if minY < pos < maxY
        pos
      else
        throw new Exception.TopologyInterrupt ("Cannot move turtle beyond the world's edge.")

    # (Number, Number) => Patch
    _getPatchNorth: (pxcor, pycor) ->
      (pycor isnt @maxPycor) and @_getPatchAt(pxcor, pycor + 1) #@# This booleanism is really weird.  It's present across topologies.

    # (Number, Number) => Patch
    _getPatchSouth: (pxcor, pycor) ->
      (pycor isnt @minPycor) and @_getPatchAt(pxcor, pycor - 1)

    # (Number, Number) => Patch
    _getPatchEast: (pxcor, pycor) ->
      if pxcor is @maxPxcor
        @_getPatchAt(@minPxcor, pycor)
      else
        @_getPatchAt(pxcor + 1, pycor)

    # (Number, Number) => Patch
    _getPatchWest: (pxcor, pycor) ->
      if pxcor is @minPxcor
        @_getPatchAt(@maxPxcor, pycor)
      else
        @_getPatchAt(pxcor - 1, pycor)

    # (Number, Number) => Patch
    _getPatchNorthWest: (pxcor, pycor) ->
      if pycor is @maxPycor
        false
      else if pxcor is @minPxcor
        @_getPatchAt(@maxPxcor, pycor + 1)
      else
        @_getPatchAt(pxcor - 1, pycor + 1)

    # (Number, Number) => Patch
    _getPatchSouthWest: (pxcor, pycor) ->
      if pycor is @minPycor
        false
      else if pxcor is @minPxcor
        @_getPatchAt(@maxPxcor, pycor - 1)
      else
        @_getPatchAt(pxcor - 1, pycor - 1)

    # (Number, Number) => Patch
    _getPatchSouthEast: (pxcor, pycor) ->
      if pycor is @minPycor
        false
      else if pxcor is @maxPxcor
        @_getPatchAt(@minPxcor, pycor - 1)
      else
        @_getPatchAt(pxcor + 1, pycor - 1)

    # (Number, Number) => Patch
    _getPatchNorthEast: (pxcor, pycor) ->
      if pycor is @maxPycor
        false
      else if pxcor is @maxPxcor
        @_getPatchAt(@minPxcor, pycor + 1)
      else
        @_getPatchAt(pxcor + 1, pycor + 1)

    # (String, Number) => Unit
    diffuse: (varName, coefficient) -> #@# Holy guacamole!
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
      for y in [yy...(yy * 2)]
        for x in [xx...(xx * 2)]
          diffuseVal = (scratch[x - xx][y - yy] / 8) * coefficient
          if yy < y < (yy * 2) - 1
            scratch2[(x    ) - xx][(y    ) - yy] += scratch[x - xx][y - yy] - (8 * diffuseVal)
            scratch2[(x - 1) % xx][(y - 1) % yy] += diffuseVal
            scratch2[(x - 1) % xx][(y    ) % yy] += diffuseVal
            scratch2[(x - 1) % xx][(y + 1) % yy] += diffuseVal
            scratch2[(x    ) % xx][(y + 1) % yy] += diffuseVal
            scratch2[(x    ) % xx][(y - 1) % yy] += diffuseVal
            scratch2[(x + 1) % xx][(y - 1) % yy] += diffuseVal
            scratch2[(x + 1) % xx][(y    ) % yy] += diffuseVal
            scratch2[(x + 1) % xx][(y + 1) % yy] += diffuseVal
          else if y is yy
            scratch2[(x    ) - xx][(y    ) - yy] += scratch[x - xx][y - yy] - (5 * diffuseVal)
            scratch2[(x - 1) % xx][(y    ) % yy] += diffuseVal
            scratch2[(x - 1) % xx][(y + 1) % yy] += diffuseVal
            scratch2[(x    ) % xx][(y + 1) % yy] += diffuseVal
            scratch2[(x + 1) % xx][(y    ) % yy] += diffuseVal
            scratch2[(x + 1) % xx][(y + 1) % yy] += diffuseVal
          else
            scratch2[(x    ) - xx][(y    ) - yy] += scratch[x - xx][y - yy] - (5 * diffuseVal)
            scratch2[(x - 1) % xx][(y    ) % yy] += diffuseVal
            scratch2[(x - 1) % xx][(y - 1) % yy] += diffuseVal
            scratch2[(x    ) % xx][(y - 1) % yy] += diffuseVal
            scratch2[(x + 1) % xx][(y    ) % yy] += diffuseVal
            scratch2[(x + 1) % xx][(y - 1) % yy] += diffuseVal
      for y in [0...yy]
        for x in [0...xx]
          @_getPatchAt(x + @minPxcor, y + @minPycor).setVariable(varName, scratch2[x][y])

      return


    # (Number, Number) => Number
    _shortestX: (x1, x2) -> #@# Some lameness
      if StrictMath.abs(x1 - x2) > (1 + @maxPxcor - @minPxcor) / 2
        (@width - StrictMath.abs(x1 - x2)) * (if x2 > x1 then -1 else 1)
      else
        Math.abs(x1 - x2) * (if x1 > x2 then -1 else 1)

    # (Number, Number) => Number
    _shortestY: (y1, y2) ->
      Math.abs(y1 - y2) * (if y1 > y2 then -1 else 1)

)
