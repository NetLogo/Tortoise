# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLMath      = require('util/nlmath')
formatFloat = require('util/formatfloat')

class MathChecks

  constructor: (@validator, @randomPrims) ->

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
    @validator.check(d1 is 0 and d2 is 0, 'atan is undefined when both inputs are zero.')
    NLMath.atan(d1, d2)

  # (Number, Number) => Number
  div: (n, d) ->
    @validator.commonArgChecks.number_number("/", arguments)
    @validator.check(d is 0, 'Division by zero.')
    n / d

  # (Number) => Number
  exp: (p) ->
    @validator.commonArgChecks.number("EXP", arguments)
    @validator.checkNumber(NLMath.exp(p))

  # (Number) => Number
  int: (n) ->
    @validator.commonArgChecks.number("INT", arguments)
    StrictMath.trunc(@validator.checkLong(n))

  # (Number) => Number
  ln: (n) ->
    @validator.commonArgChecks.number("LN", arguments)
    @validator.check(n <= 0, 'Can_t take logarithm of _.', n)
    NLMath.ln(n)

  # (Number, Number) => Number
  log: (n, b) ->
    @validator.commonArgChecks.number_number("LOG", arguments)
    @validator.check(n <= 0, 'Can_t take logarithm of _.', n)
    @validator.check(b <= 0, '_ isn_t a valid base for a logarithm.', b)
    NLMath.log(n, b)

  # (Number, Number) => Number
  pow: (b, p) ->
    @validator.commonArgChecks.number_number("POW", arguments)
    @validator.checkNumber(NLMath.pow(b, p))

  # (Number) => Number
  random: (n) ->
    @validator.commonArgChecks.number("RANDOM", arguments)
    @randomPrims.random(@validator.checkLong(n))

  # (Number) => Number
  randomExponential: (mean) ->
    @validator.commonArgChecks.number("RANDOM-EXPONENTIAL", arguments)
    @validator.checkNumber(@randomPrims.randomExponential(mean))

  # (Number, Number) => Number
  randomGamma: (alpha, lambda) ->
    @validator.commonArgChecks.number_number("RANDOM-GAMMA", arguments)
    @validator.check(alpha <= 0 or lambda <= 0, 'Both Inputs to RANDOM-GAMMA must be positive.')
    @randomPrims.randomGamma(alpha, lambda)

  # (Number, Number) => Number
  randomNormal: (mean, stdDev) ->
    @validator.commonArgChecks.number_number("RANDOM-NORMAL", arguments)
    @validator.check(stdDev < 0, 'random-normal_s second input can_t be negative.')
    @validator.checkNumber(@randomPrims.randomNormal(mean, stdDev))

  # (Number) => Unit
  randomSeed: (seed) ->
    @validator.commonArgChecks.number("RANDOM-SEED", arguments)
    @validator.check(seed < -2147483648 or seed > 2147483647, '_ is not in the allowable range for random seeds (-2147483648 to 2147483647)', formatFloat(seed))
    @randomPrims.randomSeed(seed)
    return

  # (Number) => Number
  sqrt: (n) ->
    @validator.commonArgChecks.number("SQRT", arguments)
    @validator.check(n < 0, 'The square root of _ is an imaginary number.', n)
    NLMath.sqrt(n)

module.exports = MathChecks
