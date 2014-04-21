define(['integration/strictmath', 'engine/exception', 'engine/topology/topology'], (StrictMath, Exception, Topology) ->

  class HorzCylinder extends Topology

    _wrapInX: false
    _wrapInY: true

    shortestX: (x1, x2) -> Math.abs(x1 - x2) * (if x1 > x2 then -1 else 1) #@# Weird
    shortestY: (y1, y2) -> #@# Weird
      if(StrictMath.abs(y1 - y2) > (1 + @maxPycor - @minPycor) / 2)
        (@height - Math.abs(y1 - y2)) * (if y2 > y1 then -1 else 1)
      else
        Math.abs(y1 - y2) * (if y1 > y2 then -1 else 1)
    wrapX: (pos) ->
      if(pos >= @maxPxcor + 0.5 || pos <= @minPxcor - 0.5) #@# Fun comparator syntax
        throw new Exception.TopologyInterrupt ("Cannot move turtle beyond the world's edge.")
      else pos
    wrapY: (pos) ->
      @wrap(pos, @minPycor - 0.5, @maxPycor + 0.5)
    getPatchEast: (pxcor, pycor) -> (pxcor != @maxPxcor) && @getPatchAt(pxcor + 1, pycor)
    getPatchWest: (pxcor, pycor) -> (pxcor != @minPxcor) && @getPatchAt(pxcor - 1, pycor)
    getPatchNorth: (pxcor, pycor) ->
      if (pycor == @maxPycor)
        @getPatchAt(pxcor, @minPycor)
      else
        @getPatchAt(pxcor, pycor + 1)
    getPatchSouth: (pxcor, pycor) ->
      if (pycor == @minPycor)
        @getPatchAt(pxcor, @maxPycor)
      else
        @getPatchAt(pxcor, pycor - 1)

    getPatchNorthWest: (pxcor, pycor) ->
      if (pxcor == @minPxcor)
        false
      else if (pycor == @maxPycor)
        @getPatchAt(pxcor - 1, @minPycor)
      else
        @getPatchAt(pxcor - 1, pycor + 1)

    getPatchSouthWest: (pxcor, pycor) ->
      if (pxcor == @minPxcor)
        false
      else if (pycor == @minPycor)
        @getPatchAt(pxcor - 1, @maxPycor)
      else
        @getPatchAt(pxcor - 1, pycor - 1)

    getPatchSouthEast: (pxcor, pycor) ->
      if (pxcor == @maxPxcor)
        false
      else if (pycor == @minPycor)
        @getPatchAt(pxcor + 1, @maxPycor)
      else
        @getPatchAt(pxcor + 1, pycor - 1)

    getPatchNorthEast: (pxcor, pycor) ->
      if (pxcor == @maxPxcor)
        false
      else if (pycor == @maxPycor)
        @getPatchAt(pxcor + 1, @minPycor)
      else
        @getPatchAt(pxcor + 1, pycor + 1)
    diffuse: (vn, amount) -> #@# Dat guacamole
      yy = @height
      xx = @width
      scratch = for x in [0...xx]
        for y in [0...yy]
          @getPatchAt(x + @minPxcor, y + @minPycor).getPatchVariable(vn)
      scratch2 = for x in [0...xx]
        for y in [0...yy]
          0
      for y in [yy...(yy * 2)]
        for x in [xx...(xx * 2)]
          diffuseVal = (scratch[x - xx][y - yy] / 8) * amount
          if (x > xx && x < (xx * 2) - 1)
            scratch2[(x    ) - xx][(y    ) - yy] += scratch[x - xx][y - yy] - (8 * diffuseVal)
            scratch2[(x - 1) % xx][(y - 1) % yy] += diffuseVal
            scratch2[(x - 1) % xx][(y    ) % yy] += diffuseVal
            scratch2[(x - 1) % xx][(y + 1) % yy] += diffuseVal
            scratch2[(x    ) % xx][(y + 1) % yy] += diffuseVal
            scratch2[(x    ) % xx][(y - 1) % yy] += diffuseVal
            scratch2[(x + 1) % xx][(y - 1) % yy] += diffuseVal
            scratch2[(x + 1) % xx][(y    ) % yy] += diffuseVal
            scratch2[(x + 1) % xx][(y + 1) % yy] += diffuseVal
          else if (x == xx)
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
          @getPatchAt(x + @minPxcor, y + @minPycor).setPatchVariable(vn, scratch2[x][y])

)
