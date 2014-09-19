# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports =
  class VariableManager

    # type VariableBundle = { name: String, get: GetFunc, set: SetFunc }

    # (Array[String], Array[VariableBundle]) => VariableManager
    constructor: (@_varNames = [], @_getAndSetFuncs = []) ->
      @_addVarsByName(@_varNames)
      @_addVarsByBundle(@_getAndSetFuncs)

    # (Array[String]) => (Array[String], Array[VariableBundle]) => Unit
    refineBy: (obsoleteVarNames = []) => (varNames = [], getAndSetFuncs = []) =>
      invalidatedSetter = -> throw new Error("#{name} is no longer a valid variable.")
      for name in obsoleteVarNames
        @_defineProperty(name, { get: undefined, set: invalidatedSetter, configurable: true })

      @_addVarsByName(varNames)
      @_addVarsByBundle(getAndSetFuncs)

      return

    # (Array[String]) => Unit
    _addVarsByName: (varNames) ->
      for name in varNames
        @_defineProperty(name, { value: 0, writable: true, configurable: true })
      return

    # (Array[VariableBundle]) => Unit
    _addVarsByBundle: (bundles) ->
      for { name: name, get: get, set: set } in bundles
        @_defineProperty(name, { get: get, set: set, configurable: true })
      return

    # (String, Object) => Unit
    _defineProperty: (propName, config) ->
      Object.defineProperty(this, propName, config)
      return
