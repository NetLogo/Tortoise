# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports =
  class AgentModel

    # () => AgentModel
    constructor: ->
      @turtles       = {}
      @patches       = {}
      @links         = {}
      @observer      = {}
      @world         = {}
      @drawingEvents = []

    # (Array[Updater.Update]) => Unit
    updates: (modelUpdates) ->
      for u in modelUpdates
        @update(u)
      return

    # (Updater.Update) => Unit
    update: ({ links, observer, patches, turtles, world, drawingEvents }) ->

      turtleBundle = { updates: turtles, coll: @turtles, typeCanDie: true }
      patchBundle  = { updates: patches, coll: @patches, typeCanDie: false }
      linkBundle   = { updates: links,   coll: @links,   typeCanDie: true }

      for { coll, typeCanDie, updates } in [turtleBundle, patchBundle, linkBundle]
        for id, varUpdates of updates
          if typeCanDie and varUpdates.WHO is -1
            delete coll[id]
          else
            mergeObjectInto(varUpdates, @_itemById(coll, id))

      if observer?[0]?
        mergeObjectInto(observer[0], @observer)

      if world?[0]?
        mergeObjectInto(world[0], @world)

      if drawingEvents?
        @drawingEvents = @drawingEvents.concat(drawingEvents)

      return

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
