# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# (I18nBundle) => (Number) => Number
validateNumber = (bundle) -> (result) ->
  if Number.isNaN(result)
    throw new Error(bundle.get('math operation produced a non-number'))

  if result is Infinity
    throw new Error(bundle.get('math operation produced a number too large for NetLogo'))

  result

module.exports = {
  validateNumber
}
