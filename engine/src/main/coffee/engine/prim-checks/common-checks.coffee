# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

StrictMath  = require('shim/strictmath')
formatFloat = require('util/formatfloat')

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

module.exports = {
  validateLong
  validateNumber
}
