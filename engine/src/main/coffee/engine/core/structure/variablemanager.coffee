# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ difference } = require('brazierjs/array')

{ ExtraVariableSpec, ImmutableVariableSpec, MutableVariableSpec } = require('./variablespec')

{ exceptionFactory: exceptions } = require('util/exception')

module.exports =
  class VariableManager

    _names:           undefined # Set[String]
    _validitySetters: null      # Map[String, (Any) => Boolean]

    # (Agent, Array[VariableSpec[_]]) => VariableManager
    constructor: (@agent, varSpecs) ->
      @_validitySetters = new Map()
      @_addVarsBySpec(varSpecs)
      @_names = new Set(name for { name } in varSpecs)

    # (String, Any) => Maybe[Any]
    setIfValid: (name, value) ->
      @_validitySetters.get(name).call(@agent, value)

    # () => Boolean
    has: (varName) ->
      @_names.has(varName)

    # () => Array[String]
    names: ->
      Array.from(@_names)

    # (Array[String], Array[String]) => Unit
    refineBy: (oldNames, newNames) ->
      invalidatedSetter = (name) -> (value) -> throw exceptions.internal("#{name} is no longer a valid variable.")

      obsoletedNames = difference(oldNames)(newNames)
      freshNames     = difference(newNames)(oldNames)
      specs          = freshNames.map((name) -> new ExtraVariableSpec(name))

      for name in obsoletedNames
        @_defineProperty(name, { get: undefined, set: invalidatedSetter(name), configurable: true })

      @_addVarsBySpec(specs)
      @_names = new Set(difference(@names())(obsoletedNames).concat(freshNames))

      return

    # (Array[VariableSpec]) => Unit
    reset: (varNames) ->
      varNames.forEach( (name) => this[name] = 0 )
      return

    # (Array[VariableSpec]) => Unit
    _addVarsBySpec: (varSpecs) ->
      for spec in varSpecs
        obj =
          if spec instanceof ExtraVariableSpec
            { configurable: true, value: 0, writable: true }
          else if spec instanceof MutableVariableSpec
            get = do (spec) -> (-> spec.get.call(@agent))
            set = do (spec) -> ((v) -> spec.set.call(@agent, v))
            @_validitySetters.set(spec.name, spec.set)
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
