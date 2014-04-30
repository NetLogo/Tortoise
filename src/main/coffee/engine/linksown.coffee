#@# Satanic
define(['integration/lodash'], (_) ->
  class LinksOwn
    vars: []
    init: (n) ->
      @vars = _(0).range(n).map(-> 0).value()
      return
)
