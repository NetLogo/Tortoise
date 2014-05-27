define(['integration/lodash'], (_) ->

  class Breed

    # Array[String]
    vars: undefined

    # (String, String, BreedManager, String, Array[Agent]) => Breed
    constructor: (@name, @singular, @manager, @_shape = undefined, @members = []) ->
      @vars = []

    # We can't just set this in the constructor, because people can swoop into the manager and change the turtles'
    # default shape --JAB (5/27/14)
    # () => String
    getShape: ->
      if @_shape?
        @_shape
      else
        @manager.turtles()._shape

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


  class BreedManager

    # Object[String, Breed]
    _breeds: undefined

    # () => BreedManager
    constructor: ->
      @_breeds = {
        TURTLES: new Breed("TURTLES", "turtle", this, "default"),
        LINKS:   new Breed("LINKS",   "link",   this, "default")
      }

    # (String, String) => Unit
    add: (name, singular) ->
      trueName     = name.toUpperCase()
      trueSingular = singular.toLowerCase()
      @_breeds[trueName] = new Breed(trueName, trueSingular, this)
      return

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

)
