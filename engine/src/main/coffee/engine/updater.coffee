# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Link      = require('./core/link')
Observer  = require('./core/observer')
Patch     = require('./core/patch')
Turtle    = require('./core/turtle')
World     = require('./core/world')

ignored = ["", -> ""]

# type ID           = String
# type Key          = String
# type Getter       = (Any) -> Any
# type UpdateEntry  = Object[Key, Getter]
# type UpdateSet    = Object[ID, UpdateEntry]
# type _US          = UpdateSet
# type DrawingEvent = Object[String, Any]

# (_US, _US, _US, _US, _US, Array[DrawingEvent]) => Update
class Update
  constructor: (@turtles = {}, @patches = {}, @links = {}, @observer = {}, @world = {}, @drawingEvents = []) ->

module.exports =
  class Updater

    # type Updatable   = Turtle|Patch|Link|World|Observer
    # type EngineKey   = String

    _hasUpdates: undefined # Boolean
    _updates:    undefined # Array[Update]

    # ((Any) => String) => Updater
    constructor: (@_dump) ->
      @_flushUpdates()

    # () => Unit
    clearDrawing: ->
      @_reportDrawingEvent({ type: "clear-drawing" })
      return

    # (String) => Unit
    importDrawing: (sourcePath) ->
      @_reportDrawingEvent({ type: "import-drawing", sourcePath })
      return

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

    # (Number, Number, Number, Number, RGB, Number, String) => Unit
    registerPenTrail: (fromX, fromY, toX, toY, rgb, size, penMode) =>
      @_reportDrawingEvent({ type: "line", fromX, fromY, toX, toY, rgb, size, penMode })
      return

    # (Number, Number, Number, Number, RGB, String, String) => Unit
    registerTurtleStamp: (x, y, size, heading, color, shapeName, stampMode) =>
      @_reportDrawingEvent({ type: "stamp-image", agentType: "turtle", stamp: { x, y, size, heading, color, shapeName, stampMode } })
      return

    # (Number, Number, Number, Number, Number, Number, Number, RGB, String, Number, Boolean, Number, Boolean, String) => Unit
    registerLinkStamp: (x1, y1, x2, y2, midpointX, midpointY, heading, color, shapeName, thickness, isDirected, size, isHidden, stampMode) =>
      @_reportDrawingEvent({ type: "stamp-image", agentType: "link", stamp: { x1, y1, x2, y2, midpointX, midpointY, heading, color, shapeName, thickness, 'directed?': isDirected, size, 'hidden?': isHidden, stampMode } })
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
          [update.turtles, @_turtleMap()]
        else if obj instanceof Patch
          [update.patches, @_patchMap()]
        else if obj instanceof Link
          [update.links, @_linkMap()]
        else if obj instanceof World
          [update.world, @_worldMap()]
        else if obj instanceof Observer
          [update.observer, @_observerMap()]
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
            [varName, getter]    = mapping
            entryUpdate[varName] = getter(obj)
            entry[obj.id]        = entryUpdate
        else
          throw new Error("Unknown #{obj.constructor.name} variable for update: #{v}")

      return


    # (Turtle) => Object[EngineKey, (Key, Getter)]
    _turtleMap: -> {
      breed:         ["BREED",       (turtle) -> turtle.getBreedName()]
      color:         ["COLOR",       (turtle) -> turtle._color]
      heading:       ["HEADING",     (turtle) -> turtle._heading]
      id:            ["WHO",         (turtle) -> turtle.id]
      'label-color': ["LABEL-COLOR", (turtle) -> turtle._labelcolor]
      'hidden?':     ["HIDDEN?",     (turtle) -> turtle._hidden]
      label:         ["LABEL",       (turtle) => @_dump(turtle._label)]
      'pen-size':    ["PEN-SIZE",    (turtle) -> turtle.penManager.getSize()]
      'pen-mode':    ["PEN-MODE",    (turtle) -> turtle.penManager.getMode().toString()]
      shape:         ["SHAPE",       (turtle) -> turtle._getShape()]
      size:          ["SIZE",        (turtle) -> turtle._size]
      xcor:          ["XCOR",        (turtle) -> turtle.xcor]
      ycor:          ["YCOR",        (turtle) -> turtle.ycor]
    }

    # (Patch) => Object[EngineKey, (Key, Getter)]
    _patchMap: -> {
      id:             ["WHO",          (patch) -> patch.id]
      pcolor:         ["PCOLOR",       (patch) -> patch._pcolor]
      plabel:         ["PLABEL",       (patch) => @_dump(patch._plabel)]
      'plabel-color': ["PLABEL-COLOR", (patch) -> patch._plabelcolor]
      pxcor:          ["PXCOR",        (patch) -> patch.pxcor]
      pycor:          ["PYCOR",        (patch) -> patch.pycor]
    }

    # (Link) => Object[EngineKey, (Key, Getter)]
    _linkMap: -> {
      breed:         ["BREED",       (link) -> link.getBreedName()]
      color:         ["COLOR",       (link) -> link._color]
      end1:          ["END1",        (link) -> link.end1.id]
      end2:          ["END2",        (link) -> link.end2.id]
      heading:       ["HEADING",     (link) -> (try link.getHeading() catch _ then 0)]
      'hidden?':     ["HIDDEN?",     (link) -> link._isHidden]
      id:            ["ID",          (link) -> link.id]
      'directed?':   ["DIRECTED?",   (link) -> link.isDirected]
      label:         ["LABEL",       (link) => @_dump(link._label)]
      'label-color': ["LABEL-COLOR", (link) -> link._labelcolor]
      midpointx:     ["MIDPOINTX",   (link) -> link.getMidpointX()]
      midpointy:     ["MIDPOINTY",   (link) -> link.getMidpointY()]
      shape:         ["SHAPE",       (link) -> link._shape]
      size:          ["SIZE",        (link) -> link.getSize()]
      thickness:     ["THICKNESS",   (link) -> link._thickness]
      'tie-mode':    ["TIE-MODE",    (link) -> link.tiemode]
      lcolor:        ignored
      llabel:        ignored
      llabelcolor:   ignored
      lhidden:       ignored
      lbreed:        ignored
      lshape:        ignored
    }

    # (World) => Object[EngineKey, (Key, Getter)]
    _worldMap: -> {
      height:                     ["worldHeight",               (world) -> world.topology.height]
      id:                         ["WHO",                       (world) -> world.id]
      patchesAllBlack:            ["patchesAllBlack",           (world) -> world._patchesAllBlack]
      patchesWithLabels:          ["patchesWithLabels",         (world) -> world._patchesWithLabels]
      maxPxcor:                   ["MAXPXCOR",                  (world) -> world.topology.maxPxcor]
      maxPycor:                   ["MAXPYCOR",                  (world) -> world.topology.maxPycor]
      minPxcor:                   ["MINPXCOR",                  (world) -> world.topology.minPxcor]
      minPycor:                   ["MINPYCOR",                  (world) -> world.topology.minPycor]
      patchSize:                  ["patchSize",                 (world) -> world.patchSize]
      ticks:                      ["ticks",                     (world) -> world.ticker._count]
      unbreededLinksAreDirected:  ["unbreededLinksAreDirected", (world) -> world.breedManager.links().isDirected()]
      width:                      ["worldWidth",                (world) -> world.topology.width]
      wrappingAllowedInX:         ["wrappingAllowedInX",        (world) -> world.topology._wrapInX]
      wrappingAllowedInY:         ["wrappingAllowedInY",        (world) -> world.topology._wrapInY]
    }

    # (Observer) => Object[EngineKey, (Key, Getter)]
    _observerMap: -> {
      id:          ["WHO",         (observer) -> observer.id]
      perspective: ["perspective", (observer) -> observer._perspective.toInt]
      targetAgent: ["targetAgent", (observer) -> observer._getTargetAgentUpdate()]
    }

    # (String, Number, UpdateEntry) => Unit
    _update: (agentType, id, newAgent) ->
      @_hasUpdates = true
      @_updates[0][agentType][id] = newAgent
      return

    # (Object[String, Any]) => Unit
    _reportDrawingEvent: (event) ->
      @_hasUpdates = true
      @_updates[0].drawingEvents.push(event)
      return

    # () => Unit
    _flushUpdates: ->
      @_hasUpdates = false
      @_updates    = [new Update()]
      return
