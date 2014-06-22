# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['engine/exception'], (Exception) ->
  # [Args <: Product, Result] @ ((Args => Result), Array[Any]) => Result
  (fn, args...) ->
    try fn(args...)
    catch e
      if not (e instanceof Exception.StopInterrupt)
        throw e
)
