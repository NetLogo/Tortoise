# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Exception  = require('tortoise/util/exception')
Type       = require('tortoise/util/typechecker')

{ SuperArray, fromInterval, zip } = require('super/superarray')

module.exports = {

  # (Function) => Function
  commandTask: (fn) ->
    fn.isReporter = false
    fn

  # (Function) => Function
  reporterTask: (fn) ->
    fn.isReporter = true
    fn

  # (Function) => Boolean
  isReporterTask: (x) ->
    Type(x).isFunction() and x.isReporter

  # (Function) => Boolean
  isCommandTask: (x) ->
    Type(x).isFunction() and not x.isReporter

  # [Result] @ (Product => Result, Array[Any]*) => Array[Result]
  map: (fn, lists...) ->
    @_processLists(fn, lists, "map")

  # [Result] @ (Number, (Number) => Result) => Array[Result]
  nValues: (n, fn) ->
    fromInterval(0, n).map(fn).value()

  # [Result] @ (Product => Result, Array[Any]*) => Unit
  forEach: (fn, lists...) ->
    @_processLists(fn, lists, "foreach")
    return

  # [Result] @ (Product => Result, Array[Array[Any]], String) => Array[Result]
  _processLists: (fn, lists, primName) ->
    numLists = lists.length
    head     = lists[0]
    if numLists is 1
      head.map(fn)
    else if SuperArray(lists).all((l) -> l.length is head.length)
      zip(lists...).map((tuple) -> fn(tuple...)).value()
    else
      throw new Error("All the list arguments to #{primName.toUpperCase()} must be the same length.")

}
