# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# This code looks pretty weird, huh?  That is for a few reasons:

# 1. We need to match how NetLogo desktop handles in-radius, especially for
#    returning agents in the same order for reproducibility.

# 2. We do want this to be optimized, so we want to *avoid* the following things:
#    a. Binding our functions. We want to call them without binding a `this`.
#    b. Using a class.  It would help organize the code, but we don't want member
#       accessor calls.
#    c. Worrying about safety checks where possible, when we can make assumptions.
#    d. Making intermediate objects during the search loop, like arrays or
#       `new Class()` that would be immediately discarded and add GC pressure

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

# (Topology) => (Int, Int) => Patch
makePatchGetter = (topology) ->
  # The world's version of `getPatchAt()` does rounding and such on the
  # provided values.  We don't need that kind of safety here.
  # -Jeremy B August 2020
  width      = topology.width
  maxPycor   = topology.maxPycor
  minPxcor   = topology.minPxcor
  allPatches = topology._getPatches()._agentArr
  # (Int, Int) => Patch
  return (pxcor, pycor) ->
    patchIndex = (maxPycor - pycor) * width + (pxcor - minPxcor)
    allPatches[patchIndex]

# (Agentset, Agentset) => (Agent) => Boolean
makeTargetChecker = (agentset, globalName) ->
  # Instead of iterating over the agentset to find ones that might be in the radius,
  # We iterate over patches and only check agents on patches that could be within
  # the radius.  That's how desktop does it, so that's how we do it, too. But we
  # need an easy way to check if an agent from a patch is, you know, actually one
  # of the ones we're supposed to be looking for, hence this set of IDs.
  # -Jeremy B August 2020
  return if agentset.getSpecialName() is globalName
    (agent) -> true
  else
    # We could in theory check the breed of each agent against the breed of the source
    # agentset (as desktop does), but I'm guessing the ID check is just as fast if not
    # faster than a string comparison, so we'll skip it for now.  -Jeremy B August 2020
    agentIds = new Set(agentset._unsafeIterator().toArray().map( (a) -> a.id ))
    (agent) -> agentIds.has(agent.id)

# (Topology) => (Number, Number, Number, Number, Number) => Boolean
makeInRadiusSq = (topology) ->
  # (Number, Number) => Number
  distanceX = distance(topology._wrapInX, topology.width)
  # (Number, Number) => Number
  distanceY = distance(topology._wrapInY, topology.height)

  # We do not ever take the square root of the distances we calculate, because we
  # can just compare the squared values.  -Jeremy B August 2020
  # (Number, Number, Number, Number, Number) => Boolean
  return (radiusSq, x1, y1, x2, y2) ->
    dx = distanceX(x1, x2)
    dy = distanceY(y1, y2)
    distanceSq = (dx * dx) + (dy * dy)
    return (distanceSq <= radiusSq)

# ((Number, Number, Number, Number, Number) => Boolean, Number) => (Number, Number) => Boolean
makeInExactRadiusSq = (inRadiusSq, x, y, radius) ->
  exactRadiusSq = radius * radius
  # (Number, Number) => Boolean
  return (xcor, ycor) ->
    inRadiusSq(exactRadiusSq, x, y, xcor, ycor)

maybeAddPatch = (ps, maybePatch) ->
  if maybePatch and not ps.includes(maybePatch)
    ps.push(maybePatch)

# (Topology, Number, Int, Int, (Int, Int) => Patch, (Int, Int) => Unit) => Unit
searchPatches = (topology, patchX, patchY, radius, getPatchAt, checkAgentsHere) ->
  # NetLogo desktop special-cases on radius length. -Jeremy B August 2020.
  if radius <= 2
    patches = []
    centerPatch = getPatchAt(patchX, patchY)
    patches.push(centerPatch)
    # We rely on `getNeighbors()` returning patches in the same order as desktop,
    # which it does, fortunately.  -Jeremy B August 2020.
    neighbors = centerPatch.getNeighbors()._unsafeIterator()
    neighbors.forEach( (neighbor) -> patches.push(neighbor) )

    # `radius is 0` is another quirk from desktop.  -Jeremy B August 2020
    if radius > 1 or radius is 0

      # I'm sure all of this makes perfect sense, consult the desktop version if you're curious about what
      # this is doing and why.  The patch order we use here must match the order over there, and the order differs
      # between the two branches of this check.  -Jeremy B August 2020
      if (
        (topology._wrapInX and topology.width < 5) or
        (topology._wrapInY and topology.height < 5) or
        (not topology._wrapInX and (patchX - topology.minPxcor < 2 or topology.maxPxcor - patchX < 2)) or
        (not topology._wrapInY and (patchY - topology.minPycor < 2 or topology.maxPycor - patchY < 2))
      )

        newPatches = []
        patches.forEach( (p) ->
          maybeAddPatch(newPatches, p)
          maybeAddPatch(newPatches, topology._getPatchNorth(p.pxcor, p.pycor))
          maybeAddPatch(newPatches, topology._getPatchNorthEast(p.pxcor, p.pycor))
          maybeAddPatch(newPatches, topology._getPatchEast(p.pxcor, p.pycor))
          maybeAddPatch(newPatches, topology._getPatchSouthEast(p.pxcor, p.pycor))
          maybeAddPatch(newPatches, topology._getPatchSouth(p.pxcor, p.pycor))
          maybeAddPatch(newPatches, topology._getPatchSouthWest(p.pxcor, p.pycor))
          maybeAddPatch(newPatches, topology._getPatchWest(p.pxcor, p.pycor))
          maybeAddPatch(newPatches, topology._getPatchNorthWest(p.pxcor, p.pycor))
        )
        patches = newPatches

      else

        patches.push(patches[1]._optimalPatchNorth())
        patches.push(patches[2]._optimalPatchEast())
        patches.push(patches[3]._optimalPatchSouth())
        patches.push(patches[4]._optimalPatchWest())

        patches.push(patches[5]._optimalPatchNorth())
        patches.push(patches[5]._optimalPatchNorthEast())
        patches.push(patches[5]._optimalPatchEast())

        patches.push(patches[6]._optimalPatchEast())
        patches.push(patches[6]._optimalPatchSouthEast())
        patches.push(patches[6]._optimalPatchSouth())

        patches.push(patches[7]._optimalPatchSouth())
        patches.push(patches[7]._optimalPatchSouthWest())
        patches.push(patches[7]._optimalPatchWest())

        patches.push(patches[8]._optimalPatchWest())
        patches.push(patches[8]._optimalPatchNorthWest())
        patches.push(patches[8]._optimalPatchNorth())

    patches.forEach( (patch) ->
      checkAgentsHere(patch.pxcor, patch.pycor)
    )

  else
    # This is the order NetLogo desktop searches the patches, so we follow suit.
    # -Jeremy B August 2020
    for pycor in [topology.maxPycor..topology.minPycor]
      for pxcor in [topology.minPxcor..topology.maxPxcor]
        checkAgentsHere(pxcor, pycor)

# (Topology, Number, Number, TurtleSet, Number) -> TurtleSet
filterTurtles = (topology, x, y, turtleset, radius) ->

  patchX          = NLMath.round(x)
  patchY          = NLMath.round(y)
  getPatchAt      = makePatchGetter(topology)
  isInTargetSet   = makeTargetChecker(turtleset, "turtles")
  inRadiusSq      = makeInRadiusSq(topology)
  inExactRadiusSq = makeInExactRadiusSq(inRadiusSq, x, y, radius)

  # If the source turtle is in a corner of its patch, and a target turtle is in the closest
  # corner of its patch, the patch distances will be off by sqrt(2).  We have to correct
  # for this by "over-sampling" the patches.  We could do 1.414..., but we'll use 2 to
  # stick with integer arithmetic for patches.  -Jeremy B August 2020
  patchRadiusSq = (NLMath.round(radius) + 2) * (NLMath.round(radius) + 2)
  # (Int, Int) => Boolean
  couldBeInRadiusSq = (pxcor, pycor) ->
    inRadiusSq(patchRadiusSq, patchX, patchY, pxcor, pycor)

  results = []
  # (Int, Int) => Unit
  checkTurtlesHere = (pxcor, pycor) ->
    if couldBeInRadiusSq(pxcor, pycor)
      patch = getPatchAt(pxcor, pycor)
      patch.turtlesHere()._unsafeIterator().forEach( (turtle) ->
        if isInTargetSet(turtle) and inExactRadiusSq(turtle.xcor, turtle.ycor)
          # We could do a `reduce` or `flatMap` or something over the patches
          # instead of mutating this closed-over variable, but we do not want
          # to generate extra GC pressure from excess arrays getting created then
          # immediately dropped, nor spend time re-iterating over our results to
          # collect them into the final set.  -Jeremy B August 2020
          results.push(turtle)
      )
    return

  searchPatches(topology, patchX, patchY, radius, getPatchAt, checkTurtlesHere)

  new TurtleSet(results, turtleset._world)

# (Topology, Number, Number, PatchSet, Number) -> PatchSet
filterPatches = (topology, x, y, patchset, radius) ->

  patchX          = NLMath.round(x)
  patchY          = NLMath.round(y)
  getPatchAt      = makePatchGetter(topology)
  isInTarget      = makeTargetChecker(patchset, "patches")
  inRadiusSq      = makeInRadiusSq(topology)
  inExactRadiusSq = makeInExactRadiusSq(inRadiusSq, x, y, radius)

  results = []
  # (Int, Int) => Unit
  checkPatchHere = (pxcor, pycor) ->
    patch = getPatchAt(pxcor, pycor)
    if isInTarget(patch) and inExactRadiusSq(patch.pxcor, patch.pycor)
      results.push(patch)
    return

  searchPatches(topology, patchX, patchY, radius, getPatchAt, checkPatchHere)

  new PatchSet(results, patchset._world)

# (Topology, Number, Number, TurtleSet | PatchSet, Number) -> TurtleSet | PatchSet
filterAgents = (topology, x, y, agentset, radius) ->
  checkAgentsHere =
    switch agentset._agentTypeName
      when "turtles" then filterTurtles(topology, x, y, agentset, radius)
      when "patches" then filterPatches(topology, x, y, agentset, radius)
      else throw new Error("Cannot use `in-radius` on this agentset type.")

module.exports = { filterAgents }
