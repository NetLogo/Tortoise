# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ foldl, isEmpty, last, map, sortedIndexBy, toObject } = require('brazierjs/array')
{ pipeline                                           } = require('brazierjs/function')
{ values                                             } = require('brazierjs/object')

count = 0
getNextOrdinal = -> count++

class Breed

  ordinal: undefined # Number

  # (String, String, BreedManager, Array[String], Boolean, String, Array[Agent]) => Breed
  constructor: (@name, @singular, @_manager, @varNames = [], @_isDirectedLinkBreed, @_shape = undefined, @members = []) ->
    @ordinal = getNextOrdinal()

  # We can't just set this in the constructor, because people can swoop into the manager and change the turtles'
  # default shape --JAB (5/27/14)
  # () => String
  getShape: ->
    @_shape ? (if @isLinky() then @_manager.links()._shape else @_manager.turtles()._shape)

  # (String) => Unit
  setShape: (newShape) ->
    @_shape = newShape
    return

  # (Agent) => Unit
  add: (newAgent) ->
    if isEmpty(@members) or last(@members).id < newAgent.id
      @members.push(newAgent)
    else
      @members.splice(@_getAgentIndex(newAgent), howManyToThrowOut = 0, whatToInsert = newAgent)
    return

  # Agent -> Boolean
  contains: (agent) ->
    @members[@_getAgentIndex(agent)] is agent

  # (Agent) => Unit
  remove: (agent) ->
    @members.splice(@_getAgentIndex(agent), howManyToThrowOut = 1)
    return

  # () => Boolean
  isLinky: ->
    @_isDirectedLinkBreed?

  # () => Boolean
  isUndirected: ->
    @_isDirectedLinkBreed is false

  # () => Boolean
  isDirected: ->
    @_isDirectedLinkBreed is true

  # (Agent) => Number
  _getAgentIndex: (agent) ->
    sortedIndexBy((a) -> a.id)(@members)(agent)

module.exports =
  class BreedManager

    # type BreedObj = { name: String, singular: String, varNames: Array[String], isDirected: Boolean }

    _breeds:         undefined # Object[Breed]
    _singularBreeds: undefined # Object[Breed]

    # (Array[BreedObj], Array[String], Array[String]) => BreedManager
    constructor: (breedObjs, turtlesOwns = [], linksOwns = []) ->

      defaultBreeds = {
        TURTLES: new Breed("TURTLES", "turtle", this, turtlesOwns, undefined, "default"),
        LINKS:   new Breed("LINKS",   "link",   this, linksOwns,   false,     "default")
      }

      @_breeds = foldl(
        (acc, breedObj) =>
          trueName      = breedObj.name.toUpperCase()
          trueSingular  = breedObj.singular.toLowerCase()
          trueVarNames  = breedObj.varNames ? []
          acc[trueName] = new Breed(trueName, trueSingular, this, trueVarNames, breedObj.isDirected)
          acc
      )(defaultBreeds)(breedObjs)

      @_singularBreeds = pipeline(values, map((b) -> [b.singular, b]), toObject)(@_breeds)

    # () => Object[Breed]
    breeds: ->
      @_breeds

    orderedBreeds: ->
      if (!@_orderedBreeds?)
        @_orderedBreeds = Object.getOwnPropertyNames(@_breeds).sort((a, b) => @_breeds[a].ordinal - @_breeds[b].ordinal)
      @_orderedBreeds

    orderedLinkBreeds: ->
      if (!@_orderedLinkBreeds?)
        @_orderedLinkBreeds = @orderedBreeds().filter((b) => @_breeds[b].isLinky())
      @_orderedLinkBreeds

    orderedTurtleBreeds: ->
      if (!@_orderedTurtleBreeds?)
        @_orderedTurtleBreeds = @orderedBreeds().filter((b) => !@_breeds[b].isLinky())
      @_orderedTurtleBreeds

    # (String) => Breed
    get: (name) ->
      @_breeds[name.toUpperCase()]

    # (String) => Breed
    getSingular: (name) ->
      @_singularBreeds[name.toLowerCase()]

    # (String, String) => Unit
    setDefaultShape: (breedName, shape) ->
      @get(breedName).setShape(shape.toLowerCase())
      return

    # () => Unit
    setUnbreededLinksUndirected: ->
      @links()._isDirectedLinkBreed = false
      return

    # () => Unit
    setUnbreededLinksDirected: ->
      @links()._isDirectedLinkBreed = true
      return

    # () => Breed
    turtles: ->
      @get("TURTLES")

    # () => Breed
    links: ->
      @get("LINKS")
