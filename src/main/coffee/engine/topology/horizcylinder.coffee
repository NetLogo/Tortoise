define(['integration/strictmath', 'engine/exception', 'engine/topology/topology'], (StrictMath, Exception, Topology) ->

  class HorizCylinder extends Topology

    _wrapInX: false
    _wrapInY: true

    shortestX: (x1, x2) -> Math.abs(x1 - x2) * (if x1 > x2 then -1 else 1) #@# Weird
    shortestY: (y1, y2) -> #@# Weird
      if StrictMath.abs(y1 - y2) > (1 + @maxPycor - @minPycor) / 2
        (@height - Math.abs(y1 - y2)) * (if y2 > y1 then -1 else 1)
      else
        Math.abs(y1 - y2) * (if y1 > y2 then -1 else 1)
    wrapX: (pos) -> #@# Couldn't `Topology` have a `wrapXRestrictive` and `wrapXLenient` it could share between topologies, or something?
      minX = @minPxcor - 0.5
      maxX = @maxPxcor + 0.5
      if minX < pos < maxX
        pos
      else
        throw new Exception.TopologyInterrupt ("Cannot move turtle beyond the world's edge.")
    wrapY: (pos) ->
      @wrap(pos, @minPycor - 0.5, @maxPycor + 0.5)
    getPatchEast: (pxcor, pycor) -> (pxcor isnt @maxPxcor) and @getPatchAt(pxcor + 1, pycor)
    getPatchWest: (pxcor, pycor) -> (pxcor isnt @minPxcor) and @getPatchAt(pxcor - 1, pycor)
    getPatchNorth: (pxcor, pycor) ->
      if pycor is @maxPycor
        @getPatchAt(pxcor, @minPycor)
      else
        @getPatchAt(pxcor, pycor + 1)
    getPatchSouth: (pxcor, pycor) ->
      if pycor is @minPycor
        @getPatchAt(pxcor, @maxPycor)
      else
        @getPatchAt(pxcor, pycor - 1)

    getPatchNorthWest: (pxcor, pycor) ->
      if pxcor is @minPxcor
        false
      else if pycor is @maxPycor
        @getPatchAt(pxcor - 1, @minPycor)
      else
        @getPatchAt(pxcor - 1, pycor + 1)

    getPatchSouthWest: (pxcor, pycor) ->
      if pxcor is @minPxcor
        false
      else if pycor is @minPycor
        @getPatchAt(pxcor - 1, @maxPycor)
      else
        @getPatchAt(pxcor - 1, pycor - 1)

    getPatchSouthEast: (pxcor, pycor) ->
      if pxcor is @maxPxcor
        false
      else if pycor is @minPycor
        @getPatchAt(pxcor + 1, @maxPycor)
      else
        @getPatchAt(pxcor + 1, pycor - 1)

    getPatchNorthEast: (pxcor, pycor) ->
      if pxcor is @maxPxcor
        false
      else if pycor is @maxPycor
        @getPatchAt(pxcor + 1, @minPycor)
      else
        @getPatchAt(pxcor + 1, pycor + 1)
    diffuse: (varName, coefficient) -> #@# Dat guacamole
      yy = @height
      xx = @width
      scratch =
        for x in [0...xx]
          for y in [0...yy]
            @getPatchAt(x + @minPxcor, y + @minPycor).getPatchVariable(varName)
      scratch2 =
        for [0...xx]
          for [0...yy]
            0
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
      for y in [0...yy]
        for x in [0...xx]
          @getPatchAt(x + @minPxcor, y + @minPycor).setPatchVariable(varName, scratch2[x][y])

)
