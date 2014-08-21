# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Iterator = require('tortoise/util/iterator')

module.exports =
  class DeadSkippingIterator extends Iterator

    _i: undefined # Number

    # [T] @ (Array[T]) => DeadSkippingIterator
    constructor: (items) ->
      super(items)
      @_i = 0

    # [U] @ ((T) => U) => Array[U]
    map: (f) ->
      acc = []
      while @_hasNext()
        acc.push(f(@_next()))
      acc

    # ((T) => Unit) => Unit
    forEach: (f) ->
      while @_hasNext()
        f(@_next())
      return

    # () => Array[T]
    toArray: ->
      acc = []
      while @_hasNext()
        acc.push(@_next())
      acc

    # () => Boolean
    _hasNext: ->
      @_skipToNext()
      @_isntEmpty()

    # () => T
    _next: ->
      @_skipToNext()
      @_items[@_i++]

    # () => Unit
    _skipToNext: ->
      while (@_isntEmpty() and @_items[@_i].id is -1)
        @_i++
      return

    # () => Boolean
    _isntEmpty: ->
      @_i < @_items.length
