# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('util.abstractmethoderror')

# (String) => Nothing
shim.abstractmethoderror = abstractMethod = (msg) ->
  throw new Error("Illegal method call: `#{msg}` is abstract")

