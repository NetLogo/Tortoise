# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ getRandomSeedInt } = require('shim/random')
StrictMath           = require('shim/strictmath')
Gamma                = require('./gamma')

class RandomPrims

  constructor: (@_rng) ->

  # () => Number
  generateNewSeed: (->
    lastSeed = 0 # Rather than adding a global, scope this permanent state here --JAB (9/25/15)
    helper = ->
      # NetLogo desktop just uses a `new MersenneTwisterFast().nextInt()` here, but in NetLogo Web we have a potential
      # issue where a model presenter might ask thousands of people to load a page at once, and that presenter might
      # want to generate unique IDs for each viewer, and because of reduced moment-in-time time precision due to Spectre
      # attacks and the like, multiple viewers might then get the same "random" "unique" IDs as MTF uses the
      # moment-in-time as the seed.  The `crypto.getRandomValues()` used by `getRandomSeedInt()` is arguable a better
      # way to fetch a seed in any case, as we can trust our platform API to get some better entropy for us than what a
      # time stamp provides.  -Jeremy B September 2022
      seed = getRandomSeedInt()
      if seed isnt lastSeed
        lastSeed = seed
        seed
      else
        helper()
    helper
  )()

  # (Number) => Number
  random: (n) ->
    truncated =
      if n >= 0
        StrictMath.ceil(n)
      else
        StrictMath.floor(n)
    if truncated is 0
      0
    else if truncated > 0
      @_rng.nextLong(truncated)
    else
      -@_rng.nextLong(-truncated)

  # This is for `_randomconst`, `n` must also be >0. -Jeremy B September 2020
  # (Long) => Long
  randomLong: (n) ->
    @_rng.nextLong(n)

  # (Number, Number) => Number
  randomInRange: (min, max) ->
    min + @_rng.nextInt(max - min + 1)

  # (Number, Number) => Number
  randomFloatInRange: (min, max) ->
    min - 0.5 + @_rng.nextDouble() * (max - min + 1)

  # (Number) => Number
  randomExponential: (mean) ->
    -mean * StrictMath.log(@_rng.nextDouble())

  # (Number) => Number
  randomFloat: (n) ->
    n * @_rng.nextDouble()

  # (Number, Number) => Number
  randomGamma: (alpha, lambda) ->
    Gamma(@_rng, alpha, lambda)

  # (Number, Number) => Number
  randomNormal: (mean, stdDev) ->
    mean + stdDev * @_rng.nextGaussian()

  # (Number) => Number
  randomPoisson: (mean) ->
    q   = 0
    sum = -StrictMath.log(1 - @_rng.nextDouble())
    while sum <= mean
      q   += 1
      sum -= StrictMath.log(1 - @_rng.nextDouble())
    q

  randomSeed: (seed) ->
    @_rng.setSeed(seed)

  randomState: () ->
    @_rng.exportState()

module.exports = RandomPrims
