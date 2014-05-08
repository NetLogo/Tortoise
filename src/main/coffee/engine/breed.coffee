define(['integration/lodash'], (_) ->
  class Breed
    constructor: (@name, @singular, @manager, @_shape = false, @members = []) -> #@# How come the default is `false`, but `BreedManager.defaultBreeds` passes in `"default"`?
    shape: () -> if @_shape then @_shape else @manager.turtles()._shape #@# Turtles, patches, and links should be easily accessed on `BreedManager`
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
)
