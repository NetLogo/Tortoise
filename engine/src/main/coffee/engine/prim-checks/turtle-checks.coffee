# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ fold } = require('brazierjs/maybe')

{ TopologyInterrupt, TowardsInterrupt } = require('util/interrupts')

class TurtleChecks

  _getterChecks: null
  _setterChecks: null

  # (Validator, () => Agent, TurtleManager, BreedManager)
  constructor: (@validator, @getSelf, @turtleManager, @breedManager) ->

    @_getterChecks = new Map()
    @_setterChecks = new Map()

    cannotMoveMsg       = "Cannot move turtle beyond the world_s edge."
    invalidRGBMsg       = "An rgb list must contain 3 or 4 numbers 0-255"
    invalidRGBNumberMsg = "RGB values must be 0-255"

    corSetterMappings   = new Map([ [TopologyInterrupt   , cannotMoveMsg]])
    colorSetterMappings = new Map([ ["Invalid RGB format", invalidRGBMsg]
                                  , ["Invalid RGB number", invalidRGBNumberMsg]])

    setter = @makeCheckedSetter.bind(this)

    @_setterChecks.set("xcor"       , setter("xcor"       ,   corSetterMappings))
    @_setterChecks.set("ycor"       , setter("ycor"       ,   corSetterMappings))
    @_setterChecks.set("color"      , setter("color"      , colorSetterMappings))
    @_setterChecks.set("label-color", setter("label-color", colorSetterMappings))

  # (String, Map[Any, String]) => (Any) => Unit
  makeCheckedSetter: (name, mappings) ->
    (value) =>
      turtle = @getSelf()
      fold(->)(
        (error) =>
          msg        = mappings.get(error)
          defaultMsg = "An unknown error occurred when setting the '#{name}' of \
'#{turtle}': #{error}"
          @validator.error('set', msg ? defaultMsg)
      )(turtle.setIfValid(name, value))
      return

  # (Number) => Agent
  getTurtle: (id) ->
    if not Number.isInteger(id)
      @validator.error('turtle', '_ is not an integer', id)
    @turtleManager.getTurtle(id)

  # (String, Number) => Agent
  getTurtleOfBreed: (breedName, id) ->
    agent   = @getTurtle(id)
    isValid = agent.id isnt -1
    if isValid and agent.getBreedName().toUpperCase() isnt breedName.toUpperCase()
      lowerName      = breedName.toLowerCase()
      targetSingular = @breedManager.get(breedName).singular.toUpperCase()
      turtleStr      = "#{agent.getBreedNameSingular()} #{agent.id}"
      @validator.error(lowerName, '_ is not a _', turtleStr, targetSingular)
    agent

  # (String) => Any
  getVariable: (name) ->
    turtle = @getSelf()
    if not turtle.hasVariable(name)
      msgKey    = "_ breed does not own variable _"
      upperName = name.toUpperCase()
      @validator.error(upperName, msgKey, turtle.getBreedName(), upperName)
    else if @_getterChecks.has(name)
      check = @_getterChecks.get(name)
      check(name)
    else
      turtle.getVariable(name)

  # (String, Any) => Unit
  setVariable: (name, value) ->
    turtle = @getSelf()
    if not turtle.hasVariable(name)
      msgKey    = "_ breed does not own variable _"
      upperName = name.toUpperCase()
      @validator.error('set', msgKey, turtle.getBreedName(), upperName)
    else if @_setterChecks.has(name)
      check = @_setterChecks.get(name)
      check(value)
    else
      turtle.setVariable(name, value)

    return

  # (Number, Number) => Unit
  setXY: (x, y) ->
    result = @getSelf().setXY(x, y)
    if (result is TopologyInterrupt)
      @validator.error('setxy', 'The point [ _ , _ ] is outside of the boundaries of the world and wrapping is not permitted in one or both directions.', x, y)

    return

  # (Agent) => Number
  towards: (agent) ->
    heading = @getSelf().towards(agent)
    if heading is TowardsInterrupt
      [x, y] = agent.getCoords()
      @validator.error('towards', 'No heading is defined from a point (_,_) to that same point.', x, y)
    heading

  # (Number, Number) => Number
  towardsXY: (x, y) ->
    heading = @getSelf().towardsXY(x, y)
    if heading is TowardsInterrupt
      @validator.error('towardsxy', 'No heading is defined from a point (_,_) to that same point.', x, y)
    heading

module.exports = TurtleChecks
