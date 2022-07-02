# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ TopologyInterrupt, TowardsInterrupt } = require('util/interrupts')

class TurtleChecks

  _getterChecks: null
  _setterChecks: null

  # (Validator, () => Agent, TurtleManager, BreedManager)
  constructor: (@validator, @getSelf, @turtleManager, @breedManager) ->
    @_getterChecks = new Map()
    @_setterChecks = new Map()
    @_setterChecks.set("xcor", @makeCheckedSetter("xcor", 'Cannot move turtle beyond the world_s edge.'))
    @_setterChecks.set("ycor", @makeCheckedSetter("ycor", 'Cannot move turtle beyond the world_s edge.'))

  makeCheckedSetter: (name, error) ->
    (value) =>
      turtle = @getSelf()
      if not turtle.setIfValid(name, value)
        @validator.error('set', error)
      return

  # (Number) => Agent
  getTurtle: (id) ->
    if not Number.isInteger(id)
      @validator.error('turtle', '_ is not an integer', id)
    @turtleManager.getTurtle(id)

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
