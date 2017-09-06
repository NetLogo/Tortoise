# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLMath = require('util/nlmath')
NLType = require('../typechecker')

# (Boolean, Number, Number, Number, Number, Number) => (Number, Number)
findCircleBounds = (wrapsInDim, worldSpan, distance, minDim, maxDim, currentDim) ->
  dist = NLMath.ceil(distance)
  if wrapsInDim
    halfSpan = worldSpan / 2
    if dist < halfSpan
      [-dist, dist]
    else
      [-NLMath.ceil(halfSpan - 1), NLMath.floor(halfSpan)]
  else
    diff = minDim - currentDim
    min  = if NLMath.abs(diff) < dist then diff else -dist
    max  = NLMath.min((maxDim - currentDim), dist)
    [min, max]

# this.type: Topology
# [T] @ (Number, Number, Number, AbstractAgents[T], Number, Number) => AbstractAgentSet[T]
module.exports =
  (x, y, turtleHeading, agents, distance, angle) ->

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
      isPlausible = agents.getSpecialName() is "patches" or agents.contains(patch)
      isPlausible and isInWrappableSector(patch.pxcor, patch.pycor, wrapCountInX, wrapCountInY)

    # (Number, Number) => (Turtle) => Boolean
    turtleIsGood = (wrapCountInX, wrapCountInY) => (turtle) =>
      breedName = agents.getSpecialName()
      isPlausible =
        breedName is "turtles" or
          (breedName? and breedName is turtle.getBreedName()) or
          ((not breedName?) and agents.contains(turtle))
      isPlausible and isInWrappableSector(turtle.xcor, turtle.ycor, wrapCountInX, wrapCountInY)


    { pxcor, pycor } = @_getPatchAt(x, y)

    wrapCountInX = findWrapCount(@_wrapInX, @width)
    wrapCountInY = findWrapCount(@_wrapInY, @height)

    patchIsGood_  =  patchIsGood(wrapCountInX, wrapCountInY)
    turtleIsGood_ = turtleIsGood(wrapCountInX, wrapCountInY)

    [dxMin, dxMax] = findCircleBounds(@_wrapInX, @width,  distance, @minPxcor, @maxPxcor, pxcor)
    [dyMin, dyMax] = findCircleBounds(@_wrapInY, @height, distance, @minPycor, @maxPycor, pycor)

    isPatchSet  = NLType(agents).isPatchSet()
    isTurtleSet = NLType(agents).isTurtleSet()

    result = []

    for dy in [dyMin..dyMax]
      for dx in [dxMin..dxMax]
        patch = @_getPatchAt(pxcor + dx, pycor + dy)
        if not NLType(patch).isNobody()
          if isPatchSet and patchIsGood_(patch)
            result.push(patch)
          else if isTurtleSet and NLMath.distance2_2D(dx, dy) <= distance + 1.415
            goodTurtles = patch.turtlesHere().toArray().filter((turtle) => turtleIsGood_(turtle))
            result      = result.concat(goodTurtles)

    agents.copyWithNewAgents(result)
