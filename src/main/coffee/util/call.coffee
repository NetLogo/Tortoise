# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['util/exception'], (Exception) ->
  # [Result] @ (Product => Result, Any*) => Result
  (fn, args...) ->
    try fn(args...)
    catch e
      if not (e instanceof Exception.StopInterrupt)
        throw e
)
