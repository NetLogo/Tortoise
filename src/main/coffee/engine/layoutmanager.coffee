# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# Copied pretty much verbatim from Layouts.java --FD
define(['integration/lodash', 'integration/random', 'integration/strictmath', 'engine/trig']
     , ( _,                    Random,               StrictMath,               Trig) ->

  class LayoutManager

    constructor: (@world) ->

    #@# Okay, so... in what universe is it alright for a single function to be 120 lines long?
    layoutSpring: (nodeSet, linkSet, spr, len, rep) ->
      nodeCount = nodeSet.size()
      if nodeSet.isEmpty()
        return

      ax = []
      ay = []
      tMap = []
      degCount = _(0).range(nodeCount).map(-> 0).value()

      agt = []
      i = 0
      for turtle in nodeSet.shuffled().toArray() #@# Lodash
        agt[i] = turtle
        tMap[turtle.id] = i
        ax[i] = 0.0
        ay[i] = 0.0
        i++

      for link in linkSet.toArray() #@# Lodash
        t1 = link.end1
        t2 = link.end2
        if tMap[t1.id] isnt undefined #@# Lame x2
          t1Index = tMap[t1.id]
          degCount[t1Index]++
        if tMap[t2.id] isnt undefined
          t2Index = tMap[t2.id]
          degCount[t2Index]++

      for link in linkSet.toArray() #@# Lodash
        dx = 0
        dy = 0
        t1 = link.end1
        t2 = link.end2
        t1Index = -1
        degCount1 = 0
        if tMap[t1.id] isnt undefined #@# Lame
          t1Index = tMap[t1.id]
          degCount1 = degCount[t1Index]
        t2Index = -1
        degCount2 = 0
        if tMap[t2.id] isnt undefined #@# Lame
          t2Index = tMap[t2.id]
          degCount2 = degCount[t2Index]
        dist = t1.distance(t2)
        # links that are connecting high degree nodes should not
        # be as springy, to help prevent "jittering" behavior -FD
        div = (degCount1 + degCount2) / 2.0
        div = Math.max(div, 1.0)

        if dist is 0
          dx += (spr * len) / div # arbitrary x-dir push-off --FD
        else
          f = spr * (dist - len) / div
          dx = dx + (f * (t2.xcor() - t1.xcor()) / dist)
          dy = dy + (f * (t2.ycor() - t1.ycor()) / dist)
        if t1Index isnt -1
          ax[t1Index] += dx
          ay[t1Index] += dy
        if t2Index isnt -1
          ax[t2Index] -= dx
          ay[t2Index] -= dy

      for i in [0...nodeCount]
        t1 = agt[i]
        for j in [(i + 1)...nodeCount]
          t2 = agt[j]
          dx = 0.0
          dy = 0.0
          div = (degCount[i] + degCount[j]) / 2.0
          div = Math.max(div, 1.0)

          if t2.xcor() is t1.xcor() and t2.ycor() is t1.ycor()
            ang = 360 * Random.nextDouble()
            dx = -(rep / div * Trig.sin(StrictMath.toRadians(ang)))
            dy = -(rep / div * Trig.cos(StrictMath.toRadians(ang)))
          else
            dist = t1.distance(t2)
            f = rep / (dist * dist) / div
            dx = -(f * (t2.xcor() - t1.xcor()) / dist)
            dy = -(f * (t2.ycor() - t1.ycor()) / dist)
          ax[i] += dx
          ay[i] += dy
          ax[j] -= dx
          ay[j] -= dy

      # we need to bump some node a small amount, in case all nodes
      # are stuck on a single line --FD
      if nodeCount > 1
        perturbAmt = (@world.width() + @world.height()) / 1.0e10
        ax[0] += Random.nextDouble() * perturbAmt - perturbAmt / 2.0
        ay[0] += Random.nextDouble() * perturbAmt - perturbAmt / 2.0

      # try to choose something that's reasonable perceptually --
      # for temporal aliasing, don't want to jump too far on any given timestep. --FD
      limit = (@world.width() + @world.height()) / 50.0

      for i in [0...nodeCount]
        turtle = agt[i]
        fx = ax[i]
        fy = ay[i]

        if fx > limit
          fx = limit
        else if fx < -limit
          fx = -limit

        if fy > limit
          fy = limit
        else if fy < -limit
          fy = -limit

        newx = turtle.xcor() + fx
        newy = turtle.ycor() + fy

        if newx > @world.maxPxcor
          newx = @world.maxPxcor
        else if newx < @world.minPxcor
          newx = @world.minPxcor

        if newy > @world.maxPycor
          newy = @world.maxPycor
        else if newy < @world.minPycor
          newy = @world.minPycor
        turtle.setXY(newx, newy)

)
