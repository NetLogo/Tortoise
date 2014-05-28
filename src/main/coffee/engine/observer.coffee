define(['engine/patch', 'engine/turtle', 'integration/lodash'], (Patch, Turtle, _) ->

  class Observer

    id: 0

    variables: undefined # Object[String, Any]

    _perspective: undefined
    _targetAgent: undefined

    _codeGlobalNames: undefined # Array[String]

    # (Updater, Array[String], Array[String]) => Observer
    constructor: (@_updater, @_globalNames, @_interfaceGlobalNames) ->
      @resetPerspective()
      @_initGlobals(@_globalNames)
      @_codeGlobalNames = _(@_globalNames).difference(@_interfaceGlobalNames)

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
    clearCodeGlobals: ->
      _(@_codeGlobalNames).forEach((name) => @variables[name] = 0; return)
      return

    # () => Unit
    _updatePerspective: ->
      @_updater.updated(this)("perspective", "targetAgent")
      return

    # (Array[String]) => Unit
    _initGlobals: (globalNames) ->
      @variables = _(globalNames).foldl(((acc, name) => acc[name] = 0; acc), {})
      return

)
