# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')

{ all, length, map } = require('brazierjs/array')
{ pipeline }         = require('brazierjs/function')
{ rangeUntil }       = require('brazierjs/number')

module.exports = {

  # (Function, String) => Function
  commandTask: (fn, body) ->
    fn.isReporter = false
    fn.nlogoBody = body
    fn

  # (Function, String) => Function
  reporterTask: (fn, body) ->
    fn.isReporter = true
    fn.nlogoBody = body
    fn

  # [Result] @ (Product => Result, Array[Any]) => Result
  apply: (primName) -> (fn, args) ->
    if args.length >= fn.length
      fn.apply(fn, args)
    else
      pluralStr = if fn.length is 1 then "" else "s"
      throw exceptions.runtime("anonymous procedure expected #{fn.length} input#{pluralStr}, but only got #{args.length}", primName)

  # [Result] @ (Product => Result, Array[Any]*) => Array[Result]
  map: (fn, lists...) ->
    @_processLists(fn, lists, "map")

  # [Result] @ (Number, (Number) => Result) => Array[Result]
  nValues: (n, fn) ->
    map(fn)(rangeUntil(0)(n))

  # [Result] @ (Product => Result, Array[Any]*) => Any
  forEach: (fn, lists...) ->
    return @_processLists(fn, lists, "foreach")

  # [Result] @ (Product => Result, Array[Array[Any]], String) => Array[Result]
  _processLists: (fn, lists, primName) ->
    numLists = lists.length
    head     = lists[0]
    if numLists is 1
      if fn.isReporter
        map(fn)(head)
      else
        for x in head
          res = fn(x)
          if res?
            return res
        return
    else if all((l) -> l.length is head.length)(lists)
      if fn.isReporter
        for i in [0...head.length]
          fn(map((list) -> list[i])(lists)...)
      else
        for i in [0...head.length]
          res = fn(map((list) -> list[i])(lists)...)
          if res?
            return res
    else
      throw exceptions.runtime("All the list arguments to #{primName.toUpperCase()} must be the same length.", primName)

}
