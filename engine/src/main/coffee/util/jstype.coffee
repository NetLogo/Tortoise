# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

###
This class should be favored over Lodash when you want quick typechecking that need not be thorough.
This was made specifically to compensate for the fact that Lodash's typechecking was swapped
into the sorting code and caused a 25% performance hit in BZ Benchmark. --JAB (4/30/14)
###

class JSType
  constructor: (@_x) -> # (Any) => JSType
  isArray:    -> Array.isArray(@_x)
  isBoolean:  -> typeof(@_x) is "boolean"
  isFunction: -> typeof(@_x) is "function"
  isNumber:   -> typeof(@_x) is "number"
  isObject:   -> typeof(@_x) is "object"
  isString:   -> typeof(@_x) is "string"

module.exports = (x) -> new JSType(x)
