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
    shape: ->
      if @_shape?
        @_shape
      else
        @manager.turtles()._shape

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
    defaultBreeds: -> {
      TURTLES: new Breed("TURTLES", "turtle", this, "default"),
      LINKS: new Breed("LINKS", "link", this, "default")
    }
    breeds: {} #@# Privatize
    reset: -> @breeds = @defaultBreeds()
    add: (name, singular) ->
      upperName = name.toUpperCase()
      @breeds[upperName] = new Breed(upperName, singular.toLowerCase(), this)
    get: (name) ->
      @breeds[name.toUpperCase()]
    setDefaultShape: (agents, shape) ->
      @get(agents.getBreedName())._shape = shape.toLowerCase() #@# Oh, yeah?  You just go and modify the private member?  Pretty cool!

    # () => Breed
    turtles: ->
      @get("TURTLES")

    # () => Breed
    links: ->
      @get("LINKS")

)
