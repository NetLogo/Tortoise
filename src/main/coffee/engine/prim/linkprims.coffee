# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports =
  class LinkPrims

    @_linkManager: undefined # LinkManager
    @_self:        undefined # () => Turtle

    # (World) => LinkPrims
    constructor: ({ linkManager, selfManager }) ->
      @_linkManager = linkManager
      @_self        = selfManager.self

    # (Turtle, String) => Link
    createLinkFrom: (otherTurtle, breedName) ->
      @_linkManager.createDirectedLink(otherTurtle, @_self(), breedName)

    # (TurtleSet, String) => LinkSet
    createLinksFrom: (otherTurtles, breedName) ->
      @_linkManager.createReverseDirectedLinks(@_self(), otherTurtles.shuffled(), breedName)

    # (Turtle, String) => Link
    createLinkTo: (otherTurtle, breedName) ->
      @_linkManager.createDirectedLink(@_self(), otherTurtle, breedName)

    # (TurtleSet, String) => LinkSet
    createLinksTo: (otherTurtles, breedName) ->
      @_linkManager.createDirectedLinks(@_self(), otherTurtles.shuffled(), breedName)

    # (Turtle, String) => Link
    createLinkWith: (otherTurtle, breedName) ->
      @_linkManager.createUndirectedLink(@_self(), otherTurtle, breedName)

    # (TurtleSet, String) => LinkSet
    createLinksWith: (otherTurtles, breedName) ->
      @_linkManager.createUndirectedLinks(@_self(), otherTurtles.shuffled(), breedName)

    # (Boolean, Boolean, String) => LinkSet
    connectedLinks: (isDirected, isSource, breedName) ->
      @_self().connectedLinks(isDirected, isSource, breedName)

    # (Boolean, Boolean, String) => TurtleSet
    linkNeighbors: (isDirected, isSource, breedName) ->
      @_self().linkNeighbors(isDirected, isSource, breedName)

    # (Boolean, Boolean, String) => (Turtle) => Boolean
    isLinkNeighbor: (isDirected, isSource, breedName) ->
      ((otherTurtle) => @_self().isLinkNeighbor(isDirected, isSource, breedName, otherTurtle))

    # (Boolean, Boolean, String) => (Turtle) => Link
    findLinkViaNeighbor: (isDirected, isSource, breedName) ->
      ((otherTurtle) => @_self().findLinkViaNeighbor(isDirected, isSource, breedName, otherTurtle))
