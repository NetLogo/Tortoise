# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ SuperArray } = require('super/superarray')
Checker        = require('super/_typechecker')

# [T] @ (T) => T
cloneFunc = # Stored into a variable for the sake of recursion --JAB (4/29/14)
  (obj) ->
    if Checker.isObject(obj) and not Checker.isFunction(obj)
      properties    = Object.getOwnPropertyNames(obj)
      entryCopyFunc = (acc, x) -> acc[x] = cloneFunc(obj[x]); acc
      basicClone    = new obj.constructor()
      SuperArray(properties).foldl(basicClone)(entryCopyFunc)
    else
      obj

module.exports = cloneFunc
