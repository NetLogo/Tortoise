# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLMath = require('util/nlmath')
NLType = require('../core/typechecker')

{ contains, filter, flatMap, foldl, forEach, map, maxBy, unique, zip } = require('brazierjs/array')
{ id, pipeline }                                                       = require('brazierjs/function')
{ rangeUntil }                                                         = require('brazierjs/number')
{ values }                                                             = require('brazierjs/object')

class TreeNode

  _angle:    undefined # Number
  _children: undefined # Array[Turtle]
  _depth:    undefined # Number
  _val:      undefined # Turtle

  # Turtle -> Number -> TreeNode
  constructor: (@_turtle, @_depth) ->
    @_angle    = 0.0
    @_children = []

  # Turtle -> Unit
  addChild: (child) ->
    @_children.push(child)
    return

  # Unit -> Number
  getAngle: ->
    @_angle

  # Unit -> Number
  getDepth: ->
    @_depth

  # Unit -> Turtle
  getTurtle: ->
    @_turtle

  getWeight: ->
    maxChildWeight = pipeline(map((c) -> c.getWeight()), maxBy(id), (x) -> x ? 0)(@_children)
    NLMath.max(maxChildWeight * 0.8, @_children.length + 1)

  layoutRadial: (arcStart, arcEnd) ->

    @_angle   = (arcStart + arcEnd) / 2
    weightSum = foldl((acc, x) -> acc + x.getWeight())(0)(@_children)

    f = (childStart, child) ->
      childEnd = childStart + (arcEnd - arcStart) * child.getWeight() / weightSum
      child.layoutRadial(childStart, childEnd)
      childEnd

    foldl(f)(arcStart)(@_children)

module.exports =
  class LayoutManager

    # (World, () => Number) => LayoutManager
    constructor: (@_world, @_nextDouble) ->

    # (TurtleSet, Number) => Unit
    layoutCircle: (agentsOrList, radius) ->

      turtles = if NLType(agentsOrList).isList() then agentsOrList else agentsOrList.shufflerator().toArray()
      n       = turtles.length
      midx    = @_world.topology.minPxcor + NLMath.floor(@_world.topology.width / 2)
      midy    = @_world.topology.minPycor + NLMath.floor(@_world.topology.height / 2)

      rangeUntil(0)(n).forEach(
        (i) ->
          heading = (i * 360) / n
          turtle  = turtles[i]
          turtle.patchAtHeadingAndDistance(heading, radius)
          turtle.setXY(midx, midy)
          turtle.setVariable("heading", heading)
          turtle.jumpIfAble(radius)
      )

    # (TurtleSet, LinkSet, Number, Number, Number) => Unit
    layoutSpring: (nodeSet, linkSet, spr, len, rep) ->

      if not nodeSet.isEmpty()
        [ax, ay, tMap, agt] = @_initialize(nodeSet)

        nodeCount = nodeSet.size()
        degCounts = @_calcDegreeCounts(linkSet, tMap, nodeCount)

        @_updateXYArraysForNeighbors(ax, ay, linkSet, tMap, degCounts, spr, len)
        @_updateXYArraysForAll(ax, ay, agt, degCounts, nodeCount, rep)
        @_moveTurtles(ax, ay, agt, nodeCount)

      return

    # (TurtleSet, LinkSet, Number) => Unit
    layoutTutte: (nodeSet, linkSet, radius) ->

      anchors =
        pipeline(
          flatMap(({ end1, end2 }) -> [end1, end2])
        , unique
        , filter((t) -> not nodeSet.contains(t))
        )(linkSet.toArray())

      @layoutCircle(anchors, radius)

      turtleXYTriplets =
        nodeSet.shuffled().toArray().map(
          (turtle) =>

            computeCor =
              (turtle, neighbors, degree) -> (getCor, max, min) ->

                value = pipeline(map(getCor), foldl((a, b) -> a + b)(0))(neighbors)

                adjustedValue = (value / degree) - getCor(turtle)

                limit = 100 # This voodoo magic makes absolutely no sense to me --JAB (11/7/16)
                limitedValue =
                  if adjustedValue > limit
                    limit
                  else if adjustedValue < -limit
                    -limit
                  else
                    adjustedValue

                readjustedValue = limitedValue + getCor(turtle)

                if readjustedValue > max
                  max
                else if readjustedValue < min
                  min
                else
                  readjustedValue

            allOfMyLinks  = turtle.linkManager._linksIn.concat(turtle.linkManager._linksOut)
            relevantLinks = pipeline(unique, filter((link) -> linkSet.contains(link)))(allOfMyLinks)
            neighbors     = relevantLinks.map(({ end1, end2 }) -> if end1 is turtle then end2 else end1)
            degree        = relevantLinks.length

            compute = computeCor(turtle, neighbors, degree)

            x = compute(((t) -> t.xcor), @_world.topology.maxPxcor, @_world.topology.minPxcor)
            y = compute(((t) -> t.ycor), @_world.topology.maxPycor, @_world.topology.minPycor)

            [turtle, x, y]

        )

      turtleXYTriplets.forEach(([turtle, x, y]) -> turtle.setXY(x, y))

      return

    # (TurtleSet, LinkSet, RootAgent) => Unit
    layoutRadial: (nodeSet, linkSet, root) ->

      { maxPxcor, maxPycor, minPxcor, minPycor } = @_world.topology

      rootX = (maxPxcor + minPxcor) / 2
      rootY = (maxPycor + minPycor) / 2

      rootNode  = new TreeNode(root, 0)
      queue     = [rootNode]
      nodeTable = {}
      nodeTable[rootNode.getTurtle().id] = rootNode

      [breedName, turtleIsAllowed] =
        if not linkSet.getSpecialName()?
          allowedTurtleIDs =
            pipeline(
              flatMap(({ end1, end2 }) -> [end1, end2])
            , foldl((acc, { id }) -> acc[id] = true; acc)({})
            )(linkSet.toArray())
          ["LINKS", ({ id }) -> allowedTurtleIDs[id] is true]
        else
          [linkSet.getSpecialName().toUpperCase(), -> true]

      visitNeighbors =
        (queue, last) ->
          if queue.length is 0
            last
          else
            node = queue.shift()
            node.getTurtle().linkManager.linkNeighbors(breedName).forEach(
              (t) ->
                if nodeSet.contains(t) and (not nodeTable[t.id]?) and turtleIsAllowed(t)
                  child = new TreeNode(t, node.getDepth() + 1)
                  node.addChild(child)
                  nodeTable[t.id] = child
                  queue.push(child)
                return
            )
            visitNeighbors(queue, node)

      lastNode = visitNeighbors(queue, rootNode)

      rootNode.layoutRadial(0, 360)

      maxDepth    = NLMath.max(1, lastNode.getDepth() + .2)
      xDistToEdge = NLMath.min(maxPxcor - rootX, rootX - minPxcor)
      yDistToEdge = NLMath.min(maxPycor - rootY, rootY - minPycor)
      layerGap    = NLMath.min(xDistToEdge, yDistToEdge) / maxDepth

      adjustPosition =
        (node) ->
          turtle = node.getTurtle()
          turtle.setXY(rootX, rootY)
          turtle.setVariable("heading", node.getAngle())
          turtle.jumpIfAble(node.getDepth() * layerGap)
          return

      pipeline(values, forEach(adjustPosition))(nodeTable)

      return

        # (TurtleSet) => (Array[Number], Array[Number], Object[Number, Number], Array[Turtle])
    _initialize: (nodeSet) ->

      ax   = []
      ay   = []
      tMap = []
      agt  = []

      turtles = nodeSet.shuffled().toArray()

      forEach(
        (i) ->
          turtle          = turtles[i]
          agt[i]          = turtle
          tMap[turtle.id] = i
          ax[i]           = 0.0
          ay[i]           = 0.0
          return
      )(rangeUntil(0)(turtles.length))

      [ax, ay, tMap, agt]

    # (LinkSet, Object[Number, Number], Number) => Array[Number]
    _calcDegreeCounts: (links, idToIndexMap, nodeCount) ->
      baseCounts = map(-> 0)(rangeUntil(0)(nodeCount))
      links.forEach(
        ({ end1: t1, end2: t2 }) ->
          f = (turtle) ->
            index = idToIndexMap[turtle.id]
            if index? then baseCounts[index]++
          f(t1)
          f(t2)
          return
      )
      baseCounts

    # WARNING: Mutates `ax` and `ay` --JAB (7/28/14)
    # (Array[Number], Array[Number], LinkSet, Object[Number, Number], Array[Number], Number, Number) => Unit
    _updateXYArraysForNeighbors: (ax, ay, links, idToIndexMap, degCounts, spr, len) ->

      indexAndCountOf =
        (turtle) ->
          index = idToIndexMap[turtle.id]
          if index?
            [index, degCounts[index]]
          else
            [-1, 0]

      links.forEach(
        ({ end1: t1, end2: t2 }) ->

          [t1Index, degCount1] = indexAndCountOf(t1)
          [t2Index, degCount2] = indexAndCountOf(t2)

          [x1, y1] = t1.getCoords()
          [x2, y2] = t2.getCoords()

          dist = NLMath.distance4_2D(x1, y1, x2, y2)

          # links that are connecting high degree nodes should not
          # be as springy, to help prevent "jittering" behavior -FD
          div = Math.max((degCount1 + degCount2) / 2.0, 1.0)

          [dx, dy] =
          if dist is 0
            [(spr * len) / div, 0] # arbitrary x-dir push-off --FD
          else
            f = spr * (dist - len) / div
            newDX = (f * (t2.xcor - t1.xcor) / dist)
            newDY = (f * (t2.ycor - t1.ycor) / dist)
            [newDX, newDY]

          if t1Index isnt -1
            ax[t1Index] += dx
            ay[t1Index] += dy

          if t2Index isnt -1
            ax[t2Index] -= dx
            ay[t2Index] -= dy

          return

      )

      return

    # WARNING: Mutates `ax` and `ay` --JAB (7/28/14)
    # (Array[Number], Array[Number], Array[Turtle], Array[Number], Number, Number) => Unit
    _updateXYArraysForAll: (ax, ay, agents, degCounts, nodeCount, rep) ->
      for i in [0...nodeCount]

        t1       = agents[i]
        [x1, y1] = t1.getCoords()

        for j in [(i + 1)...nodeCount]

          t2       = agents[j]
          [x2, y2] = t2.getCoords()
          div      = Math.max((degCounts[i] + degCounts[j]) / 2.0, 1.0)

          [dx, dy] =
            if x2 is x1 and y2 is y1
              ang   = 360 * @_nextDouble()
              newDX = -(rep / div * NLMath.squash(NLMath.sin(ang)))
              newDY = -(rep / div * NLMath.squash(NLMath.cos(ang)))
              [newDX, newDY]
            else
              dist  = NLMath.distance4_2D(x1, y1, x2, y2)
              f     = rep / (dist * dist) / div
              newDX = -(f * (t2.xcor - t1.xcor) / dist)
              newDY = -(f * (t2.ycor - t1.ycor) / dist)
              [newDX, newDY]

          ax[i] += dx
          ay[i] += dy
          ax[j] -= dx
          ay[j] -= dy

      return

    # WARNING: Mutates `ax` and `ay` --JAB (7/28/14)
    # (Array[Number], Array[Number], Array[Turtle], Number) => Unit
    _moveTurtles: (ax, ay, agt, nodeCount) ->

      maxX   = @_world.topology.maxPxcor
      minX   = @_world.topology.minPxcor
      maxY   = @_world.topology.maxPycor
      minY   = @_world.topology.minPycor
      height = @_world.topology.height
      width  = @_world.topology.width

      # we need to bump some node a small amount, in case all nodes
      # are stuck on a single line --FD
      if nodeCount > 1
        perturbment = (width + height) / 1.0e10
        ax[0] += @_nextDouble() * perturbment - perturbment / 2.0
        ay[0] += @_nextDouble() * perturbment - perturbment / 2.0

      # try to choose something that's reasonable perceptually --
      # for temporal aliasing, don't want to jump too far on any given timestep. --FD
      limit = (width + height) / 50.0

      bounded =
        (min, max) -> (x) ->
          if x < min
            min
          else if x > max
            max
          else
            x

      calculateLimit = bounded(-limit, limit)
      calculateXCor  = bounded(minX, maxX)
      calculateYCor  = bounded(minY, maxY)

      forEach(
        (i) ->
          turtle = agt[i]
          newX = calculateXCor(turtle.xcor + calculateLimit(ax[i]))
          newY = calculateYCor(turtle.ycor + calculateLimit(ay[i]))
          turtle.setXY(newX, newY)
          return
      )(rangeUntil(0)(nodeCount))

      return
