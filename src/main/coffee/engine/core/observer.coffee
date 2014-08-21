# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_               = require('lodash')
Patch           = require('./patch')
Turtle          = require('./turtle')
VariableManager = require('./structure/variablemanager')

module.exports =
  class Observer

    id: 0 # Number

    _varManager: undefined # VariableManager

    _perspective: undefined # Number
    _targetAgent: undefined # (Number, Number)

    _codeGlobalNames: undefined # Array[String]

    _updateVarsByName: undefined # (String*) => Unit

    # ((Updatable) => (String*) => Unit, Array[String], Array[String]) => Observer
    constructor: (genUpdate, @_globalNames, @_interfaceGlobalNames) ->
      @_updateVarsByName = genUpdate(this)

      @resetPerspective()

      @_varManager      = new VariableManager(@_globalNames)
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

    # (String) => Any
    getGlobal: (varName) ->
      @_varManager[varName]

    # (String, Any) => Unit
    setGlobal: (varName, value) ->
      @_varManager[varName] = value
      return

    # () => Unit
    clearCodeGlobals: ->
      _(@_codeGlobalNames).forEach((name) => @_varManager[name] = 0; return)
      return

    # () => Unit
    _updatePerspective: ->
      @_updateVarsByName("perspective", "targetAgent")
      return
