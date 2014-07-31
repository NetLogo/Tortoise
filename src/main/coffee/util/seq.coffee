# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['shim/lodash'], (_) ->

  # If you want at the items, use `toArray`!  NO ONE BUT `toArray` SHOULD TOUCH `_items`! --JAB (7/21/14)
  class Seq

    # [T] @ (Array[T]) => Seq[T]
    constructor: (@_items) ->

    # () => Number
    size: ->
      @toArray().length

    # () => Number
    length: ->
      @size()

    # () => Boolean
    isEmpty: ->
      @size() is 0

    # () => Boolean
    nonEmpty: ->
      @size() isnt 0

    # (T) => Boolean
    contains: (item) ->
      _(@toArray()).contains(item)

    # ((T) => Boolean) => Boolean
    exists: (pred) ->
      _(@toArray()).some(pred)

    # ((T) => Boolean) => Boolean
    every: (pred) ->
      _(@toArray()).every(pred)

    # ((T) => Boolean) => Seq[T]
    filter: (pred) ->
      @_generateFrom(_(@toArray()).filter(pred).value(), this)

    # ((T) => Boolean) => T
    find: (pred) ->
      _(@toArray()).find(pred)

    # ((T) => Unit) => Unit
    forEach: (f) ->
      _(@toArray()).forEach(f)
      return

    # [U] @ ((U, T) => U, U) => U
    foldl: (f, initial) ->
      _(@toArray()).foldl(f, initial)

    # () => Array[T]
    toArray: ->
      @_items[..]

    # () => String
    toString: ->
      "Seq(#{@toArray().toString()})"

    # (Array[T], Seq[T]) => Seq[T]
    _generateFrom: (newItems, oldSeq) ->
      new Seq(newItems)

)
