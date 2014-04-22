define(->

  class Breed
    constructor: (@name, @singular, @manager, @_shape = false, @members = []) -> #@# How come the default is `false`, but `BreedManager.defaultBreeds` passes in `"default"`?
    shape: () -> if @_shape then @_shape else @manager.get("TURTLES")._shape #@# Turtles, patches, and links should be easily accessed on `BreedManager`
    vars: []
    add: (agent) ->
      for a, i in @members #@# Lame, unused variable
        if a.id > agent.id
          break #@# `break` means that your code is probably wrong
      @members.splice(i, 0, agent) #@# WTF does this mean?  You're all insane.  The proper solution is probably Lodash
    remove: (agent) ->
      @members.splice(@members.indexOf(agent), 1)

  #@# Why bother with a companion object?  Why not just put these properties and functions directly into what this exports.
  # Since `breeds` is mutable state, the companion can't be a static object
  class BreedCompanion
    defaultBreeds: -> {
      TURTLES: new Breed("TURTLES", "turtle", "default"),
      LINKS: new Breed("LINKS", "link", "default")
    }
    breeds: {} #@# Privatize
    reset: -> @breeds = @defaultBreeds()
    add: (name, singular) ->
      upperName = name.toUpperCase()
      @breeds[upperName] = new Breed(upperName, singular.toLowerCase())
    get: (name) ->
      @breeds[name.toUpperCase()]
    setDefaultShape: (agents, shape) ->
      agents.breed._shape = shape.toLowerCase() #@# Oh, yeah?  You just go and modify the private member?  Pretty cool!

  # Cyclic dependency; good luck separating --JAB (4/16/14)
  {
    Class     : Breed
    Companion : new BreedCompanion #!# This won't work!
  }

)
