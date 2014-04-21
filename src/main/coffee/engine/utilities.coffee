#@# Replace with Lodash's equivalents
define(-> {
  isArray:    (x) -> Array.isArray(x)
  isBoolean:  (x) -> typeof(x) is "boolean"
  isFunction: (x) -> typeof(x) is "function"
  isNumber:   (x) -> typeof(x) is "number"
  isObject:   (x) -> typeof(x) is "object"
  isString:   (x) -> typeof(x) is "string"
})
