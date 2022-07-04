# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ fold } = require('brazierjs/maybe')

# (() => Agent, Validator) => (String, Map[Any, String]) => (Any) => Unit
genSetter = (getSelf, validator) -> (name, mappings) ->
  (value) =>
    patchOrTurtle = getSelf()
    fold(->)(
      (error) =>
        msg        = mappings.get(error)
        defaultMsg = "An unknown error occurred when setting the '#{name}' of \
'#{patchOrTurtle}': #{error}"
        validator.error('set', msg ? defaultMsg)
    )(patchOrTurtle.setPatchVariableIfValid(name, value))
    return

class PatchChecks

  _setterChecks: null # Map[String, (Any) => Unit]

  # (Validator, () => Number|Agent)
  constructor: (@validator, @getSelf) ->

    @_setterChecks = new Map()

    asSetter     = genSetter(@getSelf, @validator)
    toSetterPair = ([varName, mappings]) -> [varName, asSetter(varName, mappings)]

    @_setterChecks =
      new Map(
        [].map(toSetterPair)
      )

  # (String, Any) => Unit
  setVariable: (name, value) ->
    patchOrTurtle = @getSelf()
    if @_setterChecks.has(name)
      check = @_setterChecks.get(name)
      check(value)
    else
      patchOrTurtle.setPatchVariable(name, value)

    return

  # (String) => Any
  getVariable: (name) ->
    @getSelf().getPatchVariable(name)

module.exports = PatchChecks
