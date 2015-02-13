# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_ = require('lodash')

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
    if _(@members).isEmpty() or _(@members).last().id < newAgent.id
      @members.push(newAgent)
    else
      @members.splice(@_getAgentIndex(newAgent), howManyToThrowOut = 0, whatToInsert = newAgent)
    return

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
    _(@members).sortedIndex(agent, (a) -> a.id)

module.exports =
  class BreedManager

    # type BreedObj = { name: String, singular: String, varNames: Array[String], isDirected: Boolean }

    # Object[String, Breed]
    _breeds: undefined

    # (Array[BreedObj], Array[String], Array[String]) => BreedManager
    constructor: (breedObjs, turtlesOwns = [], linksOwns = []) ->
      defaultBreeds = {
        TURTLES: new Breed("TURTLES", "turtle", this, turtlesOwns, undefined, "default"),
        LINKS:   new Breed("LINKS",   "link",   this, linksOwns,   false,     "default")
      }
      @_breeds = _(breedObjs).foldl(
        (acc, breedObj) =>
          trueName      = breedObj.name.toUpperCase()
          trueSingular  = breedObj.singular.toLowerCase()
          trueVarNames  = breedObj.varNames ? []
          acc[trueName] = new Breed(trueName, trueSingular, this, trueVarNames, breedObj.isDirected)
          acc
        , defaultBreeds
      )

    # (String) => Breed
    get: (name) ->
      @_breeds[name.toUpperCase()]

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
