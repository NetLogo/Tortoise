define(['integration/lodash', 'integration/strictmath', 'engine/topology/topology'], (_, StrictMath, Topology) ->

  #@# Redundancy with other topologies...
  class Torus extends Topology

    _wrapInX: true
    _wrapInY: true

    wrapX: (pos) ->
      @wrap(pos, @minPxcor - 0.5, @maxPxcor + 0.5)
    wrapY: (pos) ->
      @wrap(pos, @minPycor - 0.5, @maxPycor + 0.5)
    shortestX: (x1, x2) -> #@# Seems improvable
      if StrictMath.abs(x1 - x2) > @width / 2
        (@width - StrictMath.abs(x1 - x2)) * (if x2 > x1 then -1 else 1)
      else
        Math.abs(x1 - x2) * (if x1 > x2 then -1 else 1)
    shortestY: (y1, y2) -> #@# Seems improvable
      if StrictMath.abs(y1 - y2) > @height / 2
        (@height - StrictMath.abs(y1 - y2)) * (if y2 > y1 then -1 else 1)
      else
        Math.abs(y1 - y2) * (if y1 > y2 then -1 else 1)
    diffuse: (vn, coefficient) -> #@# Varname
      scratch = for x in [0...@width] #@# Unused var
        [] #@# Weird style

      @getPatches().forEach((patch) => #@# Oh, mutation, thou art a cruel, deceptive bitch.  Thou cannst maketh two-eth separate-eth loops over the same thing-eth seem sane
        scratch[patch.pxcor - @minPxcor][patch.pycor - @minPycor] = patch.getPatchVariable(vn)
      )

      @getPatches().forEach((patch) =>
        pxcor = patch.pxcor
        pycor = patch.pycor
        # We have to order the neighbors exactly how Torus.java:diffuse does them so we don't get floating discrepancies.  FD 10/19/2013
        orderedNeighbors =
          [@getPatchSouthWest(pxcor, pycor), @getPatchWest(pxcor, pycor),
           @getPatchNorthWest(pxcor, pycor), @getPatchSouth(pxcor, pycor),
           @getPatchNorth(pxcor, pycor), @getPatchSouthEast(pxcor, pycor),
           @getPatchEast(pxcor, pycor), @getPatchNorthEast(pxcor, pycor)]
        diffusalSum = _(orderedNeighbors).map((nb) => scratch[nb.pxcor - @minPxcor][nb.pycor - @minPycor]).reduce((acc, x) -> acc + x)
        patch.setPatchVariable(vn, patch.getPatchVariable(vn) * (1.0 - coefficient) + (diffusalSum / 8) * coefficient)
      )

    #@# I think I tried to fix all this in the ScalaJS version.  Did I succeed?  (I doubt it)
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
        if pxcor is @minPxcor
          @getPatchAt(@maxPxcor, @minPycor)
        else
          @getPatchAt(pxcor - 1, @minPycor)

      else if pxcor is @minPxcor
        @getPatchAt(@maxPxcor, pycor + 1)
      else
        @getPatchAt(pxcor - 1, pycor + 1)

    getPatchSouthWest: (pxcor, pycor) ->
      if pycor is @minPycor
        if pxcor is @minPxcor
          @getPatchAt(@maxPxcor, @maxPycor)
        else
          @getPatchAt(pxcor - 1, @maxPycor)
      else if pxcor is @minPxcor
        @getPatchAt(@maxPxcor, pycor - 1)
      else
        @getPatchAt(pxcor - 1, pycor - 1)

    getPatchSouthEast: (pxcor, pycor) ->
      if pycor is @minPycor
        if pxcor is @maxPxcor
          @getPatchAt(@minPxcor, @maxPycor)
        else
          @getPatchAt(pxcor + 1, @maxPycor)
      else if pxcor is @maxPxcor
        @getPatchAt(@minPxcor, pycor - 1)
      else
        @getPatchAt(pxcor + 1, pycor - 1)

    getPatchNorthEast: (pxcor, pycor) ->
      if pycor is @maxPycor
        if pxcor is @maxPxcor
          @getPatchAt(@minPxcor, @minPycor)
        else
          @getPatchAt(pxcor + 1, @minPycor)
      else if pxcor is @maxPxcor
        @getPatchAt(@minPxcor, pycor + 1)
      else
        @getPatchAt(pxcor + 1, pycor + 1)

)
