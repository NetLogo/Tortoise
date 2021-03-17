# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ TopologyInterrupt } = require('util/interrupts')

class TurtleChecks

  _getterChecks: new Map()
  _setterChecks: new Map()

  constructor: (@validator, @getSelf) ->
    @_setterChecks.set("xcor", @makeCheckedSetter("xcor", 'Cannot move turtle beyond the world_s edge.'))
    @_setterChecks.set("ycor", @makeCheckedSetter("ycor", 'Cannot move turtle beyond the world_s edge.'))

  makeCheckedSetter: (name, error) ->
    (value) =>
      turtle = @getSelf()
      if not turtle.setIfValid(name, value)
        @validator.error(error)
      return

  # (Number, Number) => Unit
  setXY: (x, y) ->
    result = @getSelf().setXY(x, y)
    if (result is TopologyInterrupt)
      @validator.error('The point [ _ , _ ] is outside of the boundaries of the world and wrapping is not permitted in one or both directions.', x, y)

    return

  # (String, Any) => Unit
  setVariable: (name, value) ->
    if @_setterChecks.has(name)
      check = @_setterChecks.get(name)
      check(value)
    else
      @getSelf().setVariable(name, value)

    return

  # (String) => Any
  getVariable: (name) ->
    if @_getterChecks.has(name)
      check = @_getterChecks.get(name)
      check(name)
    else
      @getSelf().getVariable(name)

module.exports = TurtleChecks
