# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

MAX_NETLOGO_INT = 9007199254740992

# (Number) => String
formatFloat = (num) ->
  base = # These negative exponent numbers are when Java will switch to scientific notation --JAB (12/25/17)
    if num > MAX_NETLOGO_INT or num < -MAX_NETLOGO_INT or (0 < num < 1e-3) or (0 > num > -1e-3)
      maybeBase = num.toExponential()
      # Java always includes the decimal point, so `1e+38` in JS is `1.0E38` in Java.  We can't always do
      # `toExponential(1)` as then we'd truncate things like `1.222E38` to `1.2E38`.  -Jeremy B November 2020
      if maybeBase.includes('.')
        maybeBase
      else
        num.toExponential(1)
    else
      num.toString()
  base.replace(/e\+?/, 'E')  # Java stringifies scientific notation with 'E' and 'E-', while JS uses 'e+' and 'e-'. --JAB (12/25/17)

module.exports = formatFloat
