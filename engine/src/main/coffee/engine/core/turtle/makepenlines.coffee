# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLMath = require('util/nlmath')

class Trail
  constructor: (@x1, @y1, @x2, @y2, @dist) ->


# Ugh, Model Runs outputs the wrong updates for this
# Make some simple tests
lazyWrapValue = (min, max) -> (value) ->
  if value <= min
    max
  else if value >= max
    min
  else
    value

distanceFromLegs = (l1, l2) ->
  square = (x) -> NLMath.pow(x, 2)
  NLMath.sqrt(square(l1) + square(l2))

makeTrails = (heading, minX, maxX, minY, maxY) -> (x, y, jumpDist) ->

  xcomp = NLMath.squash(NLMath.sin(heading))
  ycomp = NLMath.squash(NLMath.cos(heading))
  tan   = NLMath.squash(NLMath.tan(heading))

  rawX = x + xcomp * jumpDist
  rawY = y + ycomp * jumpDist

  baseTrails = [new Trail(x, y, rawX, rawY, if jumpDist < 0 then jumpDist * -1 else jumpDist)]

  makeTrailComponent = (endX, endY, dx, dy) ->
    [new Trail(x, y, endX, endY, distanceFromLegs(dx, dy))]

  yInterceptTrails =
    if rawX > maxX
      dx = maxX - x
      dy = dx / tan
      interceptY = y + dy
      makeTrailComponent(maxX, interceptY, dx, dy)
    else if rawX < minX
      dx = x - minX
      dy = dx / tan
      interceptY = y - dy
      makeTrailComponent(minX, interceptY, dx, dy)
    else
      []

  xInterceptTrails =
    if rawY > maxY
      dy = maxY - y
      dx = dy * tan
      interceptX = x + dx
      makeTrailComponent(interceptX, maxY, dx, dy)
    else if rawY < minY
      dy = y - minY
      dx = dy * tan
      interceptX = x - dx
      makeTrailComponent(interceptX, minY, dx, dy)
    else
      []

  baseTrails.concat(xInterceptTrails, yInterceptTrails)

# (Number, Number, Number, Number, Number, Number, Number, Number) => Array[Trail]
makePenLines = (x, y, heading, jumpDist, minX, maxX, minY, maxY) ->
  makeTrailsBy = makeTrails(heading, minX, maxX, minY, maxY)
  lazyWrapX    = lazyWrapValue(minX, maxX)
  lazyWrapY    = lazyWrapValue(minY, maxY)
  makePenLinesHelper(makeTrailsBy, lazyWrapX, lazyWrapY)(x, y, jumpDist, [])

# ((Number, Number, Number) => Array[Trail], (Number) => Number, (Number) => Number) => (Number, Number, Number, Array[Trail]) => Array[Trail]
makePenLinesHelper = (makeTrailsBy, lazyWrapX, lazyWrapY) ->
  inner = (x, y, jumpDist, acc) ->

    trails       = makeTrailsBy(x, y, jumpDist)
    trail        = trails.sort(({ dist: distA }, { dist: distB }) -> if distA < distB then -1 else if distA is distB then 0 else 1)[0]
    newAcc       = acc.concat([trail])
    nextJumpDist = if jumpDist >= 0 then (jumpDist - trail.dist) else (jumpDist + trail.dist)

    if nextJumpDist == 0
      newAcc
    else
      newX = lazyWrapX(trail.x2)
      newY = lazyWrapY(trail.y2)
      inner(newX, newY, nextJumpDist, newAcc)

  inner

module.exports = makePenLines
