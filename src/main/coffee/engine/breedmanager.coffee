define(['engine/breed'], (Breed) -> #@# This is the only place where `Breed` is instantiated.  It could conceivably be hidden in here.
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
      agents.getBreed()._shape = shape.toLowerCase() #@# Oh, yeah?  You just go and modify the private member?  Pretty cool!

    # () => Breed
    turtles: ->
      @get("TURTLES")

    # () => Breed
    links: ->
      @get("LINKS")

)
