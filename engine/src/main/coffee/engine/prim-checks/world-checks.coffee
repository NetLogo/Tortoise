# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class WorldChecks

  constructor: (@validator, @world) ->

  setPatchSize: (sourceStart, sourceEnd, newSize) ->
    if newSize <= 0
      @validator.error('set-patch-size', sourceStart, sourceEnd, 'Patch size must be greater than zero.')
    @world.setPatchSize(newSize)

module.exports = WorldChecks
