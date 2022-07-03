# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ fold } = require('brazierjs/maybe')

{ TowardsInterrupt } = require('util/interrupts')

# (() => Agent, Validator) => (String, Map[Any, String]) => (Any) => Unit
genSetter = (getSelf, validator) -> (name, mappings) ->
  (value) =>
    link = getSelf()
    fold(->)(
      (error) =>
        msg        = mappings.get(error)
        defaultMsg = "An unknown error occurred when setting the '#{name}' of \
'#{link}': #{error}"
        validator.error('set', msg ? defaultMsg)
    )(link.setIfValid(name, value))
    return

class LinkChecks

  _setterChecks: null # Map[String, (Any) => Unit]

  # (Validator, () => Number|Agent, SelfPrims)
  constructor: (@validator, @getSelf, @selfPrims) ->

    @_setterChecks = new Map()

    asSetter     = genSetter(@getSelf, @validator)
    toSetterPair = ([varName, mappings]) -> [varName, asSetter(varName, mappings)]

    @_setterChecks =
      new Map(
        [
        ].map(toSetterPair)
      )

  linkHeading: () ->
    heading = @selfPrims.linkHeading()
    if heading is TowardsInterrupt
      @validator.error('link-heading', 'there is no heading of a link whose endpoints are in the same position')
    heading

  # (String, Any) => Unit
  setVariable: (name, value) ->
    link = @getSelf()
    if not link.hasVariable(name)
      msgKey    = "_ breed does not own variable _"
      upperName = name.toUpperCase()
      @validator.error('set', msgKey, link.getBreedName(), upperName)
    else if @_setterChecks.has(name)
      check = @_setterChecks.get(name)
      check(value)
    else
      link.setVariable(name, value)

    return

  # (String) => Any
  getVariable: (name) ->
    link = @getSelf()
    if not link.hasVariable(name)
      msgKey    = "_ breed does not own variable _"
      upperName = name.toUpperCase()
      @validator.error(upperName, msgKey, link.getBreedName(), upperName)
    else
      link.getVariable(name)

module.exports = LinkChecks
