define(['engine/patch', 'engine/turtle'], (Patch, Turtle) ->

  class Observer

    _perspective: 0
    _targetAgent: null

    # (Updater) => Observer
    constructor: (@_updater) ->
      @resetPerspective()

    # (Agent) => Unit
    watch: (agent) ->
      @_perspective = 3
      @_targetAgent =
        if agent instanceof Turtle
          [1, agent.id]
        else if agent instanceof Patch
          [2, agent.id]
        else
          [0, -1]
      @_updatePerspective()
      return

    # () => Unit
    resetPerspective: ->
      @_perspective = 0
      @_targetAgent = null
      @_updatePerspective()
      return

    # () => Unit
    _updatePerspective: ->
      @_updater.push({ observer: { 0: { perspective: @_perspective, targetAgent: @_targetAgent } } })
      return

)
