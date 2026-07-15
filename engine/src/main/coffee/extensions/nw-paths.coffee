# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')
TurtleSet = require('../engine/core/turtleset')
{ checks } = require('../engine/core/typechecker')

{ isInTurtleset, bfs, dijkstra, getLinkWeight, normalizeWeightVar, bfsSuccessors,
  walkSuccessors, dijkstraSuccessors, isValidLink } = require('extensions/nw-core')

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

    {distances} = bfs(startTurtle, ctx, 'out')

    dist = distances.get(targetTurtle.id)
    if dist? then dist else false

  # The links incident to `source` whose other end is `target`, in desktop `outEdges(source)` order:  directed out-links
  # (`outLinks`, link-id order) first, then undirected links incident to `source` (`undirLinks`, link-id order).  The
  # order here must line up with desktop's to pick the same link. -Jeremy B July 2026
  # (Turtle, Turtle, Context) => Array[Link]
  linksBetween = (source, target, ctx) ->
    ids   = new Set(t.id for t in ctx.turtles.toArray())
    out   = []
    undir = []
    for link in ctx.links.toArray()
      if not isValidLink(link)
        continue
      if not (ids.has(link.end1.id) and ids.has(link.end2.id))
        continue
      if link.isDirected
        if link.end1 is source and link.end2 is target
          out.push(link)
      else
        if (link.end1 is source and link.end2 is target) or (link.end2 is source and link.end1 is target)
          undir.push(link)
    out.concat(undir)

  # Converts a turtle path (source, ..., target) into the list of links realizing each hop, drawing
  # `rng.nextInt(links.size)` per consecutive pair -- replicating desktop `turtlesToLinks`.  Even when exactly one link
  # connects a pair, `nextInt(1)` is still drawn (and still consumes an MT word), so this must run even for simple
  # graphs to keep the RNG position in lockstep with desktop.  -Jeremy B July 2026
  # (Array[Turtle], Context, RNG) => Array[Link]
  turtlesToLinks = (turtles, ctx, rng) ->
    path = []
    for i in [0 ... turtles.length - 1]
      links = linksBetween(turtles[i], turtles[i + 1], ctx)
      path.push(links[rng.nextInt(links.length)])
    path

  # Desktop `path-to` first computes the *turtle* path via `PathFinder.path` (the successor-cache forward walk -- same
  # RNG as `turtles-on-path-to`), then converts turtles to links with `turtlesToLinks`, which draws one extra
  # `rng.nextInt(links.size)` per hop.  We mirror both steps so the full RNG sequence (path walk, then per-hop link
  # selection) matches desktop.  -Jeremy B July 2026
  # (Turtle, Turtle) => Array[Link] | Boolean
  calcPathTo = (startTurtle, targetTurtle) ->
    ctx = getCurrentContext()

    if not isInTurtleset(startTurtle, ctx)
      return false

    if not isInTurtleset(targetTurtle, ctx)
      return false

    if startTurtle is targetTurtle
      return []

    rng = workspace.world.rng
    { successors } = bfsSuccessors(targetTurtle, ctx)
    turtles = walkSuccessors(successors, startTurtle, targetTurtle, rng)
    if turtles is false
      return false
    turtlesToLinks(turtles, ctx, rng)

  # Mirrors desktop's `PathFinder.path` / `cachedPath`: it builds the *successor* cache (reverse BFS from the
  # destination, see `bfsSuccessors`) and then walks *forward* from the source, drawing
  # `rng.nextInt(successors[current].length)` at each hop to pick the next turtle toward the target.  The
  # predecessor-backward walk this used to do consumed the RNG in a different order and with different bounds, so it
  # diverged from desktop on tie-broken paths.  When the source cannot reach the target, `successors[source]` is empty
  # and we return `false` (no RNG drawn), matching desktop's `None`. -Jeremy B July 2026
  # (Turtle, Turtle) => Array[Turtle] | Boolean
  calcTurtlesOnPathTo = (startTurtle, targetTurtle) ->
    ctx = getCurrentContext()

    if not isInTurtleset(startTurtle, ctx)
      return false

    if not isInTurtleset(targetTurtle, ctx)
      return false

    if startTurtle is targetTurtle
      return [startTurtle]

    { successors } = bfsSuccessors(targetTurtle, ctx)
    walkSuccessors(successors, startTurtle, targetTurtle, workspace.world.rng)

  # (Number) => TurtleSet
  turtlesInRadius = (radius) ->
    self = workspace.world.selfManager.self()
    if not checks.isTurtle(self)
      throw exceptions.extension("nw:turtles-in-radius can only be called by a turtle")
    new TurtleSet(turtlesInRadiusFrom(self, radius, 'out'), workspace.world)

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

    {distances} = dijkstra(startTurtle, ctx, 'out', weightVar)

    dist = distances.get(targetTurtle.id)
    if dist? then dist else false

  # Desktop `weighted-path-to` computes the turtle path via `PathFinder.path(..., Some(weightVariable))` (the successor
  # cache built by a *reverse Dijkstra from the destination* + forward walk -- same RNG as
  # `turtles-on-weighted-path-to`), then converts turtles to links with `turtlesToLinks`.  See `calcPathTo` for why both
  # steps matter for RNG parity.  -Jeremy B July 2026
  # (Turtle, Turtle, String) => Array[Link] | Boolean
  calcWeightedPathTo = (startTurtle, targetTurtle, weightVar) ->
    ctx = getCurrentContext()

    if not isInTurtleset(startTurtle, ctx)
      return false

    if not isInTurtleset(targetTurtle, ctx)
      return false

    if startTurtle is targetTurtle
      return []

    rng = workspace.world.rng
    { successors } = dijkstraSuccessors(targetTurtle, ctx, weightVar)
    turtles = walkSuccessors(successors, startTurtle, targetTurtle, rng)
    if turtles is false
      return false
    turtlesToLinks(turtles, ctx, rng)

  # Mirrors desktop `PathFinder.path(..., Some(weightVariable))`: builds the successor cache via a reverse Dijkstra from
  # the target (see `dijkstraSuccessors`) and walks forward from the source, drawing
  # `rng.nextInt(successors[current].length)` per hop.  The predecessor-backward walk this used to do diverged from
  # desktop's successor-cache walk in RNG order and tie-broken intermediate nodes. -Jeremy B July 2026
  # (Turtle, Turtle, String) => Array[Turtle] | Boolean
  calcTurtlesOnWeightedPathTo = (startTurtle, targetTurtle, weightVar) ->
    ctx = getCurrentContext()

    if not isInTurtleset(startTurtle, ctx)
      return false

    if not isInTurtleset(targetTurtle, ctx)
      return false

    if startTurtle is targetTurtle
      return [startTurtle]

    { successors } = dijkstraSuccessors(targetTurtle, ctx, weightVar)
    walkSuccessors(successors, startTurtle, targetTurtle, workspace.world.rng)

  # () => Number | Boolean
  meanPathLength = ->
    ctx = getCurrentContext()
    turtles = ctx.turtles.toArray()

    if turtles.length < 2
      return false

    totalDistance = 0
    pairCount = 0

    for startTurtle in turtles
      {distances} = bfs(startTurtle, ctx, 'out')
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
    totalDistance = 0
    pairCount = 0

    for startTurtle in turtles
      {distances} = dijkstra(startTurtle, ctx, 'out', normalizedVar)
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
