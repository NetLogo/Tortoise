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
    @_shape ? @_manager.turtles()._shape

  # (String) => Unit
  setShape: (newShape) ->
    @_shape = newShape
    return

  # (Agent) => Unit
  add: (newAgent) ->
    index = _(@members).findIndex((agent) -> agent.id > newAgent.id)
    indexToSplitAt =
      if index >= 0
        index
      else
        @members.length
    howManyToThrowOut = 0
    whatToInsert = newAgent
    @members.splice(indexToSplitAt, howManyToThrowOut, whatToInsert)
    return

  # (Agent) => Unit
  remove: (agent) ->
    indexToSplitAt = @members.indexOf(agent)
    howManyToThrowOut = 1
    @members.splice(indexToSplitAt, howManyToThrowOut)
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


module.exports =
  class BreedManager

    # type BreedObj = { name: String, singular: String, varNames: Array[String], isDirected: Boolean }

    # Object[String, Breed]
    _breeds: undefined

    # (Array[BreedObj]) => BreedManager
    constructor: (breedObjs) ->
      defaultBreeds = {
        TURTLES: new Breed("TURTLES", "turtle", this, [], undefined, "default"),
        LINKS:   new Breed("LINKS",   "link",   this, [], false,     "default")
      }
      @_breeds = _(breedObjs).foldl(
        (acc, breedObj) =>
          trueName      = breedObj.name.toUpperCase()
          trueSingular  = breedObj.singular.toLowerCase()
          trueVarNames  = breedObj.varNames or []
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
