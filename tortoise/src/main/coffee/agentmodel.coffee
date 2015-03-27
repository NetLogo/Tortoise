# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports =
  class AgentModel

    # () => AgentModel
    constructor: ->
      @turtles  = {}
      @patches  = {}
      @links    = {}
      @observer = {}
      @world    = {}

    # (Array[Updater.Update]) => Unit
    updates: (modelUpdates) ->
      for u in modelUpdates
        @update(u)
      return

    # (Updater.Update) => Boolean
    update: ({ links, observer, patches, turtles, world }) ->
      anyUpdates = false

      # the 'when varUpdates' checks below only seem to be
      # necessary on Nashorn, which apparently has trouble iterating
      # over objects where the keys are numbers. once Oracle ships
      # the fix for http://bugs.java.com/bugdatabase/view_bug.do?bug_id=8038119
      # we should re-test and see if this got fixed as well, or
      # whether we need to file a second bug report at bugs.java.com - ST 3/16/14
      turtleBundle = { updates: turtles, coll: @turtles, typeCanDie: true }
      patchBundle  = { updates: patches, coll: @patches, typeCanDie: false }
      linkBundle   = { updates: links,   coll: @links,   typeCanDie: true }

      for { coll, typeCanDie, updates } in [turtleBundle, patchBundle, linkBundle]
        for id, varUpdates of updates when varUpdates?
          anyUpdates = true
          if typeCanDie and varUpdates.WHO is -1
            delete coll[id]
          else
            mergeObjectInto(varUpdates, @_itemById(coll, id))

      if observer? and observer[0]?
        mergeObjectInto(observer[0], @observer)

      if world? and world[0]?
        mergeObjectInto(world[0], @world)

      anyUpdates

    # (Object, String) => Object
    _itemById: (coll, id) ->
      if not coll[id]?
        coll[id] = {}
      coll[id]

    # (Object, Object) => Unit
    mergeObjectInto = (updatedObject, targetObject) ->
      for variable, value of updatedObject
        targetObject[variable.toLowerCase()] = value
      return
