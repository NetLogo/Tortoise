# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Iterator = require('./iterator')

module.exports =
  class Shufflerator extends Iterator

    _i:       undefined # Number
    _nextOne: undefined # T

    # [T] @ (Array[T], (T) => Boolean, (Number) => Number) => Shufflerator
    constructor: (items, @_itemIsValid, @_nextInt) ->
      super(items)
      @_i       = 0
      @_nextOne = null

      @_fetch()

    # [U] @ ((T) => U) => Array[U]
    map: (f) ->
      acc = []
      @forEach((x) -> acc.push(f(x)))
      acc

    # ((T) => Unit) => Unit
    forEach: (f) ->
      while @_hasNext()
        next = @_next()
        if @_itemIsValid(next)
          f(next)
      return

    # [U >: T] @ ((T) => Boolean, U) => U
    find: (f, dflt) ->
      while @_hasNext()
        next = @_next()
        if @_itemIsValid(next) and (f(next) is true)
          return next
      dflt

    # () => Array[T]
    toArray: ->
      acc = []
      @forEach((x) -> acc.push(x))
      acc

    # () => Boolean
    _hasNext: ->
      @_i <= @_items.length

    # () => T
    _next: ->
      result = @_nextOne
      @_fetch()
      result

    ###
      I dislike this.  The fact that the items are prepolled annoys me.  But there are two problems with trying to "fix"
      that. First, fixing it involves changing JVM NetLogo/Headless.  To me, that requires a disproportionate amount of
      effort to do, relative to how likely--that is, not very likely--that this code is to be heavily worked on in the
      future.  The second problem is that it's not apparent to me how to you can make this code substantially cleaner
      without significantly hurting performance.  The very idea of a structure that statefully iterates a collection in
      a random order is difficult to put into clear computational terms.  When it needs to be done _efficiently_, that
      becomes even more of a problem.  As far as I can tell, the only efficient way to do it is like how we're doing it
      (one variable tracking the current index/offset, and an array where consumed items are thrown into the front).
      Whatever.  The whole point is that this code isn't really worth worrying myself over, since it's pretty stable.
      --JAB (7/25/14)
    ###
    # () => Unit
    _fetch: ->
      if @_hasNext()

        if @_i < @_items.length - 1
          randNum = @_i + @_nextInt(@_items.length - @_i)
          @_nextOne = @_items[randNum]
          @_items[randNum] = @_items[@_i]
        else
          @_nextOne = @_items[@_i]

        @_i++

        if not @_itemIsValid(@_nextOne)
          @_fetch()

      else
        @_nextOne = null

      return
