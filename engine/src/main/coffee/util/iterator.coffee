# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports =
  class Iterator

    _items: undefined # [T] @ Array[T]

    # (Array[T]) => Iterator[T]
    constructor: (@_items) ->

    # ((T) => Boolean) => Boolean
    all: (f) ->
      for x in @_items
        if not f(x)
          return false
      true

    # (T) => Boolean
    contains: (x) ->
      for y in @_items
        if x is y
          return true
      false

    # ((T) => Boolean) => Boolean
    exists: (f) ->
      for x in @_items
        if f(x)
          return true
      false

    # ((T) => Boolean) => Array[T]
    filter: (f) ->
      x for x in @_items when f(x)

    # (Int) => T
    nthItem: (n) ->
      @_items[n]

    # [U] @ ((T) => U) => Array[U]
    map: (f) ->
      @_items.map(f)

    # ((T) => Unit) => Unit
    forEach: (f) ->
      @_items.forEach(f)
      return

    # () => Int
    size: ->
      @_items.length

    # () => Array[T]
    toArray: ->
      @_items

    # (Number, (Number, Number) => Boolean) => Boolean
    checkCount: (n, check) ->
      check(@_items.length, n)
