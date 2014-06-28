# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

#@# This makes me uncomfortable
define(['integration/lodash'], (_) -> {

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
    typeof(x) is "function" and x.isReporter

  # (Function) => Boolean
  isCommandTask: (x) -> #@# Should use `Type`
    typeof(x) is "function" and not x.isReporter

  # [Result] @ (Product => Result, Array[Any]*) => Array[Result]
  map: (fn, lists...) -> #@# Don't understand
    for i in [0...lists[0].length]
      fn(lists.map((list) -> list[i])...)

  # [Result] @ (Number, (Number) => Result) => Array[Result]
  nValues: (n, fn) ->
    _(0).range(n).map(fn).value()

  # [Result] @ (Product => Result, Array[Any]*) => Unit
  #@# This is just `map` with a `return`...
  forEach: (fn, lists...) -> #@# Don't understand
    for i in [0...lists[0].length]
      fn(lists.map((list) -> list[i])...)
    return

})
