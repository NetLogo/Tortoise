# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

###
This class should be favored over Lodash when you want quick typechecking that need not be thorough.
This was made specifically to compensate for the fact that Lodash's typechecking was swapped
into the sorting code and caused a 25% performance hit in BZ Benchmark. --JAB (4/30/14)
###
define(->

  class Type
    constructor: (@x) ->
    isArray:    -> Array.isArray(@x)
    isBoolean:  -> typeof(@x) is "boolean"
    isFunction: -> typeof(@x) is "function"
    isNumber:   -> typeof(@x) is "number"
    isObject:   -> typeof(@x) is "object"
    isString:   -> typeof(@x) is "string"

  (x) -> new Type(x)

)
