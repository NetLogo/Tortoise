# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# data Perspective =
Observe = { toInt: 0 }
Ride    = { toInt: 1 }
Follow  = { toInt: 2 }
Watch   = { toInt: 3 }

_               = require('lodash')
agentToInt      = require('./agenttoint')
Nobody          = require('./nobody')
Patch           = require('./patch')
Turtle          = require('./turtle')
VariableManager = require('./structure/variablemanager')

module.exports =
  class Observer

    id: 0 # Number

    _varManager: undefined # VariableManager

    _perspective: undefined # Perspective
    _targetAgent: undefined # Agent

    _codeGlobalNames: undefined # Array[String]

    _updateVarsByName: undefined # (String*) => Unit

    # ((Updatable) => (String*) => Unit, Array[String], Array[String]) => Observer
    constructor: (genUpdate, @_globalNames, @_interfaceGlobalNames) ->
      @_updateVarsByName = genUpdate(this)

      @resetPerspective()

      @_varManager      = new VariableManager(@_globalNames)
      @_codeGlobalNames = _(@_globalNames).difference(@_interfaceGlobalNames)

    # () => Unit
    clearCodeGlobals: ->
      _(@_codeGlobalNames).forEach((name) => @_varManager[name] = 0; return)
      return

    # (String) => Any
    getGlobal: (varName) ->
      @_varManager[varName]

    # () => Unit
    resetPerspective: ->
      @_perspective = Observe
      @_targetAgent = null
      @_updatePerspective()
      return

    # (String, Any) => Unit
    setGlobal: (varName, value) ->
      @_varManager[varName] = value
      return

    # () => Agent
    subject: ->
      @_targetAgent or Nobody

    # (Agent) => Unit
    watch: (agent) ->
      @_perspective = Watch
      @_targetAgent =
        if agent instanceof Turtle or agent instanceof Patch
          agent
        else
          Nobody
      @_updatePerspective()
      return

    # () => Unit
    _updatePerspective: ->
      @_updateVarsByName("perspective", "targetAgent")
      return

    # Used by `Updater` --JAB (9/4/14)
    # () => (Number, Number)
    _getTargetAgentUpdate: ->
      if @_targetAgent?
        [agentToInt(@_targetAgent), @_targetAgent.id]
      else
        null
