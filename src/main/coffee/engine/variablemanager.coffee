define(['integration/lodash'], (_) ->

  class VariableManager

    _variables: undefined # Object[String, Any]
    _getters:   undefined # Object[String, => Any]
    _setters:   undefined # Object[String, (Any) => Unit]

    # (Array[String], Array[{ name: String, get: () => Any, set: (Any) => Unit }]) => VariableManager
    constructor: (varNames = [], getAndSetFuncs = []) ->
      @_variables = _(varNames).foldl(((acc, name) => acc[name] = 0; acc), {})
      [@_getters, @_setters] =
        _(getAndSetFuncs).foldl(
          (acc, x) =>
            [getters, setters] = acc
            getters[x.name]    = x.get
            setters[x.name]    = x.set
            acc
        , [{}, {}])

    # Purposely written into a wordy, optimized form --JAB (5/28/14)
    # (String) => Any
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

    # (String, Any) => Unit
    set: (varName, value) ->
      if @_variables[varName]? or not @_setters[varName]?
        @_variables[varName] = value
      else
        @_setters[varName](value)
      return

)
