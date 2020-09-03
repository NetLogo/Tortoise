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
  nextGetValue: null
  nextAddKey: null
  nextAddStore: null
  initializationKey: null
}

# (Any) => Unit
initializeCache = (initializationKey) ->
  if (cacheStore.initializationKey isnt initializationKey)
    cacheStore = { initializationKey }
  return

# This method also sets the `nextGetValue` for use by `getFromCache()` or the `nextAddKey` and `nextAddStore` values
# for use by `addToCache()` on a cache miss.  -Jeremy B August 2020
# (String | Int, Array[String \ Int]) => Boolan
isInCache = (key, subKeys...) ->
  if subKeys.length is 0
    if cacheStore.hasOwnProperty(key)
      cacheStore.nextGetValue = cacheStore[key]
      return true
    else
      cacheStore.nextAddKey = key
      cacheStore.nextAddStore = cacheStore
      return false

  found = true

  subStore = if cacheStore.hasOwnProperty(key)
    cacheStore[key]
  else
    found = false
    newStore = {}
    cacheStore[key] = newStore
    newStore

  for subKeyIndex in [0..(subKeys.length - 2)]
    subKey = subKeys[subKeyIndex]
    subStore = if found and subStore.hasOwnProperty(subKey)
      subStore[subKey]
    else
      found = false
      newStore = {}
      subStore[subKey] = newStore
      newStore

  finalKey = subKeys[subKeys.length - 1]
  if found and subStore.hasOwnProperty(finalKey)
    cacheStore.nextGetValue = subStore[finalKey]
  else
    found = false
    cacheStore.nextAddKey = finalKey
    cacheStore.nextAddStore = subStore

  found

# `isInCache()` must be called first to prepare a value to get. -Jeremy B August 2020
# () => Any
getFromCache = () ->
  value = cacheStore.nextGetValue
  cacheStore.nextGetValue = null
  value

# This method puts the value into the cache at the location defined by the last `isInCache()` call key and sub keys.
# -Jeremy B August 2020
# (Any) => Any
addToCache = (value) ->
  cacheStore.nextAddStore[cacheStore.nextAddKey] = value
  cacheStore.nextAddKey   = null
  cacheStore.nextAddStore = null
  value

topologyHelpers = {}

# (Topology) => Unit
initialize = (topology) ->
  initializeCache(topology)
  topologyHelpers.getRegions = makeRegionGetter(topology)
  topologyHelpers.getPatchAt = makePatchGetter(topology)
  topologyHelpers.inRadiusSq = makeInRadiusSq(topology)
  return

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
  # of the ones we're supposed to be looking for.
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
    (agent) -> agentset.contains(agent)

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
getSmallRadiusPatches = (topology, patchX, patchY, radius) ->

  patches = if isInCache("patch", patchX, patchY, "getRadius1Patches") then getFromCache() else
    addToCache(getRadius1Patches(topologyHelpers.getPatchAt(patchX, patchY)))

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

# (Topology) => (Int, Int, Int) => Array[Region]
makeRegionGetter = (topology) ->
  getRegions = if topology._wrapInX
    if topology._wrapInY
      getRegionsTorus
    else
      getRegionsHorizontal
  else
    if topology._wrapInY
      getRegionsVertical
    else
      getRegionsBox

  (patchX, patchY, patchRadius) -> getRegions(topology, patchX, patchY, patchRadius)

# (Int, Int, Array[Int]) => Region
makeRegion = (top, bottom, segmentValues...) ->
  segments = []
  for i in [0...segmentValues.length] by 2
    segments.push({ left: segmentValues[i], right: segmentValues[i + 1] })

  { top, bottom, segments }

# The various `getRegions*` functions must return the patch coordinates in desktop order - maxPycor to minPycor outer,
# mminPxcor to maxPxcor inner.  Hence the weirdness with making sure we get the "upper" and "lower" regions correctly
# ordered, when they exist.
# - Jeremy B September 2020

# (Topology, Int, Int, Int) => Array[Region]
getRegionsBox = (topology, patchX, patchY, patchRadius) ->
  doubleRadius = patchRadius * 2

  left   = NLMath.max(patchX - patchRadius, topology.minPxcor)
  right  = NLMath.min(patchX + patchRadius, topology.maxPxcor)
  top    = NLMath.min(patchY + patchRadius, topology.maxPycor)
  bottom = NLMath.max(patchY - patchRadius, topology.minPycor)

  [makeRegion(top, bottom, left, right)]

# (Topology, Int, Int) => { upperTop, upperBottom, lowerTop, lowerBottom }
topSplitLimits = (topology, maybeTop, maybeBottom) ->
  upperTop    = topology.maxPycor
  upperBottom = maybeBottom
  lowerTop    = topology.minPycor + maybeTop - topology.maxPycor
  lowerBottom = topology.minPycor
  { upperTop, upperBottom, lowerTop, lowerBottom }

# (Topology, Int, Int) => { upperTop, upperBottom, lowerTop, lowerBottom }
bottomSplitLimits = (topology, maybeTop, maybeBottom) ->
  upperTop    = topology.maxPycor
  upperBottom = topology.maxPycor + (maybeBottom - topology.minPycor)
  lowerTop    = maybeTop
  lowerBottom = topology.minPycor
  { upperTop, upperBottom, lowerTop, lowerBottom }

# (Topology, Int, Int, Int, Int) => Array[Region]
splitVertical = (topology, patchY, patchRadius, left, right) ->
  maybeTop    = patchY + patchRadius
  maybeBottom = patchY - patchRadius

  if maybeTop > topology.maxPycor
    # wrap the top off -Jeremy B September 2020
    vertical = topSplitLimits(topology, maybeTop, maybeBottom)

    upper = makeRegion(vertical.upperTop, vertical.upperBottom, left, right)
    lower = makeRegion(vertical.lowerTop, vertical.lowerBottom, left, right)

    return [upper, lower]

  if maybeBottom < topology.minPycor
    # wrap the bottom off -Jeremy B September 2020
    vertical = bottomSplitLimits(topology, maybeTop, maybeBottom)

    upper = makeRegion(vertical.upperTop, vertical.upperBottom, left, right)
    lower = makeRegion(vertical.lowerTop, vertical.lowerBottom, left, right)

    return [upper, lower]

  # else wrap neither! -Jeremy B September 2020
  [makeRegion(maybeTop, maybeBottom, left, right)]

# (Topology, Int, Int, Int) => Array[Region]
getRegionsVertical = (topology, patchX, patchY, patchRadius) ->
  doubleRadius = patchRadius * 2

  left  = NLMath.max(patchX - patchRadius, topology.minPxcor)
  right = NLMath.min(patchX + patchRadius, topology.maxPxcor)

  # handle the "whole world" case so we don't worry about it below. -Jeremy B September 2020
  if doubleRadius >= (topology.height - 1)
    return [makeRegion(topology.maxPycor, topology.minPycor, left, right)]

  splitVertical(topology, patchY, patchRadius, left, right)

# (Topology, Int, Int) => Array[Int]
leftSplitLimits = (topology, maybeLeft, maybeRight) ->
  segment1Left  = topology.minPxcor
  segment1Right = maybeRight
  segment2Left  = topology.maxPxcor + (maybeLeft - topology.minPxcor)
  segment2Right = topology.maxPxcor
  [ segment1Left, segment1Right, segment2Left, segment2Right ]

# (Topology, Int, Int) => Array[Int]
rightSplitLimits = (topology, maybeLeft, maybeRight) ->
  segment1Left  = topology.minPxcor
  segment1Right = topology.minPxcor + (maybeRight - topology.maxPxcor)
  segment2Left  = maybeLeft
  segment2Right = topology.maxPxcor
  [ segment1Left, segment1Right, segment2Left, segment2Right ]

# (Topology, Int, Int, Int, Int) => Array[Region]
splitHorizontal = (topology, patchX, patchRadius, top, bottom) ->
  maybeLeft  = patchX - patchRadius
  maybeRight = patchX + patchRadius

  if maybeLeft < topology.minPxcor
    # wrap the left off -Jeremy B September 2020
    horizontal = leftSplitLimits(topology, maybeLeft, maybeRight)
    return [makeRegion(top, bottom, horizontal...)]

  if maybeRight > topology.maxPxcor
    # wrap the right off -Jeremy B September 2020
    horizontal = rightSplitLimits(topology, maybeLeft, maybeRight)
    return [makeRegion(top, bottom, horizontal...)]

  # else wrap neither! -Jeremy B September 2020
  [makeRegion(top, bottom, maybeLeft, maybeRight)]

# (Topology, Int, Int, Int) => Array[Region]
getRegionsHorizontal = (topology, patchX, patchY, patchRadius) ->
  doubleRadius = patchRadius * 2

  top    = NLMath.min(patchY + patchRadius, topology.maxPycor)
  bottom = NLMath.max(patchY - patchRadius, topology.minPycor)

  # handle the "whole world" case so we don't worry about it below. -Jeremy B September 2020
  if doubleRadius >= (topology.width - 1)
    return [makeRegion(top, bottom, topology.minPxcor, topology.maxPxcor)]

  splitHorizontal(topology, patchX, patchRadius, top, bottom)

# (Topology, Int, Int, Int) => Array[Region]
getRegionsTorus = (topology, patchX, patchY, patchRadius) ->
  doubleRadius = patchRadius * 2

  # handle the "whole world" cases so we don't worry about it below. -Jeremy B September 2020
  if doubleRadius >= (topology.width - 1)
    if doubleRadius >= (topology.height - 1)
      return [makeRegion(topology.maxPycor, topology.minPycor, topology.minPxcor, topology.maxPxcor)]
    else
      # we wrapped the whole world width, so this should be a simple vertical wrapping thing. -Jeremy B September 2020
      left  = topology.minPxcor
      right = topology.maxPxcor
      return splitVertical(topology, patchY, patchRadius, left, right)

  if doubleRadius >= (topology.height - 1)
    # we wrapped the whole world height, so this should be a simple horizontal wrapping thing. -Jeremy B September 2020
    top    = topology.maxPycor
    bottom = topology.minPycor
    return splitHorizontal(topology, patchX, patchRadius, top, bottom)

  maybeLeft   = patchX - patchRadius
  maybeRight  = patchX + patchRadius
  maybeTop    = patchY + patchRadius
  maybeBottom = patchY - patchRadius

  isLeftInBounds   = maybeLeft >= topology.minPxcor
  isRightInBounds  = maybeRight <= topology.maxPxcor
  isTopInBounds    = maybeTop <= topology.maxPycor
  isBottomInBounds = maybeBottom >= topology.minPycor

  # handle the unwrapped case so we don't have to worry about that below. -Jeremy B September 2020
  if (isLeftInBounds and isRightInBounds and isTopInBounds and isBottomInBounds)
    return [makeRegion(maybeTop, maybeBottom, maybeLeft, maybeRight)]

  # We aren't "whole world" and we aren't unwrapped, so there are a few scenarios left:

  # - There is a single edge outside the world - a simple two region split like vertical/horizontal
  # - There are two adjacent edges outside the world - a point in a "corner" needing four wrapped regions

  # -Jeremy B September 2020

  if isTopInBounds and isBottomInBounds
    return splitHorizontal(topology, patchX, patchRadius, maybeTop, maybeBottom)

  if isLeftInBounds and isRightInBounds
    return splitVertical(topology, patchY, patchRadius, maybeLeft, maybeRight)

  if not isTopInBounds
    if not isLeftInBounds
      # top left corner -Jeremy B September 2020
      vertical   = topSplitLimits(topology, maybeTop, maybeBottom)
      horizontal = leftSplitLimits(topology, maybeLeft, maybeRight)

      upper = makeRegion(vertical.upperTop, vertical.upperBottom, horizontal...)
      lower = makeRegion(vertical.lowerTop, vertical.lowerBottom, horizontal...)

      return [upper, lower]
    else
      # top right corner -Jeremy B September 2020
      vertical   = topSplitLimits(topology, maybeTop, maybeBottom)
      horizontal = rightSplitLimits(topology, maybeLeft, maybeRight)

      upper = makeRegion(vertical.upperTop, vertical.upperBottom, horizontal...)
      lower = makeRegion(vertical.lowerTop, vertical.lowerBottom, horizontal...)

      return [upper, lower]

  if not isLeftInBounds
    # bottom left corner -Jeremy B September 2020
    vertical   = bottomSplitLimits(topology, maybeTop, maybeBottom)
    horizontal = leftSplitLimits(topology, maybeLeft, maybeRight)

    upper = makeRegion(vertical.upperTop, vertical.upperBottom, horizontal...)
    lower = makeRegion(vertical.lowerTop, vertical.lowerBottom, horizontal...)

    return [upper, lower]

  # bottom right corner -Jeremy B September 2020
  vertical   = bottomSplitLimits(topology, maybeTop, maybeBottom)
  horizontal = rightSplitLimits(topology, maybeLeft, maybeRight)

  upper = makeRegion(vertical.upperTop, vertical.upperBottom, horizontal...)
  lower = makeRegion(vertical.lowerTop, vertical.lowerBottom, horizontal...)

  [upper, lower]

# (Region, (Int, Int) => Unit) => Unit
searchRegion = (region, checkAgentsHere) ->
  for pycor in [region.top..region.bottom]
    for segment in region.segments
      for pxcor in [segment.left..segment.right]
        checkAgentsHere(pxcor, pycor)

  return

# (Topology, Int, Int, Number, (Int, Int) => Unit) => Unit
searchPatches = (topology, patchX, patchY, radius, checkAgentsHere) ->

  # NetLogo desktop special-cases on radius length. -Jeremy B August 2020.
  if radius <= 2
    patches = getSmallRadiusPatches(topology, patchX, patchY, radius)
    patches.forEach( (patch) -> checkAgentsHere(patch.pxcor, patch.pycor) )

  else
    patchRadius = NLMath.ceil(radius)
    regions = if isInCache("patch", patchX, patchY, "regions", patchRadius) then getFromCache() else
      addToCache(topologyHelpers.getRegions(patchX, patchY, patchRadius))
    for region in regions
      searchRegion(region, checkAgentsHere)

  return

# (Topology, Number, Number, TurtleSet, Number) -> TurtleSet
filterTurtlesInRadius = (topology, x, y, turtleset, radius) ->

  patchX          = NLMath.round(x)
  patchY          = NLMath.round(y)
  isInTargetSet   = makeTargetChecker(turtleset, "turtles")
  inExactRadiusSq = makeInExactRadiusSq(topologyHelpers.inRadiusSq, x, y, radius)

  # If the source turtle is in a corner of its patch, and a target turtle is in the closest
  # corner of its patch, the patch distances will be off by sqrt(2).  We have to correct
  # for this by "over-sampling" the patches.  We could do 1.414..., but we'll use 2 to
  # stick with integer arithmetic for patches.  -Jeremy B August 2020
  roundedRadius = NLMath.round(radius)
  couldBeInRadiusSq = if isInCache("patch", patchX, patchY, "couldBeInRadiusSq", roundedRadius) then getFromCache() else
    addToCache(
      # (Int, Int) => Boolean
      (pxcor, pycor) ->
        topologyHelpers.inRadiusSq((roundedRadius + 2) * (roundedRadius + 2), patchX, patchY, pxcor, pycor)
    )

  results = []
  # (Int, Int) => Unit
  checkTurtlesHere = (pxcor, pycor) ->

    # This empty patch check may help with sparser models.  Because the bounding box check
    # should already have filtered out most of the patches, this is worth the expense of
    # getting the patch to check even if the patch might not be in radius, as the size check should
    # be pretty fast and often 0.  -Jeremy B August 2020
    patch = topologyHelpers.getPatchAt(pxcor, pycor)
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

  searchPatches(topology, patchX, patchY, radius, checkTurtlesHere)

  new TurtleSet(results, turtleset._world)

# (Topology, Number, Number, PatchSet, Number) -> PatchSet
filterPatchesInRadius = (topology, x, y, patchset, radius) ->

  patchX          = NLMath.round(x)
  patchY          = NLMath.round(y)
  isInTarget      = makeTargetChecker(patchset, "patches")
  inExactRadiusSq = makeInExactRadiusSq(topologyHelpers.inRadiusSq, x, y, radius)

  results = []
  # (Int, Int) => Unit
  checkPatchHere = (pxcor, pycor) ->
    patch = topologyHelpers.getPatchAt(pxcor, pycor)
    if isInTarget(patch) and inExactRadiusSq(patch.pxcor, patch.pycor)
      results.push(patch)
    return

  searchPatches(topology, patchX, patchY, radius, checkPatchHere)

  new PatchSet(results, patchset._world)

# (Topology, Number, Number, TurtleSet | PatchSet, Number) -> TurtleSet | PatchSet
inRadius = (topology, x, y, agentset, radius) ->
  initialize(topology)
  switch agentset._agentTypeName
    when "turtles" then filterTurtlesInRadius(topology, x, y, agentset, radius)
    when "patches" then filterPatchesInRadius(topology, x, y, agentset, radius)
    else throw new Error("Cannot use `in-radius` on this agentset type.")

###

Begin `in-cone` section.

This code is updated to match the `in-radius` style above and to use some of those optimizations and caching, but it
hasn't been fully converted or optimized.  Most critically, it gives the same ordering of resulting agents as desktop
NetLogo.

-Jeremy B August 2020

###

# this.type: Topology
# [T] @ (Number, Number, Number, AbstractAgents[T], Number, Number) => AbstractAgentSet[T]
inCone = (x, y, turtleHeading, agents, distance, angle) ->
  initialize(this)

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

  isPatchSet  = NLType(agents).isPatchSet()
  isTurtleSet = NLType(agents).isTurtleSet()

  results = []
  checkAgentsHere = if isPatchSet
    isInTargetSet = makeTargetChecker(agents, "patches")
    isInCone      = patchIsGood(wrapCountInX, wrapCountInY)
    (pxcor, pycor) ->
      patch = topologyHelpers.getPatchAt(pxcor, pycor)
      if isInTargetSet(patch) and isInCone(patch)
        results.push(patch)
      return

  else if isTurtleSet
    isInTargetSet = makeTargetChecker(agents, "turtles")
    isInCone      = turtleIsGood(wrapCountInX, wrapCountInY)
    (pxcor, pycor) ->
      patch = topologyHelpers.getPatchAt(pxcor, pycor)
      patch._turtles.forEach( (turtle) =>
        if isInTargetSet(turtle) and isInCone(turtle)
          results.push(turtle)
        return
      )
      return

  else
    throw new Error("Cannot use `in-cone` on this agentset type.")

  searchPatches(this, pxcor, pycor, distance, checkAgentsHere)
  agents.copyWithNewAgents(results)

module.exports = { inRadius, inCone }
