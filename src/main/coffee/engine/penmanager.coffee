define(->

  class PenStatus
    constructor: (@_name) ->
    toString: -> @_name

  Up   = new PenStatus("up")
  Down = new PenStatus("down")

  class PenManager

    # ((String*) => Unit, Number, PenStatus) => PenManager
    constructor: (@_updateFunc, @_size = 1.0, @_status = Up) ->

    # () => Number
    getSize: ->
      @_size

    # () => PenStatus
    getMode: ->
      @_status

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
      @_updateFunc("pensize")
      return

    # (PenStatus) => Unit
    _updateStatus: (newStatus) ->
      @_status = newStatus
      @_updateFunc("penmode")
      return


)
