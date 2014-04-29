define(['integration/strictmath', 'engine/exception', 'engine/topology/topology'], (StrictMath, Exception, Topology) ->

  class VertCylinder extends Topology

    _wrapInX: true
    _wrapInY: false

    shortestX: (x1, x2) -> #@# Some lameness
      if StrictMath.abs(x1 - x2) > (1 + @maxPxcor - @minPxcor) / 2
        (@width - StrictMath.abs(x1 - x2)) * (if x2 > x1 then -1 else 1)
      else
        Math.abs(x1 - x2) * (if x1 > x2 then -1 else 1)
    shortestY: (y1, y2) -> Math.abs(y1 - y2) * (if y1 > y2 then -1 else 1)
    wrapX: (pos) ->
      @wrap(pos, @minPxcor - 0.5, @maxPxcor + 0.5)
    wrapY: (pos) ->
      if pos >= @maxPycor + 0.5 or pos <= @minPycor - 0.5 #@# Use fun comparator syntax
        throw new Exception.TopologyInterrupt ("Cannot move turtle beyond the world's edge.")
      else pos
    getPatchNorth: (pxcor, pycor) -> (pycor isnt @maxPycor) and @getPatchAt(pxcor, pycor + 1)
    getPatchSouth: (pxcor, pycor) -> (pycor isnt @minPycor) and @getPatchAt(pxcor, pycor - 1)
    getPatchEast: (pxcor, pycor) ->
      if pxcor is @maxPxcor
        @getPatchAt(@minPxcor, pycor)
      else
        @getPatchAt(pxcor + 1, pycor)

    getPatchWest: (pxcor, pycor) ->
      if pxcor is @minPxcor
        @getPatchAt(@maxPxcor, pycor)
      else
        @getPatchAt(pxcor - 1, pycor)

    getPatchNorthWest: (pxcor, pycor) ->
      if pycor is @maxPycor
        false
      else if pxcor is @minPxcor
        @getPatchAt(@maxPxcor, pycor + 1)
      else
        @getPatchAt(pxcor - 1, pycor + 1)

    getPatchSouthWest: (pxcor, pycor) ->
      if pycor is @minPycor
        false
      else if pxcor is @minPxcor
        @getPatchAt(@maxPxcor, pycor - 1)
      else
        @getPatchAt(pxcor - 1, pycor - 1)

    getPatchSouthEast: (pxcor, pycor) ->
      if pycor is @minPycor
        false
      else if pxcor is @maxPxcor
        @getPatchAt(@minPxcor, pycor - 1)
      else
        @getPatchAt(pxcor + 1, pycor - 1)

    getPatchNorthEast: (pxcor, pycor) ->
      if pycor is @maxPycor
        false
      else if pxcor is @maxPxcor
        @getPatchAt(@minPxcor, pycor + 1)
      else
        @getPatchAt(pxcor + 1, pycor + 1)
    diffuse: (vn, amount) -> #@# Holy guacamole!
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
          if y > yy and y < (yy * 2) - 1
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
          @getPatchAt(x + @minPxcor, y + @minPycor).setPatchVariable(vn, scratch2[x][y])

)
