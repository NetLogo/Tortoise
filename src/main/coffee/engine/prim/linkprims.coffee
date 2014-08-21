# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports =
  class LinkPrims

    @_linkManager: undefined # LinkManager
    @_self:        undefined # () => Turtle

    # (World) => LinkPrims
    constructor: (@_world) ->
      @_linkManager = @_world.linkManager
      @_self        = @_world.selfManager.self

    # (Turtle) => Link
    createLinkFrom: (otherTurtle) ->
      @_linkManager.createDirectedLink(otherTurtle, @_self())

    # (TurtleSet) => LinkSet
    createLinksFrom: (otherTurtles) ->
      @_linkManager.createReverseDirectedLinks(@_self(), otherTurtles.shuffled())

    # (Turtle) => Link
    createLinkTo: (otherTurtle) ->
      @_linkManager.createDirectedLink(@_self(), otherTurtle)

    # (TurtleSet) => LinkSet
    createLinksTo: (otherTurtles) ->
      @_linkManager.createDirectedLinks(@_self(), otherTurtles.shuffled())

    # (Turtle) => Link
    createLinkWith: (otherTurtle) ->
      @_linkManager.createUndirectedLink(@_self(), otherTurtle)

    # (TurtleSet) => LinkSet
    createLinksWith: (otherTurtles) ->
      @_linkManager.createUndirectedLinks(@_self(), otherTurtles.shuffled())

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
