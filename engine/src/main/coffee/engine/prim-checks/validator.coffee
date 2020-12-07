# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

StrictMath            = require('shim/strictmath')
formatFloat           = require('util/formatfloat')
{ checks, getTypeOf } = require('engine/core/typechecker')

class Validator

  constructor: (@bundle, @dumper) ->

  check: (condition, messageKey, messageValues...) ->
    if condition
      message = @bundle.get(messageKey, messageValues...)
      throw new Error(message)

  # (Number) => Number
  checkLong: (value) ->
    @check(value > 9007199254740992 or value < -9007199254740992, '_ is too large to be represented exactly as an integer in NetLogo', formatFloat(value))
    value

  # (Number) => Number
  checkNumber: (result) ->
    @check(Number.isNaN(result), 'math operation produced a non-number')
    @check(result is Infinity, 'math operation produced a number too large for NetLogo')
    result

  listTypeNames: (types) ->
    names    = types.map( (type) -> type.niceName() )
    nameList = names.join(" or ")
    if ['A', 'E', 'I', 'O', 'U'].includes(nameList.charAt(0).toUpperCase())
      "an #{nameList}"
    else
      "a #{nameList}"

  typeError: (prim, value, expectedText) ->
    valueText = if checks.isNobody(value)
      "nobody"
    else
      valueType = getTypeOf(value)
      "the #{valueType.niceName()} #{@dumper(value)}"

    @bundle.get("_ expected input to be _ but got _ instead.", prim, expectedText, valueText)

  checkTypeError: (prim, condition, value, expectedTypes...) ->
    if condition
      expectedText = @listTypeNames(expectedTypes)
      throw new Error(@typeError(prim, value, expectedText))

    return

  #  (String, Array[NLType]) => (Any) => Any
  makeTypeCheck: (prim, expectedTypes...) ->
    expectedText = @listTypeNames(expectedTypes)

    (value) =>
      if (not expectedTypes.some( (type) -> type.isOfType(value) ))
        throw new Error(@typeError(prim, value, expectedText))

      value

module.exports = Validator
