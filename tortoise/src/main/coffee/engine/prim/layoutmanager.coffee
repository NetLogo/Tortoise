# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_      = require('lodash')
NLMath = require('util/nlmath')

module.exports =
  class LayoutManager

    # (World, () => Number) => LayoutManager
    constructor: (@_world, @_nextDouble) ->

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

    # (TurtleSet) => (Array[Number], Array[Number], Object[Number, Number], Array[Turtle])
    _initialize: (nodeSet) ->

      ax   = []
      ay   = []
      tMap = []
      agt  = []

      turtles = nodeSet.shuffled().toArray()

      _(0).range(turtles.length).forEach(
        (i) ->
          turtle          = turtles[i]
          agt[i]          = turtle
          tMap[turtle.id] = i
          ax[i]           = 0.0
          ay[i]           = 0.0
          return
      ).value()

      [ax, ay, tMap, agt]

    # (LinkSet, Object[Number, Number], Number) => Array[Number]
    _calcDegreeCounts: (links, idToIndexMap, nodeCount) ->
      baseCounts = _(0).range(nodeCount).map(-> 0).value()
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

          dist = t1.distance(t2)

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
        t1 = agents[i]
        for j in [(i + 1)...nodeCount]
          t2  = agents[j]
          div = Math.max((degCounts[i] + degCounts[j]) / 2.0, 1.0)

          [dx, dy] =
          if t2.xcor is t1.xcor and t2.ycor is t1.ycor
            ang   = 360 * @_nextDouble()
            newDX = -(rep / div * NLMath.squash(NLMath.sin(ang)))
            newDY = -(rep / div * NLMath.squash(NLMath.cos(ang)))
            [newDX, newDY]
          else
            dist  = t1.distance(t2)
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

      _(0).range(nodeCount).forEach(
        (i) ->
          turtle = agt[i]
          newX = calculateXCor(turtle.xcor + calculateLimit(ax[i]))
          newY = calculateYCor(turtle.ycor + calculateLimit(ay[i]))
          turtle.setXY(newX, newY)
          return
      ).value()

      return
