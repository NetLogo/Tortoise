# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ all, head, length, map } = require('brazierjs/array')
{ pipeline }               = require('brazierjs/function')
{ rangeUntil }             = require('brazierjs/number')

Exception = require('util/exception')

module.exports = {

  # (Function) => Function
  commandTask: (fn) ->
    fn.isReporter = false
    fn

  # (Function) => Function
  reporterTask: (fn) ->
    fn.isReporter = true
    fn

  # [Result] @ (Product => Result, Array[Any]*) => Array[Result]
  map: (fn, lists...) ->
    @_processLists(fn, lists, "map")

  # [Result] @ (Number, (Number) => Result) => Array[Result]
  nValues: (n, fn) ->
    map(fn)(rangeUntil(0)(n))

  # [Result] @ (Product => Result, Array[Any]*) => Unit
  forEach: (fn, lists...) ->
    @_processLists(fn, lists, "foreach")
    return

  # [Result] @ (Product => Result, Array[Array[Any]], String) => Array[Result]
  _processLists: (fn, lists, primName) ->
    numLists = lists.length
    h        = lists[0]
    if numLists is 1
      pipeline(head, map(fn))(lists)
    else if all((l) -> l.length is h.length)(lists)
      for i in [0...h.length]
        fn(map((list) -> list[i])(lists)...)
    else
      throw new Error("All the list arguments to #{primName.toUpperCase()} must be the same length.")

}
