_                         = require('lodash')
LinkSet                   = require('./linkset')
Nobody                    = require('./nobody')
TurtleSet                 = require('./turtleset')
{ DeathInterrupt: Death } = require('tortoise/util/exception')

# (Breed) => String
mustNotBeDirected = (breed) ->
  if breed.isDirected()
    "#{breed.name} is a directed breed."
  else
    undefined

# (Breed) => String
mustNotBeUndirected = (breed) ->
  if breed.isUndirected()
    "#{breed} is an undirected breed."
  else
    undefined

# [T] @ (Array[T]) => Array[T]
uniques = (ls) ->
  _(ls).unique().value()

# (Array[Link]) => Array[Link]
uniqueLinks = uniques

# (Array[Turtle]) => Array[Turtle]
uniqueTurtles = uniques

# Used by functions that search both `_linksIn` and `_linksOut`, since links are often duplicated in them. --JAB (11/24/14)
# (Array[Link]) => LinkSet
linkSetOf = (links) ->
  new LinkSet(uniqueLinks(links))

# Used by neighbor-finding functions, since we could get duplicate turtles through breeded links. --JAB (11/24/14)
# (Array[Turtle]) => TurtleSet
turtleSetOf = (turtles) ->
  new TurtleSet(uniqueTurtles(turtles))

# (String) => (Link) => Boolean
linkBreedMatches = (breedName) -> (link) ->
  breedName is "LINKS" or breedName is link.getBreedName()

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
      _(@_linksIn).find((l) -> l.end1 is otherTurtle and linkBreedMatches(breedName)(l)) ? Nobody

    # (String) => TurtleSet
    inLinkNeighbors: (breedName) ->
      turtleSetOf(@_neighborsIn(breedName, true))

    # (String, Turtle) => Boolean
    isInLinkNeighbor: (breedName, turtle) ->
      @inLinkFrom(breedName, turtle) isnt Nobody

    # (String, Turtle) => Boolean
    isLinkNeighbor: (breedName, turtle) ->
      @isOutLinkNeighbor(breedName, turtle) or @isInLinkNeighbor(breedName, turtle)

    # (String, Turtle) => Boolean
    isOutLinkNeighbor: (breedName, turtle) ->
      @outLinkTo(breedName, turtle) isnt Nobody

    # (String, Turtle) => Link
    linkWith: (breedName, otherTurtle) ->
      outLink = @outLinkTo(breedName, otherTurtle)
      if outLink isnt Nobody
        outLink
      else
        @inLinkFrom(breedName, otherTurtle)

    # (String) => TurtleSet
    linkNeighbors: (breedName) ->
      turtleSetOf(@_neighborsIn(breedName, false).concat(@_neighborsOut(breedName, false)))

    # (String) => LinkSet
    myInLinks: (breedName) ->
      new LinkSet(@_linksIn.filter(linkBreedMatches(breedName)))

    # (String) => LinkSet
    myLinks: (breedName) ->
      linkSetOf(@_linksIn.filter(linkBreedMatches(breedName)).concat(@_linksOut.filter(linkBreedMatches(breedName))))

    # (String) => LinkSet
    myOutLinks: (breedName) ->
      new LinkSet(@_linksOut.filter(linkBreedMatches(breedName)))

    # (String) => TurtleSet
    outLinkNeighbors: (breedName) ->
      turtleSetOf(@_neighborsOut(breedName, true))

    # (String, Turtle) => Link
    outLinkTo: (breedName, otherTurtle) ->
      _(@_linksOut).find((l) -> l.end2 is otherTurtle and linkBreedMatches(breedName)(l)) ? Nobody

    # (Link) => Unit
    remove: (link) ->
      arr = if link.end1.id is @_ownerID then @_linksOut else @_linksIn
      arr.splice(arr.indexOf(link), 1)
      return

    # () => Array[Link]
    tieLinks: ->
      if @_breedManager.links().isUndirected()
        @_linksIn.concat(@_linksOut)
      else
        @_linksOut

    # () => Unit
    _clear: ->
      oldLinks = if @_linksOut? and @_linksIn? then @_linksIn.concat(@_linksOut) else []
      @_linksOut = []
      @_linksIn  = []

      # Purposely done after resetting the arrays so that calls to `TurtleLinkManager.remove` in `Link.die` don't spend
      # a ton of time iterating through long arrays that are in the process of being wiped out. --JAB (11/24/14)
      oldLinks.forEach(
        (link) ->
          try link.die()
          catch error
            throw error if not (error instanceof Death)
          return
      )

      return

    # () => Unit
    _refresh: ->
      @_linksIn.concat(@_linksOut).forEach((link) -> link.updateEndRelatedVars(); return)
      return

    # (String, Boolean) => Array[Turtle]
    _neighborsOut: (breedName, isDirected) ->
      @_filterNeighbors(@_linksOut, breedName, isDirected).map((l) -> l.end2)

    # (String, Boolean) => Array[Turtle]
    _neighborsIn: (breedName, isDirected) ->
      @_filterNeighbors(@_linksIn, breedName, isDirected).map((l) -> l.end1)

    # (Array[Link], String, Boolean) => Array[Link]
    _filterNeighbors: (neighborArr, breedName, isDirected) ->
      neighborArr.filter((link) => linkBreedMatches(breedName)(link) and @_isCorrectlyDirected(link, isDirected))

    # (Link, Boolean) => Boolean
    _isCorrectlyDirected: (link, isDirected) ->
      @_breedManager.links().isUndirected() or isDirected is @_breedManager.get(link.getBreedName()).isDirected()
