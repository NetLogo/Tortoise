StrictMath       = require('shim/strictmath')
module.exports = (randomGenerator, alpha, lambda) ->
  a = alpha
  b = 0.0
  c = 0.0
  d = 0.0
  e = 0.0
  r = 0.0
  s = 0.0
  si = 0.0
  ss = 0.0
  q0 = 0.0
  q1 = 0.0416666664
  q2 = 0.0208333723
  q3 = 0.0079849875
  q4 = 0.0015746717
  q5 = -0.0003349403
  q6 = 0.0003340332
  q7 = 0.0006053049
  q8 = -0.0004701849
  q9 = 0.0001710320
  a1 = 0.333333333
  a2 = -0.249999949
  a3 = 0.199999867
  a4 = -0.166677482
  a5 = 0.142873973
  a6 = -0.124385581
  a7 = 0.110368310
  a8 = -0.112750886
  a9 = 0.104089866
  e1 = 1.000000000
  e2 = 0.499999994
  e3 = 0.166666848
  e4 = 0.041664508
  e5 = 0.008345522
  e6 = 0.001353826
  e7 = 0.000247453

  gds = 0.0
  p = 0.0
  q = 0.0
  t = 0.0
  signU = 0.0
  u = 0.0
  b = 0.0
  w = 0.0
  x = 0.0
  v1 = 0.0
  v2 = 0.0
  v12 = 0.0

  if a < 1.0
    b = 1.0 + 0.36788794412 * a
    while true
      p = b * randomGenerator.nextDouble()
      if p <= 1.0
        gds = StrictMath.exp(StrictMath.log(p) / a)
        if StrictMath.log(randomGenerator.nextDouble()) <= -gds
          return gds / lambda
      else
        gds = -1 * StrictMath.log((b - p) / a)
        if StrictMath.log(randomGenerator.nextDouble()) <= (a - 1.0) * StrictMath.log(gds)
          return gds / lambda

  else
    ss = a - 0.5
    s = StrictMath.sqrt(ss)
    d = 5.656854249 - 12.0 * s
    loop
      v1 = 2.0 * randomGenerator.nextDouble() - 1.0
      v2 = 2.0 * randomGenerator.nextDouble() - 1.0
      v12 = v1 * v1 + v2 * v2
      break if v12 <= 1.0
    t = v1 * StrictMath.sqrt(-2.0 * StrictMath.log(v12) / v12)
    x = s + 0.5 * t
    gds = x * x
    if t >= 0.0
      return gds / lambda
    u = randomGenerator.nextDouble()
    if d * u <= t * t * t
      return gds / lambda
    r = 1.0 / a
    q0 = ((((((((q9 * r + q8) * r + q7) * r + q6) * r + q5) * r + q4) * r + q3) * r + q2) * r + q1) * r
    if a > 3.686
      if a > 13.022
        b = 1.77
        si = 0.75
        c = 0.1515 / s
      else
        b = 1.654 + 0.0076 * ss
        si = 1.68 / s + 0.275
        c = 0.062 / s + 0.024
    else
      b = 0.463 + s - 0.178 * ss
      si = 1.235
      c = 0.195 / s - 0.079 + 0.016 * s
    if x > 0.0
      v = t / (s + s)
      if StrictMath.abs(v) > 0.25
        q = q0 - s * t + 0.25 * t * t + (ss + ss) * StrictMath.log(1.0 + v)
      else
        q = q0 + 0.5 * t * t * ((((((((a9 * v + a8) * v + a7) * v + a6) * v + a5) * v + a4) * v  + a3) * v + a2) * v + a1) * v
      if StrictMath.log(1.0 - u) <= q
        return gds / lambda
    while true
      loop
        e = -StrictMath.log(randomGenerator.nextDouble())
        u = randomGenerator.nextDouble()
        u = u + u - 1.0
        signU = if u > 0 then 1.0 else -1.0
        t = b + (e * si) * signU
        break if t > -0.71874483771719
      v = t / (s + s)
      if StrictMath.abs(v) > 0.25
        q = q0 - s * t + 0.25 * t * t + (ss + ss) * StrictMath.log(1.0 + v)
      else
        q = q = q0 + 0.5 * t * t * ((((((((a9 * v + a8) * v + a7) * v + a6) * v + a5) * v + a4) * v  + a3) * v + a2) * v + a1) * v
      if q > 0
        if q > 0.5
          w = StrictMath.exp(q) - 1.0
        else
          w = ((((((e7 * q + e6) * q + e5) * q + e4) * q + e3)  * q + e2) * q + e1) * q
        if c * u * signU <= w * StrictMath.exp(e - 0.5 * t * t)
          x = s + 0.5 * t
          return x * x / lambda
