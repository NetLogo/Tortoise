# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class PenStatus
  constructor: (@_name) -> # (String) => PenStatus
  toString: -> @_name # () => String

Up   = new PenStatus("up")
Down = new PenStatus("down")

module.exports =
  class PenManager

    # ((String*) => Unit, Number, PenStatus) => PenManager
    constructor: (@_updateFunc, @_size = 1.0, @_status = Up) ->

    # () => Number
    getSize: ->
      @_size

    # () => PenStatus
    getMode: ->
      @_status

    # This is (tragically) JVM NetLogo's idea of sanity... --JAB (5/26/14)
    # (String) => Unit
    setPenMode: (position) ->
      if position is "up"
        @raisePen()
      else
        @lowerPen()
      return

    # () => Unit
    raisePen: ->
      @_updateStatus(Up)
      return

    # () => Unit
    lowerPen: ->
      @_updateStatus(Down)
      return

    # (Number) => Unit
    setSize: (size) ->
      @_updateSize(size)
      return

    # () => PenManager
    clone: ->
      new PenManager(@_updateFunc, @_size, @_status)

    # (Number) => Unit
    _updateSize: (newSize) ->
      @_size = newSize
      @_updateFunc("pen-size")
      return

    # (PenStatus) => Unit
    _updateStatus: (newStatus) ->
      @_status = newStatus
      @_updateFunc("pen-mode")
      return
