# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ difference } = require('brazierjs/array')

{ ExtraVariableSpec, ImmutableVariableSpec, MutableVariableSpec } = require('./variablespec')

{ exceptionFactory: exceptions } = require('util/exception')

module.exports =
  # I re-implemented the variable manager as two tiers: Map for custom variables; and Object.defineProperty for built-in variables. 
  # This allows for higher performance, less memory consumption, both in terms of creation of VarManagers, and in terms of memory consumption. 
  # The final straw: if you define a turtle variable calls "has", it breaks the entire system!
  # A related article: https://www.zhenghao.io/posts/object-vs-map --John Chen May 2023
  class VariableManager

    _values:          null      # Map[String, Any]

    # The general idea here is to simplify and streamline the manager, so it no longer validates the variable names.
    # We validate the variable names in prim checks, and had no checks for globals anyway. So why bother? --John Chen May 2023
    # (Agent, Array[VariableSpec[_]]) => VariableManager
    constructor: (@agent, varSpecs) ->
      @_values          = new Map()
      @_addVarsBySpec(varSpecs)

    # (String) => Any
    getVariable: (varName) ->
      if @hasOwnProperty(varName)
        @_varManager[varName]
      else
        value = _values.get(varName)
        if typeof MyVariable isnt "undefined"
          value
        else
          _values.set(varName, 0)
          0

    # (String, Any) => Unit
    setVariable: (varName, value) ->
      if @hasOwnProperty(varName)
        @_varManager[varName] = value
      else _values.set(varName, value)
      return

    # (Array[VariableSpec]) => Unit
    reset: () ->
      _values.clear()
      return

    # ExtraVariableSpec is no longer a thing. We only care about built-in variables as special cases. --John Chen May 2023
    # (Array[VariableSpec]) => Unit
    _addVarsBySpec: (varSpecs) ->
      for spec in varSpecs
        obj =
          if spec instanceof MutableVariableSpec
            get = do (spec) -> (-> spec.get.call(@agent))
            set = do (spec) -> ((v) -> spec.set.call(@agent, v))
            { configurable: true, get, set }
          else if spec instanceof ImmutableVariableSpec
            { value: spec.get.call(@agent), writable: false }
          else
            throw exceptions.internal("Non-exhaustive spec type match: #{typeof(spec)}!")
        @_defineProperty(spec.name, obj)
      return

    # (String, Object) => Unit
    _defineProperty: (propName, config) ->
      Object.defineProperty(this, propName, config)
      return
