# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLMath      = require('util/nlmath')
formatFloat = require('util/formatfloat')

class MathChecks

  constructor: (@validator, @randomPrims) ->

  # (Number) => Number
  abs: (d) ->
    @validator.commonArgChecks.number("ABS", arguments)
    @abs_unchecked(d)

  abs_unchecked: (d) ->
    NLMath.abs(d)

  # (Number) => Number
  acos: (d) ->
    @validator.commonArgChecks.number("ACOS", arguments)
    @acos_unchecked(d)

  acos_unchecked: (d) ->
    @validator.checkNumber(NLMath.acos(d))

  # (String, Boolean) => Boolean
  bool: (prim, a) ->
    @validator.commonArgChecks.boolean(prim, [a])
    a

  # (Number) => Number
  asin: (d) ->
    @validator.commonArgChecks.number("ASIN", arguments)
    @asin_unchecked(d)

  asin_unchecked: (d) ->
    @validator.checkNumber(NLMath.asin(d))

  # (Number, Number) => Number
  atan: (d1, d2) ->
    @validator.commonArgChecks.number_number("ATAN", arguments)
    @atan_unchecked(d1, d2)

  atan_unchecked: (d1, d2) ->
    if d1 is 0 and d2 is 0
      @validator.error('atan is undefined when both inputs are zero.')

    NLMath.atan(d1, d2)

  # (Number) => Number
  ceil: (d) ->
    @validator.commonArgChecks.number("CEIL", arguments)
    @ceil_unchecked(d)

  ceil_unchecked: (d) ->
    NLMath.ceil(d)

  # (Number) => Number
  cos: (d) ->
    @validator.commonArgChecks.number("COS", arguments)
    @cos_unchecked(d)

  cos_unchecked: (d) ->
    NLMath.cos(d)

  # (Number, Number) => Number
  div: (n, d) ->
    @validator.commonArgChecks.number_number("/", arguments)
    @div_unchecked(n, d)

  div_unchecked: (n, d) ->
    if d is 0
      @validator.error('Division by zero.')
    n / d

  # (Number) => Number
  exp: (p) ->
    @validator.commonArgChecks.number("EXP", arguments)
    @exp_unchecked(p)

  exp_unchecked: (p) ->
    @validator.checkNumber(NLMath.exp(p))

  # (Number) => Number
  floor: (d) ->
    @validator.commonArgChecks.number("FLOOR", arguments)
    @floor_unchecked(d)

  floor_unchecked: (d) ->
    NLMath.floor(d)

  # (Number) => Number
  int: (n) ->
    @validator.commonArgChecks.number("INT", arguments)
    @int_unchecked(n)

  int_unchecked: (n) ->
    StrictMath.trunc(@validator.checkLong(n))

  # (Number) => Number
  ln: (n) ->
    @validator.commonArgChecks.number("LN", arguments)
    @ln_unchecked(n)

  ln_unchecked: (n) ->
    if n <= 0
      @validator.error('Can_t take logarithm of _.', n)

    NLMath.ln(n)

  # (Number, Number) => Number
  log: (n, b) ->
    @validator.commonArgChecks.number_number("LOG", arguments)
    @log_unchecked(n, b)

  log_unchecked: (n, b) ->
    if n <= 0
      @validator.error('Can_t take logarithm of _.', n)
    if b <= 0
      @validator.error('_ isn_t a valid base for a logarithm.', b)

    NLMath.log(n, b)

  # (Number, Number) => Number
  minus: (a, b) ->
    @validator.commonArgChecks.number_number("-", arguments)
    @minus_unchecked(a, b)

  minus_unchecked: (a, b) ->
    @validator.checkNumber(a - b)

  # (Number, Number) => Number
  mod: (p, q) ->
    @validator.commonArgChecks.number_number("MOD", arguments)
    @mod_unchecked(p, q)

  mod_unchecked: (p, q) ->
    NLMath.mod(p, q)

  # (Number, Number) => Number
  mult: (a, b) ->
    @validator.commonArgChecks.number_number("*", arguments)
    @mult_unchecked(a, b)

  mult_unchecked: (a, b) ->
    @validator.checkNumber(a * b)

  not: (a) ->
    @validator.commonArgChecks.boolean("NOT", arguments)
    @not_unchecked(a)

  not_unchecked: (a) ->
    not a

  # (Number, Number) => Number
  plus: (a, b) ->
    @validator.checkNumber(a + b)

  # (Number, Number) => Number
  pow: (b, p) ->
    @validator.commonArgChecks.number_number("POW", arguments)
    @pow_unchecked(b, p)

  pow_unchecked: (b, p) ->
    @validator.checkNumber(NLMath.pow(b, p))

  # (Number, Number) => Number
  precision: (n, places) ->
    @validator.commonArgChecks.number_number("PRECISION", arguments)
    @precision_unchecked(n, places)

  precision_unchecked: (n, places) ->
    NLMath.precision(n, places)

  # (Number) => Number
  random: (n) ->
    @validator.commonArgChecks.number("RANDOM", arguments)
    @random_unchecked(n)

  random_unchecked: (n) ->
    @randomPrims.random(@validator.checkLong(n))

  # (Number) => Number
  randomExponential: (mean) ->
    @validator.commonArgChecks.number("RANDOM-EXPONENTIAL", arguments)
    @randomExponential_unchecked(mean)

  randomExponential_unchecked: (mean) ->
    @validator.checkNumber(@randomPrims.randomExponential(mean))

  # (Number) => Number
  randomFloat: (n) ->
    @validator.commonArgChecks.number("RANDOM-FLOAT", arguments)
    @randomFloat_unchecked(n)

  randomFloat_unchecked: (n) ->
    @randomPrims.randomFloat(n)

  # (Number, Number) => Number
  randomGamma: (alpha, lambda) ->
    @validator.commonArgChecks.number_number("RANDOM-GAMMA", arguments)
    @randomGamma_unchecked(alpha, lambda)

  randomGamma_unchecked: (alpha, lambda) ->
    if alpha <= 0 or lambda <= 0
      @validator.error('Both Inputs to RANDOM-GAMMA must be positive.')

    @randomPrims.randomGamma(alpha, lambda)

  # (Number, Number) => Number
  randomNormal: (mean, stdDev) ->
    @validator.commonArgChecks.number_number("RANDOM-NORMAL", arguments)
    @randomNormal_unchecked(mean, stdDev)

  randomNormal_unchecked: (mean, stdDev) ->
    if stdDev < 0
      @validator.error('random-normal_s second input can_t be negative.')

    @validator.checkNumber(@randomPrims.randomNormal(mean, stdDev))

  # (Number) => Number
  randomPoisson: (mean) ->
    @validator.commonArgChecks.number("RANDOM-POISSON", arguments)
    @randomPoisson_unchecked(mean)

  randomPoisson_unchecked: (mean) ->
    @randomPrims.randomPoisson(mean)

  # (Number) => Unit
  randomSeed: (seed) ->
    @validator.commonArgChecks.number("RANDOM-SEED", arguments)
    @randomSeed_unchecked(seed)

  randomSeed_unchecked: (seed) ->
    if seed < -2147483648 or seed > 2147483647
      @validator.error('_ is not in the allowable range for random seeds (-2147483648 to 2147483647)', formatFloat(seed))

    @randomPrims.randomSeed(seed)
    return

  # (Number, Number) => Number
  remainder: (a, b) ->
    @validator.commonArgChecks.number_number("REMAINDER", arguments)
    @remainder_unchecked(a, b)

  remainder_unchecked: (a, b) ->
    a % b

  # (Number) => Number
  round: (n) ->
    @validator.commonArgChecks.number("ROUND", arguments)
    @round_unchecked(n)

  round_unchecked: (n) ->
    NLMath.round(n)

  # (Number) => Number
  sin: (d) ->
    @validator.commonArgChecks.number("SIN", arguments)
    @sin_unchecked(d)

  sin_unchecked: (d) ->
    NLMath.sin(d)

  # (Number) => Number
  sqrt: (n) ->
    @validator.commonArgChecks.number("SQRT", arguments)
    @sqrt_unchecked(n)

  sqrt_unchecked: (n) ->
    if n < 0
      @validator.error('The square root of _ is an imaginary number.', n)

    NLMath.sqrt(n)

  # (Number, Number) => Number
  subtractHeadings: (h1, h2) ->
    @validator.commonArgChecks.number_number("SUBTRACT-HEADINGS", arguments)
    @subtractHeadings_unchecked(h1, h2)

  subtractHeadings_unchecked: (h1, h2) ->
    NLMath.subtractHeadings(h1, h2)

  # (Number) => Number
  tan: (d) ->
    @validator.commonArgChecks.number("TAN", arguments)
    @tan_unchecked(d)

  tan_unchecked: (d) ->
    NLMath.tan(d)

  # (Number) => Number
  unaryminus: (a) ->
    @validator.commonArgChecks.number("-", arguments)
    @unaryminus_unchecked(a)

  unaryminus_unchecked: (a) ->
    -(a)

  # (Boolean, Boolean) => Boolean
  xor: (a, b) ->
    @validator.commonArgChecks.boolean_boolean("XOR", arguments)
    @xor_unchecked(a, b)

  xor_unchecked: (a, b) ->
    a isnt b

module.exports = MathChecks
