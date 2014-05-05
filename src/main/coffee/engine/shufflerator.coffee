#@# Lame
define(['integration/lodash', 'integration/random'], (_, Random) ->
  class Shufflerator #@# Maybe use my `Iterator` implementation, or maybe Mori has one?
    constructor: (@agents) ->
      @agents = _(@agents).clone()
      @fetch()
    i: 0
    nextOne: null
    hasNext: -> @nextOne isnt null
    next: ->
      result = @nextOne
      @fetch()
      result
    fetch: ->
      if @i >= @agents.length
        @nextOne = null
      else
        if @i < @agents.length - 1
          r = @i + Random.nextInt(@agents.length - @i)
          @nextOne = @agents[r]
          @agents[r] = @agents[@i]
        else
          @nextOne = @agents[@i]
        @i = @i + 1 #@# It's called "@i++"
      return
)
