#@# We won't need to call `toArray` each time in our own functions when this learns how to iterate over dead agents...
define(['integration/lodash'], (_) ->

  # (Array[U], Agents[V]) => Agents[U]
  createNew = (newAgentArr, agents) ->
    new Agents(newAgentArr, agents.getBreed(), agents.getKind())

  # Type Parameter: T <: Agent - The type of agents within `_agents`
  class Agents

    # (Array[T], Breed)
    constructor: (@_agents, @_breed, @_kind) ->

    # () => Breed
    getBreed: ->
      @_breed

    # () => AgentKind
    getKind: ->
      @_kind

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

    # ((T) => Boolean) => Agents[T]
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

    # () => String
    toString: ->
      "(agentset, #{@size()} #{@_breed.name.toLowerCase()})"

    # (Array[U], Agents[V]) => Agents[U]
    _generateFrom: createNew

)
