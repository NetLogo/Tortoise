# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('util.abstractmethoderror')

  # (String) => Nothing
  (msg) ->
    throw new Error("Illegal method call: `#{msg}` is abstract")

