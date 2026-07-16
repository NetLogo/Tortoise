# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ fold } = require('brazierjs/maybe')

{ TowardsInterrupt } = require('util/interrupts')

# (() => Agent, Validator) => (String, Map[Any, String]) => (Any) => Unit
genSetter = (getSelf, validator) -> (name, mappings) ->
  (value) =>
    link = getSelf()
    fold(->)(
      (error) =>
        msg         = mappings.get(error)
        # Messages that name the offending value need these; the rgb ones ignore them.
        environment = { myType: "link", varName: name, target: value }
        defaultMsg  = "An unknown error occurred when setting the '#{name}' of \
'#{link}': #{error}"
        validator.error('set', null, null, msg ? defaultMsg, environment)
    )(link.setIfValid(name, value))
    return

class LinkChecks

  _setterChecks: null # Map[String, (Any) => Unit]

  # (Validator, () => Number|Agent, SelfPrims)
  constructor: (@validator, @getSelf, @selfPrims) ->

    @_setterChecks = new Map()

    # See the matching table in `turtle-checks`; links add their endpoints, which can't be reassigned at all.
    setterMappings = new Map(
      [ ["Invalid number type" , "can't set _ variable _ to non-number _"]
      , ["Invalid string type" , "can't set _ variable _ to non-string _"]
      , ["Invalid boolean type", "can't set _ variable _ to non-boolean _"]
      , ["Invalid color type"  , "can't set _ variable _ to non-number _"]
      , ["Invalid RGB format"  , "An rgb list must contain 3 or 4 numbers 0-255"]
      , ["Invalid RGB number"  , "RGB values must be 0-255"]
      , ["Cannot change endpoints", "you can't change a link's endpoints"]
      ])

    asSetter     = genSetter(@getSelf, @validator)
    toSetterPair = ([varName, mappings]) -> [varName, asSetter(varName, mappings)]

    @_setterChecks =
      new Map(
        [ ["color"      , setterMappings]
        , ["label-color", setterMappings]
        , ["end1"       , setterMappings]
        , ["end2"       , setterMappings]
        , ["hidden?"    , setterMappings]
        , ["shape"      , setterMappings]
        , ["thickness"  , setterMappings]
        , ["tie-mode"   , setterMappings]
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
      link.setVariable(name, value)

    return

  # (Int, Int, String) => Any
  getVariable: (sourceStart, sourceEnd, name) ->
    link = @getSelf()
    if not link.hasVariable(name)
      msgKey    = "_ breed does not own variable _"
      upperName = name.toUpperCase()
      @validator.error(upperName, sourceStart, sourceEnd, msgKey, link.getBreedName(), upperName)
    else
      link.getVariable(name)

module.exports = LinkChecks
