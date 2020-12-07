# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLMath      = require('util/nlmath')
formatFloat = require('util/formatfloat')

class MathChecks

  constructor: (@validator, @randomPrims) ->

  acos: (d) ->
    @validator.checkNumber(NLMath.acos(d))

  asin: (d) ->
    @validator.checkNumber(NLMath.asin(d))

  # (Number, Number) => Number
  atan: (d1, d2) ->
    @validator.check(d1 is 0 and d2 is 0, 'atan is undefined when both inputs are zero.')
    NLMath.atan(d1, d2)

  # (Number, Number) => Number
  div: (n, d) ->
    @validator.check(d is 0, 'Division by zero.')
    n / d

  # (Number) => Number
  exp: (p) ->
    @validator.checkNumber(NLMath.exp(p))

  # (Number) => Number
  int: (n) ->
    StrictMath.trunc(@validator.checkLong(n))

  # (Number) =>
  ln: (n) ->
    @validator.check(n <= 0, 'Can_t take logarithm of _.', n)
    NLMath.ln(n)

  # (Number, Number) => Number
  log: (n, b) ->
    @validator.check(n <= 0, 'Can_t take logarithm of _.', n)
    @validator.check(b <= 0, '_ isn_t a valid base for a logarithm.', b)
    NLMath.log(n, b)

  # (Number, Number) => Number
  pow: (b, p) ->
    @validator.checkNumber(NLMath.pow(b, p))

  random: (n) ->
    @randomPrims.random(@validator.checkLong(n))

  # (Number) => Number
  randomExponential: (mean) ->
    @validator.checkNumber(@randomPrims.randomExponential(mean))

  randomGamma: (alpha, lambda) ->
    @validator.check(alpha <= 0 or lambda <= 0, 'Both Inputs to RANDOM-GAMMA must be positive.')
    @randomPrims.randomGamma(alpha, lambda)

  randomNormal: (mean, stdDev) ->
    @validator.check(stdDev < 0, 'random-normal_s second input can_t be negative.')
    @validator.checkNumber(@randomPrims.randomNormal(mean, stdDev))

  # (Number) => Unit
  randomSeed: (seed) ->
    @validator.check(seed < -2147483648 or seed > 2147483647, '_ is not in the allowable range for random seeds (-2147483648 to 2147483647)', formatFloat(seed))
    @randomPrims.randomSeed(seed)
    return

  # (Number) => Number
  sqrt: (n) ->
    @validator.check(n < 0, 'The square root of _ is an imaginary number.', n)
    NLMath.sqrt(n)

module.exports = MathChecks
