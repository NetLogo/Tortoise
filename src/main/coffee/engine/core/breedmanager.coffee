# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_ = require('lodash')

class Breed

  # (String, String, BreedManager, Array[String], String, Array[Agent]) => Breed
  constructor: (@name, @singular, @_manager, @varNames = [], @_shape = undefined, @members = []) ->

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


module.exports =
  class BreedManager

    # type BreedObj = { name: String, singular: String, varNames: Array[String] }

    # Object[String, Breed]
    _breeds: undefined

    # (Array[BreedObj]) => BreedManager
    constructor: (breedObjs) ->
      defaultBreeds = {
        TURTLES: new Breed("TURTLES", "turtle", this, [], "default"),
        LINKS:   new Breed("LINKS",   "link",   this, [], "default")
      }
      @_breeds = _(breedObjs).foldl(
        (acc, breedObj) =>
          trueName      = breedObj.name.toUpperCase()
          trueSingular  = breedObj.singular.toLowerCase()
          trueVarNames  = breedObj.varNames or []
          acc[trueName] = new Breed(trueName, trueSingular, this, trueVarNames)
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

    # () => Breed
    turtles: ->
      @get("TURTLES")

    # () => Breed
    links: ->
      @get("LINKS")
