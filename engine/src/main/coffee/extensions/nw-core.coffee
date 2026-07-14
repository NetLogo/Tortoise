# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')

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
# -Jeremy B July 2026
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

getNeighbors = (turtle, ctx, mode) ->
  neighbors = []
  links = ctx.links.toArray()

  for link in links
    if not isValidLink(link)
      continue

    isDirected = link.isDirected
    end1       = link.end1
    end2       = link.end2

    if not isDirected
      if end1 is turtle and isAliveTurtle(end2)
        neighbors.push({turtle: end2, link: link})
      else if end2 is turtle and isAliveTurtle(end1)
        neighbors.push({turtle: end1, link: link})
    else if mode is 'out' or mode is 'both'
      if end1 is turtle and isAliveTurtle(end2)
        neighbors.push({turtle: end2, link: link})
    else if mode is 'in'
      if end2 is turtle and isAliveTurtle(end1)
        neighbors.push({turtle: end1, link: link})

  neighbors

isInTurtleset = (turtle, ctx) ->
  if not (turtle? and isAliveTurtle(turtle))
    return false
  turtles = ctx.turtles.toArray()
  turtle in turtles

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

getLinkWeight = (link, varName) ->
  value = link.getVariable(varName)
  if typeof value isnt 'number'
    throw exceptions.extension("Link variable #{varName} must be numeric")
  value

class BinaryHeap
  constructor: (@scoreFn) ->
    @content = []

  push: (element) ->
    @content.push(element)
    @_siftUp(@content.length - 1)

  pop: ->
    result = @content[0]
    end = @content.pop()
    if @content.length > 0
      @content[0] = end
      @_siftDown(0)
    result

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

normalizeWeightVar = (weightVar) ->
  if typeof weightVar is 'string'
    weightVar.toLowerCase()
  else
    String(weightVar).toLowerCase()

getBreedName = (agentSet) ->
  if agentSet.getSpecialName?
    agentSet.getSpecialName() ? "LINKS"
  else
    "LINKS"

module.exports = {
  isAliveTurtle, isValidLink, determineDirectedness, getNeighbors, isInTurtleset, bfs,
  getLinkWeight, BinaryHeap, dijkstra, normalizeWeightVar, getBreedName, graphView
}
