# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')
TurtleSet = require('../engine/core/turtleset')
{ checks } = require('../engine/core/typechecker')

{ isInTurtleset, getNeighbors, bfs, dijkstra, getLinkWeight, normalizeWeightVar } = require('extensions/nw-core')

# ({ workspace: Workspace, getCurrentContext: () => Context }) => Object
module.exports = (deps) ->
  { workspace, getCurrentContext } = deps

  # (Turtle, Number, String) => Array[Turtle]
  turtlesInRadiusFrom = (startTurtle, radius, mode) ->
    if radius < 0
      throw exceptions.extension("radius cannot be negative")

    ctx = getCurrentContext()

    if not isInTurtleset(startTurtle, ctx)
      return []

    result = [startTurtle]
    if radius is 0
      return result

    {distances} = bfs(startTurtle, ctx, mode)

    for [id, dist] from distances
      if dist <= radius and dist > 0
        turtle = workspace.world.turtleManager.getTurtle(id)
        if turtle? and isInTurtleset(turtle, ctx)
          result.push(turtle)

    result

  # (Turtle, Turtle) => Number | Boolean
  calcDistanceTo = (startTurtle, targetTurtle) ->
    ctx = getCurrentContext()

    if not isInTurtleset(startTurtle, ctx)
      return false

    if not isInTurtleset(targetTurtle, ctx)
      return false

    if startTurtle is targetTurtle
      return 0

    mode = if ctx.isDirected then 'out' else 'both'
    {distances} = bfs(startTurtle, ctx, mode)

    dist = distances.get(targetTurtle.id)
    if dist? then dist else false

  # (Turtle, Turtle) => Array[Link] | Boolean
  calcPathTo = (startTurtle, targetTurtle) ->
    ctx = getCurrentContext()

    if not isInTurtleset(startTurtle, ctx)
      return false

    if not isInTurtleset(targetTurtle, ctx)
      return false

    if startTurtle is targetTurtle
      return []

    mode = if ctx.isDirected then 'out' else 'both'
    {parents} = bfs(startTurtle, ctx, mode)

    if not parents.has(targetTurtle.id) or parents.get(targetTurtle.id).length is 0
      return false

    path = []
    current = targetTurtle
    while current isnt startTurtle
      parentList = parents.get(current.id)
      if not parentList? or parentList.length is 0
        return false
      parentInfo = parentList[workspace.world.rng.nextInt(parentList.length)]
      path.unshift(parentInfo.link)
      current = parentInfo.parent

    path

  # (Turtle, Turtle) => Array[Turtle] | Boolean
  calcTurtlesOnPathTo = (startTurtle, targetTurtle) ->
    ctx = getCurrentContext()

    if not isInTurtleset(startTurtle, ctx)
      return false

    if not isInTurtleset(targetTurtle, ctx)
      return false

    if startTurtle is targetTurtle
      return [startTurtle]

    mode = if ctx.isDirected then 'out' else 'both'
    {parents} = bfs(startTurtle, ctx, mode)

    if not parents.has(targetTurtle.id) or parents.get(targetTurtle.id).length is 0
      return false

    turtles = []
    current = targetTurtle
    while current isnt startTurtle
      parentList = parents.get(current.id)
      if not parentList? or parentList.length is 0
        return false
      parentInfo = parentList[workspace.world.rng.nextInt(parentList.length)]
      turtles.unshift(current)
      current = parentInfo.parent

    turtles.unshift(startTurtle)
    turtles

  # (Number) => TurtleSet
  turtlesInRadius = (radius) ->
    self = workspace.world.selfManager.self()
    if not checks.isTurtle(self)
      throw exceptions.extension("nw:turtles-in-radius can only be called by a turtle")
    new TurtleSet(turtlesInRadiusFrom(self, radius, 'both'), workspace.world)

  # (Number) => TurtleSet
  turtlesInReverseRadius = (radius) ->
    self = workspace.world.selfManager.self()
    if not checks.isTurtle(self)
      throw exceptions.extension("nw:turtles-in-reverse-radius can only be called by a turtle")
    new TurtleSet(turtlesInRadiusFrom(self, radius, 'in'), workspace.world)

  # (Turtle) => Number | Boolean
  distanceTo = (target) ->
    self = workspace.world.selfManager.self()
    if not checks.isTurtle(self)
      throw exceptions.extension("nw:distance-to can only be called by a turtle")
    if not checks.isTurtle(target)
      throw exceptions.extension("nw:distance-to requires a turtle as argument")
    calcDistanceTo(self, target)

  # (Turtle) => Array[Link] | Boolean
  pathTo = (target) ->
    self = workspace.world.selfManager.self()
    if not checks.isTurtle(self)
      throw exceptions.extension("nw:path-to can only be called by a turtle")
    if not checks.isTurtle(target)
      throw exceptions.extension("nw:path-to requires a turtle as argument")
    calcPathTo(self, target)

  # (Turtle) => Array[Turtle] | Boolean
  turtlesOnPathTo = (target) ->
    self = workspace.world.selfManager.self()
    if not checks.isTurtle(self)
      throw exceptions.extension("nw:turtles-on-path-to can only be called by a turtle")
    if not checks.isTurtle(target)
      throw exceptions.extension("nw:turtles-on-path-to requires a turtle as argument")
    calcTurtlesOnPathTo(self, target)

  # (Turtle, Turtle, String) => Number | Boolean
  calcWeightedDistanceTo = (startTurtle, targetTurtle, weightVar) ->
    ctx = getCurrentContext()

    if not isInTurtleset(startTurtle, ctx)
      return false

    if not isInTurtleset(targetTurtle, ctx)
      return false

    if startTurtle is targetTurtle
      return 0

    mode = if ctx.isDirected then 'out' else 'both'
    {distances} = dijkstra(startTurtle, ctx, mode, weightVar)

    dist = distances.get(targetTurtle.id)
    if dist? then dist else false

  # (Turtle, Turtle, String) => Array[Link] | Boolean
  calcWeightedPathTo = (startTurtle, targetTurtle, weightVar) ->
    ctx = getCurrentContext()

    if not isInTurtleset(startTurtle, ctx)
      return false

    if not isInTurtleset(targetTurtle, ctx)
      return false

    if startTurtle is targetTurtle
      return []

    mode = if ctx.isDirected then 'out' else 'both'
    {parents} = dijkstra(startTurtle, ctx, mode, weightVar)

    if not parents.has(targetTurtle.id) or parents.get(targetTurtle.id).length is 0
      return false

    path = []
    current = targetTurtle
    while current isnt startTurtle
      parentList = parents.get(current.id)
      if not parentList? or parentList.length is 0
        return false
      parentInfo = parentList[workspace.world.rng.nextInt(parentList.length)]
      path.unshift(parentInfo.link)
      current = parentInfo.parent

    path

  # (Turtle, Turtle, String) => Array[Turtle] | Boolean
  calcTurtlesOnWeightedPathTo = (startTurtle, targetTurtle, weightVar) ->
    ctx = getCurrentContext()

    if not isInTurtleset(startTurtle, ctx)
      return false

    if not isInTurtleset(targetTurtle, ctx)
      return false

    if startTurtle is targetTurtle
      return [startTurtle]

    mode = if ctx.isDirected then 'out' else 'both'
    {parents} = dijkstra(startTurtle, ctx, mode, weightVar)

    if not parents.has(targetTurtle.id) or parents.get(targetTurtle.id).length is 0
      return false

    turtles = []
    current = targetTurtle
    while current isnt startTurtle
      parentList = parents.get(current.id)
      if not parentList? or parentList.length is 0
        return false
      parentInfo = parentList[workspace.world.rng.nextInt(parentList.length)]
      turtles.unshift(current)
      current = parentInfo.parent

    turtles.unshift(startTurtle)
    turtles

  # () => Number | Boolean
  meanPathLength = ->
    ctx = getCurrentContext()
    turtles = ctx.turtles.toArray()

    if turtles.length < 2
      return false

    mode = if ctx.isDirected then 'out' else 'both'
    totalDistance = 0
    pairCount = 0

    for startTurtle in turtles
      {distances} = bfs(startTurtle, ctx, mode)
      for targetTurtle in turtles
        if startTurtle isnt targetTurtle
          dist = distances.get(targetTurtle.id)
          if not dist?
            return false
          totalDistance += dist
          pairCount += 1

    if pairCount is 0
      return false

    totalDistance / pairCount

  # (Any) => Number | Boolean
  meanWeightedPathLength = (weightVar) ->
    ctx = getCurrentContext()
    turtles = ctx.turtles.toArray()

    if turtles.length < 2
      return false

    normalizedVar = normalizeWeightVar(weightVar)
    mode = if ctx.isDirected then 'out' else 'both'
    totalDistance = 0
    pairCount = 0

    for startTurtle in turtles
      {distances} = dijkstra(startTurtle, ctx, mode, normalizedVar)
      for targetTurtle in turtles
        if startTurtle isnt targetTurtle
          dist = distances.get(targetTurtle.id)
          if not dist?
            return false
          totalDistance += dist
          pairCount += 1

    if pairCount is 0
      return false

    totalDistance / pairCount

  # (Turtle, Any) => Number | Boolean
  weightedDistanceTo = (target, weightVar) ->
    self = workspace.world.selfManager.self()
    if not checks.isTurtle(self)
      throw exceptions.extension("nw:weighted-distance-to can only be called by a turtle")
    if not checks.isTurtle(target)
      throw exceptions.extension("nw:weighted-distance-to requires a turtle as argument")
    calcWeightedDistanceTo(self, target, normalizeWeightVar(weightVar))

  # (Turtle, Any) => Array[Link] | Boolean
  weightedPathTo = (target, weightVar) ->
    self = workspace.world.selfManager.self()
    if not checks.isTurtle(self)
      throw exceptions.extension("nw:weighted-path-to can only be called by a turtle")
    if not checks.isTurtle(target)
      throw exceptions.extension("nw:weighted-path-to requires a turtle as argument")
    calcWeightedPathTo(self, target, normalizeWeightVar(weightVar))

  # (Turtle, Any) => Array[Turtle] | Boolean
  turtlesOnWeightedPathTo = (target, weightVar) ->
    self = workspace.world.selfManager.self()
    if not checks.isTurtle(self)
      throw exceptions.extension("nw:turtles-on-weighted-path-to can only be called by a turtle")
    if not checks.isTurtle(target)
      throw exceptions.extension("nw:turtles-on-weighted-path-to requires a turtle as argument")
    calcTurtlesOnWeightedPathTo(self, target, normalizeWeightVar(weightVar))

  {
    "TURTLES-IN-RADIUS":           turtlesInRadius
  , "TURTLES-IN-REVERSE-RADIUS":   turtlesInReverseRadius
  , "DISTANCE-TO":                 distanceTo
  , "PATH-TO":                     pathTo
  , "TURTLES-ON-PATH-TO":          turtlesOnPathTo
  , "WEIGHTED-DISTANCE-TO":        weightedDistanceTo
  , "WEIGHTED-PATH-TO":            weightedPathTo
  , "TURTLES-ON-WEIGHTED-PATH-TO": turtlesOnWeightedPathTo
  , "MEAN-PATH-LENGTH":            meanPathLength
  , "MEAN-WEIGHTED-PATH-LENGTH":   meanWeightedPathLength
  }
