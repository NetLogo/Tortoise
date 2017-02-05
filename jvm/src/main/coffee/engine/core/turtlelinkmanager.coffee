# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

LinkSet   = require('./linkset')
Nobody    = require('./nobody')
TurtleSet = require('./turtleset')

{ filter, map, unique } = require('brazierjs/array')
{ pipeline }            = require('brazierjs/function')

{ DeathInterrupt, ignoring } = require('util/exception')

# data Directedness
All = {}
In  = {}
Out = {}

# Number -> Link -> Turtle
otherEnd = (sourceID) -> ({ end1, end2 }) ->
  if end1.id is sourceID then end2 else end1

# String -> Directedness -> Number -> Link -> Boolean
linkBreedMatches = (breedName) -> (directedness) -> (ownerID) -> (link) ->
  (breedName is "LINKS" or breedName is link.getBreedName()) and
    ((directedness is All) or
     (not link.isDirected) or
     (directedness is In  and link.end2.id is ownerID) or
     (directedness is Out and link.end1.id is ownerID))

module.exports =
  class LinkManager

    @_links: undefined # Array[(Link, Directedness)]

    # (Number, BreedManager, (Number) => Number) => LinkManager
    constructor: (@_ownerID, @_breedManager, @_randomInt) ->
      @_clear()

    # (Link) => Unit
    add: (link) ->
      @_links.push(link)
      return

    # (String, Turtle) => Link
    inLinkFrom: (breedName, otherTurtle) ->
      @_findLink(otherTurtle, breedName, In)

    # (String) => TurtleSet
    inLinkNeighbors: (breedName) ->
      @_neighbors(breedName, In)

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
      @_findLink(otherTurtle, breedName, All)

    # (String) => TurtleSet
    linkNeighbors: (breedName) ->
      @_neighbors(breedName, All)

    # (String) => LinkSet
    myInLinks: (breedName) ->
      new LinkSet(@_links.filter(linkBreedMatches(breedName)(In)(@_ownerID)))

    # (String) => LinkSet
    myLinks: (breedName) ->
      new LinkSet(@_links.filter(linkBreedMatches(breedName)(All)(@_ownerID)))

    # (String) => LinkSet
    myOutLinks: (breedName) ->
      new LinkSet(@_links.filter(linkBreedMatches(breedName)(Out)(@_ownerID)))

    # (String) => TurtleSet
    outLinkNeighbors: (breedName) ->
      @_neighbors(breedName, Out)

    # (String, Turtle) => Link
    outLinkTo: (breedName, otherTurtle) ->
      @_findLink(otherTurtle, breedName, Out)

    # (Link) => Unit
    remove: (link) ->
      @_links.splice(@_links.indexOf(link), 1)
      return

    # () => Unit
    _clear: ->
      oldLinks = @_links ? []
      @_links = []

      # Purposely done after resetting the array so that calls to `TurtleLinkManager.remove` in `Link.die` don't spend
      # a ton of time iterating through long arrays that are in the process of being wiped out. --JAB (11/24/14)
      oldLinks.forEach((link) -> ignoring(DeathInterrupt)(() => link.die()))

      return

    # Turtle -> String -> Directedness -> Agent
    _findLink: (otherTurtle, breedName, directedness) ->

      linkDoesMatch =
        (l) =>
          otherEnd(@_ownerID)(l) is otherTurtle and linkBreedMatches(breedName)(directedness)(@_ownerID)(l)

      links = @_links.filter(linkDoesMatch)

      if links.length is 0
        Nobody
      else if links.length is 1
        links[0]
      else
        links[@_randomInt(links.length)]

    # String -> Directedness -> TurtleSet
    _neighbors: (breedName, directedness) ->
      pipeline(
        filter(linkBreedMatches(breedName)(directedness)(@_ownerID))
      , map(otherEnd(@_ownerID))
      , unique
      , ((turtles) -> new TurtleSet(turtles))
      )(@_links)

    # () => Unit
    _refresh: ->
      @_links.forEach((link) -> link.updateEndRelatedVars(); return)
      return
