define(['integration/lodash'], (_) ->
  class Iterator
    constructor: (@agents) ->
      @agents = _(@agents).clone()
      @i = 0
    hasNext: -> @i < @agents.length
    next: ->
      result = @agents[@i]
      @i = @i + 1
      result
)
