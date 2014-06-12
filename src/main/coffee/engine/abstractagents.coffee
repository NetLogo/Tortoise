#@# We won't need to call `toArray` each time in our own functions when this learns how to iterate over dead agents...
# Never instantiate this class directly --JAB (5/7/14)
define(['integration/seq'], (Seq) ->

  # Type Parameter: T <: Agent - The type of agents within `_items`
  class AbstractAgents extends Seq

    # (Array[T]) => AbstractAgents[T]
    constructor: (agents) ->
      super(agents)

    # () => Array[T]
    sort: ->
      if @isEmpty()
        @toArray()
      else
        @toArray().sort((x, y) -> x.compare(y).toInt)

    # (Array[U]) => AbstractAgents[U]
    copyWithNewAgents: (agents) ->
      @_generateFrom(agents, this)

)
