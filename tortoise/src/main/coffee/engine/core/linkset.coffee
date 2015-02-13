# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AbstractAgentSet     = require('./abstractagentset')
DeadSkippingIterator = require('./structure/deadskippingiterator')
JSType               = require('util/typechecker')

module.exports =
  class LinkSet extends AbstractAgentSet

    # [T <: Turtle] @ ((() => Array[T])|Array[T], String, String) => TurtleSet
    constructor: (@_agents, @_breedName = "LINKS", @_specialName) ->
      super(@_unwrap(@_agents))

    # () => String
    getBreedName: ->
      @_breedName

    # () => Iterator[T]
    iterator: ->
      new DeadSkippingIterator(@_unwrap(@_agents))

    # () => String
    toString: ->
      @_specialName.toLowerCase() ? "(agentset, #{@size()} #{@getBreedName().toLowerCase()})"

    # (Array[T], LinkSet[T]) => LinkSet[T]
    _generateFrom: (newAgentArr, agents) ->
      new LinkSet(newAgentArr, agents.getBreedName())

    # I know, I know, this is insane, right?  "Why would you do this?!", you demand.  I don't blame you.  I don't like
    # it, either.  But, look... we have a problem on our hands.  Special agentsets are a thing.  They can be stored
    # into variables and then change from some code changing the special agentset.  With turtles, this works out fine,
    # because turtles are ordered by `who` number, and `who` numbers are a function of time, so we can just give a
    # `TurtleSet` a reference to the turtle array and grow it as we see fit.  Unfortunately, links are not quantally
    # ordered; they're ordered based on their properties, so we either need to provide a thunk for getting the latest
    # array, or we need to use a good sorting structure that represents the data as an array under the hood, and then
    # we can pass around that array.  Passing thunks seems to be the better option to me.  --JAB (9/7/14)
    # [T] @ ((() => Array[T])|Array[T]) => Array[T]
    _unwrap: (agents) ->
      if JSType(agents).isFunction() then agents() else agents[..]
