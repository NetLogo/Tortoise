# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Iterator = require('util/iterator')

module.exports =
  class DeadSkippingIterator extends Iterator

    _i: undefined # Number

    # [T] @ (Array[T]) => DeadSkippingIterator
    constructor: (items) ->
      super(items)
      @_i = 0

    all: (f) ->
      for x in @_items when not x.isDead()
        if not f(x)
          return false
      true

    contains: (x) ->
      for y in @_items when not x.isDead()
        if x is y
          return true
      false

    exists: (f) ->
      for x in @_items when not x.isDead()
        if f(x)
          return true
      false

    filter: (f) ->
      x for x in @_items when (not x.isDead()) and f(x)

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

    # They're asking for the `n`th not-dead item, so every time we see a dead item, increment the index and the `n`.

    # start           iteration 1     iteration 2     iteration 3     iteration 4
    # [0][X][X][1][2] [0][X][X][1][2] [0][X][X][1][2] [0][X][X][1][2] [0][X][X][1][2]
    # i=0                i=1                i=2                i=3                i=4
    #       n=2             n=2                n=3                n=4             n=4

    # (Int) => T
    nthItem: (n) ->
      i = 0
      while i <= n
        if @_items[i].isDead()
          n++
        i++
      @_items[n]

    # () => Int
    size: ->
      @_items.reduce( (acc, item) ->
        acc + if item.isDead() then 0 else 1
      , 0)

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
      while @_isntEmpty() and @_items[@_i].isDead()
        @_i++
      return

    # () => Boolean
    _isntEmpty: ->
      @_i < @_items.length

    checkCount: (n, check) ->
      totalCount = 0
      for x in @_items when not x.isDead()
        totalCount += 1
        if totalCount > n
          return check(totalCount, n)
      check(totalCount, n)
