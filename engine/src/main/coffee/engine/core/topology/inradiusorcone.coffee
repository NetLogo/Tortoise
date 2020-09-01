# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLMath = require('util/nlmath')
NLType = require('../typechecker')

# This `in-radius` code looks pretty weird, huh?  That is for a few reasons:

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

# This simple cache is not at all safe or general purpose.  It's made to be used *only* like this:
# `myVariable = if isInCache("myVariable", pxcor, pycor) then getFromCache() else addToCache(calcMyVar(pxcor, pycor))`
# We could do things like take in anonymous functions as "lazy values" instead of the weird `isInCache()`/`addToCache()`
# setup, but we're trying hard to avoid making extra intermediate objects/functions.
# -Jeremy B August 2020

cacheStore = {
  nextGet: null
  nextKey: null
  nextSubKeys: null
  topology: null
}

# (Topology) => Unit
initializeCache = (topology) ->
  if (cacheStore.topology isnt topology)
    cacheStore = { topology }
  return

# This method also sets the `nextGet` for use by `getFromCache()` or the `nextKey` and `nextSubKeys` values
# for use by `addToCache()`.  -Jeremy B August 2020
# (String | Int, Array[String \ Int]) => Boolan
isInCache = (key, subKeys...) ->
  cacheStore.nextGet = null
  cacheStore.nextKey = null
  cacheStore.nextSubKeys = null

  if not Object.hasOwnProperty(cacheStore, key)
    cacheStore.nextKey = key
    cacheStore.nextSubKeys = subKeys
    return false

  if subKeys.length is 0
    cacheStore.nextGet = cacheStore[key]
    return true

  subStore = cacheStore[key]
  for subKey in subKeys
    if not Object.hasOwnProperty(subStore, subKey)
      cacheStore.nextKey = key
      cacheStore.nextSubKeys = subKeys
      return false
    subStore = subStore[subKey]

  cacheStore.nextGet = subStore
  return true

# `isInCache()` must be called first to prepare a value to get. -Jeremy B August 2020
# () => Any
getFromCache = () ->
  return subStore.nextGet

# This method puts the value into the cache at the location defined by the last `isInCache()` call key and sub keys.
# -Jeremy B August 2020
# (Any) => Any
addToCache = (value) ->
  key     = cacheStore.nextKey
  subKeys = cacheStore.nextSubKeys

  if subKeys.length is 0
    cacheStore[key] = value
    return value

  subStore = if Object.hasOwnProperty(cacheStore, key)
    cacheStore[key]
  else
    cacheStore[key] = {}

  for subKeyIndex in [0..(subKeys.length - 2)]
    subKey = subKeys[subKeyIndex]
    subStore = if Object.hasOwnProperty(subStore, subKey)
      subStore[subKey]
    else
      subStore[subKey] = {}

  subStore[subKeys[subKeys.length - 1]] = value
  return value

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

# () => true
theTruth = () ->
  true

# (Agentset, Agentset) => (Agent) => Boolean
makeTargetChecker = (agentset, globalName) ->
  # Instead of iterating over the agentset to find ones that might be in the radius,
  # We iterate over patches and only check agents on patches that could be within
  # the radius.  That's how desktop does it, so that's how we do it, too. But we
  # need an easy way to check if an agent from a patch is, you know, actually one
  # of the ones we're supposed to be looking for, hence this set of IDs.
  # -Jeremy B August 2020
  specialName = agentset.getSpecialName()
  return if specialName is globalName
    theTruth
  else if specialName?
    if isInCache("targtChecker", specialName) then getFromCache() else addToCache(
      # Do not use `agent.isBreed()` because it calls `toUpperCase()` on the arguments, and they
      # should already be proper case.  -Jeremy B
      (agent) -> agent._breed.name is specialName
    )
  else
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

# ((Number, Number, Number, Number, Number) => Boolean, Number, Number, Number) => (Number, Number) => Boolean
makeInExactRadiusSq = (inRadiusSq, x, y, radius) ->
  exactRadiusSq = radius * radius
  # (Number, Number) => Boolean
  return (xcor, ycor) ->
    inRadiusSq(exactRadiusSq, x, y, xcor, ycor)

# (Array[Patch], Patch | false) => Unit
maybeAddPatch = (patches, maybePatch) ->
  if maybePatch and not patches.includes(maybePatch)
    patches.push(maybePatch)
  return

# (Segment, Segment, Int, Int) => Boolean
isInRegion = (pxSegment, pySegment, pxcor, pycor) ->
  pxSegment.min <= pxcor and pxSegment.max >= pxcor and pySegment.min <= pycor and pySegment.max >= pycor

# (Int, Int, Int, Int) => Segment
makeSegment = (p, patchRadius, topologyMin, topologyMax) ->
  min = p - patchRadius
  max = p + patchRadius
  # Since we're caching these, we'll go ahead and make object instances.  -Jeremy B August 2020
  {
    min,
    max,
    couldWrapMin: min < topologyMin
    couldWrapMax: max > topologyMax
  }

# (Topology, Int, Int, Int) => (Int, Int) => Boolean
makeInBoundingBox = (topology, patchX, patchY, patchRadius) ->

  pxSegment = if isInCache("boundingBoxSegment", patchX, patchRadius) then getFromCache() else addToCache(
    makeSegment(patchX, patchRadius, topology.minPxcor, topology.maxPxcor)
  )
  pySegment = if isInCache("boundingBoxSegment", patchY, patchRadius) then getFromCache() else addToCache(
    makeSegment(patchY, patchRadius, topology.minPycor, topology.maxPycor)
  )

  # Pre-determine checks for box, cylinders, or torus.  -Jeremy B August 2020
  if not topology._wrapInX and not topology._wrapInY
    return (pxcor, pycor) ->
      isInRegion(pxSegment, pySegment, pxcor, pycor)

  if topology._wrapInX and not topology._wrapInY
    return (pxcor, pycor) ->
      if isInRegion(pxSegment, pySegment, pxcor, pycor)
        return true

      if pxSegment.couldWrapMin
        if isInRegion(pxSegment, pySegment, pxcor - topology.width, pycor)
          return true

      if pxSegment.couldWrapMax
        if isInRegion(pxSegment, pySegment, pxcor + topology.width, pycor)
          return true

      return false

  if not topology._wrapInX and topology._wrapInY
    return (pxcor, pycor) ->
      if isInRegion(pxSegment, pySegment, pxcor, pycor)
        return true

      if pySegment.couldWrapMin
        if isInRegion(pxSegment, pySegment, pxcor, pycor - topology.height)
          return true

      if pySegment.couldWrapMax
        if isInRegion(pxSegment, pySegment, pxcor, pycor + topology.height)
          return true

      return false

  return (pxcor, pycor) ->
    if isInRegion(pxSegment, pySegment, pxcor, pycor)
      return true

    if pxSegment.couldWrapMin
      wrapLeft = pxcor - topology.width
      if isInRegion(pxSegment, pySegment, wrapLeft, pycor)
        return true

    if pxSegment.couldWrapMax
      wrapRight = pxcor + topology.width
      if isInRegion(pxSegment, pySegment, wrapRight, pycor)
        return true

    if pySegment.couldWrapMin
      wrapBottom = pycor - topology.height
      if isInRegion(pxSegment, pySegment, pxcor, wrapBottom)
        return true

    if pySegment.couldWrapMax
      wrapTop = pycor + topology.height
      if isInRegion(pxSegment, pySegment, pxcor, wrapTop)
        return true

    if pxSegment.couldWrapMin
      if pySegment.couldWrapMin
        if isInRegion(pxSegment, pySegment, wrapLeft, wrapBottom)
          return true
      if pySegment.couldWrapMax
        if isInRegion(pxSegment, pySegment, wrapLeft, wrapTop)
          return true

    if pxSegment.couldWrapMax
      if pySegment.couldWrapMin
        if isInRegion(pxSegment, pySegment, wrapRight, wrapBottom)
          return true
      if pySegment.couldWrapMax
        if isInRegion(pxSegment, pySegment, wrapRight, wrapTop)
          return true

    return false

# ((Int, Int) => Patch) => Array[Patch]
getRadius1Patches = (centerPatch) ->
  patches = []
  patches.push(centerPatch)
  # We rely on `getNeighbors()` returning patches in the same order as desktop,
  # which it does, fortunately.  -Jeremy B August 2020.
  neighbors = centerPatch.getNeighbors()._unsafeIterator()
  neighbors.forEach( (neighbor) -> patches.push(neighbor) )
  return patches

# (Topology, Array[Patch]) => Array[Patch]
getRadius2APatches = (topology, patches) ->
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
  return newPatches

# (Array[Patch]) => Array[Patch]
getRadius2BPatches = (patches) ->
  newPatches = patches.slice(0)

  newPatches.push(patches[1]._optimalPatchNorth())
  newPatches.push(patches[2]._optimalPatchEast())
  newPatches.push(patches[3]._optimalPatchSouth())
  newPatches.push(patches[4]._optimalPatchWest())

  newPatches.push(patches[5]._optimalPatchNorth())
  newPatches.push(patches[5]._optimalPatchNorthEast())
  newPatches.push(patches[5]._optimalPatchEast())

  newPatches.push(patches[6]._optimalPatchEast())
  newPatches.push(patches[6]._optimalPatchSouthEast())
  newPatches.push(patches[6]._optimalPatchSouth())

  newPatches.push(patches[7]._optimalPatchSouth())
  newPatches.push(patches[7]._optimalPatchSouthWest())
  newPatches.push(patches[7]._optimalPatchWest())

  newPatches.push(patches[8]._optimalPatchWest())
  newPatches.push(patches[8]._optimalPatchNorthWest())
  newPatches.push(patches[8]._optimalPatchNorth())

  return newPatches

# (Topology, Int, Int, Number, (Int, Int) => Patch) => Array[Patch]
getSmallRadiusPatches = (topology, patchX, patchY, radius, getPatchAt) ->

  patches = if isInCache("patch", patchX, patchY, "getRadius1Patches") then getFromCache() else
    addToCache(getRadius1Patches(getPatchAt(patchX, patchY)))

  # `radius is 0` is another quirk from desktop.  -Jeremy B August 2020
  if radius > 1 or radius is 0

    smallWorldCheck = if isInCache("patch", patchX, patchY, "smallWorldCheck") then getFromCache() else addToCache(
      (topology._wrapInX and topology.width < 5) or
      (topology._wrapInY and topology.height < 5) or
      (not topology._wrapInX and (patchX - topology.minPxcor < 2 or topology.maxPxcor - patchX < 2)) or
      (not topology._wrapInY and (patchY - topology.minPycor < 2 or topology.maxPycor - patchY < 2))
    )

    # I'm sure all of this makes perfect sense, consult the desktop version if you're curious about what
    # `smallWorldCheck` is doing and why.  The patch order we use here must match the order over there, and the order
    # differs between the two branches of this check.  -Jeremy B August 2020
    if (smallWorldCheck)
      patches = if isInCache("patch", patchX, patchY, "getRadius2APatches") then getFromCache() else
        addToCache(getRadius2APatches(topology, patches))

    else
      patches = if isInCache("patch", patchX, patchY, "getRadius2BPatches") then getFromCache() else
        addToCache(getRadius2BPatches(patches))

  return patches

# (Topology, Int, Int, Number, (Int, Int) => Patch, (Int, Int) => Unit) => Unit
searchPatches = (topology, patchX, patchY, radius, getPatchAt, checkAgentsHere) ->

  # NetLogo desktop special-cases on radius length. -Jeremy B August 2020.
  if radius <= 2
    patches = getSmallRadiusPatches(topology, patchX, patchY, radius, getPatchAt)
    patches.forEach( (patch) ->
      checkAgentsHere(patch.pxcor, patch.pycor)
    )

  else
    patchRadius = NLMath.ceil(radius)
    isInBoundingBox = if isInCache("patch", patchX, patchY, "isInBoundingBox", patchRadius) then getFromCache() else
      addToCache(makeInBoundingBox(topology, patchX, patchY, patchRadius))

    # This is the order NetLogo desktop searches the patches, so we follow suit.
    # -Jeremy B August 2020
    for pycor in [topology.maxPycor..topology.minPycor]
      for pxcor in [topology.minPxcor..topology.maxPxcor]
        if isInBoundingBox(pxcor, pycor)
          checkAgentsHere(pxcor, pycor)

  return

# (Topology, Number, Number, TurtleSet, Number) -> TurtleSet
filterTurtlesInRadius = (topology, x, y, turtleset, radius) ->

  patchX          = NLMath.round(x)
  patchY          = NLMath.round(y)
  getPatchAt      = if isInCache("getPatchAt") then getFromCache() else addToCache(makePatchGetter(topology))
  isInTargetSet   = makeTargetChecker(turtleset, "turtles")
  inRadiusSq      = if isInCache("inRadiusSq") then getFromCache() else addToCache(makeInRadiusSq(topology))
  inExactRadiusSq = makeInExactRadiusSq(inRadiusSq, x, y, radius)

  # If the source turtle is in a corner of its patch, and a target turtle is in the closest
  # corner of its patch, the patch distances will be off by sqrt(2).  We have to correct
  # for this by "over-sampling" the patches.  We could do 1.414..., but we'll use 2 to
  # stick with integer arithmetic for patches.  -Jeremy B August 2020
  roundedRadius = NLMath.round(radius)
  couldBeInRadiusSq = if isInCache("patch", patchX, patchY, "couldBeInRadiusSq", roundedRadius) then getFromCache() else
    addToCache(
      # (Int, Int) => Boolean
      (pxcor, pycor) ->
        inRadiusSq((roundedRadius + 2) * (roundedRadius + 2), patchX, patchY, pxcor, pycor)
    )

  results = []
  # (Int, Int) => Unit
  checkTurtlesHere = (pxcor, pycor) ->

    # This empty patch check may help with sparser models.  Because the bounding box check
    # should already have filtered out most of the patches, this is worth the expense of
    # getting the patch to check even if the patch might not be in radius, as the size check should
    # be pretty fast and often 0.  -Jeremy B August 2020
    patch = getPatchAt(pxcor, pycor)
    # This relies on patches removing their dead turtles, which they should do.  -Jeremy B August 2020
    patchTurtles = patch._turtles
    if patchTurtles.length is 0
      return

    if couldBeInRadiusSq(pxcor, pycor)
      patchTurtles.forEach( (turtle) ->
        if isInTargetSet(turtle) and inExactRadiusSq(turtle.xcor, turtle.ycor)
          # We could do a `reduce` or `flatMap` or something over the patches
          # instead of mutating this closed-over variable, but we do not want
          # to generate extra GC pressure from excess arrays getting created then
          # immediately dropped, nor spend time re-iterating over our results to
          # collect them into the final set.  -Jeremy B August 2020
          results.push(turtle)
        return
      )

    return

  searchPatches(topology, patchX, patchY, radius, getPatchAt, checkTurtlesHere)

  new TurtleSet(results, turtleset._world)

# (Topology, Number, Number, PatchSet, Number) -> PatchSet
filterPatchesInRadius = (topology, x, y, patchset, radius) ->

  patchX          = NLMath.round(x)
  patchY          = NLMath.round(y)
  getPatchAt      = if isInCache("getPatchAt") then getFromCache() else addToCache(makePatchGetter(topology))
  isInTarget      = makeTargetChecker(patchset, "patches")
  inRadiusSq      = if isInCache("inRadiusSq") then getFromCache() else addToCache(makeInRadiusSq(topology))
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
inRadius = (topology, x, y, agentset, radius) ->
  initializeCache(topology)
  switch agentset._agentTypeName
    when "turtles" then filterTurtlesInRadius(topology, x, y, agentset, radius)
    when "patches" then filterPatchesInRadius(topology, x, y, agentset, radius)
    else throw new Error("Cannot use `in-radius` on this agentset type.")

###

Begin `in-cone` section

###

# this.type: Topology
# [T] @ (Number, Number, Number, AbstractAgents[T], Number, Number) => AbstractAgentSet[T]
inCone = (x, y, turtleHeading, agents, distance, angle) ->
  initializeCache(this)

  # (Number, Number) => Number
  findWrapCount = (wrapsInDim, dimSize) ->
    if wrapsInDim then NLMath.ceil(distance / dimSize) else 0

  # (Number, Number, Number, Number, Number, Number) => Boolean
  isInSector = (ax, ay, cx, cy, radius, heading) =>

    isWithinArc = =>
      theta = @_towardsNotWrapped(cx, cy, ax, ay)
      diff  = NLMath.abs(theta - heading)
      half  = angle / 2
      (diff <= half) or ((360 - diff) <= half)

    isWithinRange = ->
      NLMath.distance4_2D(cx, cy, ax, ay) <= radius

    isTheSameSpot = ax is cx and ay is cy
    isTheSameSpot or (isWithinRange() and isWithinArc())

  # (Number, Number, Number, Number) => Boolean
  isInWrappableSector = (agentX, agentY, xBound, yBound) =>
    for xWrapCoefficient in [-xBound..xBound]
      for yWrapCoefficient in [-yBound..yBound]
        if isInSector(agentX + @width * xWrapCoefficient, agentY + @height * yWrapCoefficient, x, y, distance, turtleHeading)
          return true
    false

  # (Number, Number) => (Patch) => Boolean
  patchIsGood = (wrapCountInX, wrapCountInY) => (patch) =>
    isInWrappableSector(patch.pxcor, patch.pycor, wrapCountInX, wrapCountInY)

  # (Number, Number) => (Turtle) => Boolean
  turtleIsGood = (wrapCountInX, wrapCountInY) => (turtle) =>
    isInWrappableSector(turtle.xcor, turtle.ycor, wrapCountInX, wrapCountInY)

  { pxcor, pycor } = @_getPatchAt(x, y)

  wrapCountInX = findWrapCount(@_wrapInX, @width)
  wrapCountInY = findWrapCount(@_wrapInY, @height)

  patchIsGood_  =  patchIsGood(wrapCountInX, wrapCountInY)
  turtleIsGood_ = turtleIsGood(wrapCountInX, wrapCountInY)

  isPatchSet  = NLType(agents).isPatchSet()
  isTurtleSet = NLType(agents).isTurtleSet()

  results = []

  checkAgentsHere = if isPatchSet
    isInTargetSet = makeTargetChecker(agents, "patches")
    (pxcor, pycor) ->
      patch = getPatchAt(pxcor, pycor)
      if isInTargetSet(patch) and patchIsGood_(patch)
        results.push(patch)
      return

  else if isTurtleSet
    isInTargetSet = makeTargetChecker(agents, "turtles")
    (pxcor, pycor) ->
      patch = getPatchAt(pxcor, pycor)
      patch._turtles.forEach( (turtle) =>
        if isInTargetSet(turtle) and turtleIsGood_(turtle)
          results.push(turtle)
        return
      )
      return

  else
    throw new Error("Cannot use `in-cone` on this agentset type.")

  getPatchAt = if isInCache("getPatchAt") then getFromCache() else addToCache(makePatchGetter(this))
  searchPatches(this, pxcor, pycor, distance, getPatchAt, checkAgentsHere)

  agents.copyWithNewAgents(results)

module.exports = { inRadius, inCone }
