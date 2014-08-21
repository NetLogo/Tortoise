# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Exception = require('./exception')

# [Result] @ (Product => Result, Any*) => Result
module.exports =
  (fn, args...) ->
    try fn(args...)
    catch e
      if not (e instanceof Exception.StopInterrupt)
        throw e
