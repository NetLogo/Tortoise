## (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

#@# Widespread sucking.  Prepare to be replaced by the overlord.
define(->
  class AgentModel
    constructor: ->
      @turtles = {}
      @patches = {}
      @links = {}
      @observer = {}
      @world = {}

    updates: (modelUpdates) ->
      for u in modelUpdates
        @update(u)
      return

    update: (modelUpdate) -> # boolean
      anyUpdates = false
      # the three 'when varUpdates' checks below only seem to be
      # necessary on Nashorn, which apparently has trouble iterating
      # over objects where the keys are numbers. once Oracle ships
      # the fix for http://bugs.java.com/bugdatabase/view_bug.do?bug_id=8038119
      # we should re-test and see if this got fixed as well, or
      # whether we need to file a second bug report at bugs.java.com - ST 3/16/14
      for turtleId, varUpdates of modelUpdate.turtles when varUpdates
        anyUpdates = true
        if varUpdates == null || varUpdates['WHO'] == -1  # old and new death formats
          delete @turtles[turtleId]
        else
          t = @turtles[turtleId]
          if not t?
            t = @turtles[turtleId] = {}
          mergeObjectInto(varUpdates, t)
      for patchId, varUpdates of modelUpdate.patches when varUpdates
        anyUpdates = true
        p = @patches[patchId]
        p ?= @patches[patchId] = {}
        mergeObjectInto(varUpdates, p)
      for linkId, varUpdates of modelUpdate.links when varUpdates
        anyUpdates = true
        if varUpdates == null || varUpdates['WHO'] == -1
          delete @links[linkId]
        else
          l = @links[linkId]
          l ?= @links[linkId] = {}
          mergeObjectInto(varUpdates, l)
      if(modelUpdate.observer && modelUpdate.observer[0])
        mergeObjectInto(modelUpdate.observer[0], @observer)
      if(modelUpdate.world && modelUpdate.world[0])
        mergeObjectInto(modelUpdate.world[0], @world)
      anyUpdates

    mergeObjectInto = (updatedObject, targetObject) ->
      for variable, value of updatedObject
        targetObject[variable.toLowerCase()] = value
      return
)
