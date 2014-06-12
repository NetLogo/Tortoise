#@# We won't need to call `toArray` each time in our own functions when this learns how to iterate over dead agents...
# Never instantiate this class directly --JAB (5/7/14)
define(['integration/seq', 'engine/shufflerator'], (Seq, Shufflerator) ->

  # Type Parameter: T <: Agent - The type of agents within `_items`
  class AbstractAgents extends Seq

    @_askAgent: undefined # (Agent, () => Any) => Any

    # (Array[T]) => AbstractAgents[T]
    constructor: (agents) ->
      super(agents)
      @_askAgent =
        if agents[0]?
          agents[0].world.agentSet.askAgent
        else
          () -> undefined

    # () => AbstractAgents[T]
    shuffled: ->
      result = []
      iter = new Shufflerator(@toArray())
      while iter.hasNext() #@# 1990 rears its ugly head again
        result.push(iter.next())
      @copyWithNewAgents(result)

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
