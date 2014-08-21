# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# [T] @ (String, T) => () => T
module.exports =
  (name, defaultValue = {}) ->
    if console? and console.warn? then console.warn("The `#{name}` primitive has not yet been implemented.")
    -> defaultValue
