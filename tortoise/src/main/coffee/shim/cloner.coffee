# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_      = require('lodash')
JSType = require('util/typechecker')

# [T] @ (T) => T
cloneFunc = # Stored into a variable for the sake of recursion --JAB (4/29/14)
  (obj) ->
    if JSType(obj).isObject() and not JSType(obj).isFunction()
      properties    = Object.getOwnPropertyNames(obj)
      entryCopyFunc = (acc, x) -> acc[x] = cloneFunc(obj[x]); acc
      basicClone    = new obj.constructor()
      _(properties).reduce(entryCopyFunc, basicClone)
    else
      obj

module.exports = cloneFunc
