#@# We won't need to call `toArray` each time in our own functions when this learns how to iterate over dead agents...
# Never instantiate this class directly --JAB (5/7/14)
define(['integration/lodash'], (_) ->

  # Type Parameter: T <: Agent - The type of agents within `_agents`
  class AbstractAgents

    # (Array[T]) => AbstractAgents[T]
    constructor: (@_agents) ->

    # () => Number
    size: ->
      @_agents.length

    # () => Number
    length: @size

    # () => Boolean
    isEmpty: ->
      @size() is 0

    # () => Boolean
    nonEmpty: ->
      @size() isnt 0

    # ((T) => Boolean) => Boolean
    exists: (pred) ->
      _(@toArray()).some(pred)

    # ((T) => Boolean) => Boolean
    every: (pred) ->
      _(@toArray()).every(pred)

    # ((T) => Boolean) => AbstractAgents[T]
    filter: (pred) ->
      @_generateFrom(_(@toArray()).filter(pred).value(), this)

    # ((T) => Boolean) => T
    find: (pred) ->
      _(@toArray()).find(pred)

    # ((T) => Unit) => Unit
    forEach: (f) ->
      _(@toArray()).forEach(f)
      return

    # () => Array[T]
    sort: ->
      if @isEmpty()
        @toArray()
      else
        @toArray().sort((x, y) -> x.compare(y).toInt)

    # () => Array[T]
    toArray: ->
      @_agents[..]

    # (Array[U]) => AbstractAgents[U]
    copyWithNewAgents: (agents) ->
      @_generateFrom(agents, this)

    # () => String
    toString: ->
      throw new Error("Not implemented - `AbstractAgents.toString`")

    # (Array[U], Agents[V]) => Agents[U]
    _generateFrom: ->
      throw new Error("Not implemented - `AbstractAgents._generateFrom`")

)
