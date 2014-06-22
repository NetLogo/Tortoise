# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(->
  # (String) => Nothing
  (msg) ->
    throw new Error("Illegal method call: `#{msg}` is abstract")
)
