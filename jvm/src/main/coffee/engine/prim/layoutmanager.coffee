# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLMath = require('util/nlmath')

{ forEach, map } = require('brazierjs/array')
{ rangeUntil }   = require('brazierjs/number')

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
      anchors = []
      linkSet.forEach(
        ({ end1: t1, end2: t2 }) ->
          if not nodeSet.contains(t1) and t1 not in anchors
            anchors.push(t1)
          if not nodeSet.contains(t2) and t2 not in anchors
            anchors.push(t2))
      @layoutCircle(anchors, radius)

      n   = nodeSet.length()
      agt = nodeSet.shuffled().toArray()
      ax  = []
      ay  = []
      for i in [0...n]
        t  = agt[i]
        fx = 0
        fy = 0
        degree = 0
        for link in @_world.links().toArray()
          t1 = link.end1
          t2 = link.end2
          if (t1 == t or t2 == t) and linkSet.contains(link)
            other = t1
            if t == t1
              other = t2
            fx += other.xcor
            fy += other.ycor
            degree++

        fx /=  degree
        fy /=  degree
        fx -= t.xcor
        fy -= t.ycor

        limit = 100
        if fx > limit
          fx = limit
        else if fx < -limit
          fx = -limit
        if fy > limit
          fy = limit
        else if fy < -limit
          fy = -limit
        fx += t.xcor
        fy += t.ycor
        if fx > @_world.topology.maxPxcor
          fx = @_world.topology.maxPxcor
        else if fx < @_world.topology.minPxcor
          fx = @_world.topology.minPxcor
        if fy > @_world.topology.maxPycor
          fy = @_world.topology.maxPycor
        else if fy < @_world.topology.minPycor
          fy = @_world.topology.minPycor

        ax[i] = fx
        ay[i] = fy
      @_reposition(agt, ax, ay)

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
