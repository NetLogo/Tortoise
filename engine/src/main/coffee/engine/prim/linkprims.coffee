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

    # IN OR OUT

    # (String, Turtle) => Boolean
    isLinkNeighbor: (breedName, otherTurtle) ->
      @_self().linkManager.isLinkNeighbor(breedName, otherTurtle)

    # (String, Turtle) => Link
    linkWith: (breedName, otherTurtle) ->
      @_self().linkManager.linkWith(breedName, otherTurtle)

    # (String) => TurtleSet
    linkNeighbors: (breedName) ->
      @_self().linkManager.linkNeighbors(breedName)

    # (String) => LinkSet
    myLinks: (breedName) ->
      @_self().linkManager.myLinks(breedName)

    # OUT ONLY

    # (String, Turtle) => Boolean
    isOutLinkNeighbor: (breedName, otherTurtle) ->
      @_self().linkManager.isOutLinkNeighbor(breedName, otherTurtle)

    # (String, Turtle) => Link
    outLinkTo: (breedName, otherTurtle) ->
      @_self().linkManager.outLinkTo(breedName, otherTurtle)

    # (String) => TurtleSet
    outLinkNeighbors: (breedName) ->
      @_self().linkManager.outLinkNeighbors(breedName)

    # (String) => LinkSet
    myOutLinks: (breedName) ->
      @_self().linkManager.myOutLinks(breedName)

    # IN ONLY

    # (String, Turtle) => Boolean
    isInLinkNeighbor: (breedName, otherTurtle) ->
      otherTurtle.linkManager.isOutLinkNeighbor(breedName, @_self())

    # (String, Turtle) => Link
    inLinkFrom: (breedName, otherTurtle) ->
      otherTurtle.linkManager.outLinkTo(breedName, @_self())

    # (String) => TurtleSet
    inLinkNeighbors: (breedName) ->
      @_self().linkManager.inLinkNeighbors(breedName)

    # (String) => LinkSet
    myInLinks: (breedName) ->
      @_self().linkManager.myInLinks(breedName)
