# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLMath      = require('util/nlmath')
formatFloat = require('util/formatfloat')

class MathChecks

  constructor: (@validator, @randomPrims) ->

  # (Number) => Number
  abs: (d) ->
    NLMath.abs(d)

  # (Int, Int, Number) => Number
  acos: (sourceStart, sourceEnd, d) ->
    @validator.checkNumber('acos', sourceStart, sourceEnd, NLMath.acos(d))

  # (Int, Int, Number) => Number
  asin: (sourceStart, sourceEnd, d) ->
    @validator.checkNumber('asin', sourceStart, sourceEnd, NLMath.asin(d))

  # (Int, Int, Number, Number) => Number
  atan: (sourceStart, sourceEnd, d1, d2) ->
    if d1 is 0 and d2 is 0
      @validator.error('atan', sourceStart, sourceEnd, 'atan is undefined when both inputs are zero.')

    NLMath.atan(d1, d2)

  # (Number) => Number
  ceil: (d) ->
    NLMath.ceil(d)

  # (Number) => Number
  cos: (d) ->
    NLMath.cos(d)

  # (Int, Int, Number, Number) => Number
  div: (sourceStart, sourceEnd, n, d) ->
    if d is 0
      @validator.error('/', sourceStart, sourceEnd, 'Division by zero.')
    n / d

  # (Int, Int, Number) => Number
  exp: (sourceStart, sourceEnd, p) ->
    @validator.checkNumber('exp', sourceStart, sourceEnd, NLMath.exp(p))

  # (Number) => Number
  floor: (d) ->
    NLMath.floor(d)

  # (Int, Int, Number) => Number
  int: (sourceStart, sourceEnd, n) ->
    StrictMath.trunc(@validator.checkLong('int', sourceStart, sourceEnd, n))

  # (Int, Int, Number) => Number
  ln: (sourceStart, sourceEnd, n) ->
    if n <= 0
      @validator.error('ln', sourceStart, sourceEnd, 'Can_t take logarithm of _.', n)

    NLMath.ln(n)

  # (Int, Int, Number, Number) => Number
  log: (sourceStart, sourceEnd, n, b) ->
    if n <= 0
      @validator.error('log', sourceStart, sourceEnd, 'Can_t take logarithm of _.', n)
    if b <= 0
      @validator.error('log', sourceStart, sourceEnd, '_ isn_t a valid base for a logarithm.', b)

    NLMath.log(n, b)

  # (Int, Int, Number, Number) => Number
  minus: (sourceStart, sourceEnd, a, b) ->
    @validator.checkNumber('-', sourceStart, sourceEnd, a - b)

  # (Int, Int, Number, Number) => Number
  mod: (sourceStart, sourceEnd, p, q) ->
    if q is 0
      @validator.error('mod', sourceStart, sourceEnd, 'Division by zero.')

    NLMath.mod(p, q)

  # (Int, Int, Number, Number) => Number
  mult: (sourceStart, sourceEnd, a, b) ->
    @validator.checkNumber('*', sourceStart, sourceEnd, a * b)

  # (Boolean) => Boolean
  not: (a) ->
    not a

  # (Int, Int, Number, Number) => Number
  plus: (sourceStart, sourceEnd, a, b) ->
    @validator.checkNumber('+', sourceStart, sourceEnd, a + b)

  # (Int, Int, Number, Number) => Number
  pow: (sourceStart, sourceEnd, b, p) ->
    @validator.checkNumber('pow', sourceStart, sourceEnd, NLMath.pow(b, p))

  # (Number, Number) => Number
  precision: (n, places) ->
    NLMath.precision(n, places)

  # (Int, Int, Number) => Number
  random: (sourceStart, sourceEnd, n) ->
    @randomPrims.random(@validator.checkLong('random', sourceStart, sourceEnd, n))

  # (Number) => Number
  randomExponential: (mean) ->
    @validator.checkNumber('random-exponential', sourceStart, sourceEnd, @randomPrims.randomExponential(mean))

  # (Number) => Number
  randomFloat: (n) ->
    @randomPrims.randomFloat(n)

  # (Int, Int, Number, Number) => Number
  randomGamma: (sourceStart, sourceEnd, alpha, lambda) ->
    if alpha <= 0 or lambda <= 0
      @validator.error('random-gamma', sourceStart, sourceEnd, 'Both Inputs to RANDOM-GAMMA must be positive.')

    @randomPrims.randomGamma(alpha, lambda)

  # (Int, Int, Number, Number) => Number
  randomNormal: (sourceStart, sourceEnd, mean, stdDev) ->
    if stdDev < 0
      @validator.error('random-normal', sourceStart, sourceEnd, 'random-normal_s second input can_t be negative.')

    @validator.checkNumber('random-normal', sourceStart, sourceEnd, @randomPrims.randomNormal(mean, stdDev))

  # (Number) => Number
  randomPoisson: (mean) ->
    @randomPrims.randomPoisson(mean)

  # (Int, Int, Number) => Unit
  randomSeed: (sourceStart, sourceEnd, seed) ->
    if seed < -2147483648 or seed > 2147483647
      @validator.error('random-seed', sourceStart, sourceEnd, '_ is not in the allowable range for random seeds (-2147483648 to 2147483647)', formatFloat(seed))

    @randomPrims.randomSeed(seed)
    return

  # (Number, Number) => Number
  remainder: (a, b) ->
    a % b

  # (Number) => Number
  round: (n) ->
    NLMath.round(n)

  # (Number) => Number
  sin: (d) ->
    NLMath.sin(d)

  # (Int, Int, Number) => Number
  sqrt: (sourceStart, sourceEnd, n) ->
    if n < 0
      @validator.error('sqrt', sourceStart, sourceEnd, 'The square root of _ is an imaginary number.', n)

    NLMath.sqrt(n)

  # (Number, Number) => Number
  subtractHeadings: (h1, h2) ->
    NLMath.subtractHeadings(h1, h2)

  # (Int, Int, Number) => Number
  tan: (sourceStart, sourceEnd, d) ->
    mod = d % 180
    if mod is 90 or mod is -90
      @validator.raiseInfinityError('tan', sourceStart, sourceEnd)
    # This `mod is 0` logic should technically be in the NLMath implementation, but
    # this saves us from re-calculating the modulo there as well.  We could
    # just send the `mod` in as the argument, but that will make small
    # differences with the existing results from NetLogo due to floating
    # point arithmetic in the degrees to radians conversions.
    # -Jeremy B November 2021
    if mod is 0
      0
    else
      NLMath.tan(d)

  # (Number) => Number
  unaryminus: (a) ->
    -(a)

  # (Boolean, Boolean) => Boolean
  xor: (a, b) ->
    a isnt b

module.exports = MathChecks
