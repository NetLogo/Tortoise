# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

StrictMath = require('shim/strictmath')
Gamma      = require('./gamma')

class RandomPrims

  constructor: (@_rng) ->

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

module.exports = RandomPrims
