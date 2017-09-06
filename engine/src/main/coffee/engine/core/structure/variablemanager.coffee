# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ difference } = require('brazierjs/array')

{ ExtraVariableSpec, ImmutableVariableSpec, MutableVariableSpec } = require('./variablespec')

module.exports =
  class VariableManager

    _names: undefined # Array[String]

    # (Agent, Array[VariableSpec[_]]) => VariableManager
    constructor: (@agent, varSpecs) ->
      @_addVarsBySpec(varSpecs)
      @_names = (name for { name } in varSpecs)

    # () => Array[String]
    names: ->
      @_names

    # (Array[String], Array[String]) => Unit
    refineBy: (oldNames, newNames) ->
      invalidatedSetter = (name) -> (value) -> throw new Error("#{name} is no longer a valid variable.")

      obsoletedNames = difference(newNames)(oldNames)
      freshNames     = difference(oldNames)(newNames)
      specs          = freshNames.map((name) -> new ExtraVariableSpec(name))

      for name in obsoletedNames
        @_defineProperty(name, { get: undefined, set: invalidatedSetter(name), configurable: true })

      @_addVarsBySpec(specs)
      @_names = difference(obsoletedNames)(@_names).concat(freshNames)

      return

    # (Array[VariableSpec]) => Unit
    _addVarsBySpec: (varSpecs) ->
      for spec in varSpecs
        obj =
          if spec instanceof ExtraVariableSpec
            { configurable: true, value: 0, writable: true }
          else if spec instanceof MutableVariableSpec
            get = do (spec) -> (-> spec.get.call(@agent))
            set = do (spec) -> ((x) -> spec.set.call(@agent, x))
            { configurable: true, get, set }
          else if spec instanceof ImmutableVariableSpec
            { value: spec.get.call(@agent), writable: false }
          else
            throw new Error("Non-exhaustive spec type match: #{typeof(spec)}!")
        @_defineProperty(spec.name, obj)
      return

    # (String, Object) => Unit
    _defineProperty: (propName, config) ->
      Object.defineProperty(this, propName, config)
      return
