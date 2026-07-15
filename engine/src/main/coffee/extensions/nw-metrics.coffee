# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')
TurtleSet  = require('../engine/core/turtleset')
{ checks } = require('../engine/core/typechecker')

{ isInTurtleset, bfs, dijkstra, getLinkWeight, normalizeWeightVar, isValidLink, isAliveTurtle, graphView } = require('extensions/nw-core')

# A cheap O(V+E) structural fingerprint of the graph context, used to memoize whole-graph metrics (betweenness,
# eigenvector, page-rank).  Captures turtle membership and link structure (endpoints, directedness, and the weight
# variable when relevant) in iteration order, which is stable for an unchanged graph, so it never yields a false cache
# hit; a changed graph produces a different fingerprint and forces recomputation.
# -Jeremy B July 2026
# ((Link) => Boolean) => ((Context, Any) => String)
graphFingerprint = (isValidLinkFn) -> (ctx, weightVar) ->
  parts = (t.id for t in ctx.turtles.toArray())
  parts.push("|")
  for l in ctx.links.toArray() when isValidLinkFn(l)
    parts.push(if weightVar? then "#{l.end1.id},#{l.end2.id},#{l.isDirected},#{l.getVariable(weightVar)}" else "#{l.end1.id},#{l.end2.id},#{l.isDirected}")
  parts.join(";")

# ((Context, Any) => String, (Context, Any) => Map[Number, Number]) => ((Context, Any) => Map[Number, Number])
makeGraphMemo = (fingerprint, compute) ->
  cache = { key: null, value: null }
  (ctx, weightVar) ->
    tag = if weightVar? then "w:#{weightVar}" else "u"
    key = "#{tag}|#{fingerprint(ctx, weightVar)}"
    if cache.key isnt key
      cache.key   = key
      cache.value = compute(ctx, weightVar)
    cache.value

# ({ workspace: Workspace, getCurrentContext: () => Context }) => Object
module.exports = (deps) ->
  { workspace, getCurrentContext } = deps

  fingerprint = graphFingerprint(isValidLink)

  # Mirror of desktop's `util.TurtleSetsConverters.toTurtleSets`, which every NW cluster prim
  # (weak/bicomponent/maximal-cliques/biggest-maximal-cliques) funnels its result through: `new
  # scala.util.Random(context.getRNG).shuffle(sets)`.  The RNG draws land identically on both engines, so we reproduce
  # the exact shuffle.
  # -Jeremy B July 2026
  # (Array[TurtleSet]) => Array[TurtleSet]
  shuffleClusters = (clusters) ->
    arr = clusters.slice()
    i = arr.length
    while i > 1
      i -= 1
      j = workspace.world.rng.nextInt(i + 1)
      [arr[i], arr[j]] = [arr[j], arr[i]]
    arr

  # (Turtle) => Number
  calcClosenessCentrality = (turtle) ->
    ctx = getCurrentContext()

    if not isInTurtleset(turtle, ctx)
      throw exceptions.extension("#{turtle.toString().replace(/[()]/g, '')} is not a member of the current graph context.")

    turtles = ctx.turtles.toArray()

    if turtles.length <= 1
      return 0

    mode = if ctx.isDirected then 'out' else 'both'
    {distances} = bfs(turtle, ctx, mode)

    sumDistances = 0
    reachableCount = 0

    for other in turtles
      if other isnt turtle
        dist = distances.get(other.id)
        if dist?
          sumDistances += dist
          reachableCount += 1

    if reachableCount is 0
      return 0

    reachableCount / sumDistances

  # (Turtle, String) => Number
  calcWeightedClosenessCentrality = (turtle, weightVar) ->
    ctx = getCurrentContext()

    if not isInTurtleset(turtle, ctx)
      throw exceptions.extension("#{turtle.toString().replace(/[()]/g, '')} is not a member of the current graph context.")

    turtles = ctx.turtles.toArray()

    if turtles.length <= 1
      return 0

    mode = if ctx.isDirected then 'out' else 'both'
    {distances} = dijkstra(turtle, ctx, mode, normalizeWeightVar(weightVar))

    sumDistances = 0
    reachableCount = 0

    for other in turtles
      if other isnt turtle
        dist = distances.get(other.id)
        if dist?
          sumDistances += dist
          reachableCount += 1

    if reachableCount is 0
      return 0

    reachableCount / sumDistances

  # () => Number
  closenessCentrality = ->
    self = workspace.world.selfManager.self()
    if not checks.isTurtle(self)
      throw exceptions.extension("nw:closeness-centrality can only be called by a turtle")
    calcClosenessCentrality(self)

  # (Any) => Number
  weightedClosenessCentrality = (weightVar) ->
    self = workspace.world.selfManager.self()
    if not checks.isTurtle(self)
      throw exceptions.extension("nw:weighted-closeness-centrality can only be called by a turtle")
    calcWeightedClosenessCentrality(self, normalizeWeightVar(weightVar))

  # (Context, String) => Map[Number, Number]
  betweennessCentralityCalc = (ctx, weightVar = null) ->
    turtles = ctx.turtles.toArray()

    if turtles.length is 0
      return new Map()

    centrality = new Map()
    for t in turtles
      centrality.set(t.id, 0)

    mode = if ctx.isDirected then 'out' else 'both'
    view = graphView(ctx, mode)

    for s in turtles
      result = if weightVar then dijkstra(s, ctx, mode, weightVar, view) else bfs(s, ctx, mode, view)
      {distances, parents} = result

      reached = []
      distances.forEach((dist, id) ->
        if id isnt s.id
          reached.push({id, dist})
      )

      if reached.length is 0
        continue

      reached.sort((a, b) -> a.dist - b.dist)

      sigma = new Map()
      sigma.set(s.id, 1)

      for node in reached
        nodeParents = parents.get(node.id)
        if nodeParents and nodeParents.length > 0
          total = 0
          for p in nodeParents
            parentSigma = sigma.get(p.parent.id)
            if parentSigma?
              total += parentSigma
          sigma.set(node.id, total)

      delta = new Map()
      for t in turtles
        delta.set(t.id, 0)

      for i in [reached.length - 1 .. 0] by -1
        wId = reached[i].id
        wParents = parents.get(wId)

        if wParents and wParents.length > 0
          sigmaW = sigma.get(wId)
          if sigmaW > 0
            for p in wParents
              vId = p.parent.id
              sigmaV = sigma.get(vId)
              delta.set(vId, delta.get(vId) + (sigmaV / sigmaW) * (1 + delta.get(wId)))

        centrality.set(wId, centrality.get(wId) + delta.get(wId))

    if not ctx.isDirected
      for t in turtles
        tId = t.id
        centrality.set(tId, centrality.get(tId) / 2)

    centrality

  # (Turtle) => Number
  calcBetweennessCentrality = (turtle) ->
    ctx = getCurrentContext()

    if not isInTurtleset(turtle, ctx)
      throw exceptions.extension("#{turtle.toString().replace(/[()]/g, '')} is not a member of the current graph context.")

    centrality = memoBetweenness(ctx)
    centrality.get(turtle.id) ? 0

  # (Turtle, String) => Number
  calcWeightedBetweennessCentrality = (turtle, weightVar) ->
    ctx = getCurrentContext()

    if not isInTurtleset(turtle, ctx)
      throw exceptions.extension("#{turtle.toString().replace(/[()]/g, '')} is not a member of the current graph context.")

    centrality = memoBetweenness(ctx, normalizeWeightVar(weightVar))
    centrality.get(turtle.id) ? 0

  # () => Number
  betweennessCentrality = ->
    self = workspace.world.selfManager.self()
    if not checks.isTurtle(self)
      throw exceptions.extension("nw:betweenness-centrality can only be called by a turtle")
    calcBetweennessCentrality(self)

  # (Any) => Number
  weightedBetweennessCentrality = (weightVar) ->
    self = workspace.world.selfManager.self()
    if not checks.isTurtle(self)
      throw exceptions.extension("nw:weighted-betweenness-centrality can only be called by a turtle")
    calcWeightedBetweennessCentrality(self, normalizeWeightVar(weightVar))

  # (Context) => Map[Number, Number]
  eigenvectorCentralityCalc = (ctx) ->
    turtles = ctx.turtles.toArray()

    if turtles.length is 0
      return new Map()

    inView = if ctx.isDirected then graphView(ctx, 'in') else graphView(ctx, 'both')

    # Weakly-connected components: follow every link in both directions, matching desktop's
    # BreadthFirstSearch(followOut = true, followIn = true).  We can't use graphView('both') here because it is
    # out-biased for directed edges (a directed u->v only lands in u's adjacency), which would split a weak component
    # and leave a node's in-neighbor outside its own component -- propagating NaN into the power iteration below.
    # -Jeremy B July 2026
    weakAdj = new Map()
    for t in turtles
      weakAdj.set(t.id, [])
    for link in ctx.links.toArray() when isValidLink(link) and isInTurtleset(link.end1, ctx) and isInTurtleset(link.end2, ctx)
      weakAdj.get(link.end1.id).push(link.end2)
      weakAdj.get(link.end2.id).push(link.end1)

    visited = new Set()
    components = []

    for t in turtles
      if not visited.has(t.id)
        component = []
        queue = [t]
        visited.add(t.id)
        while queue.length > 0
          current = queue.shift()
          component.push(current)
          for neighbor in weakAdj.get(current.id)
            if not visited.has(neighbor.id)
              visited.add(neighbor.id)
              queue.push(neighbor)
        components.push(component)

    result = new Map()

    for component in components
      if component.length is 0
        continue

      compIncoming = new Map()
      for t in component
        compIncoming.set(t.id, [])

      hasEdges = false
      for t in component
        for {turtle: neighbor} in (inView.adj.get(t.id) ? [])
          compIncoming.get(t.id).push(neighbor)
          hasEdges = true

      if not hasEdges
        for t in component
          result.set(t.id, 1)
        continue

      x = new Map()
      for t in component
        # Initialize with in-degrees (as per desktop NW extension)
        x.set(t.id, compIncoming.get(t.id).length)

      # Run exactly 100 iterations (as per desktop NW extension)
      for iter in [0...100]
        y = new Map()
        for t in component
          tId = t.id
          sum = x.get(tId)
          for neighbor in compIncoming.get(tId)
            sum += x.get(neighbor.id)
          y.set(tId, sum)

        maxVal = 0
        for t in component
          val = y.get(t.id)
          if val > maxVal
            maxVal = val

        if maxVal is 0
          maxVal = 1  # Avoid division by zero

        for t in component
          y.set(t.id, y.get(t.id) / maxVal)

        x = y

      for t in component
        result.set(t.id, x.get(t.id))

    result

  # (Turtle) => Number
  calcEigenvectorCentrality = (turtle) ->
    ctx = getCurrentContext()

    if not isInTurtleset(turtle, ctx)
      throw exceptions.extension("#{turtle.toString().replace(/[()]/g, '')} is not a member of the current graph context.")

    centrality = memoEigenvector(ctx)
    centrality.get(turtle.id) ? 0

  # () => Number
  eigenvectorCentrality = ->
    self = workspace.world.selfManager.self()
    if not checks.isTurtle(self)
      throw exceptions.extension("nw:eigenvector-centrality can only be called by a turtle")
    calcEigenvectorCentrality(self)

  # Mirrors desktop's JUNG PageRank(graph, alpha = 0.15): each vertex's score flows from its *predecessors* along
  # uniform 1/out-degree edge weights, mixed with a uniform prior via alpha, and the mass sitting on dangling nodes
  # (no out-edges) is redistributed each step so the total stays 1.  Convergence follows JUNG's AbstractIterativeScorer
  # (sum of absolute per-vertex deltas below `tolerance`, capped at `maxIters`).  -Jeremy B July 2026
  # (Context) => Map[Number, Number]
  pageRankCalc = (ctx) ->
    turtles = ctx.turtles.toArray()
    n = turtles.length

    if n is 0
      return new Map()

    alpha     = 0.15  # JUNG reset (teleport) probability; damping = 1 - alpha
    prior     = 1 / n # uniform vertex prior
    tolerance = 1e-9  # iterate to the fixed point; desktop's JUNG result matches full convergence at our precision
    maxIters  = 100   # JUNG AbstractIterativeScorer iteration cap (ample for these graph sizes to converge)

    # Desktop's nw:page-rank always scores over the *undirected* graph, prim.jung.PageRank uses `asUndirectedJungGraph`
    # regardless of the context's directedness.  So treat every link as an undirected edge (weight 1 / degree(neighbor))
    # here too.  A node's inflow comes from all its neighbors (with multiplicity), and isolated nodes (degree 0) are the
    # "dangling" nodes whose potential JUNG redistributes each step.
    # -Jeremy B July 2026
    neighbors = new Map()
    degree    = new Map()
    for t in turtles
      neighbors.set(t.id, [])
      degree.set(t.id, 0)
    for link in ctx.links.toArray() when isValidLink(link) and isInTurtleset(link.end1, ctx) and isInTurtleset(link.end2, ctx)
      neighbors.get(link.end1.id).push(link.end2.id)
      neighbors.get(link.end2.id).push(link.end1.id)
      degree.set(link.end1.id, degree.get(link.end1.id) + 1)
      degree.set(link.end2.id, degree.get(link.end2.id) + 1)

    scores = new Map()
    for t in turtles
      scores.set(t.id, prior)

    for iter in [0...maxIters]
      # Collect the potential on dangling nodes (degree 0); it would otherwise leak out of the system.
      disappearing = 0
      for t in turtles
        if degree.get(t.id) is 0
          disappearing += scores.get(t.id)

      newScores = new Map()
      for t in turtles
        input = 0
        for nbrId in neighbors.get(t.id)
          input += scores.get(nbrId) / degree.get(nbrId)
        newScores.set(t.id, input * (1 - alpha) + prior * alpha + (1 - alpha) * disappearing * prior)

      maxDelta = 0
      for t in turtles
        d = Math.abs(newScores.get(t.id) - scores.get(t.id))
        maxDelta = d if d > maxDelta
      scores = newScores

      break if maxDelta < tolerance

    scores

  # (Turtle) => Number
  calcPageRank = (turtle) ->
    ctx = getCurrentContext()

    if not isInTurtleset(turtle, ctx)
      throw exceptions.extension("#{turtle.toString().replace(/[()]/g, '')} is not a member of the current graph context.")

    pr = memoPageRank(ctx)
    pr.get(turtle.id) ? 0

  # () => Number
  pageRank = ->
    self = workspace.world.selfManager.self()
    if not checks.isTurtle(self)
      throw exceptions.extension("nw:page-rank can only be called by a turtle")
    calcPageRank(self)

  # (Turtle) => Number
  calcClusteringCoefficient = (turtle) ->
    ctx = getCurrentContext()

    if not isInTurtleset(turtle, ctx)
      throw exceptions.extension("#{turtle.toString().replace(/[()]/g, '')} is not a member of the current graph context.")

    links = ctx.links.toArray()

    if ctx.isDirected
      outNeighbors = []
      for link in links
        if not isValidLink(link)
          continue
        if link.isDirected
          if link.end1 is turtle and isAliveTurtle(link.end2) and isInTurtleset(link.end2, ctx)
            outNeighbors.push(link.end2)
        else
          if link.end1 is turtle and isAliveTurtle(link.end2) and isInTurtleset(link.end2, ctx)
            outNeighbors.push(link.end2)
          else if link.end2 is turtle and isAliveTurtle(link.end1) and isInTurtleset(link.end1, ctx)
            outNeighbors.push(link.end1)

      k = outNeighbors.length
      if k < 2
        return 0

      edgeCount = 0
      neighborSet = new Set(outNeighbors.map((n) -> n.id))

      for n in outNeighbors
        for link in links
          if not isValidLink(link)
            continue
          if link.isDirected
            if link.end1 is n and neighborSet.has(link.end2.id)
              edgeCount++
          else
            if (link.end1 is n and neighborSet.has(link.end2.id)) or
               (link.end2 is n and neighborSet.has(link.end1.id))
              edgeCount++

      possible = k * (k - 1)
      if possible is 0
        return 0

      edgeCount / possible

    else
      neighbors = []
      for link in links
        if not isValidLink(link)
          continue
        if not link.isDirected
          if link.end1 is turtle and isAliveTurtle(link.end2) and isInTurtleset(link.end2, ctx)
            neighbors.push(link.end2)
          else if link.end2 is turtle and isAliveTurtle(link.end1) and isInTurtleset(link.end1, ctx)
            neighbors.push(link.end1)

      k = neighbors.length
      if k < 2
        return 0

      triangles = 0
      for i in [0...k]
        for j in [(i + 1)...k]
          ni = neighbors[i]
          nj = neighbors[j]
          for link in links
            if not isValidLink(link)
              continue
            if not link.isDirected
              if (link.end1 is ni and link.end2 is nj) or (link.end1 is nj and link.end2 is ni)
                triangles++
                break

      possible = k * (k - 1) / 2
      if possible is 0
        return 0

      triangles / possible

  # () => Number
  clusteringCoefficient = ->
    self = workspace.world.selfManager.self()
    if not checks.isTurtle(self)
      throw exceptions.extension("nw:clustering-coefficient can only be called by a turtle")
    calcClusteringCoefficient(self)

  # () => Array[TurtleSet]
  weakComponentClusters = ->
    ctx = getCurrentContext()
    turtles = ctx.turtles.toArray()

    if turtles.length is 0
      return []

    adjacency = new Map()
    for t in turtles
      adjacency.set(t.id, [])

    for link in ctx.links.toArray()
      if not isValidLink(link)
        continue
      end1 = link.end1
      end2 = link.end2
      if isInTurtleset(end1, ctx) and isInTurtleset(end2, ctx)
        adjacency.get(end1.id).push(end2)
        adjacency.get(end2.id).push(end1)

    visited = new Set()
    components = []

    for t in turtles
      if not visited.has(t.id)
        component = []
        queue = [t]
        visited.add(t.id)

        while queue.length > 0
          current = queue.shift()
          component.push(current)
          for neighbor in adjacency.get(current.id)
            if not visited.has(neighbor.id)
              visited.add(neighbor.id)
              queue.push(neighbor)

        components.push(component)

    result = []
    for component in components
      result.push(new TurtleSet(component, workspace.world))

    shuffleClusters(result)

  # (Array[TurtleSet] | TurtleSet) => Number
  modularity = (communitiesList) ->
    ctx = getCurrentContext()
    turtles = ctx.turtles.toArray()

    if turtles.length is 0
      return 0

    if not Array.isArray(communitiesList)
      if communitiesList.toArray?
        communitiesList = communitiesList.toArray()
      else
        return 0

    if communitiesList.length is 0
      return 0

    links = ctx.links.toArray()

    totalArcWeight = 0
    for link in links
      if not isValidLink(link)
        continue
      end1 = link.end1
      end2 = link.end2
      if isInTurtleset(end1, ctx) and isInTurtleset(end2, ctx)
        totalArcWeight += if link.isDirected then 1 else 2

    if totalArcWeight is 0
      return 0

    totalModularity = 0

    for community in communitiesList
      if community.toArray?
        members = community.toArray()
      else if Array.isArray(community)
        members = community
      else
        continue

      members = members.filter((t) -> isInTurtleset(t, ctx))

      if members.length is 0
        continue

      memberSet = new Set(members.map((t) -> t.id))

      internal = 0
      totalIn = 0
      totalOut = 0

      # Mirrors desktop `ClusteringMetrics.communityModularity`, which walks `outEdges(node)` (adding to `totalOut`, and
      # to `internal` when the far end is also a member) and `inEdges(node)` (adding to `totalIn`).  Desktop's graph
      # views put an undirected link in *both* `outEdges` and `inEdges` of *each* endpoint (`Graph.scala:67-68`), so an
      # undirected link incident to a member counts 1 toward `totalOut` and 1 toward `totalIn` -- for a boundary link
      # too, where only the one member endpoint contributes.  A directed link counts only from the end that owns it.
      # -Jeremy B July 2026
      for t in members
        for link in links
          if not isValidLink(link)
            continue
          isEnd1 = link.end1 is t
          isEnd2 = link.end2 is t
          if not (isEnd1 or isEnd2)
            continue
          other = if isEnd1 then link.end2 else link.end1
          if not isInTurtleset(other, ctx)
            continue
          if link.isDirected
            if isEnd1
              totalOut += 1
              if memberSet.has(other.id)
                internal += 1
            if isEnd2
              totalIn += 1
          else
            totalOut += 1
            totalIn  += 1
            if memberSet.has(other.id)
              internal += 1

      totalModularity += (internal - totalIn * totalOut / totalArcWeight) / totalArcWeight

    totalModularity

  # Unshuffled maximal cliques (Bron-Kerbosch with pivoting).  `maximalCliques` and `biggestMaximalCliques` both build
  # on this; each applies its own `shuffleClusters` (matching desktop's per-prim `toTurtleSets(..., rng)` shuffle) so
  # the RNG draws line up.  -Jeremy B July 2026
  # () => Array[TurtleSet]
  computeMaximalCliques = ->
    ctx = getCurrentContext()

    if ctx.isDirected
      throw exceptions.extension("Current graph must be undirected")

    turtles = ctx.turtles.toArray()

    if turtles.length is 0
      return []

    if turtles.length is 1
      return [new TurtleSet(turtles, workspace.world)]

    adjacency = new Map()
    for t in turtles
      adjacency.set(t.id, new Set())

    for link in ctx.links.toArray()
      if not isValidLink(link)
        continue
      if not link.isDirected
        end1 = link.end1
        end2 = link.end2
        if isInTurtleset(end1, ctx) and isInTurtleset(end2, ctx)
          adjacency.get(end1.id).add(end2)
          adjacency.get(end2.id).add(end1)

    hasEdges = false
    for t in turtles
      if adjacency.get(t.id).size > 0
        hasEdges = true
        break

    if not hasEdges
      result = []
      for t in turtles
        result.push(new TurtleSet([t], workspace.world))
      return result

    cliques = []

    getCliqueNeighbors = (node) ->
      neighborSet = adjacency.get(node.id)
      if not neighborSet?
        return []
      turtles.filter((n) -> neighborSet.has(n))

    bronKerbosch = (R, P, X) ->
      if P.length is 0 and X.length is 0
        if R.length > 0
          cliques.push(R.slice())
        return

      pivot = null
      maxCount = -1
      for u in P.concat(X)
        neighbors = getCliqueNeighbors(u)
        count = neighbors.filter((n) -> n in P).length
        if count > maxCount
          maxCount = count
          pivot = u

      if pivot?
        pivotNeighborSet = new Set(getCliqueNeighbors(pivot).map((n) -> n.id))
        Pcopy = P.slice()
        for v in Pcopy
          if pivotNeighborSet.has(v.id)
            continue
          vNeighborSet = new Set(getCliqueNeighbors(v).map((n) -> n.id))
          bronKerbosch(
            R.concat([v]),
            P.filter((n) -> vNeighborSet.has(n.id)),
            X.filter((n) -> vNeighborSet.has(n.id))
          )
          P = P.filter((n) -> n isnt v)
          X.push(v)
      else
        Pcopy = P.slice()
        for v in Pcopy
          vNeighborSet = new Set(getCliqueNeighbors(v).map((n) -> n.id))
          bronKerbosch(
            R.concat([v]),
            P.filter((n) -> vNeighborSet.has(n.id)),
            X.filter((n) -> vNeighborSet.has(n.id))
          )
          P = P.filter((n) -> n isnt v)
          X.push(v)

    bronKerbosch([], turtles, [])

    result = []
    for clique in cliques
      result.push(new TurtleSet(clique, workspace.world))
    result

  # () => Array[TurtleSet]
  maximalCliques = ->
    shuffleClusters(computeMaximalCliques())

  # () => Array[TurtleSet]
  biggestMaximalCliques = ->
    cliques = computeMaximalCliques()

    if cliques.length is 0
      return []

    maxSize = 0
    for c in cliques
      size = c.toArray().length
      if size > maxSize
        maxSize = size

    biggest = cliques.filter((c) -> c.toArray().length is maxSize)
    shuffleClusters(biggest)

  # () => Array[TurtleSet]
  louvainCommunities = ->
    ctx = getCurrentContext()
    turtles = ctx.turtles.toArray()

    if turtles.length is 0
      return []

    if turtles.length is 1
      return [new TurtleSet(turtles, workspace.world)]

    links = ctx.links.toArray()

    totalArcWeight = 0
    outAdj = new Map()
    inAdj = new Map()
    for t in turtles
      outAdj.set(t.id, new Map())
      inAdj.set(t.id, new Map())

    for link in links
      if not isValidLink(link) then continue
      end1 = link.end1
      end2 = link.end2
      if not isInTurtleset(end1, ctx) or not isInTurtleset(end2, ctx) then continue
      if link.isDirected
        totalArcWeight += 1
        w = outAdj.get(end1.id).get(end2.id) ? 0
        outAdj.get(end1.id).set(end2.id, w + 1)
        iw = inAdj.get(end2.id).get(end1.id) ? 0
        inAdj.get(end2.id).set(end1.id, iw + 1)
      else
        totalArcWeight += 2
        w12 = outAdj.get(end1.id).get(end2.id) ? 0
        outAdj.get(end1.id).set(end2.id, w12 + 1)
        w21 = outAdj.get(end2.id).get(end1.id) ? 0
        outAdj.get(end2.id).set(end1.id, w21 + 1)
        iw12 = inAdj.get(end1.id).get(end2.id) ? 0
        inAdj.get(end1.id).set(end2.id, iw12 + 1)
        iw21 = inAdj.get(end2.id).get(end1.id) ? 0
        inAdj.get(end2.id).set(end1.id, iw21 + 1)

    if totalArcWeight is 0
      return (new TurtleSet([t], workspace.world) for t in turtles)

    rng = workspace.world.rng

    runPhase1 = (nodeIds, nodeOut, nodeIn) ->
      communityOf = new Map()
      for id, i in nodeIds
        communityOf.set(id, i)
      n = nodeIds.length

      calcMetrics = ->
        internal = new Array(n).fill(0)
        totIn = new Array(n).fill(0)
        totOut = new Array(n).fill(0)
        for id in nodeIds
          com = communityOf.get(id)
          for [nbrId, w] from nodeOut.get(id)
            nbrCom = communityOf.get(nbrId)
            if com is nbrCom then internal[com] += w
            totOut[com] += w
            totIn[nbrCom] += w
        {internal, totIn, totOut}

      modC = (com, int, tin, tout) ->
        (int[com] - tin[com] * tout[com] / totalArcWeight) / totalArcWeight

      # Self-loops (nbrId is id) add to both intOld and intNew since they travel with the node.
      arcMetrics = (id, oldCom, newCom) ->
        outDeg = 0; inDeg = 0; intOld = 0; intNew = 0
        for [nbrId, w] from nodeOut.get(id)
          nbrCom = communityOf.get(nbrId)
          outDeg += w
          if nbrId is id
            intOld += w; intNew += w
          else if nbrCom is oldCom then intOld += w
          else if nbrCom is newCom then intNew += w
        for [nbrId, w] from nodeIn.get(id)
          nbrCom = communityOf.get(nbrId)
          inDeg += w
          if nbrId is id
            intOld += w; intNew += w
          else if nbrCom is oldCom then intOld += w
          else if nbrCom is newCom then intNew += w
        {outDeg, inDeg, intOld, intNew}

      moveDelta = (id, newCom, m) ->
        oldCom = communityOf.get(id)
        if oldCom is newCom then return 0
        {outDeg, inDeg, intOld, intNew} = arcMetrics(id, oldCom, newCom)
        ni = m.internal.slice(); nti = m.totIn.slice(); nto = m.totOut.slice()
        nto[oldCom] -= outDeg; nto[newCom] += outDeg
        nti[oldCom] -= inDeg; nti[newCom] += inDeg
        ni[oldCom] -= intOld; ni[newCom] += intNew
        (modC(oldCom, ni, nti, nto) - modC(oldCom, m.internal, m.totIn, m.totOut)) +
        (modC(newCom, ni, nti, nto) - modC(newCom, m.internal, m.totIn, m.totOut))

      m = calcMetrics()
      changed = true
      iters = 100
      while changed and iters > 0
        changed = false
        iters--
        order = nodeIds.slice()
        for i in [order.length - 1 .. 1] by -1
          j = rng.nextInt(i + 1)
          [order[i], order[j]] = [order[j], order[i]]
        for id in order
          curCom = communityOf.get(id)
          nbrComs = new Set()
          for [nbrId] from nodeOut.get(id)
            if nbrId isnt id
              nc = communityOf.get(nbrId)
              if nc isnt curCom then nbrComs.add(nc)
          if nbrComs.size is 0 then continue
          nbrArr = Array.from(nbrComs)
          for i in [nbrArr.length - 1 .. 1] by -1
            j = rng.nextInt(i + 1)
            [nbrArr[i], nbrArr[j]] = [nbrArr[j], nbrArr[i]]
          best = curCom; bestD = 0
          for nc in nbrArr
            d = moveDelta(id, nc, m)
            if d > bestD then bestD = d; best = nc
          if bestD > 0
            {outDeg, inDeg, intOld, intNew} = arcMetrics(id, curCom, best)
            m.totOut[curCom] -= outDeg; m.totOut[best] += outDeg
            m.totIn[curCom] -= inDeg; m.totIn[best] += inDeg
            m.internal[curCom] -= intOld; m.internal[best] += intNew
            communityOf.set(id, best)
            changed = true
      communityOf

    buildMeta = (nodeIds, nodeOut, communityOf) ->
      metaComs = Array.from(new Set(communityOf.values())).sort((a, b) -> a - b)
      metaOut = new Map(); metaIn = new Map()
      for c in metaComs
        metaOut.set(c, new Map()); metaIn.set(c, new Map())
      for id in nodeIds
        src = communityOf.get(id)
        for [nbrId, w] from nodeOut.get(id)
          dst = communityOf.get(nbrId)
          metaOut.get(src).set(dst, (metaOut.get(src).get(dst) ? 0) + w)
          metaIn.get(dst).set(src, (metaIn.get(dst).get(src) ? 0) + w)
      {metaComs, metaOut, metaIn}

    cluster = (nodeIds, nodeOut, nodeIn) ->
      communityOf = runPhase1(nodeIds, nodeOut, nodeIn)
      {metaComs, metaOut, metaIn} = buildMeta(nodeIds, nodeOut, communityOf)
      if metaComs.length >= nodeIds.length then return communityOf
      metaComm = cluster(metaComs, metaOut, metaIn)
      result = new Map()
      for id in nodeIds
        result.set(id, metaComm.get(communityOf.get(id)))
      result

    turtleIds = (t.id for t in turtles)
    finalComm = cluster(turtleIds, outAdj, inAdj)

    groups = new Map()
    for t in turtles
      c = finalComm.get(t.id)
      if not groups.has(c) then groups.set(c, [])
      groups.get(c).push(t)

    result = []
    for [c, members] from groups
      result.push(new TurtleSet(members, workspace.world))
    result

  # (Context, Any) => Map[Number, Number]
  memoBetweenness = makeGraphMemo(fingerprint, betweennessCentralityCalc)
  # (Context) => Map[Number, Number]
  memoEigenvector = makeGraphMemo(fingerprint, eigenvectorCentralityCalc)
  # (Context) => Map[Number, Number]
  memoPageRank    = makeGraphMemo(fingerprint, pageRankCalc)

  # () => Array[TurtleSet]
  bicomponentClusters = ->
    ctx     = getCurrentContext()
    turtles = ctx.turtles.toArray()
    return [] if turtles.length is 0

    turtleById = new Map()
    adjacency  = new Map()
    for t in turtles
      turtleById.set(t.id, t)
      adjacency.set(t.id, [])
    edgeId = 0
    for l in ctx.links.toArray() when isValidLink(l) and isInTurtleset(l.end1, ctx) and isInTurtleset(l.end2, ctx)
      id = edgeId
      edgeId += 1
      adjacency.get(l.end1.id).push({ other: l.end2, edge: id })
      adjacency.get(l.end2.id).push({ other: l.end1, edge: id })

    disc       = new Map()
    low        = new Map()
    counter    = 0
    edgeStack  = []
    components = []

    addComponent = (edges) ->
      verts = new Set()
      for e in edges
        verts.add(e.u)
        verts.add(e.v)
      components.push(new TurtleSet((turtleById.get(id) for id from verts), workspace.world))
      return

    dfs = (u, parentEdge) ->
      disc.set(u.id, counter)
      low.set(u.id, counter)
      counter += 1
      for { other: v, edge: eid } in adjacency.get(u.id) when eid isnt parentEdge
        if not disc.has(v.id)
          edgeStack.push({ u: u.id, v: v.id, eid })
          dfs(v, eid)
          low.set(u.id, Math.min(low.get(u.id), low.get(v.id)))
          if low.get(v.id) >= disc.get(u.id)
            block = []
            loop
              e = edgeStack.pop()
              block.push(e)
              break if e.eid is eid
            addComponent(block)
        else if disc.get(v.id) < disc.get(u.id)
          edgeStack.push({ u: u.id, v: v.id, eid })
          low.set(u.id, Math.min(low.get(u.id), disc.get(v.id)))
      return

    for t in turtles when not disc.has(t.id)
      dfs(t, -1)
      components.push(new TurtleSet([t], workspace.world)) if adjacency.get(t.id).length is 0

    shuffleClusters(components)

  {
    "BETWEENNESS-CENTRALITY":        betweennessCentrality
  , "CLOSENESS-CENTRALITY":          closenessCentrality
  , "WEIGHTED-CLOSENESS-CENTRALITY": weightedClosenessCentrality
  , "EIGENVECTOR-CENTRALITY":        eigenvectorCentrality
  , "PAGE-RANK":                     pageRank
  , "CLUSTERING-COEFFICIENT":        clusteringCoefficient
  , "WEAK-COMPONENT-CLUSTERS":       weakComponentClusters
  , "BICOMPONENT-CLUSTERS":          bicomponentClusters
  , "LOUVAIN-COMMUNITIES":           louvainCommunities
  , "MODULARITY":                    modularity
  , "MAXIMAL-CLIQUES":               maximalCliques
  , "BIGGEST-MAXIMAL-CLIQUES":       biggestMaximalCliques
  }
