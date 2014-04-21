define(->
  (name, defaultValue = {}) ->
    if console? and console.warn? then console.warn("The `#{name}` primitive has not yet been implemented.")
    -> defaultValue
)
