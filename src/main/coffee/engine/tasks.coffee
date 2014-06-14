# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

#@# This makes me uncomfortable
define(['integration/lodash'], (_) -> {
  commandTask: (fn) ->
    fn.isReporter = false
    fn
  reporterTask: (fn) ->
    fn.isReporter = true
    fn
  isReporterTask: (x) ->
    typeof(x) is "function" and x.isReporter
  isCommandTask: (x) ->
    typeof(x) is "function" and not x.isReporter
  map: (fn, lists...) -> #@# Don't understand
    for i in [0...lists[0].length]
      fn(lists.map((list) -> list[i])...)
  nValues: (n, fn) ->
    _(0).range(n).map(fn).value()
  forEach: (fn, lists...) -> #@# Don't understand
    for i in [0...lists[0].length]
      fn(lists.map((list) -> list[i])...)
    return
})
