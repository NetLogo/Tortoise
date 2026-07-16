# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ fold } = require('brazierjs/maybe')

{ TopologyInterrupt, TowardsInterrupt } = require('util/interrupts')

# (() => Agent, Validator) => (String, Map[Any, String]) => (Any) => Unit
genSetter = (getSelf, validator) -> (name, mappings) ->
  (value) =>
    turtle = getSelf()
    fold(->)(
      (error) =>
        msg         = mappings.get(error)
        # Messages that name the offending value need these; the rgb ones ignore them.
        environment = { myType: "turtle", varName: name, target: value }
        defaultMsg  = "An unknown error occurred when setting the '#{name}' of \
'#{turtle}': #{error}"
        validator.error('set', null, null, msg ? defaultMsg, environment)
    )(turtle.setIfValid(name, value))
    return

# Every error a setter can hand back, and the message it becomes.  One table serves every variable: a setter only
# ever produces the errors it validates, so `size` can't emit an rgb error any more than `color` can.
# -Jeremy B July 2026
typeErrorMappings = [ ["Invalid number type" , "can't set _ variable _ to non-number _"]
                    , ["Invalid string type" , "can't set _ variable _ to non-string _"]
                    , ["Invalid boolean type", "can't set _ variable _ to non-boolean _"]
                    , ["Invalid color type"  , "can't set _ variable _ to non-number _"]
                    , ["Invalid RGB format"  , "An rgb list must contain 3 or 4 numbers 0-255"]
                    , ["Invalid RGB number"  , "RGB values must be 0-255"]
                    ]

class TurtleChecks

  _getterChecks: null # Map[String, (Any) => Unit]
  _setterChecks: null # Map[String, (Any) => Unit]

  # (Validator, () => Agent, TurtleManager, BreedManager)
  constructor: (@validator, @getSelf, @turtleManager, @breedManager) ->

    @_getterChecks = new Map()

    cannotMoveMsg = "Cannot move turtle beyond the world_s edge."

    setterMappings    = new Map(typeErrorMappings)
    corSetterMappings = new Map(typeErrorMappings.concat([[TopologyInterrupt, cannotMoveMsg]]))

    asSetter     = genSetter(@getSelf, @validator)
    toSetterPair = ([varName, mappings]) -> [varName, asSetter(varName, mappings)]

    @_setterChecks =
      new Map(
        [ ["xcor"       , corSetterMappings]
        , ["ycor"       , corSetterMappings]
        , ["color"      ,    setterMappings]
        , ["label-color",    setterMappings]
        , ["heading"    ,    setterMappings]
        , ["hidden?"    ,    setterMappings]
        , ["pen-mode"   ,    setterMappings]
        , ["pen-size"   ,    setterMappings]
        , ["shape"      ,    setterMappings]
        , ["size"       ,    setterMappings]
        ].map(toSetterPair)
      )

  # (Int, Int, Number) => Agent
  getTurtle: (sourceStart, sourceEnd, id) ->
    if not Number.isInteger(id)
      @validator.error('turtle', sourceStart, sourceEnd, '_ is not an integer', id)
    @turtleManager.getTurtle(id)

  # (Int, Int, String, Number) => Agent
  getTurtleOfBreed: (sourceStart, sourceEnd, breedName, id) ->
    agent   = @getTurtle(sourceStart, sourceEnd, id)
    isValid = agent.id isnt -1
    if isValid and agent.getBreedName().toUpperCase() isnt breedName.toUpperCase()
      lowerName      = breedName.toLowerCase()
      targetSingular = @breedManager.get(breedName).singular.toUpperCase()
      turtleStr      = "#{agent.getBreedNameSingular()} #{agent.id}"
      @validator.error(lowerName, sourceStart, sourceEnd, '_ is not a _', turtleStr, targetSingular)
    agent

  # (Int, Int, String) => Any
  getVariable: (sourceStart, sourceEnd, name) ->
    turtle = @getSelf()
    if not turtle.hasVariable(name)
      msgKey    = "_ breed does not own variable _"
      upperName = name.toUpperCase()
      @validator.error(upperName, sourceStart, sourceEnd, msgKey, turtle.getBreedName(), upperName)
    else if @_getterChecks.has(name)
      check = @_getterChecks.get(name)
      check(name)
    else
      turtle.getVariable(name)

  # (Int, Int, String, Any) => Unit
  setVariable: (sourceStart, sourceEnd, name, value) ->
    turtle = @getSelf()
    if not turtle.hasVariable(name)
      msgKey    = "_ breed does not own variable _"
      upperName = name.toUpperCase()
      @validator.error('set', sourceStart, sourceEnd, msgKey, turtle.getBreedName(), upperName)
    else if @_setterChecks.has(name)
      check = @_setterChecks.get(name)
      check(value)
    else
      turtle.setVariable(name, value)

    return

  # (Int, Int, Number, Number) => Unit
  setXY: (sourceStart, sourceEnd, x, y) ->
    result = @getSelf().setXY(x, y)
    if (result is TopologyInterrupt)
      @validator.error('setxy', sourceStart, sourceEnd, 'The point [ _ , _ ] is outside of the boundaries of the world and wrapping is not permitted in one or both directions.', x, y)

    return

  # (Int, Int, Agent) => Number
  towards: (sourceStart, sourceEnd, agent) ->
    heading = @getSelf().towards(agent)
    if heading is TowardsInterrupt
      [x, y] = agent.getCoords()
      @validator.error('towards', sourceStart, sourceEnd, 'No heading is defined from a point (_,_) to that same point.', x, y)
    heading

  # (Int, Int, Number, Number) => Number
  towardsXY: (sourceStart, sourceEnd, x, y) ->
    heading = @getSelf().towardsXY(x, y)
    if heading is TowardsInterrupt
      @validator.error('towardsxy', sourceStart, sourceEnd, 'No heading is defined from a point (_,_) to that same point.', x, y)
    heading

module.exports = TurtleChecks
