#@# Make an `Update` class that always has turtles, links, and patches
#@# Vassal: { id: ID, companion: { trackedKeys: Set }, registerUpdate: Array[String -> Value] }
#@# Overlord: { updates: Array[Update], flushUpdates: Unit, collectUpdates: Array[Update] }
define(['engine/exception', 'engine/link', 'engine/observer', 'engine/patch', 'engine/turtle', 'engine/world']
     , ( Exception,          Link,          Observer,          Patch,          Turtle,          World) ->

  class Updater

    @_updates = undefined

    constructor: ->
      @_updates = [{turtles: {}, patches: {}, links: {}, observer: {}, world: {}}]

    collectUpdates: ->
      result =
        if @_updates.length is 0 #@# `isEmpty`?
          [turtles: {}, patches: {}]
        else
          @_updates
      @_updates = [{turtles: {}, patches: {}, links: {}, observer: {}, world: {}}]
      result

    update: (agentType, id, newAgent) ->
      @_updates[0][agentType][id] = newAgent

    updated: (obj) => (vars...) => #@# Polymorphize correctly
      update = @_updates[0]

      [entry, updateFunc] =
        if obj instanceof Turtle
          [update.turtles, @_updateTurtles]
        else if obj instanceof Patch
          [update.patches, @_updatePatches]
        else if obj instanceof Link
          [update.links, @_updateLinks]
        else if obj instanceof World
          [update.world, @_updateWorld]
        else if obj instanceof Observer
          [update.observer, @_updateObserver]
        else
          throw new Exception.NetLogoException("Unrecognized update type")

      entryUpdate = entry[obj.id] or {}

      # Receiving updates for a turtle that's about to die means the turtle was
      # reborn, so we revive it in the update - BH 1/13/2014
      if entryUpdate['WHO'] < 0
        delete entryUpdate['WHO']

      entry[obj.id] = updateFunc(obj, vars, entryUpdate)

      return


    # (Turtle, Array[String], Object[String, Any]) => Object[String, Any]
    _updateTurtles: (turtle, vars, updateBundle) ->
      for v in vars
        [varName, value] =
          switch v
            when "breed"
              ["BREED", turtle.getBreedName()]
            when "color"
              ["COLOR", turtle.color]
            when "heading"
              ["HEADING", turtle.heading]
            when "id"
              ["WHO", turtle.id]
            when "label-color"
              ["LABEL-COLOR", turtle.labelcolor]
            when "hidden?"
              ["HIDDEN?", turtle.hidden]
            when "label"
              ["LABEL", turtle.label.toString()]
            when "pen-size"
              ["PEN-SIZE", turtle.penManager.getSize()]
            when "pen-mode"
              ["PEN-MODE", turtle.penManager.getMode().toString()]
            when "shape"
              ["SHAPE", turtle.shape]
            when "size"
              ["SIZE", turtle.size]
            when "xcor"
              ["XCOR", turtle.xcor()]
            when "ycor"
              ["YCOR", turtle.ycor()]
            else
              throw new Exception.NetLogoException("Unknown turtle variable for update: #{v}")

        updateBundle[varName] = value

      updateBundle


    # (Patch, Array[String], Object[String, Any]) => Object[String, Any]
    _updatePatches: (patch, vars, updateBundle) ->
      for v in vars
        [varName, value] =
          switch v
            when "id"
              ["WHO", patch.id]
            when "pcolor"
              ["PCOLOR", patch.pcolor]
            when "plabelcolor"
              ["PLABEL-COLOR", patch.plabelcolor]
            when "plabel"
              ["PLABEL", patch.plabel.toString()]
            when "pxcor"
              ["PXCOR", patch.pxcor]
            when "pycor"
              ["PYCOR", patch.pycor]
            else
              throw new Exception.NetLogoException("Unknown patch variable for update: #{v}")

        updateBundle[varName] = value

      updateBundle


    # (Link, Array[String], Object[String, Any]) => Object[String, Any]
    _updateLinks: (link, vars, updateBundle) ->
      for v in vars
        [varName, value] =
          switch v
            when "breed"
              ["BREED", link.getBreedName()]
            when "color"
              ["COLOR", link._color]
            when "end1"
              ["END1", link.end1.id]
            when "end2"
              ["END2", link.end2.id]
            when "heading"
              ["HEADING", link.getHeading()]
            when "hidden?"
              ["HIDDEN?", link._isHidden]
            when "id"
              ["ID", link.id]
            when "label"
              ["LABEL", link._label.toString()]
            when "label-color"
              ["LABEL-COLOR", link._labelcolor]
            when "midpointx"
              ["MIDPOINTX", link.getMidpointX()]
            when "midpointy"
              ["MIDPOINTY", link.getMidpointY()]
            when "shape"
              ["SHAPE", link._shape]
            when "size"
              ["SIZE", link.getSize()]
            when "thickness"
              ["THICKNESS", link._thickness]
            when "tie-mode"
              ["TIE-MODE", link._tiemode]
            when "lcolor", "llabel", "llabelcolor", "lhidden", "lbreed", "lshape" # Ignored!
              ["", ""]
            else
              throw new Exception.NetLogoException("Unknown link variable for update: #{v}")

        if varName isnt ""
          updateBundle[varName] = value

      updateBundle


    # (World, Array[String], Object[String, Any]) => Object[String, Any]
    _updateWorld: (world, vars, updateBundle) ->
      for v in vars
        [varName, value] =
          switch v
            when "height"
              ["worldHeight", world.height()]
            when "id"
              ["WHO", world.id]
            when "patchesAllBlack"
              ["patchesAllBlack", world._patchesAllBlack]
            when "patchesWithLabels"
              ["patchesWithLabels", world._patchesWithLabels]
            when "maxPxcor"
              ["MAXPXCOR", world.maxPxcor]
            when "maxPycor"
              ["MAXPYCOR", world.maxPycor]
            when "minPxcor"
              ["MINPXCOR", world.minPxcor]
            when "minPycor"
              ["MINPYCOR", world.minPycor]
            when "ticks"
              ["ticks", world.ticker._count]
            when "unbreededLinksAreDirected"
              ["unbreededLinksAreDirected", world.unbreededLinksAreDirected]
            when "width"
              ["worldWidth", world.width()]
            else
              throw new Exception.NetLogoException("Unknown world variable for update: #{v}")

        updateBundle[varName] = value

      updateBundle


    # (Observer, Array[String], Object[String, Any]) => Object[String, Any]
    _updateObserver: (observer, vars, updateBundle) ->
      for v in vars
        [varName, value] =
          switch v
            when "id"
              ["WHO", observer.id]
            when "perspective"
              ["perspective", observer._perspective]
            when "targetAgent"
              ["targetAgent", observer._targetAgent]
            else
              throw new Exception.NetLogoException("Unknown observer variable for update: #{v}")

        updateBundle[varName] = value

      updateBundle

)
