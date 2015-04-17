# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Dump      = require('./dump')
Link      = require('./core/link')
Observer  = require('./core/observer')
Patch     = require('./core/patch')
Turtle    = require('./core/turtle')
World     = require('./core/world')
Exception = require('tortoise/util/exception')

ignored = ["", ""]

# type ID          = String
# type Key         = String
# type Value       = Any
# type UpdateEntry = Object[Key, Value]
# type UpdateSet   = Object[ID, UpdateEntry]
# type _US         = UpdateSet

# (_US, _US, _US, _US, _US) => Update
class Update
  constructor: (@turtles = {}, @patches = {}, @links = {}, @observer = {}, @world = {}) ->

module.exports =
  class Updater

    # type Updatable   = Turtle|Patch|Link|World|Observer
    # type EngineKey   = String

    _hasUpdates: undefined # Boolean
    _updates:    undefined # Array[Update]

    # () => Updater
    constructor: ->
      @_flushUpdates()

    # () => Array[Update]
    collectUpdates: ->
      temp = @_updates
      @_flushUpdates()
      temp

    # () => Boolean
    hasUpdates: ->
      @_hasUpdates

    # (Number) => Unit
    registerDeadLink: (id) =>
      @_update("links", id, { WHO: -1 })
      return

    # (Number) => Unit
    registerDeadTurtle: (id) =>
      @_update("turtles", id, { WHO: -1 })
      return

    # (UpdateEntry, Number) => Unit
    registerWorldState: (state, id = 0) ->
      @_update("world", id, state)
      return

    # (Updatable) => (EngineKey*) => Unit
    updated: (obj) => (vars...) =>
      @_hasUpdates = true

      update = @_updates[0]

      [entry, objMap] =
        if obj instanceof Turtle
          [update.turtles, @_turtleMap(obj)]
        else if obj instanceof Patch
          [update.patches, @_patchMap(obj)]
        else if obj instanceof Link
          [update.links, @_linkMap(obj)]
        else if obj instanceof World
          [update.world, @_worldMap(obj)]
        else if obj instanceof Observer
          [update.observer, @_observerMap(obj)]
        else
          throw new Error("Unrecognized update type")

      entryUpdate = entry[obj.id] ? {}

      # Receiving updates for a turtle that's about to die means the turtle was
      # reborn, so we revive it in the update - BH 1/13/2014
      if entryUpdate['WHO'] < 0
        delete entryUpdate['WHO']

      for v in vars
        mapping = objMap[v]
        if mapping?
          if mapping isnt ignored
            [varName, value]     = mapping
            entryUpdate[varName] = value
            entry[obj.id]        = entryUpdate
        else
          throw new Error("Unknown #{obj.constructor.name} variable for update: #{v}")

      return


    # (Turtle) => Object[EngineKey, (Key, Value)]
    _turtleMap: (turtle) -> {
      breed:         ["BREED",       turtle.getBreedName()]
      color:         ["COLOR",       turtle._color]
      heading:       ["HEADING",     turtle._heading]
      id:            ["WHO",         turtle.id]
      'label-color': ["LABEL-COLOR", turtle._labelcolor]
      'hidden?':     ["HIDDEN?",     turtle._hidden]
      label:         ["LABEL",       Dump(turtle._label)]
      'pen-size':    ["PEN-SIZE",    turtle.penManager.getSize()]
      'pen-mode':    ["PEN-MODE",    turtle.penManager.getMode().toString()]
      shape:         ["SHAPE",       turtle._getShape()]
      size:          ["SIZE",        turtle._size]
      xcor:          ["XCOR",        turtle.xcor]
      ycor:          ["YCOR",        turtle.ycor]
    }

    # (Patch) => Object[EngineKey, (Key, Value)]
    _patchMap: (patch) -> {
      id:             ["WHO",          patch.id]
      pcolor:         ["PCOLOR",       patch._pcolor]
      plabel:         ["PLABEL",       Dump(patch._plabel)]
      'plabel-color': ["PLABEL-COLOR", patch._plabelcolor]
      pxcor:          ["PXCOR",        patch.pxcor]
      pycor:          ["PYCOR",        patch.pycor]
    }

    # (Link) => Object[EngineKey, (Key, Value)]
    _linkMap: (link) -> {
      breed:         ["BREED",       link.getBreedName()]
      color:         ["COLOR",       link._color]
      end1:          ["END1",        link.end1.id]
      end2:          ["END2",        link.end2.id]
      heading:       ["HEADING",     @_withDefault(link.getHeading.bind(link))(0)]
      'hidden?':     ["HIDDEN?",     link._isHidden]
      id:            ["ID",          link.id]
      'directed?':   ["DIRECTED?",   link.isDirected]
      label:         ["LABEL",       Dump(link._label)]
      'label-color': ["LABEL-COLOR", link._labelcolor]
      midpointx:     ["MIDPOINTX",   link.getMidpointX()]
      midpointy:     ["MIDPOINTY",   link.getMidpointY()]
      shape:         ["SHAPE",       link._shape]
      size:          ["SIZE",        link.getSize()]
      thickness:     ["THICKNESS",   link._thickness]
      'tie-mode':    ["TIE-MODE",    link.tiemode]
      lcolor:        ignored
      llabel:        ignored
      llabelcolor:   ignored
      lhidden:       ignored
      lbreed:        ignored
      lshape:        ignored
    }

    # (World) => Object[EngineKey, (Key, Value)]
    _worldMap: (world) -> {
      height:                     ["worldHeight",               world.topology.height]
      id:                         ["WHO",                       world.id]
      patchesAllBlack:            ["patchesAllBlack",           world._patchesAllBlack]
      patchesWithLabels:          ["patchesWithLabels",         world._patchesWithLabels]
      maxPxcor:                   ["MAXPXCOR",                  world.topology.maxPxcor]
      maxPycor:                   ["MAXPYCOR",                  world.topology.maxPycor]
      minPxcor:                   ["MINPXCOR",                  world.topology.minPxcor]
      minPycor:                   ["MINPYCOR",                  world.topology.minPycor]
      ticks:                      ["ticks",                     world.ticker._count]
      unbreededLinksAreDirected:  ["unbreededLinksAreDirected", world.breedManager.links().isDirected()]
      width:                      ["worldWidth",                world.topology.width]
      wrappingAllowedInX:         ["wrappingAllowedInX",        world.topology._wrapInX]
      wrappingAllowedInY:         ["wrappingAllowedInY",        world.topology._wrapInY]
    }

    # (Observer) => Object[EngineKey, (Key, Value)]
    _observerMap: (observer) -> {
      id:          ["WHO",         observer.id]
      perspective: ["perspective", observer._perspective.toInt]
      targetAgent: ["targetAgent", observer._getTargetAgentUpdate()]
    }

    # (String, Number, UpdateEntry) => Unit
    _update: (agentType, id, newAgent) ->
      @_hasUpdates = true
      @_updates[0][agentType][id] = newAgent
      return

    # () => Unit
    _flushUpdates: ->
      @_hasUpdates = false
      @_updates    = [new Update()]
      return

    # [T] @ (() => T) => (T) => T
    _withDefault: (thunk) -> (defaultValue) ->
      try thunk()
      catch ex
        defaultValue
