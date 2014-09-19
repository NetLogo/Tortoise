# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ StopInterrupt: Stop } = require('./exception')

# [Result] @ (Product => Result, Any*) => Result
module.exports =
  (fn, args...) ->
    try fn(args...)
    catch e
      if not (e instanceof Stop)
        throw e
