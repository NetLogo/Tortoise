#@# This makes me uncomfortable
define(-> {
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
  nValues: (n, fn) -> #@# Lodash
    fn(i) for i in [0...n]
  forEach: (fn, lists...) -> #@# Don't understand
    for i in [0...lists[0].length]
      fn(lists.map((list) -> list[i])...)
    return
})
