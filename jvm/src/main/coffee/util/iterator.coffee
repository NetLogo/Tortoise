# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports =
  class Iterator

    _items: undefined # [T] @ Array[T]

    # (Array[T]) => Iterator[T]
    constructor: (items) ->
      @_items = items[..]

    all: (f) ->
      for x in @_items
        if not f(x)
          return false
      true

    contains: (x) ->
      for y in @_items
        if x is y
          return true
      false

    exists: (f) ->
      for x in @_items
        if f(x)
          return true
      false

    filter: (f) ->
      x for x in @_items when f(x)

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
