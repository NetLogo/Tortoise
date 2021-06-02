# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# data Perspective =
Observe = {}
Ride    = {}
Follow  = {}
Watch   = {}

agentToInt      = require('./agenttoint')
{ checks }      = require('./typechecker')
VariableManager = require('./structure/variablemanager')

{ exceptionFactory: exceptions } = require('util/exception')

{ difference, forEach } = require('brazierjs/array')

{ ExtraVariableSpec } = require('./structure/variablespec')

perspectiveFromNum = (num) ->
  switch num
    when 0 then Observe
    when 1 then Ride
    when 2 then Follow
    when 3 then Watch
    else        throw exceptions.internal("Invalid perspective number: #{num}")

perspectiveToNum = (p) ->
  switch p
    when Observe then 0
    when Ride    then 1
    when Follow  then 2
    when Watch   then 3
    else              throw exceptions.internal("Invalid perspective: #{p}")

perspectiveFromString = (str) ->
  switch str
    when 'observe' then Observe
    when 'ride'    then Ride
    when 'follow'  then Follow
    when 'watch'   then Watch
    else                throw exceptions.internal("Invalid perspective string: #{str}")

perspectiveToString = (p) ->
  switch p
    when Observe then 'observe'
    when Ride    then 'ride'
    when Follow  then 'follow'
    when Watch   then 'watch'
    else              throw exceptions.internal("Invalid perspective: #{p}")

module.exports.Perspective = {
  Observe
, Ride
, Follow
, Watch
, perspectiveFromNum
, perspectiveToNum
, perspectiveFromString
, perspectiveToString
}

module.exports.Observer = class Observer

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
      @_codeGlobalNames = difference(@_globalNames)(@_interfaceGlobalNames)

    # () => Unit
    clearCodeGlobals: ->
      forEach((name) => @_varManager[name] = 0; return)(@_codeGlobalNames)
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

    # (String) => Any
    getVariable: (varName) ->
      @getGlobal(varName)

    # () => Perspective
    getPerspective: ->
      @_perspective

    # (Perspective, Agent) => Unit
    setPerspective: (perspective, subject) ->
      @_perspective = perspective
      @_targetAgent = subject
      @_updatePerspective()
      return

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

    # (String, Any) => Unit
    setVariable: (varName, value) ->
      @setGlobal(varName, value)
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
      @_perspective = Watch
      @_targetAgent = if checks.isTurtle(agent) or checks.isPatch(agent) then agent else Nobody
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
