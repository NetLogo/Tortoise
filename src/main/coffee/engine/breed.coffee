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
)
