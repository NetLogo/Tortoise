#@# Make an `Update` class that always has turtles, links, and patches
#@# Vassal: { id: ID, companion: { trackedKeys: Set }, registerUpdate: Array[String -> Value] }
#@# Overlord: { updates: Array[Update], flushUpdates: Unit, collectUpdates: Array[Update] }
define(['engine/turtle', 'engine/patch', 'engine/link']
     , ( Turtle,          Patch,          Link) ->

  class Updater

    Updates: [] #@# Privatize

    collectUpdates: ->
      result =
        if (@Updates.length == 0)
          [turtles: {}, patches: {}]
        else
          @Updates
      @Updates = [{turtles: {}, patches: {}, links: {}, observer: {}, world: {}}]
      result

    update: (agentType, id, newAgent) ->
      @Updates[0][agentType][id] = newAgent

    push: (obj) ->
      @Updates.push(obj)

    updated: (obj, vars...) -> #@# Polymorphize correctly
      update = @Updates[0]
      if obj instanceof Turtle
        agents = update.turtles
      else if obj instanceof Patch
        agents = update.patches
      else if obj instanceof Link
        agents = update.links
      agentUpdate = agents[obj.id] or {}

      # Receiving updates for a turtle that's about to die means the turtle was
      # reborn, so we revive it in the update - BH 1/13/2014
      if agentUpdate['WHO'] < 0
        delete agentUpdate['WHO']

      # is there some less simpleminded way we could build this? surely there
      # must be. my CoffeeScript fu is stoppable - ST 1/24/13
      # Possible strategy. For variables with -, just replace it with a _ instead
      # of concatenating the words. For variables with a ?, replace it with _p or
      # something. For variables that need some kind of accessor, make the variable
      # that has the NetLogo name refer to the same thing that the NetLogo variable
      # does and make a different variable that refers to the thing you want in js.
      # For example, turtle.breed should refer to the breed name and
      # turtle._breed should point to the actual breed object.
      # BH 1/13/2014
      for v in vars #@# Create a mapper from engine names to view names
        switch v
          when "xcor"
            agentUpdate["XCOR"] = obj.xcor()
          when "ycor"
            agentUpdate["YCOR"] = obj.ycor()
          when "id"
            agentUpdate[if obj instanceof Link then "ID" else "WHO"] = obj[v]
          when "plabelcolor"
            agentUpdate["PLABEL-COLOR"] = obj[v]
          when "breed"
            agentUpdate["BREED"] = obj[v].name
          when "labelcolor"
            agentUpdate["LABEL-COLOR"] = obj[v]
          when "pensize"
            agentUpdate["PEN-SIZE"] = obj[v]
          when "penmode"
            agentUpdate["PEN-MODE"] = obj[v]
          when "hidden"
            agentUpdate["HIDDEN?"] = obj[v]
          when "tiemode"
            agentUpdate["TIE-MODE"] = obj[v]
          when "end1"
            agentUpdate["END1"] = obj[v].id
          when "end2"
            agentUpdate["END2"] = obj[v].id
          when "label"
            agentUpdate["LABEL"] = obj[v].toString()
          when "plabel"
            agentUpdate["PLABEL"] = obj[v].toString()
          else
            agentUpdate[v.toUpperCase()] = obj[v]
      agents[obj.id] = agentUpdate
      return

)
