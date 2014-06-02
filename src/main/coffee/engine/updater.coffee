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

      if obj instanceof Link
        entry       = update.links
        entryUpdate = @_updateLinks(obj, vars, entry[obj.id] or {})
        entry[obj.id] = entryUpdate
      else
        entry =
          if obj instanceof Turtle
            update.turtles
          else if obj instanceof Patch
            update.patches
          else if obj instanceof World
            update.world
          else if obj instanceof Observer
            update.observer
          else
            throw new Exception.NetLogoException("Unrecognized update type")

        entryUpdate = entry[obj.id] or {}

        # Receiving updates for a turtle that's about to die means the turtle was
        # reborn, so we revive it in the update - BH 1/13/2014
        if entryUpdate['WHO'] < 0
          delete entryUpdate['WHO']

        ###
        is there some less simpleminded way we could build this? surely there
        must be. my CoffeeScript fu is stoppable - ST 1/24/13
        Possible strategy. For variables with -, just replace it with a _ instead
        of concatenating the words. For variables with a ?, replace it with _p or
        something. For variables that need some kind of accessor, make the variable
        that has the NetLogo name refer to the same thing that the NetLogo variable
        does and make a different variable that refers to the thing you want in js.
        For example, turtle.breed should refer to the breed name and
        turtle._breed should point to the actual breed object.
        BH 1/13/2014
        ###
        for v in vars #@# Create a mapper from engine names to view names; that aside, this thing is absolutely ridiculous
          switch v
            when "xcor"
              entryUpdate["XCOR"] = obj.xcor()
            when "ycor"
              entryUpdate["YCOR"] = obj.ycor()
            when "id"
              entryUpdate["WHO"] = obj[v]
            when "plabelcolor"
              entryUpdate["PLABEL-COLOR"] = obj[v]
            when "breed"
              entryUpdate["BREED"] = obj[v].name
            when "labelcolor"
              entryUpdate["LABEL-COLOR"] = obj[v]
            when "pensize"
              entryUpdate["PEN-SIZE"] = obj.penManager.getSize()
            when "penmode"
              entryUpdate["PEN-MODE"] = obj.penManager.getMode().toString()
            when "hidden"
              entryUpdate["HIDDEN?"] = obj[v]
            when "label"
              entryUpdate["LABEL"] = obj[v].toString()
            when "plabel"
              entryUpdate["PLABEL"] = obj[v].toString()
            # `World` start
            when "ticks"
              entryUpdate["ticks"] = obj.ticker._count
            when "patchesAllBlack"
              entryUpdate["patchesAllBlack"] = obj._patchesAllBlack
            when "patchesWithLabels"
              entryUpdate["patchesWithLabels"] = obj._patchesWithLabels
            when "unbreededLinksAreDirected"
              entryUpdate["unbreededLinksAreDirected"] = obj.unbreededLinksAreDirected
            when "width"
              entryUpdate["worldWidth"] = obj.width()
            when "height"
                entryUpdate["worldHeight"] = obj.height()
            # `World` end / `Observer` start
            when "perspective"
              entryUpdate["perspective"] = obj._perspective
            when "targetAgent"
              entryUpdate["targetAgent"] = obj._targetAgent
            # `Observer` end
            else
              entryUpdate[v.toUpperCase()] = obj[v]

        entry[obj.id] = entryUpdate

      return

    # (Link, Array[String], Object[String, Any]) => Object[String, Any]
    _updateLinks: (link, vars, updateBundle) ->

      if updateBundle['WHO'] < 0
        delete updateBundle['WHO']

      for v in vars
        [varName, value] =
          switch v
            when "breed"
              ["BREED", link.breed.name]
            when "color"
              ["COLOR", link.color]
            when "end1"
              ["END1", link.end1.id]
            when "end2"
              ["END2", link.end2.id]
            when "heading"
              ["HEADING", link.heading]
            when "hidden"
              ["HIDDEN?", link.hidden]
            when "id"
              ["ID", link.id]
            when "label"
              ["LABEL", link.label.toString()]
            when "labelcolor"
              ["LABEL-COLOR", link.labelcolor]
            when "midpointx"
              ["MIDPOINTX", link.midpointx]
            when "midpointy"
              ["MIDPOINTY", link.midpointy]
            when "shape"
              ["SHAPE", link.shape]
            when "size"
              ["SIZE", link.size]
            when "thickness"
              ["THICKNESS", link.thickness]
            when "tiemode"
              ["TIE-MODE", link.tiemode]
            when "lcolor", "llabel", "llabelcolor", "lhidden", "lbreed", "lshape" # Ignored!
              ["", ""]
            else
              throw new Exception.NetLogoException("Unknown link variable for update: #{v}")

        if varName isnt ""
          updateBundle[varName] = value

      updateBundle

)
