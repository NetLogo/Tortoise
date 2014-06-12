define(['integration/lodash'], (_) ->

  # Type Parameter: T - The type of items within `_items`
  class Seq

    # (Array[T]) => Seq[T]
    constructor: (@_items) ->

    # () => Number
    size: ->
      @_items.length

    # () => Number
    length: @size

    # () => Boolean
    isEmpty: ->
      @size() is 0

    # () => Boolean
    nonEmpty: ->
      @size() isnt 0

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

    # () => Array[T]
    toArray: ->
      @_items[..]

    # () => String
    toString: ->
      "Seq(#{@_items.toString()})"

    # (Array[U], Seq[V]) => Seq[U]
    _generateFrom: (newItems, oldSeq) ->
      new Seq(newItems)

)
