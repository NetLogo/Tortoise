define(->

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

)
