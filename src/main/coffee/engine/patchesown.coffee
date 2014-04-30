#@# Heinous
define(['integration/lodash'], (_) ->
  class PatchesOwn
    vars: []
    init: (n) ->
      @vars = _(0).range(n).map(-> 0).value()
      return
)
