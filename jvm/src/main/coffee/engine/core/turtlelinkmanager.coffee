# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

LinkSet   = require('./linkset')
Nobody    = require('./nobody')
TurtleSet = require('./turtleset')

{ find, unique } = require('brazierjs/array')

{ DeathInterrupt, ignoring } = require('util/exception')

# data Directedness =
Undirected = {}
Directed = {}
Either = {}

# Used by functions that search both `_linksIn` and `_linksOut`, since links are often duplicated in them. --JAB (11/24/14)
# (Array[Link]) => LinkSet
linkSetOf = (links) ->
  new LinkSet(unique(links))

# Used by neighbor-finding functions, since we could get duplicate turtles through breeded links. --JAB (11/24/14)
# (Array[Turtle]) => TurtleSet
turtleSetOf = (turtles) ->
  new TurtleSet(unique(turtles))

# String -> Directedness -> Link -> Boolean
linkBreedMatches = (breedName) -> (directedness) -> (link) ->
  (breedName is "LINKS" or breedName is link.getBreedName()) and
    (directedness is Either or
      (link.isDirected and directedness is Directed) or
      (not link.isDirected and directedness is Undirected))

module.exports =
  class LinkManager

    @_linksOut: undefined # Array[Link]
    @_linksIn:  undefined # Array[Link]

    # (Number, BreedManager) => LinkManager
    constructor: (@_ownerID, @_breedManager) ->
      @_clear()

    # (Link) => Unit
    add: (link) ->
      arr = if link.end1.id is @_ownerID then @_linksOut else @_linksIn
      arr.push(link)
      return

    # (String, Turtle) => Link
    inLinkFrom: (breedName, otherTurtle) ->
      @_findLink('end1', otherTurtle, breedName, Directed, @_linksIn)

    # (String) => TurtleSet
    inLinkNeighbors: (breedName) ->
      turtleSetOf(@_neighborsIn(breedName, Directed))

    # (String, Turtle) => Boolean
    isInLinkNeighbor: (breedName, turtle) ->
      @inLinkFrom(breedName, turtle) isnt Nobody

    # (String, Turtle) => Boolean
    isLinkNeighbor: (breedName, turtle) ->
      @_mustBeUndirected(breedName)
      @_findLink('end2', turtle, breedName, Undirected, @_linksOut) isnt Nobody or
        @_findLink('end1', turtle, breedName, Undirected, @_linksIn) isnt Nobody

    # (String, Turtle) => Boolean
    isOutLinkNeighbor: (breedName, turtle) ->
      @outLinkTo(breedName, turtle) isnt Nobody

    # (String, Turtle) => Link
    linkWith: (breedName, otherTurtle) ->
      @_mustBeUndirected(breedName)
      outLink = @_findLink('end2', otherTurtle, breedName, Undirected, @_linksOut)
      if outLink isnt Nobody
        outLink
      else
        @_findLink('end1', otherTurtle, breedName, Undirected, @_linksIn)

    # (String) => TurtleSet
    linkNeighbors: (breedName) ->
      turtleSetOf(@_neighborsIn(breedName, Undirected).concat(@_neighborsOut(breedName, Undirected)))

    # (String) => LinkSet
    myInLinks: (breedName) ->
      new LinkSet(@_linksIn.filter(linkBreedMatches(breedName)(Directed)))

    # (String) => LinkSet
    myLinks: (breedName) ->
      linkSetOf(@_linksIn.filter(linkBreedMatches(breedName)(Either)).
         concat(@_linksOut.filter(linkBreedMatches(breedName)(Either))))

    # (String) => LinkSet
    myOutLinks: (breedName) ->
      new LinkSet(@_linksOut.filter(linkBreedMatches(breedName)(Directed)))

    # (String) => TurtleSet
    outLinkNeighbors: (breedName) ->
      turtleSetOf(@_neighborsOut(breedName, Directed))

    # (String, Turtle) => Link
    outLinkTo: (breedName, otherTurtle) ->
      @_findLink('end2', otherTurtle, breedName, Directed, @_linksOut)

    # (Link) => Unit
    remove: (link) ->
      arr = if link.end1.id is @_ownerID then @_linksOut else @_linksIn
      arr.splice(arr.indexOf(link), 1)
      return

    # () => Array[Link]
    tieLinks: ->
      @_linksIn.filter((link) -> not link.isDirected).concat(@_linksOut)

    # () => Unit
    _clear: ->
      oldLinks = if @_linksOut? and @_linksIn? then @_linksIn.concat(@_linksOut) else []
      @_linksOut = []
      @_linksIn  = []

      # Purposely done after resetting the arrays so that calls to `TurtleLinkManager.remove` in `Link.die` don't spend
      # a ton of time iterating through long arrays that are in the process of being wiped out. --JAB (11/24/14)
      oldLinks.forEach((link) -> ignoring(DeathInterrupt)(() => link.die()))

      return

    # () => Unit
    _refresh: ->
      @_linksIn.concat(@_linksOut).forEach((link) -> link.updateEndRelatedVars(); return)
      return

    # (String, Directedness) => Array[Turtle]
    _neighborsOut: (breedName, directedness) ->
      @_filterNeighbors(@_linksOut, breedName, directedness).map((l) -> l.end2)

    # (String, Directedness) => Array[Turtle]
    _neighborsIn: (breedName, directedness) ->
      @_filterNeighbors(@_linksIn, breedName, directedness).map((l) -> l.end1)

    # (Array[Link], String, Directedness) => Array[Link]
    _filterNeighbors: (neighborArr, breedName, directedness) ->
      neighborArr.filter((link) => linkBreedMatches(breedName)(directedness)(link))

    # String -> Turtle -> String -> Directedness -> Array Link -> Agent
    _findLink: (key, otherTurtle, breedName, directedness, linkRegistry) ->
      find((l) -> l[key] is otherTurtle and linkBreedMatches(breedName)(directedness)(l))(linkRegistry) ? Nobody

    # (String) => Unit
    _mustBeUndirected: (breedName) ->
      if @_breedManager.get(breedName).isDirected()
        throw new Error("#{breedName} is a directed breed.")
      return

    # (String) => Unit
    _mustBeDirected: (breedName) ->
      if not @_breedManager.get(breedName).isDirected()
        throw new Error("#{breedName} is an undirected breed.")
      return
