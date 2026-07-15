# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')

# Shared shapes used throughout the nw extension modules:
# type Context   = { turtles: TurtleSet, links: LinkSet, isDirected: Boolean }
# type Neighbor  = { turtle: Turtle, link: Link }
# type GraphView = { idSet: Set[Number], adj: Map[Number, Array[Neighbor]] }
# type Traversal = { distances: Map[Number, Number], parents: Map[Number, Array[{ parent: Turtle, link: Link }]] }

# (Turtle) => Boolean
isAliveTurtle = (turtle) ->
  turtle? and not turtle.isDead()

# (Link) => Boolean
isValidLink = (link) ->
  link? and not link.isDead() and isAliveTurtle(link.end1) and isAliveTurtle(link.end2)

# (LinkSet | null) => Boolean
determineDirectedness = (linkset) ->
  if not linkset?
    return false
  links = linkset.toArray()
  if links.length is 0
    return false
  # linkSet.isDirected fails for empty and mixed directed networks.
  # The only reliable way is to actually see if there are any directed links.
  for link in links
    if link.isDirected
      return true
  false

# Build a reusable view of the graph context for a given traversal mode: an id-membership Set plus adjacency lists (id
# -> [{turtle, link}]).  Traversals (bfs/dijkstra) build this once instead of re-scanning every link and doing a linear
# turtleset membership test on every neighbor, which turns a single traversal from O(V*E) into O(V+E).
#
# `mode` mirrors desktop's two neighbor functions, and an UNDIRECTED link is included by both of them (desktop
# `Graph.scala`: `outEdges = outLinks ++ undirLinks`, `inEdges = inLinks ++ undirLinks`) -- so mode only decides which
# way *directed* links are followed:
#   'out' -> desktop `outNeighbors`: directed links followed end1 -> end2, plus every undirected link, both ways.
#   'in'  -> desktop `inNeighbors`:  directed links followed end2 -> end1, plus every undirected link, both ways.
# There is deliberately no "follow every link in both directions" mode (desktop `allEdges` / BFS followOut+followIn);
# the one caller that needs it (weak components in `nw-metrics.coffee`) builds its own adjacency.  A mode named 'both'
# used to exist here, but it was just an alias for 'out' -- an invitation to assume it meant `allEdges`.
# -Jeremy B July 2026
# (Context, String) => GraphView
graphView = (ctx, mode) ->
  idSet = new Set()
  adj   = new Map()
  for t in ctx.turtles.toArray()
    idSet.add(t.id)
    adj.set(t.id, [])
  wantIn = (mode is 'in')
  for link in ctx.links.toArray() when isValidLink(link) and idSet.has(link.end1.id) and idSet.has(link.end2.id)
    end1 = link.end1
    end2 = link.end2
    if not link.isDirected
      adj.get(end1.id).push({ turtle: end2, link })
      adj.get(end2.id).push({ turtle: end1, link })
    else if wantIn
      adj.get(end2.id).push({ turtle: end1, link })
    else
      adj.get(end1.id).push({ turtle: end2, link })
  { idSet, adj }

# (Turtle, Context) => Boolean
isInTurtleset = (turtle, ctx) ->
  if not (turtle? and isAliveTurtle(turtle))
    return false
  turtles = ctx.turtles.toArray()
  turtle in turtles

# (Turtle, Context, String, GraphView) => Traversal
bfs = (startTurtle, ctx, mode, view = graphView(ctx, mode)) ->
  distances = new Map()
  parents = new Map()
  queue = []

  distances.set(startTurtle.id, 0)
  parents.set(startTurtle.id, [])
  queue.push(startTurtle)

  while queue.length > 0
    current = queue.shift()
    currentDist = distances.get(current.id)

    for {turtle: neighbor, link} in (view.adj.get(current.id) ? [])
      if not distances.has(neighbor.id)
        distances.set(neighbor.id, currentDist + 1)
        parents.set(neighbor.id, [{parent: current, link: link}])
        queue.push(neighbor)
      else if currentDist + 1 is distances.get(neighbor.id)
        parents.get(neighbor.id).push({parent: current, link: link})

  {distances, parents}

# In-neighbor adjacency, matching desktop `GraphContext.inEdges(t) = inLinks(t) ++ undirLinks(t)` in link-id
# order (directed in-edges first, then undirected, each in link-id order).  Desktop's PathFinder builds its
# successor cache from a *reverse* BFS that follows `inNeighbors`, so the path prims need the in-neighbor
# order to line up bit-for-bit.  -Jeremy B July 2026
# (Context, String) => { idSet: Set, adj: Map[Number, Array[Neighbor]] }
reverseGraphView = (ctx) ->
  idSet = new Set()
  adj   = new Map()
  for t in ctx.turtles.toArray()
    idSet.add(t.id)
    adj.set(t.id, [])
  links = ctx.links.toArray()
  valid = (link) -> isValidLink(link) and idSet.has(link.end1.id) and idSet.has(link.end2.id)
  for link in links when valid(link) and link.isDirected
    adj.get(link.end2.id).push({ turtle: link.end1, link })
  for link in links when valid(link) and not link.isDirected
    adj.get(link.end1.id).push({ turtle: link.end2, link })
    adj.get(link.end2.id).push({ turtle: link.end1, link })
  { idSet, adj }

# Reverse BFS from `dest` following in-neighbors, building `successors[node]` = the list of next-hops from
# `node` toward `dest` on a shortest path.  This replicates desktop `PathFinder.cachingBFS(reverse = true)`
# exactly: each frontier layer is built by *prepending* freshly discovered neighbors (`layer = neighbor ::
# layer`) and iterated in that stored order the next round, and `successors[neighbor]` is *appended* with
# `node` whenever `neighbor` is an in-neighbor of `node` on a shortest path.  Matching both the layer
# prepend/iterate order and the in-neighbor (link-id) order is what makes `rng.nextInt(len)` pick the same
# hop as desktop's `cachedPath`.  -Jeremy B July 2026
# (Turtle, Context) => { distances: Map[Number, Number], successors: Map[Number, Array[Turtle]] }
bfsSuccessors = (dest, ctx) ->
  view      = reverseGraphView(ctx)
  distances = new Map()
  successors = new Map()
  distances.set(dest.id, 0)
  frontier = [dest]
  while frontier.length > 0
    nextLayer = []
    for node in frontier
      nodeDist = distances.get(node.id)
      for { turtle: neighbor } in (view.adj.get(node.id) ? [])
        if not distances.has(neighbor.id)
          distances.set(neighbor.id, nodeDist + 1)
          nextLayer.unshift(neighbor)
        if distances.get(neighbor.id) is nodeDist + 1
          succs = successors.get(neighbor.id)
          if not succs?
            succs = []
            successors.set(neighbor.id, succs)
          succs.push(node)
    frontier = nextLayer
  { distances, successors }

# Forward walk from `source` toward `target` through a successor cache (`successors[node]` = the
# next-hops from `node` toward `target` on a shortest path), drawing `rng.nextInt(len)` at each hop.
# This is the shared reconstruction step for every path prim: it replicates desktop
# `PathFinder.cachedPath`'s recursive `availableSuccessors(rng.nextInt(availableSuccessors.length))`
# (which tries the successor cache first, then falls back to the predecessor cache -- but in the
# fixed-destination usage pattern every prim is docked under, only the successor cache is ever built
# and consulted).  An empty successor list at the source (unreachable) returns `false` with no RNG
# drawn, matching desktop's `None`.  -Jeremy B July 2026
# (Map[Number, Array[Turtle]], Turtle, Turtle, RNG) => Array[Turtle] | Boolean
walkSuccessors = (successors, source, target, rng) ->
  succList = successors.get(source.id)
  if not succList? or succList.length is 0
    return false
  turtles = [source]
  current = source
  while current isnt target
    list = successors.get(current.id)
    if not list? or list.length is 0
      return false
    current = list[rng.nextInt(list.length)]
    turtles.push(current)
  turtles

# Reverse Dijkstra from `dest` following in-edges, building `successors[node]` = next-hops toward `dest`
# on a shortest *weighted* path.  Replicates desktop `PathFinder.cachingDijkstra(reverse = true)`: each
# node is finalized once (the first time it is popped at its minimum distance, at which point its
# in-edges are relaxed), and for *every* pop at that minimum distance the in-neighbor it was reached
# through is appended to `successors[node]` -- so all shortest-path predecessors appear (ties).  The
# in-neighbor order matches desktop `inEdges = inLinks ++ undirLinks` (link-id order) because we reuse
# `reverseGraphView`.  Dijkstra itself draws no RNG; the RNG draws happen in `walkSuccessors`.
# -Jeremy B July 2026
# (Turtle, Context, String) => { distances: Map[Number, Number], successors: Map[Number, Array[Turtle]] }
dijkstraSuccessors = (dest, ctx, weightVar) ->
  view       = reverseGraphView(ctx)
  dists      = new Map()
  successors = new Map()
  heap       = new BinaryHeap((e) -> e.dist)
  heap.push({ turtle: dest, dist: 0, pred: dest })
  while heap.size() > 0
    { turtle, dist, pred } = heap.pop()
    if dists.has(turtle.id) and dist > dists.get(turtle.id)
      continue
    if not dists.has(turtle.id)
      dists.set(turtle.id, dist)
      for { turtle: nb, link } in (view.adj.get(turtle.id) ? [])
        if not dists.has(nb.id)
          heap.push({ turtle: nb, dist: dist + getLinkWeight(link, weightVar), pred: turtle })
    if turtle isnt pred
      succs = successors.get(turtle.id)
      if not succs?
        succs = []
        successors.set(turtle.id, succs)
      succs.push(pred)
  { distances: dists, successors }

# (Link, String) => Number
getLinkWeight = (link, varName) ->
  value = link.getVariable(varName)
  if typeof value isnt 'number'
    throw exceptions.extension("Link variable #{varName} must be numeric")
  value

class BinaryHeap
  # ((T) => Number) => BinaryHeap[T]
  constructor: (@scoreFn) ->
    @content = []

  # (T) => Unit
  push: (element) ->
    @content.push(element)
    @_siftUp(@content.length - 1)

  # () => T
  pop: ->
    result = @content[0]
    end = @content.pop()
    if @content.length > 0
      @content[0] = end
      @_siftDown(0)
    result

  # () => Number
  size: ->
    @content.length

  _siftUp: (n) ->
    element = @content[n]
    while n > 0
      parentN = Math.floor((n - 1) / 2)
      parent = @content[parentN]
      if @scoreFn(element) < @scoreFn(parent)
        @content[parentN] = element
        @content[n] = parent
        n = parentN
      else
        break

  _siftDown: (n) ->
    length = @content.length
    element = @content[n]
    loop
      child2N = (n + 1) * 2
      child1N = child2N - 1
      swap = null

      if child1N < length
        child1 = @content[child1N]
        if @scoreFn(child1) < @scoreFn(element)
          swap = child1N

      if child2N < length
        child2 = @content[child2N]
        if @scoreFn(child2) < @scoreFn(if swap then @content[swap] else element)
          swap = child2N

      if swap?
        @content[n] = @content[swap]
        @content[swap] = element
        n = swap
      else
        break

# (Turtle, Context, String, String, GraphView) => Traversal
dijkstra = (startTurtle, ctx, mode, weightVar, view = graphView(ctx, mode)) ->
  distances = new Map()
  parents = new Map()
  heap = new BinaryHeap((node) -> node.dist)

  distances.set(startTurtle.id, 0)
  parents.set(startTurtle.id, [])
  heap.push({turtle: startTurtle, dist: 0})

  while heap.size() > 0
    node = heap.pop()
    current = node.turtle
    currentDist = node.dist

    if currentDist > distances.get(current.id)
      continue

    for {turtle: neighbor, link} in (view.adj.get(current.id) ? [])
      weight = getLinkWeight(link, weightVar)

      # Dijkstra assumes non-negative weights, and the relaxation below is decrease-key: it re-pushes a neighbor every
      # time it finds a shorter distance.  A negative weight on an *undirected* link is therefore a negative cycle --
      # cross it back and forth and the distance falls without bound -- and the loop would never end, which in the
      # browser is an unrecoverable frozen tab.  We reject it here, in the only traversal that can spin, rather than in
      # `getLinkWeight`: `dijkstraSuccessors` finalizes each node on first pop (like desktop), so the weighted *path*
      # prims cannot hang and stay desktop-compatible.  A zero weight is fine -- it can never improve a distance, so it
      # never re-pushes.
      #
      # Desktop does not check at all; `cachingDijkstra` finalizes once and so reports a meaningless finite value
      # instead of hanging.  We are deliberately stricter, matching what `nw:weighted-distance-to`'s own docs already
      # require.  A language test proposing desktop do the same is filed in the NW-Extension repo's `tests.txt`.
      # -Jeremy B July 2026
      if weight < 0
        throw exceptions.extension("Weights must be non-negative.")

      newDist = currentDist + weight

      if not distances.has(neighbor.id)
        distances.set(neighbor.id, newDist)
        parents.set(neighbor.id, [{parent: current, link: link}])
        heap.push({turtle: neighbor, dist: newDist})
      else if newDist < distances.get(neighbor.id)
        distances.set(neighbor.id, newDist)
        parents.set(neighbor.id, [{parent: current, link: link}])
        heap.push({turtle: neighbor, dist: newDist})
      else if newDist is distances.get(neighbor.id)
        parents.get(neighbor.id).push({parent: current, link: link})

  {distances, parents}

# (Any) => String
normalizeWeightVar = (weightVar) ->
  if typeof weightVar is 'string'
    weightVar.toLowerCase()
  else
    String(weightVar).toLowerCase()

# (AgentSet) => String
getBreedName = (agentSet) ->
  if agentSet.getSpecialName?
    agentSet.getSpecialName() ? "LINKS"
  else
    "LINKS"

module.exports = {
  isAliveTurtle, isValidLink, determineDirectedness, isInTurtleset, bfs,
  getLinkWeight, BinaryHeap, dijkstra, normalizeWeightVar, getBreedName, graphView, bfsSuccessors,
  walkSuccessors, dijkstraSuccessors
}
