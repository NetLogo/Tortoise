# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Unit       = require('./unit')
Checker    = require('./_typechecker')

class SuperObject

  # [T, U] @ (Object[T, U]) => SuperObject[T, U]
  constructor: (@_value) ->
    if not Checker.isObject(@_value)
      throw new Error("Needed an object, but was given this thing: #{@_value}")

  # [V] @ (V) => ((V, (T, U)) => V) => V
  foldl: (z) -> (f) =>
    acc = z
    for k, v of @_value
      acc = f(acc, [k, v])
    acc

  # ((T, U) => Unit) => Unit
  forEach: (f) ->
    for k, v of @_value
      f(k, v)
    Unit

  # () => Boolean
  isEmpty: ->
    @size is 0

  # () => Number
  size: ->
    Object.keys(@_value).length

  # () => Object[T, U]
  value: ->
    @_value

  # () => Array[U]
  values: ->
    v for _, v of @_value

module.exports = (x) -> new SuperObject(x)
