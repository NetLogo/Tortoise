# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Exception = require('tortoise/util/exception')

EvilSentinel = -1

module.exports =
  class Ticker

    # Number
    _count: undefined

    # (() => Unit, () => Unit, (String*) => Unit) => Ticker
    constructor: (@_onReset, @_onTick, @_updateFunc) ->
      @_count = EvilSentinel

    # () => Unit
    reset: ->
      @_updateTicks(-> 0)
      @_onReset()
      @_onTick()
      return

    # () => Unit
    clear: ->
      @_updateTicks(-> EvilSentinel)
      return

    # () => Unit
    tick: ->
      if @ticksAreStarted()
        @_updateTicks((counter) -> counter + 1)
      else
        throw new Error("The tick counter has not been started yet. Use RESET-TICKS.")
      @_onTick()
      return

    # (Number) => Unit
    tickAdvance: (n) ->
      if n < 0
        throw new Error("Cannot advance the tick counter by a negative amount.")
      else if @ticksAreStarted()
        @_updateTicks((counter) -> counter + n)
      else
        throw new Error("The tick counter has not been started yet. Use RESET-TICKS.")

    # () => Boolean
    ticksAreStarted: ->
      @_count isnt EvilSentinel

    # () => Number
    tickCount: ->
      if @ticksAreStarted()
        @_count
      else
        throw new Error("The tick counter has not been started yet. Use RESET-TICKS.")

    # ((Number) => Number) => Unit
    _updateTicks: (updateCountFunc) ->
      @_count = updateCountFunc(@_count)
      @_updateFunc("ticks")
      return
