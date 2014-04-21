#@# Why you so puny?  Why you exist?
define(->
  class Iterator
    constructor: (@agents) ->
      @agents = @agents[..]
      @i = 0
    hasNext: -> @i < @agents.length
    next: ->
      result = @agents[@i]
      @i = @i + 1
      result
)
