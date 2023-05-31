# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ fold } = require('brazierjs/maybe')

{ checks } = require('engine/core/typechecker')

# (() => Agent, Validator) => (String, Map[Any, String]) => (Any) => Unit
genSetter = (getSelf, validator) -> (name, mappings) -> (value) ->

  pot = getSelf() # pot: patchOrTurtle

  fold(->)(
    (error) =>

      target      = if checks.isPatch(pot) then pot else pot.getPatchHere()
      environment = { myType: "patch", varName: name, target }
      msg         = mappings.get(error)
      defaultMsg  = "An unknown error occurred when setting the '#{name}' of \
'#{pot}': #{error}"

      validator.error('set', null, null, msg ? defaultMsg, environment)

  )(pot.setPatchVariableIfValid(name, value))

  return

class PatchChecks

  _setterChecks: null # Map[String, (Any) => Unit]

  # (Validator, () => Number|Agent)
  constructor: (@validator, @getSelf) ->

    @_setterChecks = new Map()

    invalidColorTypeMsg = "can't set _ variable _ to non-number _"
    invalidRGBMsg3      = "An rgb list must contain 3 numbers 0-255"
    invalidRGBMsg3Or4   = "An rgb list must contain 3 or 4 numbers 0-255"
    invalidRGBNumberMsg = "RGB values must be 0-255"

    pcolorMappings = new Map([ ["Invalid RGB format", invalidRGBMsg3]
                             , ["Invalid RGB number", invalidRGBNumberMsg]
                             , ["Invalid color type", invalidColorTypeMsg]
                             ])

    plabelColorMappings = new Map([ ["Invalid RGB format", invalidRGBMsg3Or4]
                                  , ["Invalid RGB number", invalidRGBNumberMsg]
                                  , ["Invalid color type", invalidColorTypeMsg]
                                  ])

    asSetter     = genSetter(@getSelf, @validator)
    toSetterPair = ([varName, mappings]) -> [varName, asSetter(varName, mappings)]

    @_setterChecks =
      new Map(
        [ ["pcolor"      ,      pcolorMappings]
        , ["plabel-color", plabelColorMappings]
        ].map(toSetterPair)
      )

  # (Int, Int, String, Any) => Unit
  setVariable: (sourceStart, sourceEnd, name, value) ->
    patchOrTurtle = @getSelf()
    if @_setterChecks.has(name)
      if not checks.isPatch(patchOrTurtle) and not checks.isTurtle(patchOrTurtle)
        @validator.error('set', sourceStart, sourceEnd, '_ does not exist in _.', name.toUpperCase(),
          if patchOrTurtle is 0 then "OBSERVER" else patchOrTurtle.getBreedName())
      else
        check = @_setterChecks.get(name)
        check(value)
    else
      patchOrTurtle.setPatchVariable(name, value)

    return

  # (Int, Int, String) => Any
  getVariable: (sourceStart, sourceEnd, name) ->
    @getSelf().getPatchVariable(name, sourceStart, sourceEnd)

module.exports = PatchChecks
