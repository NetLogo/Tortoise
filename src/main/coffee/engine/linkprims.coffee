define(->

  class LinkPrims

    @_self:    undefined # () => Turtle
    @_shuffle: undefined # (AbstractAgents) => TurtleSet

    # (World) => LinkPrims
    constructor: (@_world) ->
      @_self    = @_world.agentSet.self
      @_shuffle = @_world.agentSet.shuffle

    # (Turtle) => Link
    createLinkFrom: (otherTurtle) ->
      @_world.createDirectedLink(otherTurtle, @_self())

    # (TurtleSet) => LinkSet
    createLinksFrom: (otherTurtles) ->
      @_world.createReverseDirectedLinks(@_self(), @_shuffle(otherTurtles))

    # (Turtle) => Link
    createLinkTo: (otherTurtle) ->
      @_world.createDirectedLink(@_self(), otherTurtle)

    # (TurtleSet) => LinkSet
    createLinksTo: (otherTurtles) ->
      @_world.createDirectedLinks(@_self(), @_shuffle(otherTurtles))

    # (Turtle) => Link
    createLinkWith: (otherTurtle) ->
      @_world.createUndirectedLink(@_self(), otherTurtle)

    # (TurtleSet) => LinkSet
    createLinksWith: (otherTurtles) ->
      @_world.createUndirectedLinks(@_self(), @_shuffle(otherTurtles))

    # (Boolean, Boolean) => Array[Link]
    connectedLinks: (isDirected, isSource) ->
      @_self().connectedLinks(isDirected, isSource)

    # (Boolean, Boolean) => Array[Turtle]
    linkNeighbors: (isDirected, isSource) ->
      @_self().linkNeighbors(isDirected, isSource)

    # (Boolean, Boolean) => (Turtle) => Boolean
    isLinkNeighbor: (isDirected, isSource) ->
      ((otherTurtle) => @_self().isLinkNeighbor(isDirected, isSource, otherTurtle))

    # (Boolean, Boolean) => (Turtle) => Link
    findLinkViaNeighbor: (isDirected, isSource) ->
      ((otherTurtle) => @_self().findLinkViaNeighbor(isDirected, isSource, otherTurtle))

)
