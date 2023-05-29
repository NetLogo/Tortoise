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
        validator.error('set', null, null, msg ? defaultMsg)
    )(link._varManager.setIfValid(name, value))
    return

class LinkChecks

  _setterChecks: null # Map[String, (Any) => Unit]

  # (Validator, () => Number|Agent, SelfPrims)
  constructor: (@validator, @getSelf, @selfPrims) ->

    @_setterChecks = new Map()

    invalidRGBMsg       = "An rgb list must contain 3 or 4 numbers 0-255"
    invalidRGBNumberMsg = "RGB values must be 0-255"

    colorSetterMappings = new Map([ ["Invalid RGB format", invalidRGBMsg]
                                  , ["Invalid RGB number", invalidRGBNumberMsg]])

    asSetter     = genSetter(@getSelf, @validator)
    toSetterPair = ([varName, mappings]) -> [varName, asSetter(varName, mappings)]

    @_setterChecks =
      new Map(
        [ ["color"      , colorSetterMappings]
        , ["label-color", colorSetterMappings]
        ].map(toSetterPair)
      )

  # (Int, Int) => Int
  linkHeading: (sourceStart, sourceEnd) ->
    heading = @selfPrims.linkHeading()
    if heading is TowardsInterrupt
      @validator.error('link-heading', sourceStart, sourceEnd, 'there is no heading of a link whose endpoints are in the same position')
    heading

  # (Int, Int, String, Any) => Unit
  setVariable: (sourceStart, sourceEnd, name, value) ->
    link = @getSelf()
    if not link.hasVariable(name)
      msgKey    = "_ breed does not own variable _"
      upperName = name.toUpperCase()
      @validator.error('set', sourceStart, sourceEnd, msgKey, link.getBreedName(), upperName)
    else if @_setterChecks.has(name)
      check = @_setterChecks.get(name)
      check(value)
    else
      link._varManager.setVariable(name, value)

    return

  # (Int, Int, String) => Any
  getVariable: (sourceStart, sourceEnd, name) ->
    link = @getSelf()
    if not link.hasVariable(name)
      msgKey    = "_ breed does not own variable _"
      upperName = name.toUpperCase()
      @validator.error(upperName, sourceStart, sourceEnd, msgKey, link.getBreedName(), upperName)
    else
      link._varManager.getVariable(name)

module.exports = LinkChecks
