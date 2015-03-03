# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_         = require('lodash')
Exception = require('tortoise/util/exception')
JSType    = require('tortoise/util/typechecker')

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
    JSType(x).isFunction() and x.isReporter

  # (Function) => Boolean
  isCommandTask: (x) ->
    JSType(x).isFunction() and not x.isReporter

  # [Result] @ (Product => Result, Array[Any]*) => Array[Result]
  map: (fn, lists...) ->
    @_processLists(fn, lists, "map")

  # [Result] @ (Number, (Number) => Result) => Array[Result]
  nValues: (n, fn) ->
    _(0).range(n).map(fn).value()

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
    else if _(lists).all((l) -> l.length is head.length)
      _.zip(lists...).map((tuple) -> fn(tuple...))
    else
      throw new Error("All the list arguments to #{primName.toUpperCase()} must be the same length.")

}
