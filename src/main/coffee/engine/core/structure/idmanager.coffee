# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(->

  class IDManager

    # Number
    _count: undefined

    # () => IDManager
    constructor: ->
      @reset()

    # () => Unit
    reset: ->
      @_count = 0
      return

    # Number
    next: ->
      @_count++

    # ((T) => U) => Unit
    suspendDuring: (f) ->
      oldCount = @_count
      f()
      @_count = oldCount
      return

)
