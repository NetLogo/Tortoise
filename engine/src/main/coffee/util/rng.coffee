# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Random    = require('../shim/random')
AuxRandom = require('../shim/auxrandom')

# We need an auxiliary RNG for non-deterministic RNG events (e.g. code run within monitors),
# so I sloppily manage what RNG is being used here.  I plan to, soon enough, clean up this
# mess by deleting this file and replacing it with a proper context-passing system. --JAB (10/17/14)
module.exports =
  class RNG

    # type Generator = { nextInt: (Number) => Number, nextLong: (Number) => Number, nextDouble: () => Number, setSeed: (Number) => Unit }

    _currentRNG: undefined # Generator
    _mainRNG:    undefined # Generator

    # () => RNG
    constructor: ->
      @_mainRNG    = Random
      @_currentRNG = @_mainRNG

    # (String) => Unit
    importState: (state) ->
      @_mainRNG.load(state)
      return

    # () => String
    exportState: ->
      @_mainRNG.save()

    # () => Number
    nextGaussian: =>
      @_currentRNG.nextGaussian()

    # (Number) => Number
    nextInt: (limit) =>
      @_currentRNG.nextInt(limit)

    # (Number) => Number
    nextLong: (limit) =>
      @_currentRNG.nextLong(limit)

    # () => Number
    nextDouble: =>
      @_currentRNG.nextDouble()

    # (Number) => Unit
    setSeed: (seed) ->
      @_currentRNG.setSeed(seed)
      return

    # [T] @ (() => T) => T
    withAux: (f) ->
      @_withAnother(AuxRandom)(f)

    # [T] @ (() => T) => T
    withClone: (f) ->
      @_withAnother(Random.clone())(f)

    # [T] @ (Generator) => (() => T) => T
    _withAnother: (rng) -> (f) =>
      prevRNG = @_currentRNG
      @_currentRNG = rng
      result =
        try f()
        finally
          @_currentRNG = prevRNG
      result
