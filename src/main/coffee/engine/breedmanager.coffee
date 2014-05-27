define(['integration/lodash'], (_) ->

  class Breed
    constructor: (@name, @singular, @manager, @_shape = false, @members = []) -> #@# How come the default is `false`, but `BreedManager.defaultBreeds` passes in `"default"`?
    shape: () -> if @_shape then @_shape else @manager.turtles()._shape
    vars: []
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
    remove: (agent) ->
      indexToSplitAt = @members.indexOf(agent)
      howManyToThrowOut = 1
      @members.splice(indexToSplitAt, howManyToThrowOut)


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
