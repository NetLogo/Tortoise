# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLMath      = require('util/nlmath')
formatFloat = require('util/formatfloat')

class MathChecks

  constructor: (@validator, @randomPrims) ->

  # (Number) => Number
  abs: (d) ->
    @validator.commonArgChecks.number("ABS", arguments)
    NLMath.abs(d)

  # (Number) => Number
  acos: (d) ->
    @validator.commonArgChecks.number("ACOS", arguments)
    @validator.checkNumber(NLMath.acos(d))

  # (Number) => Number
  asin: (d) ->
    @validator.commonArgChecks.number("ASIN", arguments)
    @validator.checkNumber(NLMath.asin(d))

  # (Number, Number) => Number
  atan: (d1, d2) ->
    @validator.commonArgChecks.number_number("ATAN", arguments)
    if d1 is 0 and d2 is 0
      @validator.error('atan is undefined when both inputs are zero.')

    NLMath.atan(d1, d2)

  # (Number) => Number
  ceil: (d) ->
    @validator.commonArgChecks.number("CEIL", arguments)
    NLMath.ceil(d)

  # (Number) => Number
  cos: (d) ->
    @validator.commonArgChecks.number("COS", arguments)
    NLMath.cos(d)

  # (Number, Number) => Number
  div: (n, d) ->
    @validator.commonArgChecks.number_number("/", arguments)
    if d is 0
      @validator.error('Division by zero.')
    n / d

  # (Number) => Number
  exp: (p) ->
    @validator.commonArgChecks.number("EXP", arguments)
    @validator.checkNumber(NLMath.exp(p))

  # (Number) => Number
  floor: (d) ->
    @validator.commonArgChecks.number("FLOOR", arguments)
    NLMath.floor(d)

  # (Number) => Number
  int: (n) ->
    @validator.commonArgChecks.number("INT", arguments)
    StrictMath.trunc(@validator.checkLong(n))

  # (Number) => Number
  ln: (n) ->
    @validator.commonArgChecks.number("LN", arguments)
    if n <= 0
      @validator.error('Can_t take logarithm of _.', n)

    NLMath.ln(n)

  # (Number, Number) => Number
  log: (n, b) ->
    @validator.commonArgChecks.number_number("LOG", arguments)
    if n <= 0
      @validator.error('Can_t take logarithm of _.', n)
    if b <= 0
      @validator.error('_ isn_t a valid base for a logarithm.', b)

    NLMath.log(n, b)

  # (Number, Number) => Number
  mod: (p, q) ->
    @validator.commonArgChecks.number_number("MOD", arguments)
    NLMath.mod(p, q)

  # (Number, Number) => Number
  pow: (b, p) ->
    @validator.commonArgChecks.number_number("POW", arguments)
    @validator.checkNumber(NLMath.pow(b, p))

  # (Number, Number) => Number
  precision: (n, places) ->
    @validator.commonArgChecks.number_number("PRECISION", arguments)
    NLMath.precision(n, places)

  # (Number) => Number
  random: (n) ->
    @validator.commonArgChecks.number("RANDOM", arguments)
    @randomPrims.random(@validator.checkLong(n))

  # (Number) => Number
  randomExponential: (mean) ->
    @validator.commonArgChecks.number("RANDOM-EXPONENTIAL", arguments)
    @validator.checkNumber(@randomPrims.randomExponential(mean))

  # (Number) => Number
  randomFloat: (n) ->
    @validator.commonArgChecks.number("RANDOM-FLOAT", arguments)
    @randomPrims.randomFloat(n)

  # (Number, Number) => Number
  randomGamma: (alpha, lambda) ->
    @validator.commonArgChecks.number_number("RANDOM-GAMMA", arguments)
    if alpha <= 0 or lambda <= 0
      @validator.error('Both Inputs to RANDOM-GAMMA must be positive.')

    @randomPrims.randomGamma(alpha, lambda)

  # (Number, Number) => Number
  randomNormal: (mean, stdDev) ->
    @validator.commonArgChecks.number_number("RANDOM-NORMAL", arguments)
    if stdDev < 0
      @validator.error('random-normal_s second input can_t be negative.')

    @validator.checkNumber(@randomPrims.randomNormal(mean, stdDev))

  # (Number) => Number
  randomPoisson: (mean) ->
    @validator.commonArgChecks.number("RANDOM-POISSON", arguments)
    @randomPrims.randomPoisson(mean)

  # (Number) => Unit
  randomSeed: (seed) ->
    @validator.commonArgChecks.number("RANDOM-SEED", arguments)
    if seed < -2147483648 or seed > 2147483647
      @validator.error('_ is not in the allowable range for random seeds (-2147483648 to 2147483647)', formatFloat(seed))

    @randomPrims.randomSeed(seed)
    return

  # (Number) => Number
  round: (n) ->
    @validator.commonArgChecks.number("ROUND", arguments)
    NLMath.round(n)

  # (Number) => Number
  sin: (d) ->
    @validator.commonArgChecks.number("SIN", arguments)
    NLMath.sin(d)

  # (Number) => Number
  sqrt: (n) ->
    @validator.commonArgChecks.number("SQRT", arguments)
    if n < 0
      @validator.error('The square root of _ is an imaginary number.', n)

    NLMath.sqrt(n)

  # (Number, Number) => Number
  subtractHeadings: (h1, h2) ->
    @validator.commonArgChecks.number_number("SUBTRACT-HEADINGS", arguments)
    NLMath.subtractHeadings(h1, h2)

  # (Number) => Number
  tan: (d) ->
    @validator.commonArgChecks.number("TAN", arguments)
    NLMath.tan(d)

module.exports = MathChecks
