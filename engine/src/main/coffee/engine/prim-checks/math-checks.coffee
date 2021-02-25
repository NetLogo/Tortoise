# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLMath      = require('util/nlmath')
formatFloat = require('util/formatfloat')

class MathChecks

  constructor: (@validator, @randomPrims) ->

  # (Number) => Number
  abs: (d) ->
    NLMath.abs(d)

  # (Number) => Number
  acos: (d) ->
    @validator.checkNumber(NLMath.acos(d))

  # (Number) => Number
  asin: (d) ->
    @validator.checkNumber(NLMath.asin(d))

  # (Number, Number) => Number
  atan: (d1, d2) ->
    if d1 is 0 and d2 is 0
      @validator.error('atan is undefined when both inputs are zero.')

    NLMath.atan(d1, d2)

  # (Number) => Number
  ceil: (d) ->
    NLMath.ceil(d)

  # (Number) => Number
  cos: (d) ->
    NLMath.cos(d)

  # (Number, Number) => Number
  div: (n, d) ->
    if d is 0
      @validator.error('Division by zero.')
    n / d

  # (Number) => Number
  exp: (p) ->
    @validator.checkNumber(NLMath.exp(p))

  # (Number) => Number
  floor: (d) ->
    NLMath.floor(d)

  # (Number) => Number
  int: (n) ->
    StrictMath.trunc(@validator.checkLong(n))

  # (Number) => Number
  ln: (n) ->
    if n <= 0
      @validator.error('Can_t take logarithm of _.', n)

    NLMath.ln(n)

  # (Number, Number) => Number
  log: (n, b) ->
    if n <= 0
      @validator.error('Can_t take logarithm of _.', n)
    if b <= 0
      @validator.error('_ isn_t a valid base for a logarithm.', b)

    NLMath.log(n, b)

  # (Number, Number) => Number
  minus: (a, b) ->
    @validator.checkNumber(a - b)

  # (Number, Number) => Number
  mod: (p, q) ->
    NLMath.mod(p, q)

  # (Number, Number) => Number
  mult: (a, b) ->
    @validator.checkNumber(a * b)

  # (Boolean) => Boolean
  not: (a) ->
    not a

  # (Number, Number) => Number
  plus: (a, b) ->
    @validator.checkNumber(a + b)

  # (Number, Number) => Number
  pow: (b, p) ->
    @validator.checkNumber(NLMath.pow(b, p))

  # (Number, Number) => Number
  precision: (n, places) ->
    NLMath.precision(n, places)

  # (Number) => Number
  random: (n) ->
    @randomPrims.random(@validator.checkLong(n))

  # (Number) => Number
  randomExponential: (mean) ->
    @validator.checkNumber(@randomPrims.randomExponential(mean))

  # (Number) => Number
  randomFloat: (n) ->
    @randomPrims.randomFloat(n)

  # (Number, Number) => Number
  randomGamma: (alpha, lambda) ->
    if alpha <= 0 or lambda <= 0
      @validator.error('Both Inputs to RANDOM-GAMMA must be positive.')

    @randomPrims.randomGamma(alpha, lambda)

  # (Number, Number) => Number
  randomNormal: (mean, stdDev) ->
    if stdDev < 0
      @validator.error('random-normal_s second input can_t be negative.')

    @validator.checkNumber(@randomPrims.randomNormal(mean, stdDev))

  # (Number) => Number
  randomPoisson: (mean) ->
    @randomPrims.randomPoisson(mean)

  # (Number) => Unit
  randomSeed: (seed) ->
    if seed < -2147483648 or seed > 2147483647
      @validator.error('_ is not in the allowable range for random seeds (-2147483648 to 2147483647)', formatFloat(seed))

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

  # (Number) => Number
  sqrt: (n) ->
    if n < 0
      @validator.error('The square root of _ is an imaginary number.', n)

    NLMath.sqrt(n)

  # (Number, Number) => Number
  subtractHeadings: (h1, h2) ->
    NLMath.subtractHeadings(h1, h2)

  # (Number) => Number
  tan: (d) ->
    NLMath.tan(d)

  # (Number) => Number
  unaryminus: (a) ->
    -(a)

  # (Boolean, Boolean) => Boolean
  xor: (a, b) ->
    a isnt b

module.exports = MathChecks
