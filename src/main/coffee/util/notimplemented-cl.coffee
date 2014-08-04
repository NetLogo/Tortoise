# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('util.notimplemented')

# [T] @ (String, T) => () => T
(name, defaultValue = {}) ->
  if console? and console.warn? then console.warn("The `#{name}` primitive has not yet been implemented.")
  -> defaultValue

