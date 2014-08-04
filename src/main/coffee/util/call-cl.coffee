# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('util.call')

goog.require('util.exception')

  # [Result] @ (Product => Result, Any*) => Result
  (fn, args...) ->
    try fn(args...)
    catch e
      if not (e instanceof Exception.StopInterrupt)
        throw e
