StrictMath = require('shim/strictmath')

calcQ = (t, s, ss, q0) ->

  a1 =  0.333333333
  a2 = -0.249999949
  a3 =  0.199999867
  a4 = -0.166677482
  a5 =  0.142873973
  a6 = -0.124385581
  a7 =  0.110368310
  a8 = -0.112750886
  a9 =  0.104089866

  v = t / (s + s)

  if StrictMath.abs(v) > 0.25
    q0 - s * t + 0.25 * t * t + (ss + ss) * StrictMath.log(1 + v)
  else
    q0 + 0.5 * t * t * ((((((((a9 * v + a8) * v + a7) * v + a6) * v + a5) * v + a4) * v  + a3) * v + a2) * v + a1) * v

calcQ0 = (alpha) ->

  q1 =  0.0416666664
  q2 =  0.0208333723
  q3 =  0.0079849875
  q4 =  0.0015746717
  q5 = -0.0003349403
  q6 =  0.0003340332
  q7 =  0.0006053049
  q8 = -0.0004701849
  q9 =  0.0001710320

  r =  1 / alpha

  ((((((((q9 * r + q8) * r + q7) * r + q6) * r + q5) * r + q4) * r + q3) * r + q2) * r + q1) * r

calcT = (randomGenerator) ->

  generateVs = ->

    v1  = 2 * randomGenerator.nextDouble() - 1
    v2  = 2 * randomGenerator.nextDouble() - 1
    v12 = v1 * v1 + v2 * v2

    if v12 <= 1
      [v1, v12]
    else
      generateVs()

  [v1, v12] = generateVs()

  v1 * StrictMath.sqrt(-2 * StrictMath.log(v12) / v12)

calcVars = (b, si, randomGenerator) ->

  e     = -StrictMath.log(randomGenerator.nextDouble())
  uTemp = randomGenerator.nextDouble()
  u     = uTemp + uTemp - 1
  signU = if u > 0 then 1 else -1
  t     = b + (e * si) * signU

  if t > -0.71874483771719
    [e, signU, u, t]
  else
    calcVars(b, si, randomGenerator)

calcW = (q) ->

  e1 = 1.000000000
  e2 = 0.499999994
  e3 = 0.166666848
  e4 = 0.041664508
  e5 = 0.008345522
  e6 = 0.001353826
  e7 = 0.000247453

  if q > 0.5
    StrictMath.exp(q) - 1.0
  else
    ((((((e7 * q + e6) * q + e5) * q + e4) * q + e3)  * q + e2) * q + e1) * q

gdsFromAcceptanceRejection = (alpha, randomGenerator) ->

  b = 1 + 0.36788794412 * alpha

  generateNumbersUntilHappy = ->

    p        = b * randomGenerator.nextDouble()
    logRand  = StrictMath.log(randomGenerator.nextDouble())
    gdsLowP  = StrictMath.exp(StrictMath.log(p) / alpha)
    gdsHighP = -StrictMath.log((b - p) / alpha)

    if p <= 1 and logRand <= -gdsLowP
      gdsLowP
    else if p > 1 and logRand <= ((alpha - 1) * StrictMath.log(gdsHighP))
      gdsHighP
    else
      generateNumbersUntilHappy()

  generateNumbersUntilHappy()

gdsFromDoubleExponential = (b, si, c, s, ss, q0, randomGenerator) ->

  tryAgain = ->

    [e, signU, u, t] = calcVars(b, si, randomGenerator)

    # Step 12. Hat acceptance
    q = calcQ(t, s, ss, q0)
    if (q > 0) and (c * u * signU <= calcW(q) * StrictMath.exp(e - 0.5 * t * t))
      x = s + 0.5 * t
      x * x
    else
      tryAgain()

  tryAgain()

###

Gamma Distribution - Acceptance Rejection combined with Acceptance Complement

See: J.H. Ahrens, U. Dieter (1974): Computer methods for sampling from gamma, beta, Poisson and binomial distributions, Computing 12, 223-246.
See: J.H. Ahrens, U. Dieter (1982): Generating gamma variates by a modified rejection technique, Communications of the ACM 25, 47-54.

###
module.exports = (randomGenerator, alpha, lambda) ->

  gds =
    if alpha < 1 # CASE A: Acceptance rejection algorithm gs
      gdsFromAcceptanceRejection(alpha, randomGenerator)
    else # CASE B: Acceptance complement algorithm gd (gaussian distribution, box muller transformation)

      ss = alpha - 0.5
      s  = StrictMath.sqrt(ss)
      d  = 5.656854249 - 12 * s

      t = calcT(randomGenerator)
      x = s + 0.5 * t

      if t >= 0
        x * x
      else

        u = randomGenerator.nextDouble()

        if d * u <= t * t * t # Squeeze acceptance
          x * x
        else

          q0 = calcQ0(alpha)

          if (x > 0) and (StrictMath.log(1 - u) <= calcQ(t, s, ss, q0)) # Step 7. Quotient acceptance
            x * x
          else # Step 8. Double exponential deviate t

            # Set-up for hat case
            [b, si, c] =
              if alpha > 13.022
                [1.77                  , 0.75            , 0.1515 / s]
              else if alpha > 3.686
                [1.654 + 0.0076 * ss   , 1.68 / s + 0.275, 0.062 / s + 0.024]
              else
                [0.463 + s - 0.178 * ss, 1.235           , 0.195 / s - 0.079 + 0.016 * s]

            gdsFromDoubleExponential(b, si, c, s, ss, q0, randomGenerator)

  gds / lambda
