# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ validateLong, validateNumber } = require('./common-checks')

NLMath      = require('util/nlmath')
formatFloat = require('util/formatfloat')

class MathChecks

  constructor: (@_i18nBundle, @randomPrims) ->
    @validateNumber = validateNumber(@_i18nBundle)
    @validateLong   = validateLong(@_i18nBundle)

  acos: (d) ->
    @validateNumber(NLMath.acos(d))

  asin: (d) ->
    @validateNumber(NLMath.asin(d))

  # (Number, Number) => Number
  atan: (d1, d2) ->
    if d1 is 0 and d2 is 0
      throw new Error(@_i18nBundle.get('atan is undefined when both inputs are zero.'))
    NLMath.atan(d1, d2)

  # (Number, Number) => Number
  div: (n, d) ->
    if d is 0
      throw new Error(@_i18nBundle.get('Division by zero.'))
    n / d

  # (Number) => Number
  exp: (p) ->
    @validateNumber(NLMath.exp(p))

  # (Number) => Number
  int: (n) ->
    StrictMath.trunc(@validateLong(n))

  # (Number) =>
  ln: (n) ->
    if n <= 0
      throw new Error(@_i18nBundle.get('Can_t take logarithm of _.', n))
    NLMath.ln(n)

  # (Number, Number) => Number
  log: (n, b) ->
    if n <= 0
      throw new Error(@_i18nBundle.get('Can_t take logarithm of _.', n))
    if b <= 0
      throw new Error(@_i18nBundle.get('_ isn_t a valid base for a logarithm.', b))
    NLMath.log(n, b)

  # (Number, Number) => Number
  pow: (b, p) ->
    @validateNumber(NLMath.pow(b, p))

  random: (n) ->
    @randomPrims.random(@validateLong(n))

  # (Number) => Number
  randomExponential: (mean) ->
    @validateNumber(@randomPrims.randomExponential(mean))

  randomGamma: (alpha, lambda) ->
    if alpha <= 0 or lambda <= 0
      throw new Error(@_i18nBundle.get('Both Inputs to RANDOM-GAMMA must be positive.'))
    @randomPrims.randomGamma(alpha, lambda)

  randomNormal: (mean, stdDev) ->
    if stdDev < 0
      throw new Error(@_i18nBundle.get('random-normal_s second input can_t be negative.'))
    @validateNumber(@randomPrims.randomNormal(mean, stdDev))

  # (Number) => Unit
  randomSeed: (seed) ->
    if seed < -2147483648 or seed > 2147483647
      throw new Error(@_i18nBundle.get('_ is not in the allowable range for random seeds (-2147483648 to 2147483647)', formatFloat(seed)))
    @randomPrims.randomSeed(seed)
    return

  # (Number) => Number
  sqrt: (n) ->
    if n < 0
      throw new Error(@_i18nBundle.get('The square root of _ is an imaginary number.', n))
    NLMath.sqrt(n)

module.exports = MathChecks
