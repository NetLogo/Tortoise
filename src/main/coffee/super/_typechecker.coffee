
# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_ = require('lodash')

module.exports = {

  # (Any) => Boolean
  isArray: (a) ->
    Array.isArray(a)

  # (Any) => Boolean
  isFunction: (f) ->
    _(f).isFunction()

  # (Any) => Boolean
  isObject: (o) ->
    _(o).isObject()

  # (Any) => Boolean
  isString: (s) ->
    _(s).isString()

}
