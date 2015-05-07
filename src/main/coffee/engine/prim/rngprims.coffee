# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

StrictMath = require('tortoise/shim/strictmath')

module.exports =

  # (RNG) => RNGPrims
  clas RNGPrims(@_rng) ->

    # (Number) => Number
    random_number: (n) ->
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

    # (Number) => Number
    randomFloat_number: (n) ->
      n * @_rng.nextDouble()
