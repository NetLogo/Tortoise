# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(->
  class AgentModel

    # () => AgentModel
    constructor: ->
      @turtles  = {}
      @patches  = {}
      @links    = {}
      @observer = {}
      @world    = {}

    # () => Unit
    updates: (modelUpdates) ->
      for u in modelUpdates
        @update(u)
      return

    # (Updater.Update) => Boolean
    update: (modelUpdate) -> #@# Lousy comment
      anyUpdates = false
      # the three 'when varUpdates' checks below only seem to be
      # necessary on Nashorn, which apparently has trouble iterating
      # over objects where the keys are numbers. once Oracle ships
      # the fix for http://bugs.java.com/bugdatabase/view_bug.do?bug_id=8038119
      # we should re-test and see if this got fixed as well, or
      # whether we need to file a second bug report at bugs.java.com - ST 3/16/14
      for turtleId, varUpdates of modelUpdate.turtles when varUpdates?
        anyUpdates = true
        if varUpdates['WHO'] is -1
          delete @turtles[turtleId]
        else
          turtle = @turtles[turtleId]
          if not turtle
            turtle = @turtles[turtleId] = {}
          mergeObjectInto(varUpdates, turtle)
      for patchId, varUpdates of modelUpdate.patches when varUpdates?
        anyUpdates = true
        patch = @patches[patchId]
        patch ?= @patches[patchId] = {}
        mergeObjectInto(varUpdates, patch)
      for linkId, varUpdates of modelUpdate.links when varUpdates?
        anyUpdates = true
        if varUpdates['WHO'] is -1
          delete @links[linkId]
        else
          link = @links[linkId]
          link ?= @links[linkId] = {} #@# Nice crypticism
          mergeObjectInto(varUpdates, link)
      if modelUpdate.observer? and modelUpdate.observer[0]?
        mergeObjectInto(modelUpdate.observer[0], @observer)
      if modelUpdate.world? and modelUpdate.world[0]?
        mergeObjectInto(modelUpdate.world[0], @world)
      anyUpdates

    # (Object, Object) => Unit
    mergeObjectInto = (updatedObject, targetObject) ->
      for variable, value of updatedObject
        targetObject[variable.toLowerCase()] = value
      return

)
