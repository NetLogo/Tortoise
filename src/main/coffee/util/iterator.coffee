# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports =
  class Iterator

    _items: undefined # [T] @ Array[T]

    # (Array[T]) => Iterator[T]
    constructor: (items) ->
      @_items = items[..]

    # [U] @ ((T) => U) => Array[U]
    map: (f) ->
      @_items.map(f)

    # ((T) => Unit) => Unit
    forEach: (f) ->
      @_items.forEach(f)
      return

    # () => Array[T]
    toArray: ->
      @_items
