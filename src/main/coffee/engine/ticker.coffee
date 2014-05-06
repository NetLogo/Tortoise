define(['engine/exception'], (Exception) ->


  class Ticker

    # Number
    _count: undefined

    # (Updater, Number) => Ticker
    constructor: (@_updater, @_ownerID) ->
      @id = @_ownerID #@# This `id` crap for `Updater` is getting stupidly out of hand...
      @clear()

    # () => Unit
    reset: ->
      @_updateTicks(-> 0)
      return

    # () => Unit
    clear: ->
      @_updateTicks(-> -1)
      return

    # () => Unit
    tick: ->
      if @_count is -1
        throw new Exception.NetLogoException("The tick counter has not been started yet. Use RESET-TICKS.")
      else
        @_updateTicks((counter) -> counter + 1)
      return

    # (Number) => Unit
    tickAdvance: (n) ->
      if @_count is -1
        throw new Exception.NetLogoException("The tick counter has not been started yet. Use RESET-TICKS.")
      else if n < 0
        throw new Exception.NetLogoException("Cannot advance the tick counter by a negative amount.")
      else
        @_updateTicks((counter) -> counter + n)
      return

    # () => Number
    tickCount: ->
      if @_count is -1
        throw new Exception.NetLogoException("The tick counter has not been started yet. Use RESET-TICKS.")
      @_count

    # ((Number) => Number) => Unit
    _updateTicks: (updateFunc) ->
      @_count = updateFunc(@_count)
      @_updater.updated(this, "ticks")
      return

)
