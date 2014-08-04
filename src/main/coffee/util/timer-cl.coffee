# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('util.timer')

  class Timer

    # Number
    _startTime: undefined

    # () => Timer
    constructor: ->
      @reset()

    # () => Number
    elapsed: ->
      (Date.now() - @_startTime) / 1000

    # () => Unit
    reset: ->
      @_startTime = Date.now()
      return

