# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ validateNumber } = require('./common-checks')

class ListChecks

  constructor: (@_i18nBundle, @listPrims) ->
    @validateNumber = validateNumber(@_i18nBundle)

  # Array[Any] => Number
  median: (vals) ->
    @validateNumber(@listPrims.median(vals))

  # Array[Any] => Number
  standardDeviation: (vals) ->
    @validateNumber(@listPrims.standardDeviation(vals))

module.exports = ListChecks
