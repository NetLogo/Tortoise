# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')
{ checks } = require('../engine/core/typechecker')
{ Setters: TurtleSetters } = require('../engine/core/turtle/turtlevariables')

notImplemented = (name) ->
  -> throw exceptions.extension("nw:#{name} is not yet implemented")

# The file-based import/export primitives cannot work in NetLogo Web, which has no user-visible file system.  Point
# users at the string-based counterparts (nw:save-to-string / nw:load-from-string) that move the same data through an
# in-memory string instead of a file.  -Jeremy B
notSupportedOnWeb = (name, replacement) ->
  -> throw exceptions.extension("nw:#{name} is not supported by NetLogo Web. Use nw:#{replacement} instead.")

module.exports = {

  init: (workspace) ->

    TurtleSet = require('../engine/core/turtleset')
    LinkSet   = require('../engine/core/linkset')

    # type Context = {
    #   turtles: TurtleSet
    #   links: LinkSet
    #   isDirected: Boolean
    # }
    contextStack = []
    currentContext = null

    # (Turtle) => Boolean
    isAliveTurtle = (turtle) ->
      turtle? and not turtle.isDead()

    # (Link) => Boolean
    isValidLink = (link) ->
      link? and not link.isDead() and isAliveTurtle(link.end1) and isAliveTurtle(link.end2)

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

    getCurrentContext = ->
      if currentContext?
        currentContext
      else
        allLinks = workspace.world.links()
        {
          turtles:    workspace.world.turtles()
          links:      allLinks
          isDirected: determineDirectedness(allLinks)
        }

    clearContext = ->
      currentContext = null
      contextStack = []
      return

    setContext = (turtleset, linkset) ->
      if not checks.isTurtleSet(turtleset)
        throw exceptions.extension("First argument to nw:set-context must be a turtle agentset")

      if not checks.isLinkSet(linkset)
        throw exceptions.extension("Second argument to nw:set-context must be a link agentset")

      currentContext = {
        turtles:    turtleset
        links:      linkset
        isDirected: determineDirectedness(linkset)
      }
      return

    getContext = ->
      ctx = getCurrentContext()
      [ctx.turtles, ctx.links]

    withContext = (turtleset, linkset, commandThunk) ->
      previousContext = currentContext
      setContext(turtleset, linkset)
      contextStack.push(previousContext)

      try
        result = commandThunk()
      finally
        contextStack.pop()
        currentContext = previousContext

      result

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

    bfs = (startTurtle, ctx, mode) ->
      distances = new Map()
      parents = new Map()
      queue = []

      distances.set(startTurtle.id, 0)
      parents.set(startTurtle.id, [])
      queue.push(startTurtle)

      while queue.length > 0
        current = queue.shift()
        currentDist = distances.get(current.id)

        for {turtle: neighbor, link} in getNeighbors(current, ctx, mode)
          if not isInTurtleset(neighbor, ctx)
            continue

          if not distances.has(neighbor.id)
            distances.set(neighbor.id, currentDist + 1)
            parents.set(neighbor.id, [{parent: current, link: link}])
            queue.push(neighbor)
          else if currentDist + 1 is distances.get(neighbor.id)
            parents.get(neighbor.id).push({parent: current, link: link})

      {distances, parents}

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

    turtlesInRadius = (radius) ->
      self = workspace.world.selfManager.self()
      if not checks.isTurtle(self)
        throw exceptions.extension("nw:turtles-in-radius can only be called by a turtle")
      new TurtleSet(turtlesInRadiusFrom(self, radius, 'both'), workspace.world)

    turtlesInOutRadius = (radius) ->
      self = workspace.world.selfManager.self()
      if not checks.isTurtle(self)
        throw exceptions.extension("nw:turtles-in-out-radius can only be called by a turtle")
      new TurtleSet(turtlesInRadiusFrom(self, radius, 'out'), workspace.world)

    turtlesInInRadius = (radius) ->
      self = workspace.world.selfManager.self()
      if not checks.isTurtle(self)
        throw exceptions.extension("nw:turtles-in-in-radius can only be called by a turtle")
      new TurtleSet(turtlesInRadiusFrom(self, radius, 'in'), workspace.world)

    turtlesInReverseRadius = (radius) ->
      self = workspace.world.selfManager.self()
      if not checks.isTurtle(self)
        throw exceptions.extension("nw:turtles-in-reverse-radius can only be called by a turtle")
      new TurtleSet(turtlesInRadiusFrom(self, radius, 'in'), workspace.world)

    distanceTo = (target) ->
      self = workspace.world.selfManager.self()
      if not checks.isTurtle(self)
        throw exceptions.extension("nw:distance-to can only be called by a turtle")
      if not checks.isTurtle(target)
        throw exceptions.extension("nw:distance-to requires a turtle as argument")
      calcDistanceTo(self, target)

    pathTo = (target) ->
      self = workspace.world.selfManager.self()
      if not checks.isTurtle(self)
        throw exceptions.extension("nw:path-to can only be called by a turtle")
      if not checks.isTurtle(target)
        throw exceptions.extension("nw:path-to requires a turtle as argument")
      calcPathTo(self, target)

    turtlesOnPathTo = (target) ->
      self = workspace.world.selfManager.self()
      if not checks.isTurtle(self)
        throw exceptions.extension("nw:turtles-on-path-to can only be called by a turtle")
      if not checks.isTurtle(target)
        throw exceptions.extension("nw:turtles-on-path-to requires a turtle as argument")
      calcTurtlesOnPathTo(self, target)

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

    getLinkWeight = (link, varName) ->
      value = link.getVariable(varName)
      if typeof value isnt 'number'
        throw exceptions.extension("Link variable #{varName} must be numeric")
      value

    dijkstra = (startTurtle, ctx, mode, weightVar) ->
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

        for {turtle: neighbor, link} in getNeighbors(current, ctx, mode)
          if not isInTurtleset(neighbor, ctx)
            continue

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

    normalizeWeightVar = (weightVar) ->
      if typeof weightVar is 'string'
        weightVar.toLowerCase()
      else
        String(weightVar).toLowerCase()

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

    weightedDistanceTo = (target, weightVar) ->
      self = workspace.world.selfManager.self()
      if not checks.isTurtle(self)
        throw exceptions.extension("nw:weighted-distance-to can only be called by a turtle")
      if not checks.isTurtle(target)
        throw exceptions.extension("nw:weighted-distance-to requires a turtle as argument")
      calcWeightedDistanceTo(self, target, normalizeWeightVar(weightVar))

    weightedPathTo = (target, weightVar) ->
      self = workspace.world.selfManager.self()
      if not checks.isTurtle(self)
        throw exceptions.extension("nw:weighted-path-to can only be called by a turtle")
      if not checks.isTurtle(target)
        throw exceptions.extension("nw:weighted-path-to requires a turtle as argument")
      calcWeightedPathTo(self, target, normalizeWeightVar(weightVar))

    turtlesOnWeightedPathTo = (target, weightVar) ->
      self = workspace.world.selfManager.self()
      if not checks.isTurtle(self)
        throw exceptions.extension("nw:turtles-on-weighted-path-to can only be called by a turtle")
      if not checks.isTurtle(target)
        throw exceptions.extension("nw:turtles-on-weighted-path-to requires a turtle as argument")
      calcTurtlesOnWeightedPathTo(self, target, normalizeWeightVar(weightVar))

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

    closenessCentrality = ->
      self = workspace.world.selfManager.self()
      if not checks.isTurtle(self)
        throw exceptions.extension("nw:closeness-centrality can only be called by a turtle")
      calcClosenessCentrality(self)

    weightedClosenessCentrality = (weightVar) ->
      self = workspace.world.selfManager.self()
      if not checks.isTurtle(self)
        throw exceptions.extension("nw:weighted-closeness-centrality can only be called by a turtle")
      calcWeightedClosenessCentrality(self, normalizeWeightVar(weightVar))

    betweennessCentralityCalc = (ctx, weightVar = null) ->
      turtles = ctx.turtles.toArray()

      if turtles.length is 0
        return new Map()

      centrality = new Map()
      for t in turtles
        centrality.set(t.id, 0)

      mode = if ctx.isDirected then 'out' else 'both'

      for s in turtles
        result = if weightVar then dijkstra(s, ctx, mode, weightVar) else bfs(s, ctx, mode)
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

    calcBetweennessCentrality = (turtle) ->
      ctx = getCurrentContext()

      if not isInTurtleset(turtle, ctx)
        throw exceptions.extension("#{turtle.toString().replace(/[()]/g, '')} is not a member of the current graph context.")

      centrality = betweennessCentralityCalc(ctx)
      centrality.get(turtle.id) ? 0

    calcWeightedBetweennessCentrality = (turtle, weightVar) ->
      ctx = getCurrentContext()

      if not isInTurtleset(turtle, ctx)
        throw exceptions.extension("#{turtle.toString().replace(/[()]/g, '')} is not a member of the current graph context.")

      centrality = betweennessCentralityCalc(ctx, normalizeWeightVar(weightVar))
      centrality.get(turtle.id) ? 0

    betweennessCentrality = ->
      self = workspace.world.selfManager.self()
      if not checks.isTurtle(self)
        throw exceptions.extension("nw:betweenness-centrality can only be called by a turtle")
      calcBetweennessCentrality(self)

    weightedBetweennessCentrality = (weightVar) ->
      self = workspace.world.selfManager.self()
      if not checks.isTurtle(self)
        throw exceptions.extension("nw:weighted-betweenness-centrality can only be called by a turtle")
      calcWeightedBetweennessCentrality(self, normalizeWeightVar(weightVar))

    eigenvectorCentralityCalc = (ctx) ->
      turtles = ctx.turtles.toArray()

      if turtles.length is 0
        return new Map()

      undirectedMode = 'both'

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
            for {turtle: neighbor} in getNeighbors(current, ctx, undirectedMode)
              if isInTurtleset(neighbor, ctx) and not visited.has(neighbor.id)
                visited.add(neighbor.id)
                queue.push(neighbor)
          components.push(component)

      result = new Map()

      for component in components
        if component.length is 0
          continue

        mode = if ctx.isDirected then 'in' else 'both'
        compIncoming = new Map()
        for t in component
          compIncoming.set(t.id, [])

        hasEdges = false
        for t in component
          for {turtle: neighbor} in getNeighbors(t, ctx, mode)
            if isInTurtleset(neighbor, ctx)
              compIncoming.get(t.id).push(neighbor)
              hasEdges = true

        if not hasEdges
          for t in component
            result.set(t.id, 1)
          continue

        x = new Map()
        for t in component
          # Initialize with in-degrees (as per NW extension)
          x.set(t.id, compIncoming.get(t.id).length)

        # Run exactly 100 iterations (as per NW extension)
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

    calcEigenvectorCentrality = (turtle) ->
      ctx = getCurrentContext()

      if not isInTurtleset(turtle, ctx)
        throw exceptions.extension("#{turtle.toString().replace(/[()]/g, '')} is not a member of the current graph context.")

      centrality = eigenvectorCentralityCalc(ctx)
      centrality.get(turtle.id) ? 0

    eigenvectorCentrality = ->
      self = workspace.world.selfManager.self()
      if not checks.isTurtle(self)
        throw exceptions.extension("nw:eigenvector-centrality can only be called by a turtle")
      calcEigenvectorCentrality(self)

    pageRankCalc = (ctx) ->
      turtles = ctx.turtles.toArray()
      n = turtles.length

      if n is 0
        return new Map()

      incoming = new Map()
      outgoingCount = new Map()

      for t in turtles
        incoming.set(t.id, [])
        outgoingCount.set(t.id, 0)

      mode = if ctx.isDirected then 'out' else 'both'

      hasAnyEdges = false
      for t in turtles
        outCount = 0
        for {turtle: neighbor} in getNeighbors(t, ctx, mode)
          if isInTurtleset(neighbor, ctx)
            outCount++
            hasAnyEdges = true
        outgoingCount.set(t.id, outCount)

      if not hasAnyEdges
        result = new Map()
        for t in turtles
          result.set(t.id, 1 / n)
        return result

      for t in turtles
        for {turtle: neighbor} in getNeighbors(t, ctx, mode)
          if isInTurtleset(neighbor, ctx)
            neighborOutCount = outgoingCount.get(neighbor.id)
            if neighborOutCount > 0
              incoming.get(t.id).push({neighbor: neighbor, outCount: neighborOutCount})

      damping = 0.85
      teleport = (1 - damping) / n

      pr = new Map()
      for t in turtles
        pr.set(t.id, 1 / n)

      maxIterations = 100
      tolerance = 0.0001

      for iter in [0...maxIterations]
        newPr = new Map()
        for t in turtles
          tId = t.id
          linkContribution = 0
          for incomingInfo in incoming.get(tId)
            linkContribution += damping * pr.get(incomingInfo.neighbor.id) / incomingInfo.outCount
          newPr.set(tId, teleport + linkContribution)

        maxDiff = 0
        for t in turtles
          diff = Math.abs(newPr.get(t.id) - pr.get(t.id))
          if diff > maxDiff
            maxDiff = diff

        pr = newPr

        if maxDiff < tolerance
          break

      pr

    calcPageRank = (turtle) ->
      ctx = getCurrentContext()

      if not isInTurtleset(turtle, ctx)
        throw exceptions.extension("#{turtle.toString().replace(/[()]/g, '')} is not a member of the current graph context.")

      pr = pageRankCalc(ctx)
      pr.get(turtle.id) ? 0

    pageRank = ->
      self = workspace.world.selfManager.self()
      if not checks.isTurtle(self)
        throw exceptions.extension("nw:page-rank can only be called by a turtle")
      calcPageRank(self)

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

    clusteringCoefficient = ->
      self = workspace.world.selfManager.self()
      if not checks.isTurtle(self)
        throw exceptions.extension("nw:clustering-coefficient can only be called by a turtle")
      calcClusteringCoefficient(self)

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

      result

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

        for t in members
          for link in links
            if not isValidLink(link)
              continue
            if link.end1 is t
              end2 = link.end2
              if isInTurtleset(end2, ctx)
                weight = if link.isDirected then 1 else 2
                totalOut += weight
                if memberSet.has(end2.id)
                  internal += weight
            if link.end2 is t
              end1 = link.end1
              if isInTurtleset(end1, ctx)
                totalIn += if link.isDirected then 1 else 2

        totalModularity += (internal - totalIn * totalOut / totalArcWeight) / totalArcWeight

      totalModularity

    maximalCliques = ->
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

    biggestMaximalCliques = ->
      cliques = maximalCliques()

      if cliques.length is 0
        return []

      maxSize = 0
      for c in cliques
        size = c.toArray().length
        if size > maxSize
          maxSize = size

      cliques.filter((c) -> c.toArray().length is maxSize)

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

      # nodeIds: Array<id> where id is a turtle ID (original level) or community index (meta level)
      # nodeOut/nodeIn: Map<id, Map<neighborId, weight>>
      # Returns Map<id, communityIndex>
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

      # Build compressed meta-graph where each community becomes a meta-node.
      # Returns {metaComs, metaOut, metaIn}
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

      # Phase 1 local moves, then recursively cluster the meta-graph until convergence.
      # Returns Map<id, communityIndex>
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

    getBreedName = (agentSet) ->
      if agentSet.getSpecialName?
        agentSet.getSpecialName() ? "LINKS"
      else
        "LINKS"

    generatePreferentialAttachment = (turtleBreed, linkBreed, numTurtles, minDegree) ->
      if numTurtles < 1
        throw exceptions.extension("The number of nodes in the generated network must be at least 1.")

      if minDegree < 1
        throw exceptions.extension("The minimum degree must be at least 1.")

      if numTurtles <= minDegree
        throw exceptions.extension("The number of turtles must be larger than the minimum degree.")

      turtleBreedName = getBreedName(turtleBreed)
      linkBreedName = getBreedName(linkBreed)
      linkBreedObj = workspace.world.breedManager.get(linkBreedName)
      isDirected = linkBreedObj.isDirected()

      initialTurtles = []
      for i in [0...minDegree + 1]
        color = 5 + (i % 14) * 10
        heading = (360 * i) / (minDegree + 1)
        workspace.world.turtleManager.createTurtles(1, turtleBreedName, 0, 0)
        allTurtles = workspace.world.turtles().toArray()
        newTurtle = allTurtles[allTurtles.length - 1]
        TurtleSetters.setHeading.call(newTurtle, heading)
        TurtleSetters.setColor.call(newTurtle, color)
        initialTurtles.push(newTurtle)

      links = []
      for i in [0...initialTurtles.length]
        for j in [i + 1...initialTurtles.length]
          end1 = initialTurtles[i]
          end2 = initialTurtles[j]
          if isDirected
            link = workspace.world.linkManager.createDirectedLink(end1, end2, linkBreedName)
          else
            link = workspace.world.linkManager.createUndirectedLink(end1, end2, linkBreedName)
          links.push(link)

      allTurtles = initialTurtles.slice()
      for t in [initialTurtles.length...numTurtles]
        color = 5 + (t % 14) * 10
        heading = (360 * t) / numTurtles
        workspace.world.turtleManager.createTurtles(1, turtleBreedName, 0, 0)
        allTurtlesList = workspace.world.turtles().toArray()
        newTurtle = allTurtlesList[allTurtlesList.length - 1]
        TurtleSetters.setHeading.call(newTurtle, heading)
        TurtleSetters.setColor.call(newTurtle, color)

        connected = new Set()
        attempts = 0
        while connected.size < minDegree and attempts < minDegree * 100
          attempts++
          if links.length is 0
            break
          randomLink = links[workspace.world.rng.nextInt(links.length)]
          target = if workspace.world.rng.nextInt(2) is 0 then randomLink.end1 else randomLink.end2
          if not connected.has(target.id)
            if isDirected
              newLink = workspace.world.linkManager.createDirectedLink(newTurtle, target, linkBreedName)
            else
              newLink = workspace.world.linkManager.createUndirectedLink(newTurtle, target, linkBreedName)
            if newLink
              links.push(newLink)
              connected.add(target.id)

        allTurtles.push(newTurtle)

      return

    generateRandom = (turtleBreed, linkBreed, nbTurtles, connexionProbability) ->
      if nbTurtles < 1
        throw exceptions.extension("A positive number of turtles must be specified.")

      if connexionProbability < 0 or connexionProbability > 1.0
        throw exceptions.extension("The connexion probability must be between 0 and 1.")

      turtleBreedName = getBreedName(turtleBreed)
      linkBreedName = getBreedName(linkBreed)
      linkBreedObj = workspace.world.breedManager.get(linkBreedName)
      isDirected = linkBreedObj.isDirected()

      turtles = []
      for i in [0...nbTurtles]
        color = 5 + (i % 14) * 10
        heading = (360 * i) / nbTurtles
        workspace.world.turtleManager.createTurtles(1, turtleBreedName, 0, 0)
        allTurtles = workspace.world.turtles().toArray()
        newTurtle = allTurtles[allTurtles.length - 1]
        TurtleSetters.setHeading.call(newTurtle, heading)
        TurtleSetters.setColor.call(newTurtle, color)
        turtles.push(newTurtle)

      for i in [0...nbTurtles]
        jRange = if isDirected then [0...nbTurtles].filter((j) -> j isnt i) else [i + 1...nbTurtles]
        for j in jRange
          if workspace.world.rng.nextDouble() < connexionProbability
            if isDirected
              workspace.world.linkManager.createDirectedLink(turtles[i], turtles[j], linkBreedName)
            else
              workspace.world.linkManager.createUndirectedLink(turtles[i], turtles[j], linkBreedName)

      return

    generateWattsStrogatz = (turtleBreed, linkBreed, nbTurtles, neighborhoodSize, rewireProbability) ->
      if nbTurtles < 1
        throw exceptions.extension("A positive number of turtles must be specified.")

      if neighborhoodSize < 0 or neighborhoodSize > Math.ceil(nbTurtles / 2 - 1)
        throw exceptions.extension("Neighborhood size must be less than half the number of turtles.")

      if rewireProbability < 0 or rewireProbability > 1.0
        throw exceptions.extension("The rewire probability must be between 0 and 1.")

      turtleBreedName = getBreedName(turtleBreed)
      linkBreedName   = getBreedName(linkBreed)
      linkBreedObj    = workspace.world.breedManager.get(linkBreedName)
      isDirected      = linkBreedObj.isDirected()
      rng             = workspace.world.rng

      turtles = []
      for i in [0...nbTurtles]
        workspace.world.turtleManager.createTurtles(1, turtleBreedName, 0, 0)
        allTurtles = workspace.world.turtles().toArray()
        newTurtle  = allTurtles[allTurtles.length - 1]
        TurtleSetters.setColor.call(newTurtle, 5 + (i % 14) * 10)
        TurtleSetters.setHeading.call(newTurtle, (360 * i) / nbTurtles)
        turtles.push(newTurtle)

      # Seed the adjacency map with the full forward ring lattice: turtle i is connected to turtles i+1 .. i+k (mod n).
      # This mirrors the desktop generator (NW-Extension WattsStrogatzGenerator.scala) so link structure and RNG usage
      # stay in lock-step with NetLogo desktop.  Sets are forward-only; dedup checks both directions.
      adjacency = new Map()
      for source, i in turtles
        targets = new Set()
        for neighbor in [1..neighborhoodSize]
          targets.add(turtles[(i + neighbor) % nbTurtles].id)
        adjacency.set(source.id, targets)

      # availBuffer is shuffled in place across the whole run; each rewire runs a partial Fisher-Yates from the front.
      availBuffer = turtles.slice()

      for source, i in turtles
        for neighbor in [1..neighborhoodSize]
          target     = turtles[(i + neighbor) % nbTurtles]
          realTarget = target

          if rng.nextDouble() < rewireProbability
            # Removing `target` first guarantees at least `target` itself stays a valid fallback candidate below.
            adjacency.get(source.id).delete(target.id)

            # Draw candidates via a running Fisher-Yates until one is neither self nor already adjacent (either
            # direction).  This matches the desktop selection loop, including its RNG draw per candidate.
            c = 0
            loop
              j              = rng.nextInt(availBuffer.length - c) + c
              candidate      = availBuffer[j]
              availBuffer[j] = availBuffer[c]
              availBuffer[c] = candidate
              c += 1
              if candidate isnt source and not adjacency.get(source.id).has(candidate.id) and not adjacency.get(candidate.id).has(source.id)
                break

            adjacency.get(source.id).add(candidate.id)
            realTarget = candidate

          if isDirected
            workspace.world.linkManager.createDirectedLink(source, realTarget, linkBreedName)
          else
            workspace.world.linkManager.createUndirectedLink(source, realTarget, linkBreedName)

      return

    {
      name: "nw"
    , clearAll: clearContext
    , prims: {
        "SET-CONTEXT":                      setContext
      , "GET-CONTEXT":                      getContext
      , "WITH-CONTEXT":                     withContext
      , "TURTLES-IN-RADIUS":                turtlesInRadius
      , "TURTLES-IN-OUT-RADIUS":            turtlesInOutRadius
      , "TURTLES-IN-IN-RADIUS":             turtlesInInRadius
      , "TURTLES-IN-REVERSE-RADIUS":        turtlesInReverseRadius
      , "DISTANCE-TO":                      distanceTo
      , "PATH-TO":                          pathTo
      , "TURTLES-ON-PATH-TO":               turtlesOnPathTo
      , "WEIGHTED-DISTANCE-TO":             weightedDistanceTo
      , "WEIGHTED-PATH-TO":                 weightedPathTo
      , "TURTLES-ON-WEIGHTED-PATH-TO":      turtlesOnWeightedPathTo
      , "MEAN-PATH-LENGTH":                 meanPathLength
      , "MEAN-WEIGHTED-PATH-LENGTH":        meanWeightedPathLength
      , "BETWEENNESS-CENTRALITY":           betweennessCentrality
      , "CLOSENESS-CENTRALITY":             closenessCentrality
      , "WEIGHTED-CLOSENESS-CENTRALITY":    weightedClosenessCentrality
      , "EIGENVECTOR-CENTRALITY":           eigenvectorCentrality
      , "PAGE-RANK":                        pageRank
      , "CLUSTERING-COEFFICIENT":           clusteringCoefficient
      , "WEAK-COMPONENT-CLUSTERS":          weakComponentClusters
      , "LOUVAIN-COMMUNITIES":              louvainCommunities
      , "MODULARITY":                       modularity
      , "MAXIMAL-CLIQUES":                  maximalCliques
      , "BIGGEST-MAXIMAL-CLIQUES":          biggestMaximalCliques
      , "GENERATE-PREFERENTIAL-ATTACHMENT": generatePreferentialAttachment
      , "GENERATE-RANDOM":                  generateRandom
      , "GENERATE-WATTS-STROGATZ":          generateWattsStrogatz
      , "SAVE-GRAPHML":                     notSupportedOnWeb("save-graphml", "save-to-string")
      , "LOAD-GRAPHML":                     notSupportedOnWeb("load-graphml", "load-from-string")
      , "SAVE-MATRIX":                      notSupportedOnWeb("save-matrix",  "save-to-string")
      , "LOAD-MATRIX":                      notSupportedOnWeb("load-matrix",  "load-from-string")
      , "SAVE-DL":                          notSupportedOnWeb("save-dl",      "save-to-string")
      , "LOAD-DL":                          notSupportedOnWeb("load-dl",      "load-from-string")
      , "SAVE-GDF":                         notSupportedOnWeb("save-gdf",     "save-to-string")
      , "LOAD-GDF":                         notSupportedOnWeb("load-gdf",     "load-from-string")
      , "SAVE-GEXF":                        notSupportedOnWeb("save-gexf",    "save-to-string")
      , "LOAD-GEXF":                        notSupportedOnWeb("load-gexf",    "load-from-string")
      , "SAVE-GML":                         notSupportedOnWeb("save-gml",     "save-to-string")
      , "LOAD-GML":                         notSupportedOnWeb("load-gml",     "load-from-string")
      , "SAVE-VNA":                         notSupportedOnWeb("save-vna",     "save-to-string")
      , "LOAD-VNA":                         notSupportedOnWeb("load-vna",     "load-from-string")
      , "SAVE":                             notSupportedOnWeb("save",         "save-to-string")
      , "LOAD":                             notSupportedOnWeb("load",         "load-from-string")
      }
    }

}
