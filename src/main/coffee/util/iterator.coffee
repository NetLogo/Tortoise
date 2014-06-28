# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(->

  class Iterator

    _items: undefined # Array[T]
    _i:     undefined # Number

    # [T] @ (Array[T]) => Iterator[T]
    constructor: (items) ->
      @_items = items[..]
      @_i     = 0

    # () => Boolean
    hasNext: ->
      @_i < @_items.length

    # () => T
    next: ->
      @_items[@_i++]

)
