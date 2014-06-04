define(['integration/lodash'], (_) ->

  # type Var            = Any
  # type GetFunc        = () => Var
  # type SetFunc        = (Var) => Unit
  # type VariableBundle = { name: String, get: GetFunc, set: SetFunc }
  # type VarObj         = Object[String, Var]
  # type GetObj         = Object[String, GetFunc]
  # type SetObj         = Object[String, SetFunc]

  Companion =
    # (Array[String], Array[VariableBundle]) => VariableManager
    generate: (varNames = [], getAndSetFuncs = []) ->
      variables          = @_generateVarsObj(varNames)
      [getters, setters] = @_generateGetsAndSets(getAndSetFuncs)
      new VariableManager(variables, getters, setters)

    # (Array[String], VarObj) => VarObj
    _generateVarsObj: (varNames, baseObj = {}) ->
      _(varNames).foldl(((acc, name) => acc[name] = 0; acc), baseObj)

    # (Array[VariableBundle], GetObj, SetObj) => (GetObj, SetObj)
    _generateGetsAndSets: (getAndSetFuncs, baseGets = {}, baseSets = {}) ->
      _(getAndSetFuncs).foldl(
        (acc, x) =>
          [getters, setters] = acc
          getters[x.name]    = x.get
          setters[x.name]    = x.set
          acc
      , [baseGets, baseSets])

  class VariableManager

    # (VarObj, GetObj, SetObj) => VariableManager
    constructor: (@_variables, @_getters, @_setters) ->

    # Purposely written into a wordy, optimized form --JAB (5/28/14)
    # (String) => Var
    get: (varName) ->
      raw = @_variables[varName]
      if raw?
        raw
      else
        getter = @_getters[varName]
        if getter?
          getter()
        else
          undefined

    # (String, Var) => Unit
    set: (varName, value) ->
      if @_variables[varName]? or not @_setters[varName]?
        @_variables[varName] = value
      else
        @_setters[varName](value)
      return

    # (Array[String]) => (Array[String], Array[VariableBundle]) => VariableManager
    refineBy: (obsoleteVarNames = []) => (varNames = [], getAndSetFuncs = []) =>
      trim = (obj) -> _(obj).omit(obsoleteVarNames).value()

      trimmedVars = trim(@_variables)
      trimmedGets = trim(@_getters)
      trimmedSets = trim(@_setters)

      fullVars             = Companion._generateVarsObj(varNames, trimmedVars)
      [fullGets, fullSets] = Companion._generateGetsAndSets(getAndSetFuncs, trimmedGets, trimmedSets)

      new VariableManager(fullVars, fullGets, fullSets)


  {
    Class:     VariableManager
    Companion: Companion
  }

)
