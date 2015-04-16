# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ Type: { TurtleSetType }, TypeSet } = require('../core/typeinfo')

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
      @_ensureTurtleSet("create-#{breedName}-with", otherTurtles)
      @_linkManager.createReverseDirectedLinks(@_self(), otherTurtles.shuffled(), breedName)

    # (Turtle, String) => Link
    createLinkTo: (otherTurtle, breedName) ->
      @_linkManager.createDirectedLink(@_self(), otherTurtle, breedName)

    # (TurtleSet, String) => LinkSet
    createLinksTo: (otherTurtles, breedName) ->
      @_ensureTurtleSet("create-#{breedName}-to", otherTurtles)
      @_linkManager.createDirectedLinks(@_self(), otherTurtles.shuffled(), breedName)

    # (Turtle, String) => Link
    createLinkWith: (otherTurtle, breedName) ->
      @_linkManager.createUndirectedLink(@_self(), otherTurtle, breedName)

    # (TurtleSet, String) => LinkSet
    createLinksWith: (otherTurtles, breedName) ->
      @_ensureTurtleSet("create-#{breedName}-with", otherTurtles)
      @_linkManager.createUndirectedLinks(@_self(), otherTurtles.shuffled(), breedName)

    # (String, Turtle) => Boolean
    isInLinkNeighbor: (breedName, otherTurtle) ->
      @_self().linkManager.isInLinkNeighbor(breedName, otherTurtle)

    # (String, Turtle) => Boolean
    isLinkNeighbor: (breedName, otherTurtle) ->
      @_self().linkManager.isLinkNeighbor(breedName, otherTurtle)

    # (String, Turtle) => Boolean
    isOutLinkNeighbor: (breedName, otherTurtle) ->
      @_self().linkManager.isOutLinkNeighbor(breedName, otherTurtle)

    # (String, Turtle) => Link
    inLinkFrom: (breedName, otherTurtle) ->
      @_self().linkManager.inLinkFrom(breedName, otherTurtle)

    # (String, Turtle) => Link
    linkWith: (breedName, otherTurtle) ->
      @_self().linkManager.linkWith(breedName, otherTurtle)

    # (String, Turtle) => Link
    outLinkTo: (breedName, otherTurtle) ->
      @_self().linkManager.outLinkTo(breedName, otherTurtle)

    # (String) => TurtleSet
    inLinkNeighbors: (breedName) ->
      @_self().linkManager.inLinkNeighbors(breedName)

    # (String) => TurtleSet
    linkNeighbors: (breedName) ->
      @_self().linkManager.linkNeighbors(breedName)

    # (String) => TurtleSet
    outLinkNeighbors: (breedName) ->
      @_self().linkManager.outLinkNeighbors(breedName)

    # (String) => LinkSet
    myInLinks: (breedName) ->
      @_self().linkManager.myInLinks(breedName)

    # (String) => LinkSet
    myLinks: (breedName) ->
      @_self().linkManager.myLinks(breedName)

    # (String) => LinkSet
    myOutLinks: (breedName) ->
      @_self().linkManager.myOutLinks(breedName)

    # (String, Any) => Unit
    _ensureTurtleSet: (primName, ts) ->
      if not NLType(ts).isTurtleSet()
        throw new ArgumentTypeError(primName.toUpperCase(), new TypeSet([TurtleSetType]), ts)
      return
