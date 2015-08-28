# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# data Perspective =
Observe = { toInt: 0 }
Ride    = { toInt: 1 }
Follow  = { toInt: 2 }
Watch   = { toInt: 3 }

_               = require('lodash')
agentToInt      = require('./agenttoint')
Nobody          = require('./nobody')
NLType          = require('./typechecker')
VariableManager = require('./structure/variablemanager')

{ ExtraVariableSpec } = require('./structure/variablespec')

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

      globalSpecs       = @_globalNames.map((name) -> new ExtraVariableSpec(name))
      @_varManager      = new VariableManager(this, globalSpecs)
      @_codeGlobalNames = _(@_globalNames).difference(@_interfaceGlobalNames).value()

    # () => Unit
    clearCodeGlobals: ->
      _(@_codeGlobalNames).forEach((name) => @_varManager[name] = 0; return).value()
      return

    # (Turtle) => Unit
    follow: (turtle) ->
      @_perspective = Follow
      @_targetAgent = turtle
      @_updatePerspective()
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

    # (Turtle) => Unit
    ride: (turtle) ->
      @_perspective = Ride
      @_targetAgent = turtle
      @_updatePerspective()
      return

    # (String, Any) => Unit
    setGlobal: (varName, value) ->
      @_varManager[varName] = value
      return

    # () => Agent
    subject: ->
      @_targetAgent ? Nobody

    # (Turtle) => Unit
    unfocus: (turtle) ->
      if @_targetAgent is turtle
        @resetPerspective()
      return

    # () => Array[String]
    varNames: ->
      @_varManager.names()

    # (Agent) => Unit
    watch: (agent) ->
      type = NLType(agent)
      @_perspective = Watch
      @_targetAgent = if type.isTurtle() or type.isPatch() then agent else Nobody
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
