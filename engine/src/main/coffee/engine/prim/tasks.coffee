# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')

{ all, length, map } = require('brazierjs/array')
{ pipeline }         = require('brazierjs/function')
{ rangeUntil }       = require('brazierjs/number')

module.exports = {

  # [Result] @ (Product => Result, Array[Any]) => Result
  apply: (fn, args) ->
    fn.apply(fn, args)

  # [Result] @ (Product => Result, Array[Any]*) => Array[Result]
  map: (fn, lists) ->
    @_processLists(fn, lists)

  # [Result] @ (Number, () => Result | (Number) => Result) => Array[Result]
  nValues: (n, fn) ->
    if fn.minArgCount is 0
      (new Array(n)).fill(0).map( () -> fn() )
    else
      # if the length is greater than 1, we rely on the task itself to throw the mismatched args error.
      map(fn)(rangeUntil(0)(n))

  # [Result] @ (Product => Result, Array[Any]*) => Any
  forEach: (fn, lists) ->
    return @_processLists(fn, lists)

  # [Result] @ (Product => Result, Array[Array[Any]], String) => Array[Result]
  _processLists: (fn, lists, primName) ->
    switch lists.length
      when 0
        if fn.isReporter
          []
        else
          return

      when 1
        list = lists[0]
        if fn.isReporter
          # beware ye terse-nics tempted to enshorten this to `head.map(fn)`
          # for variadic concise prims be lurking
          # what require the `arguments` set in this way
          list.map( (v) -> fn(v) )
        else
          for x in list
            res = fn(x)
            if res?
              return res
          return

      else
        head = lists[0]
        if fn.isReporter
          for i in [0...head.length]
            fn(map((list) -> list[i])(lists)...)
        else
          for i in [0...head.length]
            res = fn(map((list) -> list[i])(lists)...)
            if res?
              return res

}
