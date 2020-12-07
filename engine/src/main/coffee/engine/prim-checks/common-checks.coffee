# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

StrictMath            = require('shim/strictmath')
formatFloat           = require('util/formatfloat')
{ checks, getTypeOf } = require('engine/core/typechecker')

# (I18nBundle) => (Number) => Number
validateLong = (bundle) -> (value) ->
  if (value > 9007199254740992 or value < -9007199254740992)
    throw new Error(bundle.get("_ is too large to be represented exactly as an integer in NetLogo", formatFloat(value)))

  value

# (I18nBundle) => (Number) => Number
validateNumber = (bundle) -> (result) ->
  if Number.isNaN(result)
    throw new Error(bundle.get('math operation produced a non-number'))

  if result is Infinity
    throw new Error(bundle.get('math operation produced a number too large for NetLogo'))

  result

listTypeNames = (types) ->
  names    = types.map( (type) -> type.niceName() )
  nameList = names.join(" or ")
  if ['A', 'E', 'I', 'O', 'U'].includes(nameList.charAt(0).toUpperCase())
    "an #{nameList}"
  else
    "a #{nameList}"

# (I18nBundle, (Any) => String) => (String, Array[NLType]) => (Any) => Any
validateType = (bundle, dumper) -> (prim, expectedTypes...) ->
  expectedText = listTypeNames(expectedTypes)

  (value) ->
    if (not expectedTypes.some( (type) -> type.isOfType(value) ))
      valueText = if checks.isNobody(value)
        "nobody"
      else
        valueType = getTypeOf(value)
        "the #{valueType.niceName()} #{dumper(value)}"

      message = bundle.get("_ expected input to be _ but got _ instead.", prim, expectedText, valueText)
      throw new Error(message)

    value

module.exports = {
  validateLong
  validateNumber
  validateType
}
