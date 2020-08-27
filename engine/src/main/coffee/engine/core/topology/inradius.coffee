# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# This code looks pretty weird, huh?  That is for a few reasons:

# 1. We need to match how NetLogo desktop handles in-radius, especially for
#    returning agents in the same order for reproducibility.

# 2. We do want this to be optimized, so we want to avoid the following things:
#    a. Binding our functions. We want to call them without binding a `this`.
#    b. Using a class.  It would help organize the code, but we don't want member
#       accessor calls
#    c. Worrying about safety checks where possible, when we can make assumptions.

# More comments about specific oddities are below.

# -Jeremy B August 2020

# (Number, Number) => Number
distanceRaw = (p1, p2) ->
  NLMath.abs(p1 - p2)

# Intentionally take in the full and the half values instead of repeatedly
# calculating the half.  -Jeremy B August 2020
# (Int, Number, Number, Number) => Number
distanceWrap = (full, half, p1, p2) ->
  d = distanceRaw(p1, p2)
  if d > half then (full - d) else d

# (Boolean, Int) => (Number, Number) => Number
distance = (wrap, full) ->
  # We don't want to check if we're wrapped for each distance calculation,
  # so just check once and return the appropriate function at the start.
  # -Jeremy B August 2020
  if wrap
    half = full / 2
    (p1, p2) -> distanceWrap(full, half, p1, p2)
  else
    distanceRaw

# (Topology, Number, Number, TurtleSet | PatchSet, Number) -> TurtleSet | PatchSet
filterAgents = (topology, x, y, agentset, radius) ->
  # Instead of iterating over the agentset to find ones that might be in the radius,
  # We iterate over patches and only check agents on patches that could be within
  # the radius.  That's how desktop does it, so that's how we do it, too. But we
  # need an easy way to check if an agent from a patch is, you know, actually one
  # of the ones we're supposed to be looking for, hence this set of IDs.
  # -Jeremy B August 2020
  agentIds = new Set(agentset._unsafeIterator().toArray().map( (a) -> a.id ))

  # (Number, Number) => Number
  distanceX = distance(topology._wrapInX, topology.width)
  # (Number, Number) => Number
  distanceY = distance(topology._wrapInY, topology.height)

  # We do not ever take the square root of the distances we calculate, because we
  # can just compare the squared values.  -Jeremy B August 2020
  # (Number, Number, Number, Number, Number) => Boolean
  inRadiusSq = (radiusSq, x1, y1, x2, y2) ->
    dx = distanceX(x1, x2)
    dy = distanceY(y1, y2)
    distanceSq = (dx * dx) + (dy * dy)
    return (distanceSq <= radiusSq)

  # If the source turtle is in a corner of its patch, and a target turtle is in the closest
  # corner of its patch, the patch distances will be off by sqrt(2).  We have to correct
  # for this by "over-sampling" the patches.  We could do 1.414..., but we'll use 2 to
  # stick with integer arithmetic for patches.  -Jeremy B August 2020
  patchRadiusSq = (NLMath.round(radius) + 2) * (NLMath.round(radius) + 2)
  patchX        = NLMath.round(x)
  patchY        = NLMath.round(y)
  # (Int, Int) => Boolean
  couldBeInRadius = (pxcor, pycor) ->
    inRadiusSq(patchRadiusSq, patchX, patchY, pxcor, pycor)

  exactRadiusSq = radius * radius
  # (Number, Number) => Boolean
  exactInRadius = (xcor, ycor) ->
    inRadiusSq(exactRadiusSq, x, y, xcor, ycor)

  # The world's version of `getPatchAt()` does rounding and such on the
  # provided values.  We don't need that kind of safety here.
  # -Jeremy B August 2020
  width      = topology.width
  maxPycor   = topology.maxPycor
  minPxcor   = topology.minPxcor
  allPatches = topology._getPatches()._agentArr
  # (Int, Int) => Patch
  getPatchAt = (pxcor, pycor) ->
    patchIndex = (maxPycor - pycor) * width + (pxcor - minPxcor)
    allPatches[patchIndex]

  results = []
  # (Agent, Number, Number) => Unit
  checkAgent = (agent, xcor, ycor) ->
    if agentIds.has(agent.id) and exactInRadius(xcor, ycor)
      # We could do a `reduce` or `flatMap` or something over the patches
      # instead of mutating this closed-over variable, but we do not want
      # to generate extra GC pressure from excess arrays getting created then
      # immediately dropped, nor spend time re-iterating over our results to
      # collect them into the final set.  -Jeremy B August 2020
      results.push(agent)

  # (Int, Int) => Unit
  checkPatchHere = (pxcor, pycor) ->
    patch = getPatchAt(pxcor, pycor)
    checkAgent(patch, pxcor, pycor)
    return

  # (Int, Int) => Unit
  checkTurtlesHere = (pxcor, pycor) ->
    if couldBeInRadius(pxcor, pycor)
      patch = getPatchAt(pxcor, pycor)
      patch.turtlesHere()._unsafeIterator().forEach( (turtle) ->
        checkAgent(turtle, turtle.xcor, turtle.ycor)
      )
    return

  # Because of things like this and the final result below, it's tempting to split
  # `filterAgents()` into a turtle version and a patch version, but it's hard to
  # do that and to re-use common code between them while avoiding things like making
  # a class to handle each.  -Jeremy B August 2020
  checkAgentsHere =
    switch agentset._agentTypeName
      when "turtles" then checkTurtlesHere
      when "patches" then checkPatchHere
      else throw new Error("Cannot use `in-radius` on this agentset type.")

  # NetLogo desktop special-cases on radius length. -Jeremy B August 2020.
  if radius <= 2
    patches = new Set()
    centerPatch = getPatchAt(patchX, patchY)
    patches.add(centerPatch)
    # We rely on `getNeighbors()` returning patches in the same order as desktop,
    # which it does, fortunately.  -Jeremy B August 2020.
    neighbors = centerPatch.getNeighbors()._unsafeIterator()
    neighbors.forEach( (neighbor) -> patches.add(neighbor) )

    if radius > 1
      # The order here must match what is done in desktop's version. -Jeremy B August 2020
      patchGetters = [
        topology._getPatchNorth,
        topology._getPatchNorthEast,
        topology._getPatchEast,
        topology._getPatchSouthEast,
        topology._getPatchSouth,
        topology._getPatchSouthWest,
        topology._getPatchWest,
        topology._getPatchNorthWest
      ]
      neighbors.forEach( (neighbor) ->
        patchGetters.forEach( (getter) ->
          maybePatch = getter.call(topology, neighbor.pxcor, neighbor.pycor)
          if maybePatch
            patches.add(maybePatch)
        )
      )

    patches.forEach( (patch) -> checkAgentsHere(patch.pxcor, patch.pycor) )

  else

    # This is the order NetLogo desktop searches the patches, so we follow suit.
    # -Jeremy B August 2020
    for pycor in [topology.maxPycor..topology.minPycor]
      for pxcor in [topology.minPxcor..topology.maxPxcor]
        checkAgentsHere(pxcor, pycor)

  switch agentset._agentTypeName
    when "turtles" then new TurtleSet(results, agentset._world)
    when "patches" then new PatchSet(results, agentset._world)
    else throw new Error("Cannot use `in-radius` on this agentset type.")

module.exports = { filterAgents }
