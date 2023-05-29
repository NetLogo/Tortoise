# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ difference } = require('brazierjs/array')

{ ExtraVariableSpec, ImmutableVariableSpec, MutableVariableSpec } = require('./variablespec')

{ exceptionFactory: exceptions } = require('util/exception')

module.exports =
  # I re-implemented the variable manager as two tiers: Map for custom variables; and Object.defineProperty for built-in variables.
  # This allows for higher performance, less memory consumption, both in terms of creation of VarManagers, and in terms of memory consumption.
  # The final straw: if you define a turtle variable calls "has", it breaks the entire system!
  # A related article: https://www.zhenghao.io/posts/object-vs-map
  # Another one: https://stackoverflow.com/questions/66931535/javascript-object-vs-map-set-key-lookup-performance --John Chen May 2023
  class VariableManager

    _values:          null      # {}
    _setters:         null      # {String, (Any) => Boolean}

    # The general idea here is to simplify and streamline the manager, so it no longer validates the variable names.
    # We validate the variable names in prim checks, and had no checks for globals anyway. So why bother? --John Chen May 2023
    # (Agent, Array[VariableSpec[_]]) => VariableManager
    constructor: (@agent, varSpecs) ->
      @_values          = new Object(null)
      @_setters         = new Object(null)
      @_addVarsBySpec(varSpecs)

    # (String) => Any
    getVariable: (varName) ->
      value = @_values[varName]
      if typeof value isnt "undefined"
        value
      else
        @_values[varName] = 0
        0
    
    # () => (String) => Any
    getVariableWrapper: () ->
      (varName) => @getVariable(varName)

    # (String, Any) => Unit
    setVariable: (varName, value) ->
      @_values[varName] = value
      return
    
    # (String, Any) => Maybe[Any]
    setIfValid: (name, value) ->
      @_setters[name].call(@agent, value)

    # () => (String) => Any
    setVariableWrapper: () ->
      (varName, value) => @setVariable(varName, value)

    # () => Unit
    reset: () ->
      for varName of Object.keys(@_values)
        delete @_values[varName] if not @_setters.has(varName)
      return

    # ExtraVariableSpec is no longer a thing. We only care about built-in variables as special cases. --John Chen May 2023
    # (Array[VariableSpec]) => Unit
    _addVarsBySpec: (varSpecs) ->
      for spec in varSpecs
        obj =
          if spec instanceof MutableVariableSpec
            get = do (spec, agent = @agent) -> (-> spec.get.call(agent))
            set = do (spec, agent = @agent) -> ((v) -> spec.set.call(agent, v))
            @_setters[spec.name] = spec.set
            { configurable: true, get, set }
          else if spec instanceof ImmutableVariableSpec
            { value: spec.get.call(@agent), writable: false }
          else
            throw exceptions.internal("Non-exhaustive spec type match: #{typeof(spec)}!")
        @_defineProperty(spec.name, obj)
      return

    # (String, Object) => Unit
    _defineProperty: (propName, config) ->
      Object.defineProperty(@_values, propName, config)
      return
